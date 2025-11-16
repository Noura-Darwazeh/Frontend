<template>
  <div class="map-page">
    <div ref="mapContainer" class="map-container">

      <div class="search-bar">
        <input v-model="searchTerm" @input="handleSearch" list="areas-list" placeholder="🔍 Search area..."
          class="search-input" />

        <datalist id="areas-list">
          <option v-for="name in areaNames" :key="name" :value="name" />
        </datalist>
      </div>
    </div>

    <!-- Top Right Action Buttons (Horizontal) -->
    <div class="action-buttons">
      <!-- Edit Button -->
      <div class="action-button edit-btn" :class="{ active: showEditDropdown }"
        @click="showEditDropdown = !showEditDropdown">
        <img :src="editIcon" alt="Edit Icon" class="icon" width="25" height="25" />

        <ul v-if="showEditDropdown" class="action-dropdown">
          <li @click.stop="startEditMode('shape')">Edit Shape</li>
          <li @click.stop="startEditMode('info')">Edit Info</li>
        </ul>
      </div>

      <!-- Move Button -->
      <div class="action-button move-btn" :class="{ active: editMode === 'move' }" @click="startEditMode('move')"
        title="Move Feature">
        <img :src="moveIcon" alt="Move Icon" class="icon" width="25" height="25" />
      </div>

      <!-- Delete Button -->
      <div class="action-button delete-btn" :class="{ active: editMode === 'delete' }" @click="startEditMode('delete')"
        title="Delete Feature">
        <img :src="deleteIcon" alt="Delete Icon" class="icon" width="25" height="25" />

      </div>
    </div>

    <!-- Add Button (Bottom Right) -->
    <div class="floating-button" @click="showDropdown = !showDropdown">
      <img :src="addIcon" alt="Add Icon" class="icon" width="25" height="25" />
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

    <!-- Edit Mode Message -->
    <div v-if="editMode && editMode !== 'none'" class="edit-mode-message">
      <span v-if="editMode === 'shape'">Click on a feature to edit its shape</span>
      <span v-else-if="editMode === 'info'">Click on a feature to edit its info</span>
      <span v-else-if="editMode === 'move'">Click on a feature to move it</span>
      <span v-else-if="editMode === 'delete'">Click on a feature to delete it</span>
      <button @click="cancelEditMode">Cancel</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import MapPopup from '../components/MapPopup.vue';
import useMap from '../store/useMap';
import moveIcon from '../../../assets/map/move.svg';
import editIcon from '../../../assets/map/edit.svg';
import deleteIcon from '../../../assets/map/delete.svg';
import addIcon from '../../../assets/map/add.svg';

const mapContainer = ref(null);
const tooltip = ref(null);
const showDropdown = ref(false);
const showEditDropdown = ref(false);
const showPopup = ref(false);
const areaName = ref('');
const areaDescription = ref('');
const searchTerm = ref('');
const areaNames = ref([]);
const shapes = ['Point', 'Polygon', 'Box', 'Square', 'Circle'];
const editMode = ref(null);

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
  getAllAreaNames,
  enableEditMode,
  disableEditMode,
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

function startEditMode(mode) {
  if (editMode.value === mode) {
    cancelEditMode();
    return;
  }

  editMode.value = mode;
  showEditDropdown.value = false;

  if (enableEditMode) {
    enableEditMode(mode, (feature) => {
      editMode.value = null;

      if (mode === 'info') {
        areaName.value = feature.get('name') || '';
        areaDescription.value = feature.get('description') || '';
        showPopup.value = true;
      }
    });
  }
}

function cancelEditMode() {
  editMode.value = null;
  showEditDropdown.value = false;
  if (disableEditMode) {
    disableEditMode();
  }
}

</script>

<style>
.map-page {
  width: 100%;
  height: 100%;
}

.map-container {
  width: 100%;
  height: 100vh;
}

.action-buttons {
  position: absolute;
  top: 70px;
  right: 30px;
  display: flex;
  gap: 10px;
  z-index: 1000;
}

.action-button {
  background-color: white;
  color: #333;
  font-size: 10px;
  border-radius: 8px;
  width: 35px;
  height: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  position: relative;
  border: 2px solid transparent;
}

.action-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

/* Edit Dropdown */
.action-dropdown {
  position: absolute;
  top: 60px;
  right: 0;
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 8px;
  list-style: none;
  padding: 5px 0;
  margin: 0;
  min-width: 140px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.action-dropdown li {
  padding: 10px 16px;
  cursor: pointer;
  color: #333;
  transition: background-color 0.2s ease;
  font-size: 14px;
}

.action-dropdown li:hover {
  background-color: #f1f1f1;
}

/* Add Button (Bottom Right) */
.floating-button {
  border-radius: 8px;
  position: absolute;
  top: 70px;
  right: 170px;
  background-color: white;
  color: white;
  width: 35px;
  height: 35px;
  text-align: center;
  line-height: 30px;
  cursor: pointer;
  z-index: 1000;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
}

.floating-button:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
}

.drawing-options {
  position: absolute;
  top: 60px;
  right: 0;
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 8px;
  list-style: none;
  padding: 5px 0;
  margin: 0;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}

.drawing-options li {
  padding: 8px 16px;
  cursor: pointer;
  color: black;
  transition: background-color 0.2s ease;
  white-space: nowrap;
}

.drawing-options li:hover {
  background-color: #f1f1f1;
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
  top: 70px;
  left: 60%;
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

/* Edit Mode Message */
.edit-mode-message {
  position: absolute;
  top: 85px;
  right: 20px;
  background-color: white;
  color: black;
  padding: 12px 16px;
  border-radius: 8px;
  z-index: 1000;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
  animation: slideIn 0.3s ease;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.edit-mode-message button {
  background-color: white;
  color: black;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.2s ease;
}

.edit-mode-message button:hover {
  background-color: #f1f1f1;
}

.ol-zoom {
  position: absolute;
  bottom: 90px;
  right: 10px;
  display: flex;
  flex-direction: column;
  gap: 5px;
  z-index: 1000;
}

.ol-zoom button {
  background-color: white !important;
  color: rgb(160, 155, 155);
  border: none;
  font-size: 22px;
  font-weight: bold;
  width: 40px;
  height: 40px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}
</style>