//mapAcion.js
import { Point } from 'ol/geom';
import Feature from 'ol/Feature';
import { saveFeature } from '../payload';
import { addPointToCluster, addPolygonToCluster, getFeatureId } from './clusterManager';

//save new zone
export async function saveNewArea(
  interactionManager,
  areaName,
  areaDescription,
  showPopup,
  pointClusterInputSource
) {
  const f = interactionManager?.getLastDrawnFeature?.();
  if (!f) {
    alert('No feature to save!');
    return;
  }

  if (!areaName.value.trim()) {
    alert('Area name is required!');
    return;
  }

  f.set('name', areaName.value);
  f.set('description', areaDescription.value || '');

  try {
    await saveFeature(f, areaName, areaDescription);
    syncFeatureToCluster(f, pointClusterInputSource);
    alert('Area saved successfully!');

    //reset
    showPopup.value = false;
    areaName.value = '';
    areaDescription.value = '';
    interactionManager.clearMapInteractions();
  } catch (err) {
    console.error(err);
    alert('Error saving area!');
  }
}

//sync feature to cluster 
function syncFeatureToCluster(feature, pointClusterInputSource) {
  const geomType = feature.getGeometry().getType().toLowerCase();
  const id = getFeatureId(feature);

  if (geomType === 'point') {
    const existing = pointClusterInputSource.getFeatureById?.(id);
    if (existing) {
      existing.setGeometry(feature.getGeometry().clone());
      existing.set('name', feature.get('name'));
      existing.set('description', feature.get('description'));
    } else {
      const clone = new Feature(new Point(feature.getGeometry().getCoordinates()));
      clone.setId(id);
      clone.set('id', id);
      clone.set('name', feature.get('name'));
      clone.set('description', feature.get('description'));
      clone.set('originalFeature', feature);
      pointClusterInputSource.addFeature(clone);
    }
  } else if (geomType === 'polygon') {
    const geom = feature.getGeometry();
    let interiorCoords = geom.getInteriorPoint?.()?.getCoordinates();
    if (!interiorCoords) {
      const ex = geom.getExtent();
      interiorCoords = [(ex[0] + ex[2]) / 2, (ex[1] + ex[3]) / 2];
    }
    const polyId = `poly-${id}`;
    const existing = pointClusterInputSource.getFeatureById?.(polyId);

    if (existing) {
      existing.setGeometry(new Point(interiorCoords));
      existing.set('originalFeature', feature);
      existing.set('originId', id);
      existing.set('originType', 'polygon');
      existing.set('name', feature.get('name'));
      existing.set('description', feature.get('description'));
    } else {
      const cp = new Feature(new Point(interiorCoords));
      cp.setId(polyId);
      cp.set('originalFeature', feature);
      cp.set('originId', id);
      cp.set('originType', 'polygon');
      cp.set('name', feature.get('name'));
      cp.set('description', feature.get('description'));
      pointClusterInputSource.addFeature(cp);
    }
  }
}

//cancle zone
export function cancelNewArea(
  interactionManager,
  vectorSource,
  pointClusterInputSource,
  showPopup
) {
  const f = interactionManager?.getLastDrawnFeature?.();
  if (f && !f.get('id')) {
    const tempId = f.get('id');
    if (tempId) {
      const c = pointClusterInputSource.getFeatureById?.(tempId);
      if (c) pointClusterInputSource.removeFeature(c);
    }
    vectorSource.removeFeature(f);
  }

  showPopup.value = false;
  interactionManager.clearMapInteractions();
}
//delete all areas
export function clearAllAreas(vectorSource, pointClusterInputSource) {
  vectorSource.clear();
  pointClusterInputSource.clear();
  alert('All areas cleared!');
}

//get all area names
export function getAllAreaNames(vectorSource) {
  return vectorSource.getFeatures()
    .map((f) => f.get('name'))
    .filter(Boolean);
}

//focus on area by name
export function focusOnAreaByName(name, vectorSource, mapInstance) {
  const features = vectorSource.getFeatures();
  const feature = features.find(
    (f) => f.get('name')?.toLowerCase() === name.toLowerCase()
  );

  if (!feature) {
    alert('Area not found!');
    return;
  }

  const geom = feature.getGeometry();
  if (!geom || !mapInstance.value) return;

  const view = mapInstance.value.getView();
  view.fit(geom.getExtent(), {
    duration: 1000,
    maxZoom: 20
  });
}