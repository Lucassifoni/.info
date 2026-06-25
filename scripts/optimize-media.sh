#!/usr/bin/env bash
#
# optimize-media.sh — prepare a folder of raw photos/videos for a web gallery.
#
# For every media file directly inside <folder>:
#   - images  -> .webp  (longest side capped, sensible quality)
#   - videos  -> .mp4   (H.264 high / yuv420p / AAC, capped height, faststart)
#   - the original is moved into <folder>/_old/
#   - an empty <basename>.txt caption sidecar is created (Gallery convention)
#
# Videos larger than MAX_VIDEO_MB are left untouched (raw footage you intend to
# clip by hand). Already-processed files (those whose original sits in _old) are
# skipped, so the script is safe to re-run after adding more media.
#
# Usage:   scripts/optimize-media.sh <folder> [--dry-run]
# Example: scripts/optimize-media.sh public/pics/hiking-with-wallace
#
# Tunables (env vars):
#   IMG_MAX=2400      image longest side (px)
#   IMG_Q=82          webp quality
#   VID_MAXH=1080     video max height (px)
#   VID_CRF=28        x264 CRF (lower = better/heavier)
#   VID_PRESET=medium x264 preset
#   AUDIO_KBPS=128    aac bitrate
#   MAX_VIDEO_MB=200  skip videos bigger than this
#   MAKE_TXT=1        create empty .txt caption sidecars
#   JOBS=4            number of conversions to run in parallel

set -euo pipefail

IMG_MAX="${IMG_MAX:-2400}"
IMG_Q="${IMG_Q:-82}"
VID_MAXH="${VID_MAXH:-1080}"
VID_CRF="${VID_CRF:-28}"
VID_PRESET="${VID_PRESET:-medium}"
AUDIO_KBPS="${AUDIO_KBPS:-128}"
MAX_VIDEO_MB="${MAX_VIDEO_MB:-400}"
MAKE_TXT="${MAKE_TXT:-1}"
JOBS="${JOBS:-4}"

IMAGE_EXTS=" jpg jpeg png heic heif tif tiff bmp gif "
VIDEO_EXTS=" mov mp4 m4v avi mkv webm "

DRY_RUN=0
DIR=""
for arg in "$@"; do
  case "$arg" in
    --dry-run|-n) DRY_RUN=1 ;;
    *) DIR="$arg" ;;
  esac
done

if [[ -z "$DIR" || ! -d "$DIR" ]]; then
  echo "usage: $0 <folder> [--dry-run]" >&2
  exit 1
fi

for bin in magick ffmpeg; do
  command -v "$bin" >/dev/null || { echo "missing dependency: $bin" >&2; exit 1; }
done

DIR="${DIR%/}"
OLD="$DIR/_old"

lower() { printf '%s' "$1" | tr '[:upper:]' '[:lower:]'; }
size_mb() { echo $(( $(stat -f%z "$1" 2>/dev/null || stat -c%s "$1") / 1048576 )); }

convert_image() {
  local src="$1" out="$2"
  magick "$src" -auto-orient -resize "${IMG_MAX}x${IMG_MAX}>" -quality "$IMG_Q" "$out"
}

# ffmpeg auto-rotates by default, baking any rotation (portrait phone clips,
# DSLR orientation flags) into the pixels; we also clear the legacy rotate tag
# so the output is upright in every player. Height is capped without upscaling.
convert_video() {
  local src="$1" out="$2"
  ffmpeg -nostdin -loglevel error -y -i "$src" \
    -vf "scale=w=-2:h=min(${VID_MAXH}\,ih),scale=trunc(iw/2)*2:trunc(ih/2)*2:flags=lanczos" \
    -c:v libx264 -profile:v high -pix_fmt yuv420p -crf "$VID_CRF" -preset "$VID_PRESET" \
    -c:a aac -b:a "${AUDIO_KBPS}k" -metadata:s:v:0 rotate=0 -movflags +faststart "$out"
}

n_skip_big=0; n_skip_done=0; n_ignored=0; n_outexists=0
skipped_big=(); outexists=()

RESULTS="$(mktemp)"
trap 'rm -f "$RESULTS"' EXIT

