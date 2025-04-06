<script lang="ts" setup>
import { computed, onMounted, type Ref, ref, watch } from "vue";
import * as fns from "./functions";
import type { Point, Segment } from "./types";

const canvasRef: Ref<HTMLCanvasElement | null> = ref(null);
const focus = ref(400);
const radius = ref(57);
const rays = ref(4);
const zoom = ref(1.5);
const dist = ref(10000);
const draw_normals = ref(true);
const draw_infinity = ref(false);
const draw_tangents = ref(false);
const source_height = ref(250);
const sensor_distance = ref(416);
const sensor_height = ref(2.02);
const sensor_width = ref(3.58);
const pixel_size = ref(2.8 / 1000);

const draw = () => {
    const c = canvasRef.value;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    c.width = focus.value * zoom.value + 100 * zoom.value;
    c.height = 2 * radius.value * zoom.value + 20 * zoom.value;
    ctx.fillStyle = "white";
    ctx.strokeStyle = "black";
    ctx.lineWidth = 1;
    ctx.fillRect(0, 0, c.width, c.height);
    const f = focus.value;
    const max_y_mm = radius.value;
    const z = source_height.value;
    const x_off = 10;
    const y_off = max_y_mm + 10;

    const to_x = (n: number) => zoom.value * (n + x_off) + 0.5;
    const to_y = (n: number) => zoom.value * (n + y_off) + 0.5;

    const lineTo = (x: number, y: number) => ctx.lineTo(to_x(x), to_y(y));
    const moveTo = (x: number, y: number) => ctx.moveTo(to_x(x), to_y(y));
    const arc = (x: number, y: number, r: number, a: number) =>
        ctx.arc(to_x(x), to_y(y), r, 0, a);

    const draw_segment = (s: Segment) => {
        ctx.beginPath();
        moveTo(s.a.x, s.a.y);
        lineTo(s.b.x, s.b.y);
        ctx.stroke();
    };

    const axis = () => {
        ctx.beginPath();
        moveTo(0, 0);
        lineTo(1000, 0);
        ctx.strokeStyle = "green";
        ctx.stroke();
    };

    const focalPoint = () => {
        ctx.beginPath();
        ctx.fillStyle = "red";
        arc(f, 0, 3, Math.PI * 2);
        ctx.fill();
    };

    const parabola = () => {
        ctx.beginPath();
        fns.parabola_coords(max_y_mm, focus.value).forEach((p) => {
            lineTo(p.x, p.y);
        });
        ctx.stroke();
    };

    const rayfan = () => {
        ctx.strokeStyle = "green";
        fns.parallel_rayfan_coords(max_y_mm, f, rays.value).forEach((s) => {
            draw_segment(s);
        });
    };

    const nonparallelrayfan = () => {
        const segments = fns.non_parallel_rayfan_coords(
            f,
            max_y_mm,
            dist.value,
            z,
            rays.value,
        );
        ctx.fillStyle = "blue";
        arc(dist.value, 0, 5, Math.PI * 2);
        segments.forEach((s) => {
            ctx.strokeStyle = "orange";
            draw_segment(s);
            if (draw_normals.value) {
                normal(s.a.y);
            }
            if (draw_tangents.value) {
                tangent(s.a.y);
            }
            ctx.strokeStyle = "pink";
            draw_segment(fns.reflection_coords(f, s.a.y, dist.value, z));
        });
    };

    const normal = (y: number) => {
        ctx.strokeStyle = "red";
        const coords = fns.normal_coords(f, y);
        draw_segment(coords);
    };

    const sensor = () => {
        ctx.fillStyle = "black";
        ctx.fillRect(
            to_x(sensor_distance.value),
            to_y(-sensor_height.value / 2),
            1,
            sensor_height.value * zoom.value,
        );
    };
    const tangent = (y: number) => {
        ctx.strokeStyle = "blue";
        const coords = fns.tangent_coords(f, y);
        draw_segment(coords);
    };

    parabola();
    axis();
    if (draw_infinity.value) {
        rayfan();
    }
    nonparallelrayfan();
    focalPoint();
    sensor();
};

onMounted(() => {
    draw();
});

const params = computed(() => {
    return JSON.stringify({
        b: rays.value,
        c: dist.value,
        d: focus.value,
        e: radius.value,
        f: draw_normals.value,
        g: draw_tangents.value,
        i: draw_infinity.value,
        z: zoom.value,
        h: source_height.value,
        sd: sensor_distance.value,
        sh: sensor_height.value,
    });
});

const efl = computed(() => {
    return fns.effective_fl(focus.value, radius.value, dist.value);
});

