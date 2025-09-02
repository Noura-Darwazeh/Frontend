<!-- Button.vue -->
<template>
    <button class="btn" @click="$emit('click')">
        <img v-if="icon" :src="icon" alt="" class="icon" />
    </button>
</template>

<script>
export default {
    props: {
        icon: String
    }
}
</script>

<style scoped>
.btn {
    padding: 10px;
    border: none;
    border-radius: 50%;
    background-color: #d7dee4;
    cursor: pointer;
    display: inline-flex;
}

.icon {
    width: 18px;
    height: 18px;
}
</style>
