import { ref } from 'vue';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import OSM from 'ol/source/OSM';
import { Point, Polygon } from 'ol/geom';
import Feature from 'ol/Feature';
import { fromLonLat } from 'ol/proj';
import useAreas from './useAreas';
import { createInteractionManager } from './interactions';
import { buildPayloadFromFeature, saveFeature } from './payload';
import { deleteArea as deleteAreaApi } from './map';

export default function useMap({ mapContainer, tooltip, showPopup, areaName, areaDescription }) {
  const { getAreas } = useAreas();

  const mapInstance = ref(null);
  const vectorSource = new VectorSource();
  const tooltipVisible = ref(false);
  const tooltipText = ref('');
  let interactionManager = null;

  function createMap() {
    const raster = new TileLayer({ source: new OSM() });
    const vectorLayer = new VectorLayer({ source: vectorSource });

    mapInstance.value = new Map({
      target: mapContainer.value,
      layers: [raster, vectorLayer],
      view: new View({ center: [0, 0], zoom: 2 }),
    });
  }

  async function fetchZones() {
    try {
      const response = await getAreas();
      const zones = response?.result?.data || [];

      zones.forEach(zone => {
        if (!zone.type || !zone.coordinates) return;
        const type = zone.type.toLowerCase();
        let feature;

        if (type === 'polygon') {
          const coords = zone.coordinates[0].map(c => fromLonLat(c));
          feature = new Feature(new Polygon([coords]));
        } else if (type === 'point') {
          const coord = fromLonLat(zone.coordinates);
          feature = new Feature(new Point(coord));
        }

        if (feature) {
          feature.set('id', zone.id);
          feature.set('name', zone.name);
          feature.set('description', zone.description || '');
          vectorSource.addFeature(feature);
        }
      });

      if (zones.length > 0 && mapInstance.value) {
        const first = zones[0];
        const center = first.center_point ? fromLonLat(first.center_point) : fromLonLat(first.coordinates[0] || first.coordinates);
        mapInstance.value.getView().setCenter(center);
        mapInstance.value.getView().setZoom(10);
      }
    } catch (err) {
      console.error('Error fetching zones:', err);
    }
  }

  function initMap() {
    createMap();

    interactionManager = createInteractionManager({
      mapInstance,
      mapContainer,
      vectorSource,
      tooltip,
      showPopup,
      areaName,
      areaDescription,
      saveFeature,
      deleteAreaApi
    });

    interactionManager.initMap();
  }

  function startDrawing(type) {
    if (!interactionManager) return;
    interactionManager.startDrawing(type);
  }

  async function saveArea() {
    const f = interactionManager?.getLastDrawnFeature?.();
    if (!f) return alert('No feature to save!');
    if (!areaName.value.trim()) return alert('Area name is required!');
    f.set('name', areaName.value);
    f.set('description', areaDescription.value || '');
    try {
      await saveFeature(f, areaName, areaDescription);
      alert('Area saved successfully!');
    } catch (err) {
      console.error(err);
      alert('Error saving area!');
    }
    showPopup.value = false;
    areaName.value = '';
    areaDescription.value = '';
    interactionManager.clearMapInteractions();
  }

  function cancelArea() {
    const f = interactionManager?.getLastDrawnFeature?.();
    if (f && !f.get('id')) vectorSource.removeFeature(f);
    showPopup.value = false;
    interactionManager.clearMapInteractions();
  }

  function clearAllAreas() {
    vectorSource.clear();
    alert('All areas cleared!');
  }

  return {
    initMap,
    fetchZones,
    startDrawing,
    saveArea,
    cancelArea,
    clearAllAreas,
    mapInstance,
    tooltipVisible,
    tooltipText,
  };
}