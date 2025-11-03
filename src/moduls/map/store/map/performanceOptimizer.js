import { Point, Polygon } from 'ol/geom';
import RBush from 'rbush';

class SpatialIndex {
  constructor() {
    this.tree = new RBush();
    this.featuresMap = new Map();
  }

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
      id: id,
    };

    this.tree.insert(item);
    this.featuresMap.set(id, feature);
  }

  search(extent) {
    const results = this.tree.search({
      minX: extent[0],
      minY: extent[1],
      maxX: extent[2],
      maxY: extent[3],
    });

    return results.map(item => this.featuresMap.get(item.id)).filter(Boolean);
  }

  remove(featureId) {
    const feature = this.featuresMap.get(featureId);
    if (!feature) return;

    const geom = feature.getGeometry();
    const extent = geom.getExtent();

    this.tree.remove({
      minX: extent[0],
      minY: extent[1],
      maxX: extent[2],
      maxY: extent[3],
      id: featureId,
    });

    this.featuresMap.delete(featureId);
  }

  clear() {
    this.tree.clear();
    this.featuresMap.clear();
  }

  size() {
    return this.featuresMap.size;
  }
}


export class ViewportRenderer {
  constructor(mapInstance, vectorSource) {
    this.map = mapInstance;
    this.vectorSource = vectorSource;
    this.spatialIndex = new SpatialIndex();
    this.visibleFeatures = new Set();
    this.renderTimeout = null;
  }

  indexFeature(feature) {
    this.spatialIndex.insert(feature);
  }

  buildIndex(features) {
    console.time('Building Spatial Index');
    this.spatialIndex.clear();
    features.forEach(f => this.indexFeature(f));
    console.timeEnd('Building Spatial Index');
    console.log(`Indexed ${features.length} features`);
  }

  updateVisibleFeatures() {
    if (!this.map.value) return;

    clearTimeout(this.renderTimeout);
    this.renderTimeout = setTimeout(() => {
      const view = this.map.value.getView();
      const extent = view.calculateExtent();
      const featuresInView = this.spatialIndex.search(extent);
      console.log(`Viewport: ${featuresInView.length} features visible out of ${this.spatialIndex.size()}`);
      this.visibleFeatures.clear();
      featuresInView.forEach(f => this.visibleFeatures.add(f.getId() ?? f.get('id')));

    }, 100); 
  }
  startWatching() {
    if (!this.map.value) return;

    this.map.value.on('moveend', () => {
      this.updateVisibleFeatures();
    });
    this.updateVisibleFeatures();
  }
}


export function createOptimizedCluster(source, distance = 40) {
  const optimizedDistance = source.getFeatures?.().length > 1000 ? 60 : distance;

  return {
    distance: optimizedDistance,
    source: source,
  };
}

export class BatchLoader {
  constructor(batchSize = 500) {
    this.batchSize = batchSize;
  }

  async loadInBatches(zones, processFn) {
    console.log(`Loading ${zones.length} zones in batches of ${this.batchSize}`);
    
    for (let i = 0; i < zones.length; i += this.batchSize) {
      const batch = zones.slice(i, i + this.batchSize);
      
      batch.forEach(zone => processFn(zone));
      if (i + this.batchSize < zones.length) {
        await new Promise(resolve => setTimeout(resolve, 0));
      }

      console.log(`Loaded batch ${Math.floor(i / this.batchSize) + 1}/${Math.ceil(zones.length / this.batchSize)}`);
    }
  }
}

export function createOptimizedPolygonStyle() {
  return (feature) => {
    const geom = feature.getGeometry?.();
    if (!geom) return null;

    const type = geom.getType?.();
    if (type && type.toLowerCase() === 'polygon') {
      return new Style({
        stroke: new Stroke({ 
          color: '#1976d2', 
          width: 1  
        }),
        fill: new Fill({ 
          color: 'rgba(25,118,210,0.05)'  
        }),
      });
    }
    return null;
  };
}

export { SpatialIndex };