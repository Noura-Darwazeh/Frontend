//featureSync.js
import { removeFromCluster, updateClusterFeature } from './clusterManager';

// vectorSource /clusterSource
export function setupFeatureSync(vectorSource, pointClusterInputSource) {
  if (typeof vectorSource.on !== 'function') return;

  // when delete feature
  vectorSource.on('removefeature', (evt) => {
    try {
      removeFromCluster(evt.feature, pointClusterInputSource);
    } catch (e) {
      console.error('Error syncing cluster on removefeature', e);
    }
  });

  //when edit feature
  vectorSource.on('changefeature', (evt) => {
    try {
      updateClusterFeature(evt.feature, pointClusterInputSource);
    } catch (e) {
      console.error('Error syncing cluster on changefeature', e);
    }
  });
}