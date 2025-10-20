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
import AddUnitModal from "./UnitModal.vue"
import ColumnSelector from './ColumnSelector.vue'
import { ref } from "vue";
const props = defineProps({
  showSearch: { type: Boolean, default: true },
  showGroup: { type: Boolean, default: true },
  showSortBtn: { type: Boolean, default: true },
  showSelect: { type: Boolean, default: true },
  showExport: { type: Boolean, default: true },
  showRefresh: { type: Boolean, default: true },
  showDeleted: { type: Boolean, default: true },
  showAdd: { type: Boolean, default: true },
  showColsList: { type: Boolean, default: true },
  addLabel: { type: String, default: "Add Unit" },
  pageType: { type: String, default: "unit" }

})

const emit = defineEmits(["update-columns"]);

const showColsList = ref(true);

const handleColumnsUpdate = (updatedColumns) => {
  emit("update-columns", updatedColumns);
};
function openAdd() {
  if (props.pageType === "unit") {
    Object.keys(newUnit).forEach((key) => (newUnit[key] = ""));
    newUnit.fuelType = "Diesel";
  } else if (props.pageType === "tag") {
    window.location.href = "/add-tags";
  }
}


function handleAdd(data) {
  console.log("Added Unit:", data);
}
</script>

<template>
  <div class="pageHeader">
    <div class="leftSection">
      <Search v-if="props.showSearch" />
      <Group v-if="props.showGroup" />
      <Btn v-if="props.showSortBtn" :label="$t('buttons.sort')" :iconRight="AddIcon" />
      <SelectBtn v-if="props.showSelect" :option1="$t('filters.allUnits')" />
      <Export v-if="props.showExport" />
      <Btn v-if="props.showRefresh" :iconRight="RefreshIcon" />
      <Btn v-if="props.showDeleted" :label="$t('buttons.deletedItems')" :iconLeft="TrashIcon" />
    </div>


    <div class="rightSection">
      <ColumnSelector v-if="showColsList" :columns="$attrs.columns" @update-columns="handleColumnsUpdate" />
      <Btn data-bs-toggle="modal" data-bs-target="#addUnitModal" @click="openAdd" :iconLeft="PlusIcon" :label="addLabel"
        bg-color="#10B981" color="#fff" />
      <AddUnitModal id="addUnitModal" mode="add" v-model="newUnit" @submit="handleAdd" />
    </div>
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

.rightSection {
  display: flex;
  gap: 3px;
}
</style>
