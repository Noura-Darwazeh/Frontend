// import { ref } from 'vue';
// import Map from 'ol/Map';
// import View from 'ol/View';
// import TileLayer from 'ol/layer/Tile';
// import VectorLayer from 'ol/layer/Vector';
// import VectorSource from 'ol/source/Vector';
// import OSM from 'ol/source/OSM';
// import { Point, Polygon } from 'ol/geom';
// import Feature from 'ol/Feature';
// import { fromLonLat } from 'ol/proj';
// import useAreas from './useAreas';
// import { createInteractionManager } from './interactions';
// import { buildPayloadFromFeature, saveFeature } from './payload';
// import { deleteArea as deleteAreaApi } from './map';
// import Cluster from 'ol/source/Cluster';
// import { Style, Text, Circle as CircleStyle, Fill, Stroke } from 'ol/style';
// import { defaults as defaultControls } from 'ol/control';

// export default function useMap({ mapContainer, tooltip, showPopup, areaName, areaDescription }) {
//   const { getAreas } = useAreas();

//   const mapInstance = ref(null);
//   const vectorSource = new VectorSource();
//   const pointClusterInputSource = new VectorSource();
//   const clusterSource = new Cluster({
//     distance: 40,
//     source: pointClusterInputSource,
//   });

//   const tooltipVisible = ref(false);
//   const tooltipText = ref('');
//   let interactionManager = null;

//   const getFeatureId = (f) => f?.getId?.() ?? f?.get?.('id');

//   function createMap() {
//     const raster = new TileLayer({ source: new OSM() });

//     const clusterLayer = new VectorLayer({
//       source: clusterSource,
//       style: (feature) => {
//         const features = feature.get('features') || [];
//         const size = features.length;
//         if (size > 1) {
//           return new Style({
//             image: new CircleStyle({
//               radius: 15,
//               fill: new Fill({ color: 'rgba(0, 123, 255, 0.6)' }),
//               stroke: new Stroke({ color: '#fff', width: 2 }),
//             }),
//             text: new Text({
//               text: String(size),
//               fill: new Fill({ color: '#fff' }),
//             }),
//           });
//         }
//         return new Style({
//           image: new CircleStyle({
//             radius: 7,
//             fill: new Fill({ color: 'rgba(220, 53, 69, 0.8)' }),
//             stroke: new Stroke({ color: '#fff', width: 2 }),
//           }),
//         });
//       },
//     });

//     const polygonLayer = new VectorLayer({
//       source: vectorSource,
//       style: (feature) => {
//         const geom = feature.getGeometry?.();
//         if (!geom) return null;
//         const type = geom.getType?.();
//         if (type && type.toLowerCase() === 'polygon') {
//           return new Style({
//             stroke: new Stroke({ color: '#1976d2', width: 2 }),
//             fill: new Fill({ color: 'rgba(25,118,210,0.1)' }),
//             text: new Text({
//               text: feature.get('name') || '',
//               font: '14px sans-serif',
//               fill: new Fill({ color: '#000' }),
//               offsetY: -10,
//             }),
//           });
//         }
//         return null;
//       },
//     });

//     mapInstance.value = new Map({
//       target: mapContainer.value,
//       layers: [raster, clusterLayer, polygonLayer],
//       view: new View({ center: [0, 0], zoom: 2 }),
//       controls: defaultControls({
//         zoom: true,
//         rotate: false,
//         attribution: false,
//       }),
//     });

//     // --- sync cluster source when vector features change ---
//     if (typeof vectorSource.on === 'function') {
//       vectorSource.on('removefeature', (evt) => {
//         try {
//           const removed = evt.feature;
//           const fid = getFeatureId(removed);
//           const byId = pointClusterInputSource.getFeatureById?.(fid);
//           if (byId) pointClusterInputSource.removeFeature(byId);
//           const polyId = `poly-${fid}`;
//           const byPoly = pointClusterInputSource.getFeatureById?.(polyId);
//           if (byPoly) pointClusterInputSource.removeFeature(byPoly);
//         } catch (e) {
//           console.error('Error syncing cluster on removefeature', e);
//         }
//       });

//       vectorSource.on('changefeature', (evt) => {
//         try {
//           const f = evt.feature;
//           const fid = getFeatureId(f);
//           const geom = f.getGeometry?.();
//           if (!geom) return;
//           const type = geom.getType?.()?.toLowerCase();

