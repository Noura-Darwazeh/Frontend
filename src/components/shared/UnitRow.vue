<template>
  <tr>
    <td v-if="visibleColumns.includes('id')">
      <div class="checkBoxId">
        <input type="checkbox" />
        <p>{{ unit.id }}</p>
      </div>
    </td>

    <td v-if="visibleColumns.includes('unit')"><a href="#">{{ unit.unit }}</a></td>
    <td v-if="visibleColumns.includes('driver')">{{ unit.driver }}</td>
    <td v-if="visibleColumns.includes('phone')" class="lightLine">{{ unit.phone }}</td>
    <td v-if="visibleColumns.includes('color')" class="centerLine">
      <span class="color-circle" :style="{ backgroundColor: unit.color, border: '1px solid #ddd' }"></span>
    </td>
    <td v-if="visibleColumns.includes('model')" class="lightLine">{{ unit.model }}</td>
    <td v-if="visibleColumns.includes('lastUpdate')" class="lightLine">{{ unit.lastUpdate }}</td>
    <td v-if="visibleColumns.includes('state')">
      <span :class="['state', unit.state === 'ON' ? 'on' : 'off']">{{ unit.state }}</span>
    </td>
    <td v-if="visibleColumns.includes('devices')" class="lightLine centerLine">{{ unit.devices }}</td>
    <td v-if="visibleColumns.includes('sim')" class="lightLine">{{ unit.sim }}</td>
    <td v-if="visibleColumns.includes('actions')">
      <V @show-details="openUnitDetailsModal" @edit="openEditModal" />
      <UnitModal id="unitModal" :mode="modalMode" v-model="selectedUnit" @submit="handleSubmit" />
      <UnitDetailsModal id="unitDetailsModal" />
    </td>
  </tr>
</template>

<script>
import { ref } from "vue"
import V from "./OptionsColoumn.vue"
import UnitModal from "./UnitModal.vue"
import UnitDetailsModal from '../../moduls/units/components/UnitDetailsModal.vue'
import * as bootstrap from "bootstrap"

export default {
  name: "UnitRow",
  props: {
    unit: {
      type: Object,
      required: true,
    },
    visibleColumns: {
      type: Array,
      required: true,
    },
  },
  components: {
    V,
    UnitModal,
    UnitDetailsModal,
  },
  setup() {
    const modalMode = ref("add")
    const selectedUnit = ref({})

    function openEditModal(unitData) {
      modalMode.value = "edit"
      selectedUnit.value = { ...unitData }

      const modal = new bootstrap.Modal(document.getElementById("unitModal"))
      modal.show()
    }

    function openUnitDetailsModal() {
      const modal = new bootstrap.Modal(document.getElementById("unitDetailsModal"))
      modal.show()
    }

    function handleSubmit(data) {
      console.log("Save", data)
    }

    return {
      modalMode,
      selectedUnit,
      openEditModal,
      handleSubmit,
      openUnitDetailsModal,
    }
  },
}
</script>

<style scoped>
a {
  color: #0568A0;
}

.lightLine {
  color: #8D9DAB;
}

.centerLine {
  text-align: center;
}

.checkBoxId {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  color: #8D9DAB;
}

p {
  margin-top: 10px !important;
}

.color-circle {
  width: 24px;
  height: 24px;
  display: inline-block;
  border-radius: 50%;
}

.state.on {
  color: #10B981;
  background-color: #dbf5ec;
  padding: 2px 8px;
  border-radius: 10px;
  font-weight: bold;
}

.state.off {
  color: #50606e;
  background-color: #e4ebf2;
  padding: 2px 8px;
  border-radius: 10px;
  font-weight: bold;
}

.simBox {
  display: flex;
  gap: 15px;
}

td {
  vertical-align: middle;
  overflow: visible;
}
</style>
