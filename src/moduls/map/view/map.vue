<template>
  <div class="map-page">
    <div class="search-bar">
      <input v-model="searchTerm" @input="handleSearch" list="areas-list" placeholder="🔍 Search area..."
        class="search-input" />

      <datalist id="areas-list">
        <option v-for="name in areaNames" :key="name" :value="name" />
      </datalist>
    </div>

    <div ref="mapContainer" class="map-container"></div>
    <div class="floating-button" @click="showDropdown = !showDropdown">
      ➕
      <ul v-if="showDropdown" class="drawing-options">
        <li v-for="shape in shapes" :key="shape" @click="startDrawing(shape)">
          {{ shape }}
        </li>
      </ul>
    </div>

    <div class="clear-button" @click="clearAllAreas">🗑️ Clear All</div>
    <MapPopup v-if="showPopup" v-model:areaName="areaName" v-model:areaDescription="areaDescription" @save="saveArea"
      @cancel="cancelArea" />

    <div ref="tooltip" class="map-tooltip" v-show="tooltipVisible">
      {{ tooltipText }}
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import MapPopup from '../components/MapPopup.vue';
import useMap from '../store/useMap';

const mapContainer = ref(null);
const tooltip = ref(null);
const showDropdown = ref(false);
const showPopup = ref(false);
const areaName = ref('');
const areaDescription = ref('');
const searchTerm = ref('');
//search
const areaNames = ref([]);
const shapes = ['Point', 'Polygon', 'Box', 'Square', 'Circle'];

const {
  initMap,
  fetchZones,
  startDrawing,
  saveArea,
  clearAllAreas,
  cancelArea,
  mapInstance,
  tooltipVisible,
  tooltipText,
  focusOnAreaByName,
  //search
  getAllAreaNames,
} = useMap({ mapContainer, tooltip, showPopup, areaName, areaDescription });

onMounted(async () => {
  initMap();
  await fetchZones();
  areaNames.value = getAllAreaNames(); 
});


onBeforeUnmount(() => {
  if (mapInstance.value) mapInstance.value.setTarget(null);
});

let searchTimeout = null;

function handleSearch() {
  clearTimeout(searchTimeout);

  searchTimeout = setTimeout(() => {
    if (!searchTerm.value.trim()) return;
    focusOnAreaByName(searchTerm.value.trim());
  }, 2000);
}

function searchArea() {
  if (!searchTerm.value.trim()) return;
  focusOnAreaByName(searchTerm.value.trim());
}

</script>

<style scoped>
.map-page {
  width: 100%;
  height: 100%;
}

.map-container {
  width: 100%;
  height: 100vh;
}

.floating-button {
  position: absolute;
  bottom: 20px;
  right: 20px;
  background-color: #1976d2;
  color: white;
  font-size: 24px;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  text-align: center;
  line-height: 50px;
  cursor: pointer;
  z-index: 1000;
}

.drawing-options {
  position: absolute;
  bottom: 60px;
  right: 0;
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 6px;
  list-style: none;
  padding: 5px 0;
  margin: 0;
}

.drawing-options li {
  padding: 6px 12px;
  cursor: pointer;
  background: black;
  color: white;
}

.clear-button {
  position: absolute;
  bottom: 20px;
  left: 20px;
  background-color: #d32f2f;
  color: white;
  font-size: 14px;
  border-radius: 6px;
  padding: 8px 14px;
  cursor: pointer;
  z-index: 1000;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
  transition: background-color 0.2s ease;
}

.clear-button:hover {
  background-color: #b71c1c;
}

.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
}

.popup {
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 320px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.popup h3 {
  margin-bottom: 10px;
}

.popup input,
.popup textarea {
  width: 100%;
  margin-bottom: 10px;
  padding: 6px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.popup-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.popup-buttons button {
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.popup-buttons button:first-child {
  background-color: #1976d2;
  color: white;
}

.map-tooltip {
  position: absolute;
  background: rgba(0, 0, 0, 0.75);
  color: #fff;
  padding: 5px 8px;
  border-radius: 4px;
  font-size: 13px;
  pointer-events: none;
  z-index: 3000;
  white-space: nowrap;
}

.search-bar {
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2000;
}

.search-input {
  width: 260px;
  padding: 10px 14px;
  border-radius: 25px;
  border: 1px solid #ccc;
  font-size: 14px;
  background-color: #fff;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  outline: none;
  transition: box-shadow 0.2s ease;
}

.search-input:focus {
  box-shadow: 0 3px 10px rgba(25, 118, 210, 0.4);
}

</style>
