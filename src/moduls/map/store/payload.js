// payload.js
import { fromLonLat, toLonLat } from 'ol/proj';
import { Style, Fill, Stroke, Text } from 'ol/style';
import { updateArea, postArea } from './map';

export function buildPayloadFromFeature(feature, areaNameRef, areaDescriptionRef) {
    const geom = feature.getGeometry();
    if (!geom) return null;

    let type = geom.getType().toLowerCase();
    let coordinates;

    if (type === 'polygon') {
        coordinates = geom.getCoordinates()[0].map(c => toLonLat(c));
        const first = coordinates[0], last = coordinates[coordinates.length - 1];
        if (!(first[0] === last[0] && first[1] === last[1])) coordinates.push(first);
        coordinates = [coordinates];
    } else if (type === 'point') {
        coordinates = toLonLat(geom.getCoordinates());
    } else if (type === 'circle') {
        const center = geom.getCenter(), radius = geom.getRadius();
        const points = 64, ring = [];
        for (let i = 0; i < points; i++) {
            const angle = (i / points) * 2 * Math.PI;
            const x = center[0] + radius * Math.cos(angle);
            const y = center[1] + radius * Math.sin(angle);
            ring.push(toLonLat([x, y]));
        }
        ring.push(ring[0]);
        coordinates = [ring];
        type = 'polygon';
    } else {
        return null;
    }

    return {
        name: feature.get('name') || areaNameRef?.value || 'Unnamed area',
        description: feature.get('description') || areaDescriptionRef?.value || '',
        default_customer_name: 'test',
        visibility: 'private',
        type,
        coordinates,
        clients: [],
        tags: [],
        zones_type: '',
        longitude: '',
        latitude: '',
        expected_visits: [],
    };
}

// src/moduls/map/store/payload.js

export async function saveFeature(feature, areaNameRef, areaDescriptionRef) {
    try {
        if (!feature) return null;
        const payload = buildPayloadFromFeature(feature, areaNameRef, areaDescriptionRef);
        if (!payload) return null;

        const id = feature.get('id');
        if (id) {
            await updateArea(id, payload);
        } else {
            const res = await postArea(payload);
            if (res && res.result && res.result.id) feature.set('id', res.result.id);
            else if (res && res.id) feature.set('id', res.id);
        }

        // ✅ تحديث الستايل مع اسم المنطقة
        const name = feature.get('name') || '';
        feature.setStyle(new Style({
            stroke: new Stroke({ 
              color: '#1976d2', 
              width: 2 
            }),
            fill: new Fill({ 
              color: 'rgba(25,118,210,0.1)' 
            }),
            text: name ? new Text({ 
                text: name, 
                font: 'bold 13px sans-serif', 
                fill: new Fill({ color: '#000' }), // ✅ خط أسود
                backgroundFill: new Fill({ color: '#fff' }), // ✅ خلفية بيضاء
                backgroundStroke: new Stroke({ 
                  color: '#ccc', 
                  width: 1 
                }), // ✅ حدود
                padding: [3, 5, 3, 5], // ✅ مسافة داخلية
                offsetY: -10 
            }) : undefined
        }));

        return true;
    } catch (err) {
        console.error('Error saving feature:', err);
        throw err;
    }
}