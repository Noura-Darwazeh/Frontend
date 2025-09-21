<template>
    <span class="color-dot" :style="{ backgroundColor: color }"></span>
</template>

<style scoped>
.color-dot {
    display: inline-block;
    width: 24px;
    height: 24px;
    background-color: #2563eb;
    border-radius: 50%;
}
</style>

<script setup>
defineProps({
  color: {
    type: String,
    default: '#2563eb' // لون افتراضي
  }
})
</script>