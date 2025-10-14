<script setup>
import PageHeader from '../../../components/shared/PageHeader.vue';
import { unitColumns } from '../stores/InitialData';
const emit = defineEmits(["update-columns", "unit-added"]);
function forwardUpdateColumns(cols){ emit("update-columns", cols); }
function forwardUnitAdded(){ emit("unit-added"); }

</script>

<template>
    <PageHeader :columns="unitColumns" :show-cols-list="true" @update-columns="forwardUpdateColumns" @unit-added="forwardUnitAdded"/>
</template>