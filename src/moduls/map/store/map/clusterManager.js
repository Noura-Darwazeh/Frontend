import { Point } from 'ol/geom';
import Feature from 'ol/Feature';

//get id
export const getFeatureId = (f) => f?.getId?.() ?? f?.get?.('id');

//add poly to cluster
export function addPolygonToCluster(feature, pointClusterInputSource) {
  const fid = getFeatureId(feature);
  const geom = feature.getGeometry();
  
  let interiorCoords = null;
  try {
    interiorCoords = geom.getInteriorPoint?.()?.getCoordinates();
  } catch (err) {
    console.error('Error getting interior point:', err);
  }
  
  if (!interiorCoords) {
    const ex = geom.getExtent();
    interiorCoords = [(ex[0] + ex[2]) / 2, (ex[1] + ex[3]) / 2];
  }

  const polyId = `poly-${fid}`;
  const clusterPoint = new Feature(new Point(interiorCoords));
  clusterPoint.setId(polyId);
  clusterPoint.set('originId', fid);
  clusterPoint.set('originType', 'polygon');
  clusterPoint.set('originalFeature', feature);
  clusterPoint.set('name', feature.get('name'));
  clusterPoint.set('description', feature.get('description') || '');
  
  pointClusterInputSource.addFeature(clusterPoint);
}

//add point to cluster
export function addPointToCluster(feature, pointClusterInputSource) {
  const fid = getFeatureId(feature);
  const coord = feature.getGeometry().getCoordinates();
  
  const clusterPoint = new Feature(new Point(coord));
  clusterPoint.setId(fid);
  clusterPoint.set('id', fid);
  clusterPoint.set('name', feature.get('name'));
  clusterPoint.set('description', feature.get('description') || '');
  clusterPoint.set('originalFeature', feature);
  clusterPoint.set('originId', fid);
  clusterPoint.set('originType', 'point');
  
  pointClusterInputSource.addFeature(clusterPoint);
}

//update feature in cluster
export function updateClusterFeature(feature, pointClusterInputSource) {
  const fid = getFeatureId(feature);
  const geom = feature.getGeometry?.();
  if (!geom) return;
  
  const type = geom.getType?.()?.toLowerCase();

  if (type === 'point') {
    const existing = pointClusterInputSource.getFeatureById?.(fid);
    if (existing) {
      existing.setGeometry(geom.clone());
      existing.set('name', feature.get('name'));
      existing.set('description', feature.get('description'));
      existing.set('originId', fid);
      existing.set('originType', 'point');
    }
  } else if (type === 'polygon') {
    let interiorCoords = null;
    try {
      interiorCoords = geom.getInteriorPoint?.()?.getCoordinates();
    } catch (err) {}
    
    if (!interiorCoords) {
      const ex = geom.getExtent();
      interiorCoords = [(ex[0] + ex[2]) / 2, (ex[1] + ex[3]) / 2];
    }
    
    const polyId = `poly-${fid}`;
    const existing = pointClusterInputSource.getFeatureById?.(polyId);
    if (existing) {
      existing.setGeometry(new Point(interiorCoords));
      existing.set('name', feature.get('name'));
      existing.set('description', feature.get('description'));
      existing.set('originId', fid);
      existing.set('originType', 'polygon');
      existing.set('originalFeature', feature);
    }
  }
}

//remove feature from cluster
export function removeFromCluster(feature, pointClusterInputSource) {
  const fid = getFeatureId(feature);
  
  // remove point
  const byId = pointClusterInputSource.getFeatureById?.(fid);
  if (byId) pointClusterInputSource.removeFeature(byId);
  
  // remove polygon
  const polyId = `poly-${fid}`;
  const byPoly = pointClusterInputSource.getFeatureById?.(polyId);
  if (byPoly) pointClusterInputSource.removeFeature(byPoly);
}