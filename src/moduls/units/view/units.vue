<template>
  <UnitsHeader :columns="unitsCols" @update-columns="handleColumnsUpdate" />

  <div>
    <BaseTable :columns="unitsCols.filter(col => col.visible)" :data="units" :showCheckbox="true">
      <template #cell-color="{ value }">
        <ColorIndicator :color="value" />
      </template>

      <template #cell-state="{ value }">
        <StateBadge :isOn="value === 'ON'" />
      </template>

      <template #cell-actions="{ row }">
        <MultiSelect :row-data="row" @show-details="openUnitDetailsModal" @edit="openEditModal" @delete="deleteUnit" />
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
// addVehicle, updateVehicle
import { addVehicle } from "../stores/showAllUnits";
import { updateVehicle } from "../stores/showAllUnits";
import { unitColumns } from '../stores/InitialData';
import * as bootstrap from "bootstrap";

const units = ref([]);
const unitsCols = ref([...unitColumns]);
const selectedUnit = ref({});
const modalMode = ref("add");

onMounted(async () => {
  const response = await getVehicles();
  console.log(response);
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

async function openEditModal(unitData) {
  try {
    modalMode.value = "edit";
    // جلب كل بيانات السيارة من الـ API
    const vehicleDetails = await getVehicleById(unitData.id);
    selectedUnit.value = { ...vehicleDetails }; // تعبئة بيانات المودال
    const modal = new bootstrap.Modal(document.getElementById("unitModal"));
    modal.show();
  } catch (error) {
    console.error('Failed to fetch vehicle details:', error);
  }
}

async function openUnitDetailsModal(unitData) {
  try {
    const vehicleDetails = await getVehicleById(unitData.id);
    selectedUnit.value = { ...vehicleDetails };
    const modal = new bootstrap.Modal(document.getElementById("unitDetailsModal"));
    modal.show();
  } catch (error) {
    console.error('Failed to fetch vehicle details:', error);
  }
}

function deleteUnit(unitData) {
  console.log("Delete unit:", unitData);
}

import axios from "axios";

// import { addVehicle, updateVehicle } from '../../../api/axios';
// import * as bootstrap from "bootstrap";

async function handleSubmit(data) {
  try {
    // تجهيز البيانات للإرسال إلى الـ API
    const payload = {
      name: data.name || "",
      tank_capacity: data.tank_capacity || "",
      oil_consumption: data.oil_consumption || "",
      fuel_type: data.fuel_type || "diesel",
      model: data.unitModel ? new Date(data.unitModel).getFullYear() : null,
      engine_serial_number: data.engine_serial_number || undefined,
      chassis_serial_number: data.chassis_serial_number || undefined,
      color: data.color || undefined,
      license_expiry_at: data.licenseExpiry
        ? new Date(data.licenseExpiry).toISOString().split("T")[0]
        : undefined,
      insurance_expiry_at: data.insuranceExpiry
        ? new Date(data.insuranceExpiry).toISOString().split("T")[0]
        : undefined,
      tags: data.tags || undefined,
      device_number: data.device_number || undefined,
      driver_name: data.driver_name || undefined,
      driver_phone: data.driver_phone || undefined,
    };

    let response;

    if (modalMode.value === "add") {
      // إضافة وحدة جديدة
      response = await addVehicle(payload);
      console.log("API Response:", response);

      console.log("Added Unit:", JSON.parse(JSON.stringify(payload)));

      // ✅ إضافة الصف الجديد للجدول مباشرة
      units.value.push({
        id: response.result.id,
        unit: data.name,
        driver: data.driver_name || "",
        color: data.color || "",
        phone: data.driver_phone || "",
        model: data.unitModel
          ? new Date(data.unitModel).getFullYear()
          : data.model || "",
        lastUpdate: null,
        state: "OFF",
        devices: data.device_number || "",
        sim: data.device_id || "",
      });

    } else {
      // تعديل وحدة موجودة
      const unitId = selectedUnit.value.id;
      response = await updateVehicle(unitId, payload);
      console.log("Updated:", response);

      // ✅ تحديث الصف الموجود في الجدول
      const index = units.value.findIndex((u) => u.id === unitId);
      if (index !== -1) {
        units.value[index] = {
          ...units.value[index],
          unit: data.name,
          driver: data.driver_name || "",
          color: data.color || "",
          phone: data.driver_phone || "",
          model: data.unitModel
            ? new Date(data.unitModel).getFullYear()
            : data.model || "",
          devices: data.device_number || "",
          sim: data.device_id || "",
        };
      }
    }

    // ✅ إغلاق المودال بعد الحفظ
    const modalEl = document.getElementById("unitModal");
    const modal = bootstrap.Modal.getInstance(modalEl);
    modal.hide();

  } catch (error) {
    console.error("Error saving unit:", error);
  }
}


</script>
