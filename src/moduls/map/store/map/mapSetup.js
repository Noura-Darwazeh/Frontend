import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import OSM from 'ol/source/OSM';
import { Style, Text, Circle as CircleStyle, Fill, Stroke } from 'ol/style';
import { defaults as defaultControls } from 'ol/control';

//cluster layer
export function createClusterLayer(clusterSource) {
  return new VectorLayer({
    source: clusterSource,
    style: (feature) => {
      const features = feature.get('features') || [];
      const size = features.length;
      
      if (size > 1) {
        return new Style({
          image: new CircleStyle({
            radius: 15,
            fill: new Fill({ color: 'rgba(0, 123, 255, 0.6)' }),
            stroke: new Stroke({ color: '#fff', width: 2 }),
          }),
          text: new Text({
            text: String(size),
            fill: new Fill({ color: '#fff' }),
          }),
        });
      }
      
      return new Style({
        image: new CircleStyle({
          radius: 7,
          fill: new Fill({ color: 'rgba(220, 53, 69, 0.8)' }),
          stroke: new Stroke({ color: '#fff', width: 2 }),
        }),
      });
    },
  });
}

//polygon layer
export function createPolygonLayer(vectorSource) {
  return new VectorLayer({
    source: vectorSource,
    style: (feature) => {
      const geom = feature.getGeometry?.();
      if (!geom) return null;
      
      const type = geom.getType?.();
      if (type && type.toLowerCase() === 'polygon') {
        return new Style({
          stroke: new Stroke({ color: '#1976d2', width: 2 }),
          fill: new Fill({ color: 'rgba(25,118,210,0.1)' }),
          text: new Text({
            text: feature.get('name') || '',
            font: '14px sans-serif',
            fill: new Fill({ color: '#000' }),
            offsetY: -10,
          }),
        });
      }
      return null;
    },
  });
}

//map
export function createMapInstance(mapContainer, clusterLayer, polygonLayer) {
  const raster = new TileLayer({ source: new OSM() });

  return new Map({
    target: mapContainer.value,
    layers: [raster, clusterLayer, polygonLayer],
    view: new View({ center: [0, 0], zoom: 2 }),
    controls: defaultControls({
      zoom: true,
      rotate: false,
      attribution: false,
    }),
  });
}