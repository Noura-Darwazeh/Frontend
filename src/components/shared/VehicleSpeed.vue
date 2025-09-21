<template>
    <div class="circle-wrapper">
        <svg class="progress-ring" width="24" height="24">
            <circle class="progress-ring__background" stroke-width="2" r="10" cx="12" cy="12" />
            <circle class="progress-ring__progress" :stroke="progressColor" stroke-width="2" fill="transparent" r="10"
                cx="12" cy="12" :stroke-dasharray="circumference" :stroke-dashoffset="dashOffset" />
        </svg>
        <div class="progress-text">{{ value }}</div>
    </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
    value: { type: Number, required: true },
    max: { type: Number, default: 210 }
})

const radius = 10;
const circumference = 2 * Math.PI * radius;

const percentage = computed(() => (props.value / props.max) * 100);

const dashOffset = computed(() => {
    return circumference - (percentage.value / 100) * circumference;
});

const progressColor = computed(() => {
    if (props.value < 70) return "green";
    if (props.value < 140) return "orange";
    return "red";
});
</script>

<style scoped>
.circle-wrapper {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
}

.progress-ring__background {
    fill: transparent;
    stroke: #e5e7eb;
}

.progress-ring__progress {
    fill: transparent;
    transform: rotate(120deg) scale(-1, 1);
    transform-origin: center;
    transition: stroke-dashoffset 0.35s;
}

.progress-text {
    position: absolute;
    font-size: 0.7rem;
    font-weight: bold;
    color: #50606e;
}
</style>
