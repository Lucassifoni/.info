#!/usr/bin/env node
// Self-contained visual gallery re-orderer.
//
// Usage:  node scripts/gallery-reorder.mjs [folder] [port]
//   folder  path to a media folder, default: public/pics/hiking-with-wallace
//   port    http port, default: 4567
//
// Opens a local page where you drag image/video thumbnails into the order you
// want, then "Save" renumbers the files on disk as 001_<name>, 002_<name>, ...
// Matching `<name>.txt` caption sidecars are renamed in lockstep. Re-running is
// safe: an existing leading "NNN_" prefix is stripped before renumbering.
//
// No dependencies — only Node's built-in modules.

import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const folderArg = process.argv[2] ?? "public/pics/hiking-with-wallace";
const port = Number(process.argv[3] ?? 4567);

const repoRoot = process.cwd();
const dir = path.resolve(repoRoot, folderArg);

if (!fs.existsSync(dir) || !fs.statSync(dir).isDirectory()) {
    console.error(`Not a directory: ${dir}`);
    process.exit(1);
}

const videoExt = new Set(["mp4", "webm", "ogg", "ogv", "mov", "m4v"]);
const imageExt = new Set(["jpg", "jpeg", "png", "webp", "gif", "avif", "svg"]);

const extOf = (name) => name.split(".").pop()?.toLowerCase() ?? "";
const isMedia = (name) => {
    const e = extOf(name);
    return videoExt.has(e) || imageExt.has(e);
};
const isVideo = (name) => videoExt.has(extOf(name));

const naturalSort = (a, b) =>
    a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" });

const listMedia = () =>
    fs.readdirSync(dir).filter(isMedia).sort(naturalSort);

const mime = {
    mp4: "video/mp4",
    webm: "video/webm",
    ogg: "video/ogg",
    ogv: "video/ogg",
    mov: "video/quicktime",
    m4v: "video/x-m4v",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    webp: "image/webp",
    gif: "image/gif",
    avif: "image/avif",
    svg: "image/svg+xml",
    txt: "text/plain",
};

/**
 * Resolves the desired final state for `order` — an array of
 * { name, caption } — into per-item targets. `name` is the current media
 * filename; the new name is `NNN_<cleanStem>.<ext>`, where an existing
 * leading "NNN_" prefix is stripped first so re-runs stay stable.
 */
const planOrder = (order) => {
    const width = Math.max(3, String(order.length).length);
    return order.map((item, i) => {
        const ext = extOf(item.name);
        const oldStem = item.name.slice(0, item.name.length - ext.length - 1);
        const cleanStem = oldStem.replace(/^\d+_/, "");
        const newStem = `${String(i + 1).padStart(width, "0")}_${cleanStem}`;
        return {
            from: item.name,
            to: `${newStem}.${ext}`,
            oldStem,
            newStem,
            caption: typeof item.caption === "string" ? item.caption.trim() : "",
        };
    });
};

const applyRenames = (ops) => {
    // Phase 1: move everything involved to a unique temp name so swaps and
    // cross-collisions can't clobber a file we still need to read.
    const temps = ops.map((op, i) => ({
        tmp: `.reorder_tmp_${i}__${op.to}`,
        to: op.to,
        from: op.from,
    }));
    temps.forEach((t) =>
        fs.renameSync(path.join(dir, t.from), path.join(dir, t.tmp)),
    );
    temps.forEach((t) =>
        fs.renameSync(path.join(dir, t.tmp), path.join(dir, t.to)),
    );
};

