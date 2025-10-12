<template>
  <tr>
    <td >
      <div class="checkBoxId">
        <input type="checkbox" />
        <p>{{ unit.id }}</p>
      </div>
    </td>

    <td ><a href="#">{{ unit.unit }}</a></td>
    <td >{{ unit.driver }}</td>
    <td >{{ unit.phone }}</td>
    <td  class="centerLine">
      <span class="color-circle" :style="{ backgroundColor: unit.color, border: '1px solid #ddd' }"></span>
    </td>
    <td >{{ unit.model }}</td>
    <td class="lightLine">{{ unit.lastUpdate }}</td>
    <td >
      <span :class="['state', unit.state === 'ON' ? 'on' : 'off']">{{ unit.state }}</span>
    </td>
    <td>{{ unit.devices }}</td>
    <td >{{ unit.sim }}</td>
    <td >
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
