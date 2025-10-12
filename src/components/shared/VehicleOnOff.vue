<template>
  <span :class="['state', isOn ? 'on' : 'off']">
    {{ isOn ? 'ON' : 'OFF' }}
  </span>
</template>

<script setup>
defineProps({
  isOn: {
    type: Boolean,
    required: true
  }
})
</script>

<style scoped>
.state {
  padding: 2px 8px;
  border-radius: 10px;
  font-weight: bold;
}

.state.on {
  color: #10B981;
  background-color: #dbf5ec;
}

.state.off {
  color: #50606e;
  background-color: #e4ebf2;
}
</style>
