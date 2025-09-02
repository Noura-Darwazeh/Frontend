<script setup>
import Btn from './Button.vue'
import AddIcon from '../../assets/Switch.svg'
import RefreshIcon from '../../assets/refresh.svg'
import TrashIcon from '../../assets/trash-01.svg'
import SelectBtn from './Select.vue'
import Search from './SearchBox.vue'
import PlusIcon from '../../assets/plus.svg'
</script>


<template>
    <div class="pageHeader">
        <div class="leftSection">
            <Search />
            <SelectBtn option1="Group" customSelectWidth="90px" selectWidth="90%" :iconRightSpace="20" />
            <Btn label="Sort" :iconRight="AddIcon" @click="addUnit" />

            <SelectBtn option1="All Units" />

            <Btn label="Export" @click="exportUnits"
                :showArrow="false" />
            <Btn :iconRight="RefreshIcon" @click="addUnit" />
            <Btn label="Deleted Items" :iconLeft="TrashIcon" @click="addUnit" />
        </div>

        <Btn :iconLeft="PlusIcon" label="Add Unit" bg-color="#10B981" color="#fff" />
    </div>
</template>

<style>
.pageHeader {
    display: flex;
    justify-content: space-between;
}

.leftSection {
    display: flex;
    gap: 7px;
}
</style>