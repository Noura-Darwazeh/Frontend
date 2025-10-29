import { ref } from 'vue';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Cluster from 'ol/source/Cluster';
import OSM from 'ol/source/OSM';
import { Point, Polygon } from 'ol/geom';
import Feature from 'ol/Feature';
import { fromLonLat } from 'ol/proj';
import { Style, Text, Circle as CircleStyle, Fill, Stroke } from 'ol/style';
import useAreas from './useAreas';
import { createInteractionManager } from './interactions';
import { buildPayloadFromFeature, saveFeature } from './payload';
import { deleteArea as deleteAreaApi } from './map';

export default function useMap({ mapContainer, tooltip, showPopup, areaName, areaDescription }) {
  const { getAreas } = useAreas();

  const mapInstance = ref(null);
  const vectorSource = new VectorSource(); // الأصلية
  const tooltipVisible = ref(false);
  const tooltipText = ref('');
  let interactionManager = null;

  // 🔹 الـ Cluster Source
  const clusterSource = new Cluster({
    distance: 40, // المسافة الافتراضية بالبكسل بين النقاط
    source: vectorSource,
  });

  // 🔹 الطبقات
  const raster = new TileLayer({ source: new OSM() });

  // ستايل ديناميكي للكلستر والنقاط
  const clusterStyle = feature => {
    const features = feature.get('features');
    const size = features.length;

    // Cluster (أكثر من نقطة)
    if (size > 1) {
      return new Style({
        image: new CircleStyle({
          radius: 15,
          fill: new Fill({ color: 'rgba(0, 123, 255, 0.6)' }),
          stroke: new Stroke({ color: '#fff', width: 2 }),
        }),
        text: new Text({
          text: size.toString(),
          fill: new Fill({ color: '#fff' }),
          font: 'bold 13px sans-serif',
        }),
      });
    }

    // نقطة واحدة
    return new Style({
      image: new CircleStyle({
        radius: 7,
        fill: new Fill({ color: 'rgba(220, 53, 69, 0.8)' }),
        stroke: new Stroke({ color: '#fff', width: 2 }),
      }),
    });
  };

  const clusterLayer = new VectorLayer({
    source: clusterSource,
    style: clusterStyle,
  });

  const polygonLayer = new VectorLayer({
    source: vectorSource, // نستخدم نفس السورس لأن البوليغونات غير مجمعة
    style: new Style({
      stroke: new Stroke({ color: '#4CAF50', width: 2 }),
      fill: new Fill({ color: 'rgba(76, 175, 80, 0.3)' }),
    }),
  });

  // 🔹 إنشاء الخريطة
  function createMap() {
    mapInstance.value = new Map({
      target: mapContainer.value,
      layers: [raster, polygonLayer, clusterLayer],
      view: new View({ center: [0, 0], zoom: 2 }),
    });

    // 🔹 تغيير سلوك الكلستر حسب الزوم
    mapInstance.value.getView().on('change:resolution', () => {
      const zoom = mapInstance.value.getView().getZoom();
      const distance = zoom > 14 ? 20 : zoom > 10 ? 40 : 60;
      clusterSource.setDistance(distance);
    });

    // 🔹 حدث عند الضغط على الكلستر
    mapInstance.value.on('click', evt => {
      mapInstance.value.forEachFeatureAtPixel(evt.pixel, feature => {
        const features = feature.get('features');
        if (features && features.length > 1) {
          // Cluster
          const names = features.map(f => f.get('name') || '(Unnamed)');
          alert(`Cluster contains:\n${names.join('\n')}`);
        } else if (features && features.length === 1) {
          // نقطة واحدة
          const f = features[0];
          alert(`Area: ${f.get('name') || 'Unnamed'}`);
        }
      });
    });
  }

  // 🔹 جلب المناطق من الـ API
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

  // 🔹 تهيئة الخريطة مع الانترآكشنز
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
      deleteAreaApi,
    });

    interactionManager.initMap();
  }

  // 🔹 الرسم
  function startDrawing(type) {
    if (!interactionManager) return;
    interactionManager.startDrawing(type);
  }

  // 🔹 حفظ منطقة جديدة
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

  // 🔹 إلغاء منطقة مرسومة
  function cancelArea() {
    const f = interactionManager?.getLastDrawnFeature?.();
    if (f && !f.get('id')) vectorSource.removeFeature(f);
    showPopup.value = false;
    interactionManager.clearMapInteractions();
  }

  // 🔹 حذف الكل
  function clearAllAreas() {
    vectorSource.clear();
    alert('All areas cleared!');
  }

  // 🔹 أسماء المناطق
  function getAllAreaNames() {
    return vectorSource.getFeatures().map(f => f.get('name')).filter(Boolean);
  }

  // 🔹 البحث بالاسم
  function focusOnAreaByName(name) {
    const features = vectorSource.getFeatures();
    const feature = features.find(f => f.get('name')?.toLowerCase() === name.toLowerCase());

    if (!feature) {
      alert('Area not found!');
      return;
    }

    const geom = feature.getGeometry();
    if (!geom || !mapInstance.value) return;

    const view = mapInstance.value.getView();
    const extent = geom.getExtent();

    view.fit(extent, {
      duration: 1000,
      maxZoom: 20,
    });
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
    focusOnAreaByName,
    getAllAreaNames,
  };
}
