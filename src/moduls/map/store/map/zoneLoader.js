import { Point, Polygon } from 'ol/geom';
import Feature from 'ol/Feature';
import { fromLonLat } from 'ol/proj';
import { addPointToCluster, addPolygonToCluster } from './clusterManager';
import { BatchLoader } from './performanceOptimizer';

// Fetch zones data from API and display them on the map
export async function fetchAndLoadZones(
  getAreas,
  vectorSource,
  pointClusterInputSource,
  mapInstance,
  viewportRenderer = null
) {
  try {
    console.time('Fetching Zones');
    const response = await getAreas(); // Get data from server
    const zones = response?.result?.data || [];
    console.timeEnd('Fetching Zones');

    if (!zones.length) return; // Stop if no data found

    console.log(`Loading ${zones.length} zones...`);
    console.time('Total Loading Time');

    const batchLoader = new BatchLoader(500); // Load data in small batches
    const allFeatures = [];

    // Process each zone and add it to the map
    await batchLoader.loadInBatches(zones, (zone) => {
      const features = loadZone(zone, vectorSource, pointClusterInputSource);
      if (features) allFeatures.push(...features);
    });

    console.timeEnd('Total Loading Time');

    // Rebuild spatial index for visible features
    if (viewportRenderer) {
      viewportRenderer.buildIndex(vectorSource.getFeatures());
    }

    // Center the map on the first loaded zone
    if (zones.length > 0 && mapInstance.value) {
      const first = zones[0];
      const center = first.center_point
        ? fromLonLat(first.center_point)
        : fromLonLat(first.coordinates[0] || first.coordinates);
      mapInstance.value.getView().setCenter(center);
      mapInstance.value.getView().setZoom(10);
    }

    console.log(`Successfully loaded ${zones.length} zones`);
  } catch (err) {
    console.error('Error fetching zones:', err);
  }
}

// Handle each zone and decide if it's a polygon or point
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

// Create and add a polygon feature to the map
function loadPolygonZone(zone, vectorSource, pointClusterInputSource) {
  const coords = zone.coordinates[0].map((c) => fromLonLat(c));
  const feature = new Feature(new Polygon([coords]));

  // Set feature properties
  feature.setId(zone.id);
  feature.set('id', zone.id);
  feature.set('name', zone.name);
  feature.set('description', zone.description || '');

  vectorSource.addFeature(feature); // Add polygon to the map
  addPolygonToCluster(feature, pointClusterInputSource); // Add to cluster

  return feature;
}

// Create and add a point feature to the map
function loadPointZone(zone, vectorSource, pointClusterInputSource) {
  const coord = fromLonLat(zone.coordinates);
  const editablePoint = new Feature(new Point(coord));

  // Set feature properties
  editablePoint.setId(zone.id);
  editablePoint.set('id', zone.id);
  editablePoint.set('name', zone.name);
  editablePoint.set('description', zone.description || '');

  vectorSource.addFeature(editablePoint); // Add point to the map
  addPointToCluster(editablePoint, pointClusterInputSource); // Add to cluster

  return editablePoint;
}
