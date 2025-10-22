<template>
  <TagsHeader 
    @update-columns="handleColumnsUpdate" 
    :addLabel="$t('buttons.addTag')" 
    pageType="tag" 
  />

  <!-- 🧾 الجدول -->
  <BaseTable 
    :columns="tagsCols.filter(col => col.visible)" 
    :data="paginatedTags" 
    :showCheckbox="true"
  >
    <template #cell-actions="{ row }">
      <MultiSelect 
        :show-details="false" 
        :row-data="row" 
        @show-details="openUnitDetailsModal" 
        @edit="openEditPage"
        @delete="deleteUnit" 
      />
    </template>
  </BaseTable>

  <!-- 📄 الباجنيشن -->
  <div class="pagination">
    <button 
      :disabled="currentPage === 1" 
      @click="currentPage--"
    >
      Prev
    </button>

    <span>Page {{ currentPage }} of {{ totalPages }}</span>

    <button 
      :disabled="currentPage === totalPages" 
      @click="currentPage++"
    >
      Next
    </button>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { tagColumns } from '../stores/columnsData';
import BaseTable from "../../../components/shared/Table.vue";
import { getTags, deleteTag } from '../stores/tags';
import TagsHeader from '../components/tagsHeader.vue';
import MultiSelect from '../../../components/shared/Actions.vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const tags = ref([]);
const tagsCols = ref([...tagColumns]);

// 📄 إعدادات الباجنيشن
const currentPage = ref(1);
const rowsPerPage = 10;

// حساب الصفحات الكلية
const totalPages = computed(() => Math.ceil(tags.value.length / rowsPerPage));

// تحديد البيانات المعروضة في الصفحة الحالية
const paginatedTags = computed(() => {
  const start = (currentPage.value - 1) * rowsPerPage;
  const end = start + rowsPerPage;
  return tags.value.slice(start, end);
});

onMounted(async () => {
  const response = await getTags();

  if (response?.result?.data) {
    tags.value = response.result.data.map(t => ({
      id: t.id,
      name: t.name,
      accounts: t.accounts.length,
      units: t.vehicles.length,
      drivers: t.drivers.length,
      areas: t.zones.length,
      customers: t.clients.length,
      createdDate: t.created_at.split(' ')[0],
      createdDy: t.created_by?.name || '—'
    }));
  }
});

function handleColumnsUpdate(updatedColumns) {
  tagsCols.value = updatedColumns;
}

function openEditPage(row) {
  router.push({
    name: 'addtags',
    query: { editId: row.id },
    meta: { title: 'Edit Tag' }
  });
}

async function deleteUnit(row) {
  const confirmed = confirm(`Are you sure you want to delete tag "${row.name}"?`);
  if (!confirmed) return;

  try {
    const res = await deleteTag(row.id);
    if (res.status === 'success') {
      alert('Tag deleted successfully!');
      tags.value = tags.value.filter(t => t.id !== row.id);

      // إعادة ضبط الصفحة لو صارت فارغة بعد الحذف
      if (paginatedTags.value.length === 0 && currentPage.value > 1) {
        currentPage.value--;
      }
    } else {
      alert('Failed to delete tag.');
    }
  } catch (err) {
    console.error('Error deleting tag:', err);
    alert('Something went wrong while deleting the tag.');
  }
}
</script>

<style scoped>
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  margin-top: 20px;
}

button {
  background-color: #1976d2;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
}

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
</style>
