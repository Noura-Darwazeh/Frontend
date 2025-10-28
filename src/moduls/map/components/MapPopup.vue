<template>
  <div class="popup-overlay">
    <div class="popup">
      <h3>Save Area</h3>

      <label>Area Name <span style="color:red">*</span></label>
      <input v-model="localName" placeholder="Enter area name" />

      <label>Description</label>
      <textarea v-model="localDescription" placeholder="Enter description"></textarea>

      <div class="popup-buttons">
        <button @click="$emit('save')">Save</button>
        <button @click="$emit('cancel')">Cancel</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
const props = defineProps(['areaName', 'areaDescription'])
const emits = defineEmits(['update:areaName', 'update:areaDescription', 'save', 'cancel'])

const localName = ref(props.areaName)
const localDescription = ref(props.areaDescription)

watch(localName, (v) => emits('update:areaName', v))
watch(localDescription, (v) => emits('update:areaDescription', v))
</script>

<style scoped>
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
}

.popup {
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 320px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.popup h3 {
  margin-bottom: 10px;
}

.popup input,
.popup textarea {
  width: 100%;
  margin-bottom: 10px;
  padding: 6px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.popup-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.popup-buttons button {
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.popup-buttons button:first-child {
  background-color: #1976d2;
  color: white;
}
</style>
