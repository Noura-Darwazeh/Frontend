<template>
    <div class="onOff" :style="{ backgroundColor: bgColor }">
        <img :src="icon" :style="{ filter: svgFilter }" alt="onoff-icon" />
    </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
    bgColor: { type: String, default: 'aqua' },
    icon: { type: String, required: true },
    isOn: { type: Boolean, default: true }
});

const svgFilter = computed(() => {
    return props.isOn
        ? 'brightness(0) saturate(100%) invert(55%) sepia(40%) saturate(2200%) hue-rotate(120deg) brightness(93%) contrast(87%)'
        : 'brightness(0) saturate(100%) invert(99%) sepia(4%) saturate(0%) hue-rotate(307deg) brightness(103%) contrast(100%)';
});
</script>

<style scoped>
.onOff {
    border-radius: 50%;
    width: 24px;
    height: 24px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.onOff img {
    width: 16px;
    height: 16px;
}
</style>