//           if (type === 'point') {
//             const existing = pointClusterInputSource.getFeatureById?.(fid);
//             if (existing) {
//               existing.setGeometry(geom.clone());
//               existing.set('name', f.get('name'));
//               existing.set('description', f.get('description'));
//               existing.set('originId', fid);
//               existing.set('originType', 'point');
//             }
//           } else if (type === 'polygon') {
//             let interiorCoords = null;
//             try {
//               interiorCoords = geom.getInteriorPoint?.()?.getCoordinates();
//             } catch (err) {}
//             if (!interiorCoords) {
//               const ex = geom.getExtent();
//               interiorCoords = [(ex[0] + ex[2]) / 2, (ex[1] + ex[3]) / 2];
//             }
//             const polyId = `poly-${fid}`;
//             const existing = pointClusterInputSource.getFeatureById?.(polyId);
//             if (existing) {
//               existing.setGeometry(new Point(interiorCoords));
//               existing.set('name', f.get('name'));
//               existing.set('description', f.get('description'));
//               existing.set('originId', fid);
//               existing.set('originType', 'polygon');
//               existing.set('originalFeature', f);
//             }
//           }
//         } catch (e) {
//           console.error('Error syncing cluster on changefeature', e);
//         }
//       });
//     } // ← تم حذف القوس الزايد هنا ✅

//     // --- single click cluster menu ---
//     mapInstance.value.on('singleclick', (evt) => {
//       const feature = mapInstance.value.forEachFeatureAtPixel(evt.pixel, (f) => f);
//       if (!feature) return;

//       const inner = feature.get('features') || [];
//       if (!Array.isArray(inner) || inner.length <= 1) return;
//       evt.preventDefault();
//       evt.stopPropagation();
//       if (interactionManager) {
//         interactionManager.clearMapInteractions();
//       }

//       const menu = document.createElement('div');
//       menu.style.position = 'absolute';
//       menu.style.left = evt.originalEvent.pageX + 'px';
//       menu.style.top = evt.originalEvent.pageY + 'px';
//       menu.style.backgroundColor = '#fff';
//       menu.style.border = '1px solid #ccc';
//       menu.style.padding = '8px';
//       menu.style.zIndex = 10000;
//       menu.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';
//       menu.style.maxHeight = '240px';
//       menu.style.overflowY = 'auto';
//       menu.style.minWidth = '160px';
//       menu.style.fontSize = '13px';

//       const title = document.createElement('div');
//       title.innerText = `Areas (${inner.length})`;
//       title.style.fontWeight = '600';
//       title.style.marginBottom = '6px';
//       menu.appendChild(title);

//       const list = document.createElement('ul');
//       list.style.listStyle = 'none';
//       list.style.padding = '0';
//       list.style.margin = '0';

//       inner.forEach((f, idx) => {
//         const li = document.createElement('li');
//         const originalFeature = f.get('originalFeature') || f;
//         const name = originalFeature.get('name') || `Area ${idx + 1}`;
//         li.innerText = name;
//         li.style.padding = '6px 8px';
//         li.style.cursor = 'pointer';
//         li.style.borderRadius = '4px';
//         li.onmouseenter = () => { li.style.background = '#f1f1f1'; };
//         li.onmouseleave = () => { li.style.background = 'transparent'; };
//         li.onclick = (e) => {
//           e.stopPropagation();
//           const geom = originalFeature.getGeometry();
//           if (geom) {
//             const view = mapInstance.value.getView();
//             if (geom.getType().toLowerCase() === 'point') {
//               view.animate({ center: geom.getCoordinates(), duration: 500, zoom: 16 });
//             } else {
//               view.fit(geom.getExtent(), { duration: 500, maxZoom: 18 });
//             }
//           }
//           menu.remove();
//         };
//         list.appendChild(li);
//       });
//       menu.appendChild(list);
//       document.body.appendChild(menu);

//       const removeMenu = () => {
//         if (menu && menu.parentNode) menu.parentNode.removeChild(menu);
//         document.removeEventListener('click', removeMenu);
//       };
//       setTimeout(() => document.addEventListener('click', removeMenu), 0);
//     });
//   }

//   async function fetchZones() {
//     try {
//       const response = await getAreas();
//       const zones = response?.result?.data || [];

//       zones.forEach((zone) => {
//         if (!zone.type || !zone.coordinates) return;
//         const type = zone.type.toLowerCase();
//         let feature;

//         if (type === 'polygon') {
//           const coords = zone.coordinates[0].map((c) => fromLonLat(c));
//           feature = new Feature(new Polygon([coords]));
//           feature.setId(zone.id);
//           feature.set('id', zone.id);
//           feature.set('name', zone.name);
//           feature.set('description', zone.description || '');
//           vectorSource.addFeature(feature);

