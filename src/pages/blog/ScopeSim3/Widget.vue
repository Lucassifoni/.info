<script lang="ts" setup>
import { computed, onMounted, Ref, ref, watch } from 'vue';
const canvasRef: Ref<HTMLCanvasElement | null> = ref(null);
const focus = ref(400);
const radius = ref(57);
const px_per_mm = ref(2);
const rays = ref(2);
const dist = ref(99999999);

const draw = () => {
    const c = canvasRef.value;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    c.width = 600;
    c.height = 600;
    ctx.fillStyle = "white";
    ctx.strokeStyle = "black";
    ctx.lineWidth = 1;
    ctx.fillRect(0, 0, c.width, c.height);
    const a_mm = focus.value;
    const max_y_mm = radius.value;
    const x_off = 10;
    const y_off = max_y_mm + 10;

    const x_coord = (a: number, y: number) => {
        return y * y / 4 / a;
    };

    const axis = () => {
        ctx.beginPath();
        ctx.moveTo(0, y_off + 0.5);
        ctx.lineTo(1000, y_off + 0.5);
        ctx.strokeStyle = "green";
        ctx.stroke();
    };

    const focalPoint = () => {
        ctx.beginPath();
        ctx.fillStyle = "red";
        ctx.arc(a_mm + x_off, y_off + 0.5, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
    }
    const parabola = () => {
        ctx.beginPath();
        for (let y = -1 * max_y_mm; y < max_y_mm; y += 1) {
            const x = x_coord(a_mm, y);
            const rx = x_off + x;
            const ry = y + y_off;
            ctx.lineTo(rx, ry + 0.5);
        }
        ctx.stroke();
        ctx.closePath();
    };

    const rayfan = () => {
        let base_y = -max_y_mm;
        let step = Math.abs(max_y_mm) / rays.value * 2;
        for (let i = 0; i <= rays.value; i++) {
            let y = base_y + i * step;
            let x = x_coord(a_mm, y);
            ctx.strokeStyle = "green";
            ctx.beginPath();
            ctx.moveTo(x + x_off, y + y_off + 0.5);
            ctx.lineTo(999999, y + y_off + 0.5);
            ctx.moveTo(x + x_off, y + y_off + 0.5);
            ctx.lineTo(a_mm + x_off, y_off + 0.5);
            ctx.stroke();
            ctx.closePath();
        }
    };

    const nonparallelrayfan = () => {
        let base_y = -max_y_mm;
        let base_x = dist.value + x_off;
        let step = Math.abs(max_y_mm) / rays.value * 2;
        for (let i = 0; i <= rays.value; i++) {
            let y = base_y + i * step;
            let x = x_coord(a_mm, y);
            ctx.strokeStyle = "blue";
            ctx.beginPath();
            ctx.moveTo(x + x_off, y + y_off + 0.5);
            ctx.lineTo(base_x, y_off + 0.5);
            ctx.stroke();
            tangent(y);
        }
    };

    const normal = (y: number) => {
        ctx.beginPath();
        ctx.strokeStyle = "red";
        const tx = x_coord(a_mm, y);
        const xx = -tx;
        const yy = 0;
        const dx = xx - tx;
        const dy = yy - y;
        ctx.moveTo(-dy + tx + x_off, dx + y + y_off);
        ctx.lineTo(dy + tx + x_off, -dx + y + y_off);
        ctx.stroke();
    };

    const tangent = (y: number) => {
        ctx.beginPath();
        ctx.strokeStyle = "blue";
        const x = x_coord(a_mm, y);
        const xx = -x;
        const yy = 0;
        const dx = xx - x;
        const dy = yy - y;
        ctx.moveTo(xx + x_off, yy + y_off);
        ctx.lineTo(x - dx + x_off, y - dy + y_off);
        ctx.stroke();
        normal(y);
    }

    parabola();
    axis();
    rayfan();
    nonparallelrayfan();
    focalPoint();
};

onMounted(() => {
    draw();
});
const params = computed(() => {
    return JSON.stringify([px_per_mm.value, rays.value, dist.value, focus.value, radius.value]);
});
watch(params, () => {
    draw();
});
</script>

<template>
    <div>
        <div>
            <label for="">Mirror radius (mm) <input type="number" v-model="radius"></label>
        </div>
        <div>
            <label for="">Mirror focal length (mm) <input type="number" v-model="focus"></label>
        </div>
        <div>
            <label for="">Rays (min 2) <input type="number" min="2" step="1" v-model="rays"></label>
        </div>
        <div>
            <label for="">Source distance (min. focal length) <input type="number" :min="focus" step="1" v-model="dist"></label>
        </div>
        <canvas style="border: 1px solid lightcoral; border-radius: 3px" ref="canvasRef"></canvas>
    </div>
</template>