import { ref } from 'vue';
import VectorSource from 'ol/source/Vector';
import Cluster from 'ol/source/Cluster';
import useAreas from './useAreas';
import { createInteractionManager } from './interactions';
import { saveFeature } from './payload';
import { deleteArea as deleteAreaApi } from './map';
import { createClusterLayer, createPolygonLayer, createMapInstance } from './map/mapSetup';
import { setupFeatureSync } from './map/featureSync';
import { setupClusterClickHandler } from './map/clusterEvents';
import { fetchAndLoadZones } from './map/zoneLoader';
import {
  saveNewArea,
  cancelNewArea,
  clearAllAreas,
  getAllAreaNames,
  focusOnAreaByName,
} from './map/mapActions';

import { ViewportRenderer } from './map/performanceOptimizer';

export default function useMap({
  mapContainer,
  tooltip,
  showPopup,
  areaName,
  areaDescription
}) {
  const { getAreas } = useAreas();

  const mapInstance = ref(null);
  const vectorSource = new VectorSource({
    wrapX: false,
  });

  const pointClusterInputSource = new VectorSource({
    wrapX: false,
  });

  const clusterSource = new Cluster({
    distance: 50,
    minDistance: 20,
    source: pointClusterInputSource,
  });

  const tooltipVisible = ref(false);
  const tooltipText = ref('');
  let interactionManager = null;
  let viewportRenderer = null;
  let editModeClickListener = null;

  function createMap() {
    const clusterLayer = createClusterLayer(clusterSource);
    const polygonLayer = createPolygonLayer(vectorSource);
    mapInstance.value = createMapInstance(mapContainer, clusterLayer, polygonLayer);
    viewportRenderer = new ViewportRenderer(mapInstance, vectorSource);

    setupFeatureSync(vectorSource, pointClusterInputSource);
    setupClusterClickHandler(mapInstance, () => interactionManager);

    viewportRenderer.startWatching();

    const attributions = document.querySelectorAll('.ol-attribution');
    attributions.forEach(attr => attr.style.display = 'none');
  }

  async function fetchZones() {
    console.log('Starting fetchZones...');
    console.time('Total Fetch Time');

    try {
      console.time('API Call');
      const response = await getAreas();
      console.timeEnd('API Call');

      const zones = response?.result?.data || [];
      console.log(`Total zones: ${zones.length}`);

      await fetchAndLoadZones(
        getAreas,
        vectorSource,
        pointClusterInputSource,
        mapInstance,
        viewportRenderer
      );

      console.timeEnd('Total Fetch Time');
      console.log('Fetch completed');
    } catch (err) {
      console.error('Error:', err);
    }
  }

  function initMap() {
    createMap();

    interactionManager = createInteractionManager({
      mapInstance,
      mapContainer,
      vectorSource,
      pointClusterInputSource,
      tooltip,
      showPopup,
      areaName,
      areaDescription,
      saveFeature,
      deleteAreaApi,
    });

    interactionManager.initMap();
  }

  function startDrawing(type) {
    if (!interactionManager) return;
    interactionManager.startDrawing(type);
  }

  async function saveArea() {
    await saveNewArea(
      interactionManager,
      areaName,
      areaDescription,
      showPopup,
      pointClusterInputSource
    );
    if (viewportRenderer) {
      const newFeature = interactionManager.getLastDrawnFeature();
      if (newFeature) {
        viewportRenderer.indexFeature(newFeature);
      }
    }
  }

  function cancelArea() {
    cancelNewArea(
      interactionManager,
      vectorSource,
      pointClusterInputSource,
      showPopup
    );
  }

  function clearAll() {
    clearAllAreas(vectorSource, pointClusterInputSource);
    if (viewportRenderer) {
      viewportRenderer.spatialIndex.clear();
    }
  }

  function getAreaNames() {
    return getAllAreaNames(vectorSource);
  }

  function focusArea(name) {
    focusOnAreaByName(name, vectorSource, mapInstance);
  }

  // Helper function to extract feature ID
  function extractFeatureId(feature) {
    let id = feature.get('id') || feature.getId();
    if (id && id !== 'undefined' && !String(id).startsWith('poly-')) {
      return id;
    }

    const originalFeature = feature.get('originalFeature');
    if (originalFeature) {
      id = originalFeature.get('id') || originalFeature.getId();
      if (id && id !== 'undefined') return id;
    }

    id = feature.get('originId');
    if (id && id !== 'undefined') return id;

    return null;
  }

  // Helper function to extract original feature
  function extractOriginalFeature(feature) {
    return feature.get('originalFeature') || feature;
  }

  // Enable Edit Mode
  function enableEditMode(mode, callback) {
    if (!mapInstance.value || !interactionManager) return;

    // Clear any existing interactions
    interactionManager.clearMapInteractions();

    // Remove previous listener if exists
    if (editModeClickListener) {
      mapInstance.value.un('singleclick', editModeClickListener);
    }

    // Create new click listener
    editModeClickListener = (evt) => {
      const clickedFeature = mapInstance.value.forEachFeatureAtPixel(evt.pixel, f => f);
      
      if (!clickedFeature) return;

      // Handle cluster
      const isCluster = Array.isArray(clickedFeature.get('features')) && 
                        clickedFeature.get('features').length > 0;
      
      let targetFeature = clickedFeature;
      
      if (isCluster) {
        const clusterFeatures = clickedFeature.get('features');
        if (clusterFeatures.length === 1) {
          targetFeature = clusterFeatures[0];
        } else {
          alert('Please zoom in to select a single feature');
          return;
        }
      }

      // Get original feature
      const originalFeature = extractOriginalFeature(targetFeature);

      // Execute based on mode
      if (mode === 'shape') {
        interactionManager.startEditShape(originalFeature);
      } else if (mode === 'info') {
        if (callback) callback(originalFeature);
      } else if (mode === 'move') {
        interactionManager.startMove(originalFeature, areaName, areaDescription);
      } else if (mode === 'delete') {
        handleDeleteFeature(originalFeature, targetFeature);
      }

      // Remove listener after selection
      mapInstance.value.un('singleclick', editModeClickListener);
      editModeClickListener = null;
    };

    mapInstance.value.on('singleclick', editModeClickListener);
  }

  // Handle Delete Feature
  async function handleDeleteFeature(originalFeature, clickedFeature) {
    const id = extractFeatureId(clickedFeature);
    const featureName = originalFeature.get('name') || 'this area';

    const confirmDelete = window.confirm(`Are you sure you want to delete "${featureName}"?`);
    if (!confirmDelete) return;

    if (id) {
      try {
        console.log('Attempting to delete ID:', id);
        await deleteAreaApi(id);

        console.log('Deleted from database, removing from map...');
        vectorSource.removeFeature(originalFeature);

        alert('Area deleted successfully!');
      } catch (err) {
        console.error('Error deleting area:', err);
        alert('Error deleting area: ' + (err.response?.data?.message || err.message || 'Unknown error'));
      }
    } else {
      console.warn('No ID found - removing from map only');
      vectorSource.removeFeature(originalFeature);
      alert('Area removed from map (no database ID found)');
    }
  }

  // Disable Edit Mode
  function disableEditMode() {
    if (!mapInstance.value) return;

    if (editModeClickListener) {
      mapInstance.value.un('singleclick', editModeClickListener);
      editModeClickListener = null;
    }

    if (interactionManager) {
      interactionManager.clearMapInteractions();
    }
  }

  return {
    initMap,
    fetchZones,
    startDrawing,
    saveArea,
    cancelArea,
    clearAllAreas: clearAll,
    mapInstance,
    tooltipVisible,
    tooltipText,
    focusOnAreaByName: focusArea,
    getAllAreaNames: getAreaNames,
    enableEditMode,
    disableEditMode,
  };
}