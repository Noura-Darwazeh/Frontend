<template>
  <div class="column-selector">
    <button type="button" @click="toggleDropdown">
      <img src="../../assets/settings.svg" />
    </button>

    <div v-if="showDropdown" class="dropdown">
      <div v-for="col in localColumns" :key="col.key">
        <label v-if="col.key !== 'actions'">
          <input type="checkbox" v-model="col.visible" @change="emitUpdate" />
          {{ col.label }}
        </label>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch } from "vue";
import Btn from '../shared/Button.vue'
const props = defineProps({
  columns: { type: Array, required: true }
});

const emit = defineEmits(["update-columns"]);
const showDropdown = ref(false);
const localColumns = reactive(JSON.parse(JSON.stringify(props.columns)));

function toggleDropdown() {
  showDropdown.value = !showDropdown.value;
}

function emitUpdate() {
  emit("update-columns", JSON.parse(JSON.stringify(localColumns)));
}

watch(
  () => props.columns,
  (newVal) => {
    Object.assign(localColumns, JSON.parse(JSON.stringify(newVal)));
  },
  { deep: true }
);
</script>

<style scoped>
button {
  padding: 5px 15px;
  border: none;
  border-radius: 5px;
  border: 1px solid #D7DEE4 !important;
  background-color: #ffffff !important;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  min-height: 50px;

}

.column-selector {
  position: relative;
  display: inline-block;
}

.column-selector button {
  background-color: #10b981;
  color: #fff;
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
}

.dropdown {
  position: absolute;
  background: white;
  border: 1px solid #ccc;
  margin-top: 4px;
  padding: 8px;
  border-radius: 4px;
  z-index: 100;
  min-width: 150px;
}

.dropdown label {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 4px;
  cursor: pointer;
}
</style>