//           let interiorCoords = feature.getGeometry().getInteriorPoint?.()?.getCoordinates();
//           if (!interiorCoords) {
//             const ex = feature.getGeometry().getExtent();
//             interiorCoords = [(ex[0] + ex[2]) / 2, (ex[1] + ex[3]) / 2];
//           }
//           const clusterPoint = new Feature(new Point(interiorCoords));
//           clusterPoint.setId(`poly-${zone.id}`);
//           clusterPoint.set('originId', zone.id);
//           clusterPoint.set('originType', 'polygon');
//           clusterPoint.set('originalFeature', feature);
//           clusterPoint.set('name', zone.name);
//           clusterPoint.set('description', zone.description || '');
//           pointClusterInputSource.addFeature(clusterPoint);
//         } else if (type === 'point') {
//           const coord = fromLonLat(zone.coordinates);
//           const editablePoint = new Feature(new Point(coord));
//           editablePoint.setId(zone.id);
//           editablePoint.set('id', zone.id);
//           editablePoint.set('name', zone.name);
//           editablePoint.set('description', zone.description || '');
//           vectorSource.addFeature(editablePoint);

//           const clusterPoint = new Feature(new Point(coord));
//           clusterPoint.setId(zone.id);
//           clusterPoint.set('id', zone.id);
//           clusterPoint.set('name', zone.name);
//           clusterPoint.set('description', zone.description || '');
//           clusterPoint.set('originalFeature', editablePoint);
//           clusterPoint.set('originId', zone.id);
//           clusterPoint.set('originType', 'point');
//           pointClusterInputSource.addFeature(clusterPoint);
//         }
//       });

//       if (zones.length > 0 && mapInstance.value) {
//         const first = zones[0];
//         const center = first.center_point
//           ? fromLonLat(first.center_point)
//           : fromLonLat(first.coordinates[0] || first.coordinates);
//         mapInstance.value.getView().setCenter(center);
//         mapInstance.value.getView().setZoom(10);
//       }
//     } catch (err) {
//       console.error('Error fetching zones:', err);
//     }
//   }

//   function initMap() {
//     createMap();

//     interactionManager = createInteractionManager({
//       mapInstance,
//       mapContainer,
//       vectorSource,
//       pointClusterInputSource,
//       tooltip,
//       showPopup,
//       areaName,
//       areaDescription,
//       saveFeature,
//       deleteAreaApi,
//     });

//     interactionManager.initMap();
//   }

//   function startDrawing(type) {
//     if (!interactionManager) return;
//     interactionManager.startDrawing(type);
//   }

//   async function saveArea() {
//     const f = interactionManager?.getLastDrawnFeature?.();
//     if (!f) return alert('No feature to save!');
//     if (!areaName.value.trim()) return alert('Area name is required!');
//     f.set('name', areaName.value);
//     f.set('description', areaDescription.value || '');
//     try {
//       await saveFeature(f, areaName, areaDescription);

//       const geomType = f.getGeometry().getType().toLowerCase();
//       if (geomType === 'point') {
//         const id = f.getId?.() ?? f.get('id');
//         const existing = pointClusterInputSource.getFeatureById?.(id);
//         if (existing) {
//           existing.setGeometry(f.getGeometry().clone());
//           existing.set('name', f.get('name'));
//           existing.set('description', f.get('description'));
//         } else {
//           const clone = new Feature(new Point(f.getGeometry().getCoordinates()));
//           clone.setId(id);
//           clone.set('id', id);
//           clone.set('name', f.get('name'));
//           clone.set('description', f.get('description'));
//           clone.set('originalFeature', f);
//           pointClusterInputSource.addFeature(clone);
//         }
//       } else if (geomType === 'polygon') {
//         let interiorCoords = f.getGeometry().getInteriorPoint?.()?.getCoordinates();
//         if (!interiorCoords) {
//           const ex = f.getGeometry().getExtent();
//           interiorCoords = [(ex[0] + ex[2]) / 2, (ex[1] + ex[3]) / 2];
//         }
//         const polyId = `poly-${f.getId?.() ?? f.get('id')}`;
//         const existing = pointClusterInputSource.getFeatureById?.(polyId);
//         if (existing) {
//           existing.setGeometry(new Point(interiorCoords));
//           existing.set('originalFeature', f);
//           existing.set('originId', f.getId?.() ?? f.get('id'));
//           existing.set('originType', 'polygon');
//         } else {
//           const cp = new Feature(new Point(interiorCoords));
//           cp.setId(polyId);
//           cp.set('originalFeature', f);
//           cp.set('originId', f.getId?.() ?? f.get('id'));
//           cp.set('originType', 'polygon');
//           cp.set('name', f.get('name'));
//           cp.set('description', f.get('description'));
//           pointClusterInputSource.addFeature(cp);
//         }
//       }