const page = () => {
    const files = listMedia().map((name) => ({
        name,
        video: isVideo(name),
        caption: (() => {
            const stem = name.slice(0, name.length - extOf(name).length - 1);
            const p = path.join(dir, `${stem}.txt`);
            return fs.existsSync(p)
                ? fs.readFileSync(p, "utf8").trim()
                : "";
        })(),
    }));

    return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Gallery re-order — ${folderArg}</title>
<style>
  :root { color-scheme: light dark; }
  body { font: 15px/1.4 system-ui, sans-serif; margin: 0; padding: 1rem 1.25rem 6rem; }
  header { display:flex; align-items:baseline; gap:1rem; flex-wrap:wrap; }
  h1 { font-size: 1.05rem; margin: 0; }
  .path { opacity:.6; font-size:.85rem; }
  .hint { opacity:.6; font-size:.85rem; margin:.4rem 0 1rem; }
  #grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(170px,1fr)); gap:.85rem; }
  .item { position:relative; border:1px dashed #888; border-radius:6px; overflow:hidden;
          cursor:grab; background:#0001; user-select:none; aspect-ratio:1; }
  .item.dragging { opacity:.35; }
  .item.over-before { box-shadow:-3px 0 0 0 #3b82f6; }
  .item.over-after  { box-shadow: 3px 0 0 0 #3b82f6; }
  .item img, .item video { width:100%; height:100%; object-fit:cover; pointer-events:none; display:block; }
  .badge { position:absolute; top:4px; left:4px; background:#000c; color:#fff; font-weight:700;
           font-size:.8rem; padding:2px 7px; border-radius:4px; }
  .play { position:absolute; inset:0; display:flex; align-items:center; justify-content:center;
          pointer-events:none; }
  .play svg { width:44px; height:44px; padding:11px; box-sizing:border-box; fill:#fff;
              background:#000a; border-radius:50%; }
  .name { position:absolute; right:4px; top:4px; max-width:62%; background:#000a; color:#fff;
          font-size:.65rem; padding:2px 5px; border-radius:4px; white-space:nowrap;
          overflow:hidden; text-overflow:ellipsis; }
  .cap { position:absolute; left:0; right:0; bottom:0; box-sizing:border-box; width:100%;
         border:0; resize:none; font:inherit; font-size:.72rem; padding:5px 6px; height:3.1em;
         background:#000b; color:#fff; }
  .cap::placeholder { color:#fff7; }
  .cap:focus { outline:2px solid #3b82f6; background:#000d; }
  #bar { position:fixed; left:0; right:0; bottom:0; padding:.75rem 1.25rem; background:#111e;
         color:#fff; display:flex; align-items:center; gap:1rem; backdrop-filter:blur(4px); }
  button { font:inherit; font-weight:600; padding:.5rem 1.1rem; border-radius:6px; border:0;
           cursor:pointer; background:#3b82f6; color:#fff; }
  button:disabled { opacity:.5; cursor:default; }
  #status { font-size:.85rem; }
</style>
</head>
<body>
<header>
  <h1>Drag to order, then Save</h1>
  <span class="path">${folderArg} · ${files.length} items</span>
</header>
<p class="hint">Position 001 is first in the gallery. Drop on the left half of a tile to place before it, right half to place after. Type in a tile to caption it — every item gets a <code>.txt</code> sidecar on save (blank = empty placeholder).</p>
<div id="grid"></div>
<div id="bar">
  <button id="save">Save order &amp; renumber</button>
  <span id="status"></span>
</div>
<script>
const FILES = ${JSON.stringify(files)};
const grid = document.getElementById("grid");
const status = document.getElementById("status");

function tile(f) {
  const el = document.createElement("div");
  el.className = "item";
  el.draggable = true;
  el.dataset.name = f.name;
  const media = f.video
    ? '<video src="/media/' + encodeURIComponent(f.name) + '#t=0.1" muted playsinline preload="metadata"></video>'
      + '<span class="play"><svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg></span>'
    : '<img src="/media/' + encodeURIComponent(f.name) + '" alt="" loading="lazy" />';
  el.innerHTML = '<span class="badge"></span>' + media
    + '<span class="name">' + f.name + '</span>'
    + '<textarea class="cap" placeholder="caption…" rows="2"></textarea>';
  const cap = el.querySelector(".cap");
  cap.value = f.caption;
  // Let the caption box take text selection without starting a tile drag.
  cap.addEventListener("pointerdown", () => (el.draggable = false));
  cap.addEventListener("blur", () => (el.draggable = true));
  return el;
}

FILES.forEach((f) => grid.appendChild(tile(f)));

function renumber() {
  [...grid.children].forEach((el, i) =>
    el.querySelector(".badge").textContent = String(i + 1).padStart(3, "0"));
}
renumber();

let dragged = null;
grid.addEventListener("dragstart", (e) => {
  dragged = e.target.closest(".item");
  dragged.classList.add("dragging");
  e.dataTransfer.effectAllowed = "move";
});
grid.addEventListener("dragend", () => {
  dragged?.classList.remove("dragging");
  grid.querySelectorAll(".over-before,.over-after")
    .forEach((el) => el.classList.remove("over-before", "over-after"));
  dragged = null;
  renumber();
});
grid.addEventListener("dragover", (e) => {
  e.preventDefault();
  const target = e.target.closest(".item");
  grid.querySelectorAll(".over-before,.over-after")
    .forEach((el) => el.classList.remove("over-before", "over-after"));
  if (!target || target === dragged) return;
  const r = target.getBoundingClientRect();
  const before = e.clientX < r.left + r.width / 2;
  target.classList.add(before ? "over-before" : "over-after");
});
grid.addEventListener("drop", (e) => {
  e.preventDefault();
  const target = e.target.closest(".item");
  if (!target || target === dragged) return;
  const r = target.getBoundingClientRect();
  const before = e.clientX < r.left + r.width / 2;
  grid.insertBefore(dragged, before ? target : target.nextSibling);
  renumber();
});

document.getElementById("save").addEventListener("click", async () => {
  const order = [...grid.children].map((el) => ({
    name: el.dataset.name,
    caption: el.querySelector(".cap").value,
  }));
  status.textContent = "Saving…";
  const res = await fetch("/save", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ order }),
  });
  const data = await res.json();
  if (data.ok) {
    status.textContent = data.changed + " file(s) renumbered. Reloading…";
    setTimeout(() => location.reload(), 700);
  } else {
    status.textContent = "Error: " + data.error;
  }
});
</script>
</body>
</html>`;
};

const server = http.createServer((req, res) => {
    const url = new URL(req.url, `http://localhost:${port}`);

    if (req.method === "GET" && url.pathname === "/") {
        res.writeHead(200, { "content-type": "text/html; charset=utf-8" });
        res.end(page());
        return;
    }

    if (req.method === "GET" && url.pathname.startsWith("/media/")) {
        const name = decodeURIComponent(url.pathname.slice("/media/".length));
        const file = path.join(dir, name);
        if (path.dirname(file) !== dir || !fs.existsSync(file)) {
            res.writeHead(404);
            res.end("not found");
            return;
        }
        res.writeHead(200, {
            "content-type": mime[extOf(name)] ?? "application/octet-stream",
        });
        fs.createReadStream(file).pipe(res);
        return;
    }

    if (req.method === "POST" && url.pathname === "/save") {
        let body = "";
        req.on("data", (c) => (body += c));
        req.on("end", () => {
            try {
                const { order } = JSON.parse(body);
                const current = new Set(listMedia());
                if (
                    !Array.isArray(order) ||
                    order.length !== current.size ||
                    !order.every((it) => it && current.has(it.name))
                ) {
                    throw new Error("order is stale; reload the page");
                }
                const plan = planOrder(order);

                // Rename the media files (two-phase, skips no-ops).
                applyRenames(plan.filter((p) => p.to !== p.from));

                // Sidecars: clear every old caption file, then (re)write one
                // per item under its new stem — creating any that were missing.
                plan.forEach((p) => {
                    const old = path.join(dir, `${p.oldStem}.txt`);
                    if (fs.existsSync(old)) fs.rmSync(old);
                });
                plan.forEach((p) => {
                    fs.writeFileSync(
                        path.join(dir, `${p.newStem}.txt`),
                        p.caption ? `${p.caption}\n` : "",
                    );
                });

                const changed = plan.filter((p) => p.to !== p.from).length;
                res.writeHead(200, { "content-type": "application/json" });
                res.end(JSON.stringify({ ok: true, changed }));
            } catch (err) {
                res.writeHead(200, { "content-type": "application/json" });
                res.end(JSON.stringify({ ok: false, error: err.message }));
            }
        });
        return;
    }

    res.writeHead(404);
    res.end("not found");
});

server.listen(port, () => {
    const u = `http://localhost:${port}/`;
    console.log(`Gallery re-order → ${u}`);
    console.log(`Folder: ${dir}`);
    if (process.platform === "darwin" && !process.env.NO_OPEN) {
        import("node:child_process").then(({ spawn }) =>
            spawn("open", [u], { stdio: "ignore" }),
        );
    }
    console.log("Ctrl-C to stop.");
});
