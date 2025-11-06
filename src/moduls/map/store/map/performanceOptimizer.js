import { Point, Polygon } from 'ol/geom';
import RBush from 'rbush';

// Class for fast spatial search using RBush (stores feature positions)
class SpatialIndex {
  constructor() {
    this.tree = new RBush(); // R-tree structure
    this.featuresMap = new Map(); // Stores features by ID
  }

  // Add feature to index
  insert(feature) {
    const geom = feature.getGeometry();
    if (!geom) return;

    const extent = geom.getExtent();
    const id = feature.getId() ?? feature.get('id');

    const item = {
      minX: extent[0],
      minY: extent[1],
      maxX: extent[2],
      maxY: extent[3],
      id,
    };

    this.tree.insert(item);
    this.featuresMap.set(id, feature);
  }

  // Find features inside given extent
  search(extent) {
    const results = this.tree.search({
      minX: extent[0],
      minY: extent[1],
      maxX: extent[2],
      maxY: extent[3],
    });
    return results.map(i => this.featuresMap.get(i.id)).filter(Boolean);
  }

  // Remove feature by ID
  remove(featureId) {
    const feature = this.featuresMap.get(featureId);
    if (!feature) return;

    const extent = feature.getGeometry().getExtent();
    this.tree.remove({
      minX: extent[0],
      minY: extent[1],
      maxX: extent[2],
      maxY: extent[3],
      id: featureId,
    });

    this.featuresMap.delete(featureId);
  }

  // Clear all data
  clear() {
    this.tree.clear();
    this.featuresMap.clear();
  }

  // Get number of stored features
  size() {
    return this.featuresMap.size;
  }
}

// Handles visible features and updates on map move
export class ViewportRenderer {
  constructor(mapInstance, vectorSource) {
    this.map = mapInstance;
    this.vectorSource = vectorSource;
    this.spatialIndex = new SpatialIndex();
    this.visibleFeatures = new Set();
    this.renderTimeout = null;
  }

  // Add one feature to index
  indexFeature(feature) {
    this.spatialIndex.insert(feature);
  }

  // Rebuild index for all features
  buildIndex(features) {
    console.time('Building Index');
    this.spatialIndex.clear();
    features.forEach(f => this.indexFeature(f));
    console.timeEnd('Building Index');
    console.log(`Indexed ${features.length} features`);
  }

  // Update visible features based on current map extent
  updateVisibleFeatures() {
    if (!this.map.value) return;
    clearTimeout(this.renderTimeout);

    this.renderTimeout = setTimeout(() => {
      const view = this.map.value.getView();
      const extent = view.calculateExtent();
      const visible = this.spatialIndex.search(extent);

      console.log(
        `Visible: ${visible.length} / ${this.spatialIndex.size()}`
      );

      this.visibleFeatures.clear();
      visible.forEach(f =>
        this.visibleFeatures.add(f.getId() ?? f.get('id'))
      );
    }, 100);
  }

  // Watch map movements and update automatically
  startWatching() {
    if (!this.map.value) return;
    this.map.value.on('moveend', () => this.updateVisibleFeatures());
    this.updateVisibleFeatures();
  }
}

// Adjusts cluster distance based on number of features
export function createOptimizedCluster(source, distance = 40) {
  const optimized = source.getFeatures?.().length > 1000 ? 60 : distance;
  return { distance: optimized, source };
}

// Loads big data in small parts (batches)
export class BatchLoader {
  constructor(batchSize = 500) {
    this.batchSize = batchSize;
  }

  // Load data in batches with a small delay
  async loadInBatches(zones, processFn) {
    console.log(`Loading ${zones.length} zones in ${this.batchSize} batches`);
    for (let i = 0; i < zones.length; i += this.batchSize) {
      const batch = zones.slice(i, i + this.batchSize);
      batch.forEach(z => processFn(z));

      if (i + this.batchSize < zones.length)
        await new Promise(r => setTimeout(r, 0));

      console.log(
        `Batch ${Math.floor(i / this.batchSize) + 1}/${Math.ceil(
          zones.length / this.batchSize
        )}`
      );
    }
  }
}

// Style for polygon features
export function createOptimizedPolygonStyle() {
  return feature => {
    const geom = feature.getGeometry?.();
    if (!geom) return null;

    const type = geom.getType?.();
    if (type && type.toLowerCase() === 'polygon') {
      return new Style({
        stroke: new Stroke({ color: '#1976d2', width: 1 }),
        fill: new Fill({ color: 'rgba(25,118,210,0.05)' }),
      });
    }
    return null;
  };
}

export { SpatialIndex };