//       alert('Area saved successfully!');
//     } catch (err) {
//       console.error(err);
//       alert('Error saving area!');
//     }
//     showPopup.value = false;
//     areaName.value = '';
//     areaDescription.value = '';
//     interactionManager.clearMapInteractions();
//   }

//   function cancelArea() {
//     const f = interactionManager?.getLastDrawnFeature?.();
//     if (f && !f.get('id')) {
//       const tempId = f.get('id');
//       if (tempId) {
//         const c = pointClusterInputSource.getFeatureById?.(tempId);
//         if (c) pointClusterInputSource.removeFeature(c);
//       }
//       vectorSource.removeFeature(f);
//     }
//     showPopup.value = false;
//     interactionManager.clearMapInteractions();
//   }

//   function clearAllAreas() {
//     vectorSource.clear();
//     pointClusterInputSource.clear();
//     alert('All areas cleared!');
//   }

//   function getAllAreaNames() {
//     return vectorSource.getFeatures().map((f) => f.get('name')).filter(Boolean);
//   }

//   function focusOnAreaByName(name) {
//     const features = vectorSource.getFeatures();
//     const feature = features.find((f) => f.get('name')?.toLowerCase() === name.toLowerCase());
//     if (!feature) {
//       alert('Area not found!');
//       return;
//     }
//     const geom = feature.getGeometry();
//     if (!geom || !mapInstance.value) return;
//     const view = mapInstance.value.getView();
//     view.fit(geom.getExtent(), { duration: 1000, maxZoom: 20 });
//   }

//   return {
//     initMap,
//     fetchZones,
//     startDrawing,
//     saveArea,
//     cancelArea,
//     clearAllAreas,
//     mapInstance,
//     tooltipVisible,
//     tooltipText,
//     focusOnAreaByName,
//     getAllAreaNames,
//   };
// } 



import { ref } from 'vue';
import VectorSource from 'ol/source/Vector';
import Cluster from 'ol/source/Cluster';
import useAreas from './useAreas';
import { createInteractionManager } from './interactions';
import { saveFeature } from './payload';
import { deleteArea as deleteAreaApi } from './map';

// استيراد الوحدات الجديدة
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

export default function useMap({ 
  mapContainer, 
  tooltip, 
  showPopup, 
  areaName, 
  areaDescription 
}) {
  const { getAreas } = useAreas();

  // المصادر والطبقات
  const mapInstance = ref(null);
  const vectorSource = new VectorSource();
  const pointClusterInputSource = new VectorSource();
  const clusterSource = new Cluster({
    distance: 40,
    source: pointClusterInputSource,
  });

  const tooltipVisible = ref(false);
  const tooltipText = ref('');
  let interactionManager = null;

  /**
   * إنشاء الخريطة وإعدادها
   */
  function createMap() {
    const clusterLayer = createClusterLayer(clusterSource);
    const polygonLayer = createPolygonLayer(vectorSource);
    mapInstance.value = createMapInstance(mapContainer, clusterLayer, polygonLayer);

    // ربط المزامنة بين المصادر
    setupFeatureSync(vectorSource, pointClusterInputSource);

    // إضافة معالج النقر على الـ clusters
    setupClusterClickHandler(mapInstance, () => interactionManager);
  }

  /**
   * تحميل المناطق من الـ API
   */
  async function fetchZones() {
    await fetchAndLoadZones(
      getAreas,
      vectorSource,
      pointClusterInputSource,
      mapInstance
    );
  }

  /**
   * تهيئة الخريطة
   */
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

  /**
   * بدء الرسم
   */
  function startDrawing(type) {
    if (!interactionManager) return;
    interactionManager.startDrawing(type);
  }

  /**
   * حفظ منطقة
   */
  async function saveArea() {
    await saveNewArea(
      interactionManager,
      areaName,
      areaDescription,
      showPopup,
      pointClusterInputSource
    );
  }

  /**
   * إلغاء رسم منطقة
   */
  function cancelArea() {
    cancelNewArea(
      interactionManager,
      vectorSource,
      pointClusterInputSource,
      showPopup
    );
  }

  /**
   * مسح جميع المناطق
   */
  function clearAll() {
    clearAllAreas(vectorSource, pointClusterInputSource);
  }

  /**
   * الحصول على أسماء المناطق
   */
  function getAreaNames() {
    return getAllAreaNames(vectorSource);
  }

  /**
   * التركيز على منطقة
   */
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



















