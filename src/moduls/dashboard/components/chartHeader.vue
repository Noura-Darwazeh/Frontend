<script setup>
defineProps({
  title: {
    type: String,
    default: "Default Title"
  },
  icon: {
    type: String,
    default: null
  }
});
</script>

<template>
  <div class="chartHeader">
    <h3>{{ title }}</h3>
    <button v-if="icon">
      <img :src="icon" width="16" height="16">
    </button>
  </div>
</template>

<style scoped>
h3 {
  color: #d7dee4;
  font-size: 16px;
}

.chartHeader {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

button {
  background-color: #fff;
  border: 1px solid #d7dee4;
  border-radius: 8px;
  padding: 5px 10px;
}
</style>