# Worker (runs backgrounded): move the original into _old, convert, restore on
# failure, write the caption sidecar, and append a status line
# (`kind<TAB>name` or `ERR<TAB>name`) to the shared results file. Always exits 0
# so the throttling `wait` never trips `set -e`.
process_one() {
  local f="$1" out="$2" kind="$3"
  local bn stem ok=1
  bn="$(basename "$f")"; stem="${bn%.*}"

  mkdir -p "$OLD"
  mv "$f" "$OLD/$bn"

  if [[ "$kind" == image ]]; then
    convert_image "$OLD/$bn" "$out" || ok=0
  else
    convert_video "$OLD/$bn" "$out" || ok=0
  fi

  if [[ "$ok" == 0 ]]; then
    echo "! conversion failed, restoring original: $bn" >&2
    [[ -e "$out" ]] && rm -f "$out"
    [[ -e "$OLD/$bn" ]] && mv "$OLD/$bn" "$f"
    printf 'ERR\t%s (conversion failed)\n' "$bn" >> "$RESULTS"
    return 0
  fi

  if [[ "$MAKE_TXT" == 1 ]]; then
    local txt="$DIR/$stem.txt"
    [[ -e "$txt" ]] || touch "$txt"
  fi
  printf '%s\t%s\n' "$kind" "$bn" >> "$RESULTS"
  return 0
}

# Throttled dispatch: keep at most JOBS workers in flight. Portable to bash 3.2
# (no `wait -n`) — once the queue is full, block on the oldest pid.
pids=()
dispatch() {
  process_one "$@" &
  pids+=("$!")
  if (( ${#pids[@]} >= JOBS )); then
    wait "${pids[0]}"
    pids=("${pids[@]:1}")
  fi
}

shopt -s nullglob
for f in "$DIR"/*; do
  [[ -d "$f" ]] && continue
  bn="$(basename "$f")"
  case "$bn" in .*|*.txt) continue ;; esac

  ext="$(lower "${bn##*.}")"
  stem="${bn%.*}"

  is_image=0; is_video=0
  [[ "$IMAGE_EXTS" == *" $ext "* ]] && is_image=1
  [[ "$VIDEO_EXTS" == *" $ext "* ]] && is_video=1
  if [[ "$is_image" == 0 && "$is_video" == 0 ]]; then
    n_ignored=$((n_ignored+1)); continue
  fi

  if [[ -e "$OLD/$bn" ]]; then n_skip_done=$((n_skip_done+1)); continue; fi

  if [[ "$is_video" == 1 ]]; then
    mb="$(size_mb "$f")"
    if (( mb > MAX_VIDEO_MB )); then
      n_skip_big=$((n_skip_big+1)); skipped_big+=("$bn (${mb}MB)"); continue
    fi
    out="$DIR/$stem.mp4"; kind=video
  else
    out="$DIR/$stem.webp"; kind=image
  fi

  if [[ -e "$out" && "$out" != "$f" ]]; then
    echo "! output exists, skipping to avoid overwrite: $out" >&2
    n_outexists=$((n_outexists+1)); outexists+=("$bn -> $(basename "$out")")
    continue
  fi

  echo "» $bn -> $(basename "$out")"
  if [[ "$DRY_RUN" == 1 ]]; then
    echo "  would: mv -> _old/$bn ; convert_${kind} -> $(basename "$out") ; touch ${stem}.txt"
  else
    dispatch "$f" "$out" "$kind"
  fi
done

[[ "$DRY_RUN" == 1 ]] || wait

n_img=$(grep -c "^image$(printf '\t')" "$RESULTS" || true); n_img=${n_img:-0}
n_vid=$(grep -c "^video$(printf '\t')" "$RESULTS" || true); n_vid=${n_vid:-0}
n_err_conv=$(grep -c "^ERR$(printf '\t')" "$RESULTS" || true); n_err_conv=${n_err_conv:-0}
n_err=$(( n_err_conv + n_outexists ))

echo
echo "── summary ($DIR) ──"
echo "images converted : $n_img"
echo "videos converted : $n_vid"
echo "already done     : $n_skip_done"
echo "big videos kept  : $n_skip_big"
echo "non-media kept   : $n_ignored"
echo "errors           : $n_err"

if (( n_skip_big > 0 )); then
  echo
  echo "left for manual clipping (> ${MAX_VIDEO_MB}MB):"
  for s in "${skipped_big[@]}"; do echo "  - $s"; done
fi
if (( n_err > 0 )); then
  echo
  echo "errors:"
  for e in "${outexists[@]}"; do echo "  - $e already exists"; done
  while IFS=$'\t' read -r tag name; do
    [[ "$tag" == ERR ]] && echo "  - $name"
  done < "$RESULTS"
fi
