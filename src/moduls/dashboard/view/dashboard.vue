<script setup>
import topFiveSpeedUnitsChart from '../components/topFiveSpeedUnitsChart.vue';
import getUnitsBySpeed from '../components/getUnitsBySpeedChart.vue';
import activitySummaryChart from '../components/activitySummaryChart.vue';
import Speedometer from '../components/Speedometer.vue';
import totalVehicles from '../components/totalVehicles.vue';
import BaseTable from "../../../components/shared/Table.vue";
import { getWillExpireUnits } from '../stores/getWillExpireUnits';
import { getUnitsLiveList } from '../stores/getUnitsLiveList'
import { ref, onMounted } from "vue";

const willExpireUnits = ref([]);
const loadingExpire = ref(true);
const columnsExpire = [
  { key: "id", label: "" },
  { key: "unit", label: "Unit", icon:true },
  { key: "insuranceExpiry", label: "Insurance expiry", icon:true },
  { key: "licenseExpiry", label: "License expiry", icon:true },
];

const liveList = ref([]);
const loadingList = ref(true);
const columnsList = [
  { key: "id", label: " " },
  { key: "lastUpdate", label: "LAST UPDATE", icon:true },
  { key: "trackingName", label: "TRACKING", icon:true },
  { key: "location", label: "LOCATION", icon:true },
  { key: "driver", label: "DRIVER", icon:true },
  { key: "tracking", label: "TRACKING", icon:true },
];
onMounted(async () => {
  try {
    const response = await getWillExpireUnits();
    console.log("Units Will Expire:", response);
    willExpireUnits.value = (response.result.data || []).map(v => ({
      id: v.id,
      unit: v.name,
      insuranceExpiry: v.insurance_expiry_at,
      licenseExpiry: v.license_expiry_at,

    }));

  } catch (err) {
    console.error(err);
    error.value = "Failed to fetch ";
  } finally {
    loadingExpire.value = false;
  }
  //second table
  try {
 
    const res2 = await getUnitsLiveList();
    liveList.value = (res2.result.data || []).map(v => ({
      id: v.id,
      lastUpdate: v.last_point.last_gps_device,
      trackingName: v.name,
      location: v.last_point.address,
      driver: v.last_point.driver_name,
      tracking: v.last_point.ignition_index,
    }
    ));
  } catch (e) {
    console.error("Error fetching live list", e);
  } finally {
    loadingList.value = false;
  }
});
</script>

<template>
  <div class="charts">
    <topFiveSpeedUnitsChart />
    <getUnitsBySpeed />
    <activitySummaryChart />
  </div>

  <div class="totalVehiclesSpeedSummary">
    <totalVehicles />
    <Speedometer />
  </div>
  <!-- <topFiveSpeedUnitsChart3D /> -->
  <BaseTable :columns="columnsExpire" :data="willExpireUnits"></BaseTable>
  <BaseTable :columns="columnsList" :data="liveList"></BaseTable>

</template>

<style scoped>
.charts {
  display: flex;
  justify-content: space-around;
  gap: 15px;
  margin: 15px 0;
}

.totalVehiclesSpeedSummary {
  display: flex;
  justify-content: space-around;
  gap: 15px;
}

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
  align-items: center;
  justify-content: center;
  gap: 2px;
}

.units-table td {
  border-bottom: 1px solid #ddd;
}

@media (max-width: 900px) {
  .charts {
    flex-direction: column;
    align-items: center;
  }

  .totalVehiclesSpeedSummary {
    flex-direction: column;
    align-items: center;
  }
}
</style>
