import { Point, Polygon } from 'ol/geom';
import Feature from 'ol/Feature';
import { fromLonLat } from 'ol/proj';
import { addPointToCluster, addPolygonToCluster } from './clusterManager';

//load zones
export async function fetchAndLoadZones(
  getAreas,
  vectorSource,
  pointClusterInputSource,
  mapInstance
) {
  try {
    const response = await getAreas();
    const zones = response?.result?.data || [];

    zones.forEach((zone) => {
      loadZone(zone, vectorSource, pointClusterInputSource);
    });

    //focase on first zone
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

//load zone
function loadZone(zone, vectorSource, pointClusterInputSource) {
  if (!zone.type || !zone.coordinates) return;

  const type = zone.type.toLowerCase();

  if (type === 'polygon') {
    loadPolygonZone(zone, vectorSource, pointClusterInputSource);
  } else if (type === 'point') {
    loadPointZone(zone, vectorSource, pointClusterInputSource);
  }
}

//load polygon zone
function loadPolygonZone(zone, vectorSource, pointClusterInputSource) {
  const coords = zone.coordinates[0].map((c) => fromLonLat(c));
  const feature = new Feature(new Polygon([coords]));

  feature.setId(zone.id);
  feature.set('id', zone.id);
  feature.set('name', zone.name);
  feature.set('description', zone.description || '');

  vectorSource.addFeature(feature);
  addPolygonToCluster(feature, pointClusterInputSource);
}

//load point zone
function loadPointZone(zone, vectorSource, pointClusterInputSource) {
  const coord = fromLonLat(zone.coordinates);
  const editablePoint = new Feature(new Point(coord));

  editablePoint.setId(zone.id);
  editablePoint.set('id', zone.id);
  editablePoint.set('name', zone.name);
  editablePoint.set('description', zone.description || '');

  vectorSource.addFeature(editablePoint);
  addPointToCluster(editablePoint, pointClusterInputSource);
}