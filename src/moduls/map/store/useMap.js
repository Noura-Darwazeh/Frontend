import { ref } from 'vue';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import OSM from 'ol/source/OSM';
import Draw, { createBox } from 'ol/interaction/Draw';
import { Point, Polygon, Circle as CircleGeom } from 'ol/geom';
import Feature from 'ol/Feature';
import { fromLonLat, toLonLat } from 'ol/proj';
import { Style, Fill, Stroke, Text, Circle as CircleStyle } from 'ol/style';
import useAreas from './useAreas';

export default function useMap({ mapContainer, tooltip, showPopup, areaName, areaDescription }) {
  const { getAreas, postArea, deleteArea } = useAreas();

  const mapInstance = ref(null);
  const vectorSource = new VectorSource();
  const tooltipVisible = ref(false);
  const tooltipText = ref('');
  let drawInteraction = null;
  let lastDrawnFeature = null;
  let currentDrawType = '';

  async function fetchZones() {
    try {
      const response = await getAreas();
      const zones = response?.result?.data || [];

      zones.forEach((zone) => {
        if (!zone.type || !zone.coordinates) return;
        const type = zone.type.toLowerCase();
        let feature;

        if (type === 'polygon') {
          const coords = zone.coordinates[0].map(c => fromLonLat(c));
          feature = new Feature(new Polygon([coords]));

        } else if (type === 'point') {
          const coord = fromLonLat(zone.coordinates);
          feature = new Feature(new Point(coord));
          feature.setStyle(new Style({
            image: new CircleStyle({ radius: 6, fill: new Fill({ color: 'red' }), stroke: new Stroke({ color: '#000', width: 1 }) }),
            text: new Text({ text: zone.name, font: '14px sans-serif', fill: new Fill({ color: '#000' }), offsetY: -15 }),
          }));
        }

        if (feature) {
          feature.set('id', zone.id); 
          feature.set('name', zone.name);
          feature.set('description', zone.description || '');
          vectorSource.addFeature(feature);
        }
      });

      if (zones.length > 0) {
        const first = zones[0];
        const center = first.center_point
          ? fromLonLat(first.center_point)
          : fromLonLat(first.coordinates[0] || first.coordinates);
        mapInstance.value.getView().setCenter(center);
        mapInstance.value.getView().setZoom(10);
      }
    } catch (err) {
      console.error('Error fetching zones:', err);
    }
  }

  function initMap() {
    const raster = new TileLayer({ source: new OSM() });
    const vectorLayer = new VectorLayer({ source: vectorSource });

    mapInstance.value = new Map({
      target: mapContainer.value,
      layers: [raster, vectorLayer],
      view: new View({ center: [0, 0], zoom: 2 }),
    });

    mapInstance.value.on('pointermove', (evt) => {
      const feature = mapInstance.value.forEachFeatureAtPixel(evt.pixel, f => f);
      if (feature && feature.get('description')) {
        tooltipText.value = feature.get('description');
        tooltipVisible.value = true;
        const el = tooltip.value;
        el.style.left = evt.originalEvent.pageX + 10 + 'px';
        el.style.top = evt.originalEvent.pageY + 10 + 'px';
      } else tooltipVisible.value = false;
    });

    mapInstance.value.on('singleclick', async (evt) => {
      const feature = mapInstance.value.forEachFeatureAtPixel(evt.pixel, f => f);
      if (!feature) return;

      const id = feature.get('id');
      if (!id) return alert('No id ');

      const confirmDelete = confirm(`are you sure you want to delete "${feature.get('name')}"؟`);
      if (!confirmDelete) return;

      try {
        await deleteArea(id); 
        vectorSource.removeFeature(feature);
        alert('تم حذف المنطقة بنجاح!');
      } catch (err) {
        console.error(err);
        alert('حدث خطأ أثناء الحذف!');
      }
    });
  }

  function startDrawing(type) {
    currentDrawType = type.toLowerCase();
    if (drawInteraction) mapInstance.value.removeInteraction(drawInteraction);

    const drawType = ['Circle', 'Box', 'Square'].includes(type) ? 'Circle' : type;
    drawInteraction = new Draw({
      source: vectorSource,
      type: drawType,
      geometryFunction: ['Box', 'Square'].includes(type) ? createBox() : undefined,
    });
    mapInstance.value.addInteraction(drawInteraction);

    drawInteraction.on('drawend', (e) => {
      lastDrawnFeature = e.feature;
      showPopup.value = true;
    });
  }

  async function saveArea() {
    if (!areaName.value.trim()) return alert('Area name is required!');
    if (!lastDrawnFeature) return alert('No feature drawn!');

    lastDrawnFeature.set('name', areaName.value);
    lastDrawnFeature.set('description', areaDescription.value || '');
    lastDrawnFeature.setStyle(
      new Style({
        stroke: new Stroke({ color: '#1976d2', width: 2 }),
        fill: new Fill({ color: 'rgba(25,118,210,0.1)' }),
        text: new Text({ text: areaName.value, font: '14px sans-serif', fill: new Fill({ color: '#000' }), offsetY: -10 })
      })
    );

    const geom = lastDrawnFeature.getGeometry();
    let type = geom.getType().toLowerCase();
    let coordinates = null;

    if (type === 'polygon') {
      coordinates = geom.getCoordinates()[0].map(c => toLonLat(c));
      const first = coordinates[0], last = coordinates[coordinates.length - 1];
      if (first[0] !== last[0] || first[1] !== last[1]) coordinates.push(first);
      coordinates = [coordinates];
    } else if (type === 'point') {
      coordinates = toLonLat(geom.getCoordinates());
    } else if (type === 'circle') {
      const center = geom.getCenter(), radius = geom.getRadius();
      const points = 64, ring = [];
      for (let i = 0; i < points; i++) {
        const angle = (i / points) * 2 * Math.PI;
        const x = center[0] + radius * Math.cos(angle);
        const y = center[1] + radius * Math.sin(angle);
        ring.push(toLonLat([x, y]));
      }
      ring.push(ring[0]);
      coordinates = [ring];
      type = 'polygon';
    }

    const payload = { name: areaName.value, description: areaDescription.value || '', default_customer_name: 'test - customer', visibility: 'private', type, coordinates, clients: [] };
    try { await postArea(payload); alert('Area saved and posted successfully!'); } 
    catch (err) { console.error('Error posting area:', err.response?.data || err); alert('Error posting area to API'); }

    showPopup.value = false;
    areaName.value = '';
    areaDescription.value = '';
    lastDrawnFeature = null;
  }

  function clearAllAreas() { vectorSource.clear(); alert('All areas cleared!'); }
  function cancelArea() { if (lastDrawnFeature) vectorSource.removeFeature(lastDrawnFeature); showPopup.value = false; }

  return { initMap, fetchZones, startDrawing, saveArea, clearAllAreas, cancelArea, mapInstance, tooltipVisible, tooltipText };
}
