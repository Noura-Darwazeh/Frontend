
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import OSM from 'ol/source/OSM';
import { Style, Text, Circle as CircleStyle, Fill, Stroke } from 'ol/style';
import { defaults as defaultControls } from 'ol/control';

export function createClusterLayer(clusterSource) {
  return new VectorLayer({
    source: clusterSource,
    renderMode: 'image',
    updateWhileAnimating: false,
    updateWhileInteracting: false,
    style: (feature) => {
      const features = feature.get('features') || [];
      const size = features.length;

      if (size > 1) {
        return new Style({
          image: new CircleStyle({
            radius: Math.min(15 + Math.log(size) * 2, 30),
            fill: new Fill({ color: 'rgba(0, 123, 255, 0.6)' }),
            stroke: new Stroke({ color: '#fff', width: 2 }),
          }),
          text: new Text({
            text: size > 999 ? '999+' : String(size),
            fill: new Fill({ color: '#fff' }),
            font: 'bold 12px sans-serif',
          }),
        });
      }

      const singleFeature = features[0];
      if (singleFeature.get('originType') === 'polygon') {
        return null;
      }

      return new Style({
        image: new CircleStyle({
          radius: 6,
          fill: new Fill({ color: 'rgba(220, 53, 69, 0.8)' }),
          stroke: new Stroke({ color: '#fff', width: 1 }),
        }),
      });
    },
  });
}

export function createPolygonLayer(vectorSource) {
  return new VectorLayer({
    source: vectorSource,
    renderMode: 'image',
    updateWhileAnimating: false,
    updateWhileInteracting: false,
    declutter: true,
    style: (feature) => {
      const geom = feature.getGeometry?.();
      if (!geom) return null;

      const type = geom.getType?.();
      if (type && type.toLowerCase() === 'polygon') {
        const view = feature.get('__inView');

        return new Style({
          stroke: new Stroke({
            color: '#1976d2',
            width: view ? 2 : 1
          }),
          fill: new Fill({
            color: view ? 'rgba(25,118,210,0.1)' : 'rgba(25,118,210,0.05)'
          }),
          text: view ? new Text({
            text: feature.get('name') || '',
            font: '12px sans-serif',
            fill: new Fill({ color: '#000' }),
            offsetY: -10,
            overflow: true,
          }) : undefined,
        });
      }
      return null;
    },
  });
}

export function createMapInstance(mapContainer, clusterLayer, polygonLayer) {
  const raster = new TileLayer({
    source: new OSM(),
    preload: 3,
  });

  return new Map({
    target: mapContainer.value,
    layers: [raster, clusterLayer, polygonLayer],
    view: new View({
      center: [0, 0],
      zoom: 2,
      constrainResolution: true,
      smoothResolutionConstraint: false,
    }),
    controls: defaultControls({
      zoom: true,
      rotate: false,
      attribution: false,
    }),

    loadTilesWhileAnimating: true,
    loadTilesWhileInteracting: true,
  });
}