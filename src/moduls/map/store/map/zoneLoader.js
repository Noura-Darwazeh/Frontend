
import { Point, Polygon } from 'ol/geom';
import Feature from 'ol/Feature';
import { fromLonLat } from 'ol/proj';
import { addPointToCluster, addPolygonToCluster } from './clusterManager';
import { BatchLoader } from './performanceOptimizer';

export async function fetchAndLoadZones(
  getAreas,
  vectorSource,
  pointClusterInputSource,
  mapInstance,
  viewportRenderer = null
) {
  try {
    console.time('Fetching Zones');
    const response = await getAreas();
    const zones = response?.result?.data || [];
    console.timeEnd('Fetching Zones');

    if (!zones.length) return;

    console.log(`Loading ${zones.length} zones...`);
    console.time('Total Loading Time');

    const batchLoader = new BatchLoader(500);

    const allFeatures = [];

    await batchLoader.loadInBatches(zones, (zone) => {
      const features = loadZone(zone, vectorSource, pointClusterInputSource);
      if (features) allFeatures.push(...features);
    });

    console.timeEnd('Total Loading Time');

    if (viewportRenderer) {
      viewportRenderer.buildIndex(vectorSource.getFeatures());
    }

    if (zones.length > 0 && mapInstance.value) {
      const first = zones[0];
      const center = first.center_point
        ? fromLonLat(first.center_point)
        : fromLonLat(first.coordinates[0] || first.coordinates);
      mapInstance.value.getView().setCenter(center);
      mapInstance.value.getView().setZoom(10);
    }

    console.log(`✅ Successfully loaded ${zones.length} zones`);
  } catch (err) {
    console.error('Error fetching zones:', err);
  }
}

function loadZone(zone, vectorSource, pointClusterInputSource) {
  if (!zone.type || !zone.coordinates) return null;

  const type = zone.type.toLowerCase();
  const features = [];

  if (type === 'polygon') {
    const feature = loadPolygonZone(zone, vectorSource, pointClusterInputSource);
    if (feature) features.push(feature);
  } else if (type === 'point') {
    const feature = loadPointZone(zone, vectorSource, pointClusterInputSource);
    if (feature) features.push(feature);
  }

  return features;
}

function loadPolygonZone(zone, vectorSource, pointClusterInputSource) {
  const coords = zone.coordinates[0].map((c) => fromLonLat(c));
  const feature = new Feature(new Polygon([coords]));

  feature.setId(zone.id);
  feature.set('id', zone.id);
  feature.set('name', zone.name);
  feature.set('description', zone.description || '');

  vectorSource.addFeature(feature);
  addPolygonToCluster(feature, pointClusterInputSource);

  return feature;
}

function loadPointZone(zone, vectorSource, pointClusterInputSource) {
  const coord = fromLonLat(zone.coordinates);
  const editablePoint = new Feature(new Point(coord));

  editablePoint.setId(zone.id);
  editablePoint.set('id', zone.id);
  editablePoint.set('name', zone.name);
  editablePoint.set('description', zone.description || '');

  vectorSource.addFeature(editablePoint);
  addPointToCluster(editablePoint, pointClusterInputSource);

  return editablePoint;
}