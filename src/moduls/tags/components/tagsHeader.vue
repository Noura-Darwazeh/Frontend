<script setup>
import PageHeader from '../../../components/shared/PageHeader.vue';
import { ref } from 'vue';
import { tagColumns } from '../stores/columnsData';

const tagsCols = ref([...tagColumns]);

const emit = defineEmits(["update-columns", "unit-added"]);

function forwardUpdateColumns(updatedCols) {
    tagsCols.value = updatedCols;
    emit("update-columns", updatedCols);
}

function forwardUnitAdded() {
    emit("unit-added");
}
</script>

<template>
    <PageHeader :showSortBtn="false" :showSelect="false" :showExport="false" :showGroup="false" :showDeleted="false"
        :columns="tagsCols" :show-cols-list="true" @update-columns="forwardUpdateColumns"
        @unit-added="forwardUnitAdded" />

</template>
