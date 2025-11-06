import Draw, { createBox } from 'ol/interaction/Draw';
import Modify from 'ol/interaction/Modify';
import Translate from 'ol/interaction/Translate';
import Select from 'ol/interaction/Select';
import { Point, Polygon } from 'ol/geom';
import Feature from 'ol/Feature';
import { fromLonLat } from 'ol/proj';
import { Style, Fill, Stroke, Text, Circle as CircleStyle } from 'ol/style';

function extractFeatureId(feature) {
    let id = feature.get('id') || feature.getId();
    if (id && id !== 'undefined' && !String(id).startsWith('poly-')) {
        if (String(id).startsWith('poly-')) {
            return String(id).replace('poly-', '');
        }
        return id;
    }

    const originalFeature = feature.get('originalFeature');
    if (originalFeature) {
        id = originalFeature.get('id') || originalFeature.getId();
        if (id && id !== 'undefined') return id;
    }

    id = feature.get('originId');
    if (id && id !== 'undefined') return id;

    return null;
}

function extractOriginalFeature(feature) {
    return feature.get('originalFeature') || feature;
}

function isClusterFeature(feature) {
    const features = feature.get('features');
    return Array.isArray(features) && features.length > 0;
}

export function createInteractionManager({
    mapInstance,
    mapContainer,
    vectorSource,
    tooltip,
    showPopup,
    areaName,
    areaDescription,
    saveFeature,
    deleteAreaApi
}) {
    let drawInteraction = null;
    let modifyInteraction = null;
    let translateInteraction = null;
    let selectInteraction = null;
    let lastDrawnFeature = null;

    function clearMapInteractions() {
        if (!mapInstance.value) return;
        if (drawInteraction) { mapInstance.value.removeInteraction(drawInteraction); drawInteraction = null; }
        if (modifyInteraction) { mapInstance.value.removeInteraction(modifyInteraction); modifyInteraction = null; }
        if (translateInteraction) { mapInstance.value.removeInteraction(translateInteraction); translateInteraction = null; }
        if (selectInteraction) { mapInstance.value.removeInteraction(selectInteraction); selectInteraction = null; }
    }

    function initMap() {
        if (!mapInstance.value) return;

        mapInstance.value.on('pointermove', evt => {
            const feature = mapInstance.value.forEachFeatureAtPixel(evt.pixel, f => f);
            if (feature && feature.get('description')) {
                if (tooltip?.value) {
                    tooltip.value.style.left = evt.originalEvent.pageX + 10 + 'px';
                    tooltip.value.style.top = evt.originalEvent.pageY + 10 + 'px';
                }
            }
        });

        mapInstance.value.on('singleclick', evt => {
            const clickedFeature = mapInstance.value.forEachFeatureAtPixel(evt.pixel, f => f);
            if (!clickedFeature) return;

            if (isClusterFeature(clickedFeature)) {
                const clusterFeatures = clickedFeature.get('features');

                if (clusterFeatures.length === 1) {
                    const feature = clusterFeatures[0];
                    showContextMenu(feature, evt);
                }
                return;
            }

            showContextMenu(clickedFeature, evt);
        });
    }

    function showContextMenu(feature, evt) {
        lastDrawnFeature = feature;

        const menu = document.createElement('div');
        menu.style.position = 'absolute';
        menu.style.left = evt.originalEvent.pageX + 'px';
        menu.style.top = evt.originalEvent.pageY + 'px';
        menu.style.backgroundColor = '#fff';
        menu.style.border = '1px solid #ccc';
        menu.style.padding = '5px';
        menu.style.zIndex = 10000;
        menu.style.boxShadow = '0 2px 6px rgba(0,0,0,0.2)';

        const editBtn = document.createElement('button');
        editBtn.innerText = 'Edit';
        editBtn.style.display = 'block';
        editBtn.style.marginBottom = '5px';

        const editShapeBtn = document.createElement('button');
        editShapeBtn.innerText = 'Edit Shape';
        editShapeBtn.style.display = 'block';
        editShapeBtn.style.marginBottom = '5px';

        const moveBtn = document.createElement('button');
        moveBtn.innerText = 'Move';
        moveBtn.style.display = 'block';
        moveBtn.style.marginBottom = '5px';

        const deleteBtn = document.createElement('button');
        deleteBtn.innerText = 'Delete';
        deleteBtn.style.display = 'block';

        menu.appendChild(editBtn);
        menu.appendChild(editShapeBtn);
        menu.appendChild(moveBtn);
        menu.appendChild(deleteBtn);
        document.body.appendChild(menu);

        const removeMenu = () => {
            if (menu) menu.remove();
            document.removeEventListener('click', removeMenu);
        };
        setTimeout(() => document.addEventListener('click', removeMenu), 0);

        editBtn.onclick = (e) => {
            e.stopPropagation();

            const originalFeature = extractOriginalFeature(feature);

            console.log('Edit clicked for feature:', originalFeature);
            console.log('Feature ID:', extractFeatureId(feature));
            console.log('Feature name:', originalFeature.get('name'));

            areaName.value = originalFeature.get('name') || '';
            areaDescription.value = originalFeature.get('description') || '';
            showPopup.value = true;

            clearMapInteractions();
            modifyInteraction = new Modify({ source: vectorSource });
            modifyInteraction.on('modifyend', async (me) => {
                try { me.features.getArray().forEach(f => saveFeature(f, areaName, areaDescription)); }
                catch (err) { console.error('Modify save error:', err); }
            });
            mapInstance.value.addInteraction(modifyInteraction);
            removeMenu();
        };

        editShapeBtn.onclick = (e) => {
            e.stopPropagation();
            clearMapInteractions();

            const originalFeature = extractOriginalFeature(feature);

            console.log('Edit Shape clicked for feature:', originalFeature);
            console.log('Feature ID:', extractFeatureId(feature));

            selectInteraction = new Select();
            selectInteraction.getFeatures().clear();
            selectInteraction.getFeatures().push(originalFeature);
            mapInstance.value.addInteraction(selectInteraction);

            modifyInteraction = new Modify({ features: selectInteraction.getFeatures() });
            modifyInteraction.on('modifyend', async (me) => {
                try { me.features.getArray().forEach(f => saveFeature(f, areaName, areaDescription)); }
                catch (err) { console.error('EditShape modify save error:', err); }
            });
            mapInstance.value.addInteraction(modifyInteraction);
            removeMenu();
        };

        moveBtn.onclick = (e) => {
            e.stopPropagation();
            clearMapInteractions();

            const originalFeature = extractOriginalFeature(feature);

            console.log(' Move clicked for feature:', originalFeature);
            console.log('Feature ID:', extractFeatureId(feature));

            selectInteraction = new Select();
            selectInteraction.getFeatures().clear();
            selectInteraction.getFeatures().push(originalFeature);
            mapInstance.value.addInteraction(selectInteraction);

            translateInteraction = new Translate({ features: selectInteraction.getFeatures() });
            translateInteraction.on('translateend', async (te) => {
                try { te.features.getArray().forEach(f => saveFeature(f, areaName, areaDescription)); }
                catch (err) { console.error('Translate save error:', err); }
                finally {
                    if (translateInteraction) { mapInstance.value.removeInteraction(translateInteraction); translateInteraction = null; }
                    if (selectInteraction) { mapInstance.value.removeInteraction(selectInteraction); selectInteraction = null; }
                }
            });
            mapInstance.value.addInteraction(translateInteraction);
            removeMenu();
        };


        deleteBtn.onclick = async (e) => {
            e.stopPropagation();
            removeMenu();

            const id = extractFeatureId(feature);
            const originalFeature = extractOriginalFeature(feature);

            //  Debug logging
            console.log('Delete clicked');
            console.log('Clicked feature:', feature);
            console.log('Original feature:', originalFeature);
            console.log('Extracted ID:', id);
            console.log('Feature.get("id"):', feature.get('id'));
            console.log('Feature.getId():', feature.getId());
            console.log('Original.get("id"):', originalFeature?.get('id'));
            console.log(' Original.getId():', originalFeature?.getId());

            const confirmDelete = window.confirm(`Are you sure you want to delete "${originalFeature.get('name') || 'this area'}"?`);
            if (!confirmDelete) return;

            if (id) {
                try {
                    console.log('🔄 Attempting to delete ID:', id);
                    await deleteAreaApi(id);

                    console.log('Deleted from database, removing from map...');
                    vectorSource.removeFeature(originalFeature);

                    alert('Area deleted successfully!');
                } catch (err) {
                    console.error(' Error deleting area:', err);
                    alert(' Error deleting area: ' + (err.response?.data?.message || err.message || 'Unknown error'));
                }
            } else {
                console.warn(' No ID found - removing from map only');
                console.warn(' This usually means the feature was not saved to database');
                vectorSource.removeFeature(originalFeature);
                alert(' Area removed from map (no database ID found - might be a new unsaved area)');
            }
        };
    }

    function startDrawing(type) {
        clearMapInteractions();

        let drawOptions = { source: vectorSource };
        if (type === 'Box' || type === 'Square') {
            drawOptions.type = 'Circle';
            drawOptions.geometryFunction = createBox();
        } else {
            drawOptions.type = type;
        }

        drawInteraction = new Draw(drawOptions);
        mapInstance.value.addInteraction(drawInteraction);

        drawInteraction.on('drawend', e => {
            lastDrawnFeature = e.feature;
            areaName.value = '';
            areaDescription.value = '';
            showPopup.value = true;
        });
    }

    return {
        initMap,
        startDrawing,
        clearMapInteractions,
        getLastDrawnFeature: () => lastDrawnFeature
    };
}