const hfov = computed(() => fns.hfov(sensor_width.value, efl.value));
const vfov = computed(() => fns.vfov(sensor_height.value, efl.value));
const phfov = computed(() => fns.phfov(hfov.value, dist.value));
const pvfov = computed(() => fns.pvfov(vfov.value, dist.value));
const spread = computed(() =>
    fns.spread(focus.value, radius.value, dist.value),
);
const blur = computed(() =>
    fns.blur(radius.value, efl.value, sensor_distance.value, spread.value),
);
const airy = computed(() => fns.airy(focus.value, radius.value));
const dawes = computed(() => fns.dawes(radius.value));

watch(params, () => {
    draw();
});
</script>

<template>
    <div
        style="
            background: lightgray;
            padding: 1em;
            margin-bottom: 1em;
            border-radius: 2px;
            font-family: sans-serif;
            overflow: hidden;
        "
    >
        <div style="display: flex; flex-wrap: wrap">
            <div>
                <label style="margin: 8px 0; display: block" for=""
                    >Mirror radius (mm) <input type="number" v-model="radius"
                /></label>

                <label style="margin: 8px 0; display: block" for=""
                    >Draw tangents ?
                    <input type="checkbox" v-model="draw_tangents"
                /></label>

                <label style="margin: 8px 0; display: block" for=""
                    >Draw normals ?
                    <input type="checkbox" v-model="draw_normals"
                /></label>

                <label style="margin: 8px 0; display: block" for=""
                    >Draw infinity ray fan ?
                    <input type="checkbox" v-model="draw_infinity"
                /></label>

                <label style="margin: 8px 0; display: block" for=""
                    >Zoom <input type="number" v-model="zoom"
                /></label>

                <label style="margin: 8px 0; display: block" for=""
                    >Mirror focal length (mm)
                    <input type="number" v-model="focus"
                /></label>
                <label style="margin: 8px 0; display: block" for=""
                    >Rays (min 2)
                    <input type="number" min="2" step="1" v-model="rays"
                /></label>
            </div>
            <div style="margin-left: 40px">
                <label style="margin: 8px 0; display: block" for=""
                    >Source distance
                    <input
                        type="number"
                        :min="focus + 1"
                        step="1"
                        v-model="dist"
                /></label>

                <label style="margin: 8px 0; display: block" for=""
                    >Sensor position
                    <input type="number" step="0.1" v-model="sensor_distance"
                /></label>

                <label style="margin: 8px 0; display: block" for=""
                    >Sensor width
                    <input type="number" step="0.1" v-model="sensor_width"
                /></label>

                <label style="margin: 8px 0; display: block" for=""
                    >Sensor height
                    <input type="number" step="0.1" v-model="sensor_height"
                /></label>

                <label style="margin: 8px 0; display: block" for=""
                    >Pixel size
                    <input type="number" step="0.0001" v-model="pixel_size"
                /></label>
                <label style="margin: 8px 0; display: block" for=""
                    >Source height
                    <input type="number" step="1" v-model="source_height"
                /></label>
            </div>
        </div>

        <h4 style="margin: 0; margin-top: 0.25em">Some information :</h4>
        <ul style="padding: 0; list-style: none; margin: 0">
            <li style="margin: 8px 0">
                Average focal plane location for on-axis object at {{ dist }}mm
                : {{ efl.toFixed(2) }}mm
            </li>
            <li style="margin: 8px 0">
                FoV : {{ ((hfov / Math.PI) * 180).toFixed(2) }}° x
                {{ ((vfov / Math.PI) * 180).toFixed(2) }}° (at {{ dist }}mm,
                that is {{ phfov.toFixed(2) }}mm x {{ pvfov.toFixed(2) }}mm)
            </li>
            <li style="margin: 8px 0">
                Longitudinal aberration : {{ Math.abs(spread).toFixed(2) }}mm
            </li>
            <li style="margin: 8px 0">
                Geometric blur circle for sensor position :
                {{ Math.abs(blur).toFixed(4) }}mm ({{
                    Math.abs(blur / pixel_size).toFixed(2)
                }}
                px wide)
            </li>
            <li style="margin: 8px 0">
                Minimal blur circle @ 550nm (airy disk diameter) :
                {{ airy.toFixed(4) }}mm ({{ (airy / pixel_size).toFixed(2) }}px
                wide)
            </li>
            <li style="margin: 8px 0">
                Dawes limit : {{ dawes.toFixed(2) }} arcsec
            </li>
        </ul>

        <div style="width: 100%; overflow-x: scroll">
            <canvas
                style="border: 1px solid lightcoral; border-radius: 2px"
                ref="canvasRef"
            ></canvas>
        </div>
    </div>
</template>
