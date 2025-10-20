<template>
    <TagsHeader @update-columns="handleColumnsUpdate" :addLabel="$t('buttons.addTag')" pageType="tag" />
    <BaseTable :columns="tagsCols.filter(col => col.visible)" :data="tags" :showCheckbox="true" />
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { tagColumns } from '../stores/columnsData';
import BaseTable from "../../../components/shared/Table.vue";
import { getTags } from '../stores/tags';
import TagsHeader from '../components/tagsHeader.vue'
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

</script>
