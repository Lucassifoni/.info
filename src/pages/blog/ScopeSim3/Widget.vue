<script lang="ts" setup>
import { computed, onMounted, ref, watch } from "vue";
import { type Ref } from "vue";
import {
    parabola_coords,
    parallel_rayfan_coords,
    reflection_coords,
    non_parallel_rayfan_coords,
    normal_coords,
    tangent_coords,
} from "./functions";
import type { Point, Segment } from "./types";

const canvasRef: Ref<HTMLCanvasElement | null> = ref(null);
const focus = ref(400);
const radius = ref(57);
const rays = ref(4);
const zoom = ref(1.5);
const dist = ref(10000);
const draw_normals = ref(true);
const draw_infinity = ref(true);
const draw_tangents = ref(false);

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
        parabola_coords(max_y_mm, focus.value).forEach((p) => {
            lineTo(p.x, p.y);
        });
        ctx.stroke();
    };

    const rayfan = () => {
        ctx.strokeStyle = "green";
        parallel_rayfan_coords(max_y_mm, f, rays.value).forEach((s) => {
            draw_segment(s);
        });
    };

    const nonparallelrayfan = () => {
        ctx.strokeStyle = "orange";
        const segments = non_parallel_rayfan_coords(
            f,
            max_y_mm,
            dist.value,
            rays.value,
        );
        ctx.fillStyle = "blue";
        arc(dist.value, 0, 5, Math.PI * 2);
        segments.forEach((s) => {
            draw_segment(s);
            if (draw_normals.value) {
                normal(s.a.y);
            }
            if (draw_tangents.value) {
                tangent(s.a.y);
            }
            ctx.strokeStyle = "orange";
            draw_segment(reflection_coords(f, s.a.y, dist.value));
        });
    };

    const normal = (y: number) => {
        ctx.strokeStyle = "red";
        const coords = normal_coords(f, y);
        draw_segment(coords);
    };

    const tangent = (y: number) => {
        ctx.strokeStyle = "blue";
        const coords = tangent_coords(f, y);
        draw_segment(coords);
    };

    parabola();
    axis();
    if (draw_infinity.value) {
        rayfan();
    }
    nonparallelrayfan();
    focalPoint();
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
    });
});
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
            border-radius: 3px;
            font-family: sans-serif;
            overflow: hidden;
        "
    >
        <div>
            <label style="margin: 4px; display: block" for=""
                >Mirror radius (mm) <input type="number" v-model="radius"
            /></label>
        </div>
        <div>
            <label style="margin: 4px; display: block" for=""
                >Draw tangents ? <input type="checkbox" v-model="draw_tangents"
            /></label>
        </div>
        <div>
            <label style="margin: 4px; display: block" for=""
                >Draw normals ? <input type="checkbox" v-model="draw_normals"
            /></label>
        </div>
        <div>
            <label style="margin: 4px; display: block" for=""
                >Draw infinity ray fan ?
                <input type="checkbox" v-model="draw_infinity"
            /></label>
        </div>
        <div>
            <label style="margin: 4px; display: block" for=""
                >Zoom <input type="number" v-model="zoom"
            /></label>
        </div>
        <div>
            <label style="margin: 4px; display: block" for=""
                >Mirror focal length (mm) <input type="number" v-model="focus"
            /></label>
        </div>
        <div>
            <label style="margin: 4px; display: block" for=""
                >Rays (min 2)
                <input type="number" min="2" step="1" v-model="rays"
            /></label>
        </div>
        <div>
            <label style="margin: 4px; display: block" for=""
                >Source distance
                <input type="number" :min="focus + 1" step="1" v-model="dist"
            /></label>
        </div>
        <div style="margin-top: 1em">
            <h4>Calculation results :</h4>
            <ul style="padding: 0; list-style: none">
                <li>
                    1mm - radius focal point :
                    {{ reflection_coords(focus, 1, dist).b.x.toFixed(2) }}mm
                </li>
                <li>
                    {{ radius }}mm - radius focal point :
                    {{
                        reflection_coords(focus, radius, dist).b.x.toFixed(2)
                    }}mm
                </li>
                <li>
                    Longitudinal aberration :
                    {{
                        (
                            reflection_coords(focus, radius, dist).b.x -
                            reflection_coords(focus, 1, dist).b.x
                        ).toFixed(2)
                    }}mm
                </li>
                <li>
                    Outward focal plane push :
                    {{
                        (
                            reflection_coords(focus, radius, dist).b.x - focus
                        ).toFixed(2)
                    }}mm
                </li>
            </ul>
        </div>
        <div style="width: 100%; padding-bottom: 32px; overflow-x: scroll">
            <canvas
                style="border: 1px solid lightcoral; border-radius: 3px"
                ref="canvasRef"
            ></canvas>
        </div>
    </div>
</template>
