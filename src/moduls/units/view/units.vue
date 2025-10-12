<template>
  <UnitsHeader :columns="unitsCols" @update-columns="handleColumnsUpdate" />

  <div>
    <BaseTable
      :columns="unitsCols.filter(col => col.visible)"
      :data="units"
      :showCheckbox="true"
    >
      <template #cell-color="{ value }">
        <ColorIndicator :color="value" />
      </template>

      <template #cell-state="{ value }">
        <StateBadge :isOn="value === 'ON'" />
      </template>

      <template #cell-actions="{ row }">
        <MultiSelect
          :row-data="row"
          @show-details="openUnitDetailsModal"
          @edit="openEditModal"
          @delete="deleteUnit"
        />
      </template>
    </BaseTable>

    <UnitModal id="unitModal" v-model="selectedUnit" :mode="modalMode" @submit="handleSubmit" />
    <UnitDetailsModal id="unitDetailsModal" :unit="selectedUnit" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import BaseTable from "../../../components/shared/Table.vue";
import UnitsHeader from "../components/UnitsHeader.vue";
import ColorIndicator from "../../../components/shared/VehicleColor.vue";
import StateBadge from "../../../components/shared/VehicleOnOff.vue";
import MultiSelect from '../../../components/shared/OptionsColoumn.vue';
import UnitModal from "../../../components/shared/UnitModal.vue";
import UnitDetailsModal from '../components/UnitDetailsModal.vue';
import { getVehicles } from "../stores/showAllUnits";
import { getVehicleById } from "../stores/showAllUnits";
import { unitColumns } from '../stores/InitialData';
import * as bootstrap from "bootstrap";

const units = ref([]);
const unitsCols = ref([...unitColumns]);
const selectedUnit = ref({});
const modalMode = ref("add");

onMounted(async () => {
  const response = await getVehicles();
  units.value = response.result.data.map((v) => ({
    id: v.id,
    unit: v.name,
    driver: v.driver_name,
    color: v.color,
    phone: v.driver_phone,
    model: v.model || v.vehicle_type,
    lastUpdate: v.last_update_point,
    state: v.vehicle_status == 1 ? "ON" : "OFF",
    devices: v.device_number,
    sim: v.device_id,
  }));
});

function handleColumnsUpdate(updatedColumns) {
  unitsCols.value = updatedColumns;
}

function openEditModal(unitData) {
  modalMode.value = "edit";
  selectedUnit.value = { ...unitData };
  const modal = new bootstrap.Modal(document.getElementById("unitModal"));
  modal.show();
}
async function openUnitDetailsModal(unitData) {
  try {
    // نجيب البيانات من السيرفر حسب ID
    const vehicleDetails = await getVehicleById(unitData.id);

    // نخزن البيانات في selectedUnit
    selectedUnit.value = { ...vehicleDetails };

    // نفتح المودال
    const modal = new bootstrap.Modal(document.getElementById("unitDetailsModal"));
    modal.show();
  } catch (error) {
    console.error('Failed to fetch vehicle details:', error);
  }
}
// function openUnitDetailsModal(unitData) {
//   selectedUnit.value = { ...unitData };
//   const modal = new bootstrap.Modal(document.getElementById("unitDetailsModal"));
//   modal.show();
// }

function deleteUnit(unitData) {
  console.log("Delete unit:", unitData);
}

function handleSubmit(data) {
  console.log("Save", data);
}
</script>
