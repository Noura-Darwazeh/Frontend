<!-- Button.vue -->
<template>
  <button :style="{ backgroundColor: bgColor, color: color }" class="btn" @click="$emit('click')">
    <img v-if="iconLeft" :src="iconLeft" alt="" class="icon" />
    {{ label }}
    <img v-if="iconRight" :src="iconRight" alt="" class="icon" />
  </button>
</template>

<script>
export default {
  props: {
    label: String,
    iconLeft: String,
    iconRight: String,
    bgColor: {
      type: String,
      default: '#fff'
    },
    color: {
      type: String,
      default: '#333'
    }
  }
}
</script>

<style scoped>
.btn {
  padding: 5px 15px;
  border: none;
  border-radius: 5px;
  border: 1px solid #D7DEE4;
  background-color: #ffffff;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 5px;
}

.icon {
  width: 18px;
  height: 18px;
}
</style>
