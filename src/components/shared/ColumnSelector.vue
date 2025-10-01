<template>
  <div class="column-selector">
    <!-- زر الأعمدة -->
    <button type="button" @click="toggleDropdown">
      Select Columns ▼
    </button>

    <!-- القائمة المنسدلة -->
    <div v-if="showDropdown" class="dropdown">
      <div v-for="col in localColumns" :key="col.key">
        <label>
          <input type="checkbox" v-model="col.visible" @change="emitUpdate" />
          {{ col.label }}
        </label>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch } from "vue";

// Props
const props = defineProps({
  columns: {
    type: Array,
    required: true,
  },
});

// Emit
const emit = defineEmits(["update-columns"]);

const showDropdown = ref(false);

// نسخة محلية للتعديل على الأعمدة بدون التأثير المباشر على الأب
const localColumns = reactive(JSON.parse(JSON.stringify(props.columns)));

// فتح/اغلاق القائمة
function toggleDropdown() {
  showDropdown.value = !showDropdown.value;
}

// إرسال التحديث للوالد
function emitUpdate() {
  emit("update-columns", localColumns);
}

// مراقبة أي تغييرات في الأعمدة من الأب لتحديث النسخة المحلية
watch(
  () => props.columns,
  (newVal) => {
    Object.assign(localColumns, JSON.parse(JSON.stringify(newVal)));
  },
  { deep: true }
);
</script>

<style scoped>
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
