<script>
import UnitRow from "../../../components/shared/UnitRow.vue";
import UnitsHeader from "../components/UnitsHeader.vue";
import { getVehicles } from "../stores/showAllUnits";
import Btn from "../../../components/shared/Button.vue";
export default {
  name: "UnitsTable",
  components: { UnitRow, UnitsHeader },

  data() {
    return {
      localUnits: [],
      loading: true,
      error: null,
      showColumnDropdown: false,
      columns: [
        { key: "id", label: "ID", visible: true, sortable: false },
        { key: "unit", label: "UNIT", visible: true, sortable: true },
        { key: "driver", label: "DRIVER", visible: true, sortable: true },
        { key: "phone", label: "PHONE", visible: true, sortable: false },
        { key: "color", label: "COLOR", visible: true, sortable: false },
        { key: "model", label: "MODEL", visible: true, sortable: true },
        { key: "lastUpdate", label: "LAST UPDATE", visible: true, sortable: true },
        { key: "state", label: "STATE", visible: true, sortable: false },
        { key: "devices", label: "DEVICES", visible: true, sortable: false },
        { key: "sim", label: "SIM", visible: true, sortable: false },
        { key: "actions", label: "", visible: true, sortable: false }
      ]

    };
  },

  async mounted() {
    try {
      const response = await getVehicles();
      console.log("Vehicles from API:", response);

      this.localUnits = (response.result.data || []).map(v => ({
        id: v.id,
        unit: v.name,
        driver: v.driver_name,
        phone: v.driver_phone,
        color: v.color,
        model: v.model || v.vehicle_type,
        lastUpdate: v.last_update_point,
        state: v.vehicle_status == 1 ? "ON" : "OFF",
        devices: v.device_number,
        sim: v.device_id
      }));
    } catch (err) {
      console.error(err);
      this.error = "Failed to fetch vehicles";
    } finally {
      this.loading = false;
    }
  }
};
</script>

<template>
  <div>
    <UnitsHeader />

    <div class="column-selector">
      <button type="button" @click="showColumnDropdown = !showColumnDropdown">
        Select Columns ▼
      </button>
      <div v-if="showColumnDropdown" class="dropdown">
        <div v-for="col in columns" :key="col.key">
          <label>
            <input type="checkbox" v-model="col.visible" /> {{ col.label }}
          </label>
        </div>
      </div>
    </div>

    <table class="units-table" v-if="!loading && localUnits.length">
      <thead>
        <tr>
          <th v-for="col in columns.filter(c => c.visible)" :key="col.key">
            <div class="th-with-icon">
              <input v-if="col.key === 'id'" type="checkbox" />
              <span v-else>{{ col.label }}</span>
              <img v-if="col.sortable && col.key !== 'id'" src="../../../assets/chevron-selector-vertical.svg"
                alt="icon" width="14" height="14" />
            </div>
          </th>
        </tr>
      </thead>
      <tbody>
        <UnitRow v-for="unit in localUnits" :key="unit.id" :unit="unit"
          :visible-columns="columns.filter(c => c.visible).map(c => c.key)" />

      </tbody>
    </table>

    <div v-else-if="loading">Loading...</div>
    <div v-else-if="error">{{ error }}</div>
    <div v-else>No units found.</div>
  </div>
</template>

<style scoped>
.units-table {
  background-color: #ffffff;
  width: 100%;
  margin-top: 20px;
  border: 1px solid #D7DEE4;
  padding: 0;
  border-collapse: separate;
  border-spacing: 0;
  font-size: 12px;
  border-radius: 6px;
  overflow: hidden;
}

thead {
  background-color: #f0f5fa;
  color: #50606e;
}

th,
td {
  padding: 12px;
  text-align: left;
}

.th-with-icon {
  display: flex;
  align-items: self-start;
  justify-content: center;
  gap: 2px;
}

.units-table td {
  border-bottom: 1px solid #ddd;
}

</style>