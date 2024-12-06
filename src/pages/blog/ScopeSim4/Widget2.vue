<script setup lang="ts">
import { onMounted, type Ref, ref, computed } from "vue";
import type { Point } from "./types";
import * as fns from "./functions";

const canvas: Ref<HTMLCanvasElement | null> = ref(null);
const canvas2: Ref<HTMLCanvasElement | null> = ref(null);
const step = ref("");
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const scene_distance = ref(20000);
const distance = ref(408.3);
const drawing = ref(false);
const scene_width = computed(
    () => scene_distance.value * Math.tan((0.51 * Math.PI) / 180),
);
const tile_size = computed(() => scene_width.value / 3.69);
const scene_depth = computed(
    () => ((tile_size.value * Math.sqrt(2) * 6) / 2) * Math.sqrt(3),
);

const draw = async (
    width: number,
    height: number,
    pxsize: number,
    radius: number,
    base_fl: number,
    distance: number,
    scene_depth: number,
    scene_distance: number,
) => {
    if (!canvas.value) return;
    if (!canvas2.value) return;
    drawing.value = true;
    const c = canvas.value;
    const ctx = canvas.value.getContext("2d") as CanvasRenderingContext2D;
    const c2 = canvas2.value;
    const output_ctx = canvas2.value.getContext(
        "2d",
    ) as CanvasRenderingContext2D;
    const depth = document.getElementById("img-depth") as HTMLImageElement;
    const pic = document.getElementById("img-image") as HTMLImageElement;

    c.width = width;
    c.height = height;
    c2.width = width;
    c2.height = height;

    step.value = "Initializing canvas";
    await sleep(1000);
    step.value = "Drawing depth map";
    ctx.save();
    ctx.scale(-1, -1);
    ctx.drawImage(depth, 0, 0, -width, -height);
    ctx.restore();

    await sleep(1000);
    step.value =
        "Collecting depth and coordinates, and sorting them from farthest to nearest";
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    const coords_distances = [];
    const mul = scene_depth / 255;
    const map_to_distance = (r_value: number): number =>
        Math.abs(255 - r_value) * mul + scene_distance;

    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
            const r_value = data[(x + y * width) * 4];
            coords_distances.push({
                d: map_to_distance(r_value),
                r: r_value,
                x,
                y,
            });
        }
    }

    coords_distances.sort((b, a) => (b.d < a.d ? 1 : -1));

    await sleep(1000);

    step.value = "Drawing source image";
    ctx.save();
    ctx.scale(-1, -1);
    ctx.drawImage(pic, 0, 0, -width, -height);
    ctx.restore();
    await sleep(1000);
    step.value = "Sampling pixels on source image";

    const data2 = ctx.getImageData(0, 0, width, height).data;

    const len = coords_distances.length;
    const blur_canvas = document.createElement("canvas");
    blur_canvas.width = width;
    blur_canvas.height = height;
    const blur_ctx = blur_canvas.getContext("2d") as CanvasRenderingContext2D;
    const drawing_canvas = document.createElement("canvas");
    drawing_canvas.width = width;
    drawing_canvas.height = height;
    const drawing_ctx = drawing_canvas.getContext(
        "2d",
    ) as CanvasRenderingContext2D;

    let current_blur = -1;
    for (let k = 0; k < len; k++) {
        const { x, y, d } = coords_distances[k];
        const dindex = (x + y * width) * 4;
        const [r, g, b] = [data2[dindex], data2[dindex + 1], data2[dindex + 2]];
        const rd = d;
        const elf = fns.effective_fl(base_fl, radius, rd);
        const spread = fns.spread(elf, radius, rd);
        const blur_diam_px = Math.abs(
            fns.blur(radius, elf, distance, spread) / pxsize,
        );
        const color = `rgb(${r}, ${g}, ${b})`;
        drawing_ctx.fillStyle = color;
        const bv = parseFloat((blur_diam_px / 4).toFixed(2));
        if (bv !== current_blur) {
            const blurb = `blur(${bv}px)`;
            blur_ctx.filter = blurb;
            blur_ctx.drawImage(drawing_canvas, 0, 0);
            drawing_ctx.clearRect(0, 0, width, height);
            current_blur = bv;
        } else {
            drawing_ctx.beginPath();
            drawing_ctx.arc(x, y, 1, 0, Math.PI * 2);
            drawing_ctx.fill();
        }
    }
    const blurb = `blur(${current_blur}px)`;
    blur_ctx.filter = blurb;
    blur_ctx.drawImage(drawing_canvas, 0, 0);
    drawing_ctx.clearRect(0, 0, width, height);
    output_ctx.drawImage(blur_canvas, 0, 0);
    drawing.value = false;
    step.value = "Drawing done.";
};

const redraw = () => {
    draw(
        640,
        360,
        2.8 / 1000,
        57,
        400,
        distance.value,
        scene_depth.value,
        scene_distance.value,
    );
};
onMounted(async () => {
    redraw();
});
</script>

<template>
    <div
        style="
            font-family: sans-serif;
            background: lightgray;
            padding: 4px;
            border-radius: 4px;
        "
    >
        <div style="margin: 8px 0">
            <label for=""
                >Scene front distance to the mirror
                {{ scene_distance }}mm<br /><input
                    type="number"
                    min="5000"
                    max="10000"
                    v-model="scene_distance"
                    step="0.05"
            /></label>
        </div>
        <div style="margin: 8px 0">
            Tile size : {{ tile_size.toFixed(2) }}mm / Scene width :
            {{ scene_width.toFixed(2) }}mm / Scene depth :
            {{ scene_depth.toFixed(2) }}mm
        </div>
        <div style="margin: 8px 0">
            <label for=""
                >Sensor distance to the mirror (ideal : around
                {{ fns.effective_fl(400, 57, scene_distance).toFixed(2) }}mm):
                {{ distance }}mm<br /><input
                    type="number"
                    min="405"
                    max="411"
                    v-model="distance"
                    step="0.05"
            /></label>
        </div>
        <div style="margin: 8px 0">Step : {{ step }}</div>
        <div style="margin: 8px 0">
            <button :disabled="drawing" @click="redraw">Click to Draw</button>
        </div>
        <div style="display: flex; width: 100%; gap: 10px; flex-wrap: wrap">
            <canvas ref="canvas" style="width: 280px"></canvas>
            <canvas ref="canvas2" style="width: 280px"></canvas>
        </div>
    </div>
</template>
