<script>
import UnitRow from "../../../components/shared/UnitRow.vue";
import UnitsHeader from "../components/UnitsHeader.vue";
import { getVehicles } from "../stores/showAllUnits"

export default {
  name: "UnitsTable",
  components: { UnitRow, UnitsHeader },

  props: {
    units: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      localUnits: [],
      loading: true,
      error: null,
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
  },
  watch: {
    units(newVal) {
      if (newVal && newVal.length) {
        this.localUnits = newVal;
      }
    }
  }
};
</script>

<template>
  <div>
    <UnitsHeader />
    <table class="units-table">
      <thead>
        <tr>
          <th>
            <input type="checkbox" />
          </th>
          <th>
            <div class="th-with-icon">
              UNIT
              <img src="../../../assets/chevron-selector-vertical.svg" alt="icon" width="14" height="14" />
            </div>
          </th>
          <th>
            <div class="th-with-icon">
              DRIVER
              <img src="../../../assets/chevron-selector-vertical.svg" alt="icon" width="14" height="14" />
            </div>
          </th>
          <th>PHONE</th>
          <th>COLOR</th>
          <th>
            <div class="th-with-icon">
              MODEL
              <img src="../../../assets/chevron-selector-vertical.svg" alt="icon" width="14" height="14" />
            </div>
          </th>
          <th>
            <div class="th-with-icon">
              LAST UPDATE
              <img src="../../../assets/chevron-selector-vertical.svg" alt="icon" width="14" height="14" />
            </div>
          </th>
          <th>STATE</th>
          <th>DEVICES</th>
          <th>SIM</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <UnitRow v-for="unit in localUnits" :key="unit.id" :unit="unit" />
      </tbody>
    </table>
  </div>
</template>

<style>
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