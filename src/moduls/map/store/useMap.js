
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
    console.log(' Starting fetchZones...');
    console.time('Total Fetch Time');

    try {
      console.time(' API Call');
      const response = await getAreas();
      console.timeEnd(' API Call');

      const zones = response?.result?.data || [];
      console.log(`Total zones: ${zones.length}`);

      await fetchAndLoadZones(
        getAreas,
        vectorSource,
        pointClusterInputSource,
        mapInstance,
        viewportRenderer
      );

      console.timeEnd('⏱Total Fetch Time');
      console.log(' Fetch completed');
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
  };
}



















