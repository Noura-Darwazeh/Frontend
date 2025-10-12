<script setup>
import PageHeader from '../../../components/shared/PageHeader.vue';
import { unitColumns } from '../stores/InitialData';

</script>

<template>
    <PageHeader :columns="unitColumns" :show-cols-list="true"/>
</template>