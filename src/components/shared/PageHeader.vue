<script setup>
import Btn from './Button.vue'
import AddIcon from '../../assets/Switch.svg'
import RefreshIcon from '../../assets/refresh.svg'
import TrashIcon from '../../assets/trash-01.svg'
import SelectBtn from './Select.vue'
import Search from './SearchBox.vue'
import PlusIcon from '../../assets/plus.svg'
import Group from './Group.vue'
import Export from './Export.vue'
import AddUnitModal from "./UnitModal.vue";
import ColumnSelector from './ColumnSelector.vue' // << استدعاء الكولوم سيليكتور
import { reactive, ref } from "vue";

const newUnit = reactive({
    unitName: "",
    fuelType: "Diesel",
    tankCapacity: "",
    unitModel: "",
    engineSerial: "",
    chassisSerial: "",
    oilConsumption: "",
    eTag: "",
    color: "",
    licenseExpiry: "",
    insuranceExpiry: "",
    tags: "",
});

const columns = ref([
    { key: "id", label: "ID", visible: true },
    { key: "unit", label: "UNIT", visible: true },
    { key: "driver", label: "DRIVER", visible: true },
    { key: "phone", label: "PHONE", visible: true },
    { key: "color", label: "COLOR", visible: true },
    { key: "model", label: "MODEL", visible: true },
    { key: "lastUpdate", label: "LAST UPDATE", visible: true },
    { key: "state", label: "STATE", visible: true },
    { key: "devices", label: "DEVICES", visible: true },
    { key: "sim", label: "SIM", visible: true },
    { key: "actions", label: "ACTIONS", visible: true },
]);

function handleColumnsUpdate(updatedColumns) {
    columns.value = updatedColumns;
}

function openAdd() {
    Object.keys(newUnit).forEach((key) => (newUnit[key] = ""));
    newUnit.fuelType = "Diesel";
}

function handleAdd(data) {
    console.log("Added Unit:", data);
}
</script>


<template>
    <div class="pageHeader">
        <div class="leftSection">
            <Search />
            <Group />
            <Btn label="Sort" :iconRight="AddIcon" @click="addUnit" />

            <SelectBtn option1="All Units" />

            <Export />
            <Btn :iconRight="RefreshIcon" @click="addUnit" />
            <Btn label="Deleted Items" :iconLeft="TrashIcon" @click="addUnit" />
        </div>

        <!-- <Btn :iconRight="RefreshIcon" @click="addUnit" /> -->

          <!-- زر الأعمدة -->
        <ColumnSelector
            :columns="columns"
            @update-columns="handleColumnsUpdate"
        />

        <!-- <div>
            <Btn data-bs-toggle="modal" data-bs-target="#addUnitModal" @click="openAdd" :iconLeft="PlusIcon"
                label="Add Unit" bg-color="#10B981" color="#fff" />

            <AddUnitModal id="addUnitModal" mode="add" v-model="newUnit" @submit="handleAdd" />

        </div> -->

    </div>
</template>

<style>
.pageHeader {
    display: flex;
    justify-content: space-between;
    margin-top: 15px !important;
    width: 100% !important;

}

.leftSection {
    display: flex;
    gap: 7px;
}
</style>