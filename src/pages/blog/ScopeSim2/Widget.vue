<script lang="ts" setup>
import { computed, ref, Ref } from 'vue';

const params = ref({
    wavelength: 0.00055,
    radius: 57,
    curvature_radius: 800,
    object_distance_from_image: 7620,
    image_distance_from_mirror: 685.8
});

const adjust_display = (value: number) => {
    return value;
};

const opd = computed(() => {
    const r = params.value.radius;
    const roc = params.value.curvature_radius;
    return (r * r * r * r) / (4 * (roc * roc * roc));
});

const rayleigh = computed(() => {
    return params.value.wavelength / 4;
});

const opd_ellipsoid = computed(() => {
    const term_1 = opd.value;
    const C = params.value.object_distance_from_image / 2;
    const a = params.value.image_distance_from_mirror + C;
    const term_2 = (C * C) / (a * a);
    return term_1 * term_2;
});

const k = computed(() => {
    return -1 * (opd_ellipsoid.value / opd.value);
});
</script>

<template>
    <div style="background: #333; color: white; padding: 4px;border-radius: 2px;">
        <div v-for="val, key in params">
            <label style="margin: 4px; display: block; padding: 2px;">
                {{ key }} mm <input type="number" v-model="params[key]">
            </label>
        </div>
        <hr>
        <ul style="list-style:none; padding: 0">
            <li>OPD <code style="color:black">DP</code> between a sphere and parabola <code style="color:black">(r^4 / 4R^3)</code> : {{ adjust_display(opd).toFixed(6) }}mm</li>
            <li>OPD <code style="color:black">DE</code> between a sphere and ellipsoid <br><code style="color:black">(r^4 / 4R^3) * (C^2 / a^2)</code>, where <code style="color:black">2C is the object distance</code>, and <code style="color:black">a is C + the image distance</code>: {{ adjust_display(opd_ellipsoid).toFixed(6) }}mm</li>
            <li><code style="color:black">DP - DE</code> to observe an object at {{ adjust_display(params.object_distance_from_image) }}mm with a parabolic mirror :<br>
            {{ adjust_display(opd - opd_ellipsoid).toFixed(6) }}, or {{ ((opd - opd_ellipsoid) / rayleigh).toFixed(2) }} times the &lambda;/4 criterion.</li>
            <li>Calculated conic constant for the ideal ellipsoid : {{ k.toFixed(2) }}</li>
        </ul>
    </div>
</template>

<style lang="scss">

</style>