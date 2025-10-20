<template>
    <TagsHeader @update-columns="handleColumnsUpdate" :addLabel="$t('buttons.addTag')" pageType="tag" />
    <BaseTable :columns="tagsCols.filter(col => col.visible)" :data="tags" :showCheckbox="true">
        <template #cell-actions="{ row }">
            <MultiSelect :row-data="row" @show-details="openUnitDetailsModal" @edit="openEditPage"
                @delete="deleteUnit" />
        </template>
    </BaseTable>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { tagColumns } from '../stores/columnsData';
import BaseTable from "../../../components/shared/Table.vue";
import { getTags, deleteTag } from '../stores/tags';
import TagsHeader from '../components/tagsHeader.vue';
import MultiSelect from '../../../components/shared/Actions.vue';
import { useRouter } from 'vue-router';
const router = useRouter();
const tags = ref([]);
const tagsCols = ref([...tagColumns]);

onMounted(async () => {
    const response = await getTags();
    console.log(response);

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
        } else {
            alert('Failed to delete tag.');
        }
    } catch (err) {
        console.error('Error deleting tag:', err);
        alert('Something went wrong while deleting the tag.');
    }
}
</script>
