import Draw, { createBox } from 'ol/interaction/Draw';
import Modify from 'ol/interaction/Modify';
import Translate from 'ol/interaction/Translate';
import Select from 'ol/interaction/Select';
import { Point, Polygon } from 'ol/geom';
import Feature from 'ol/Feature';
import { fromLonLat } from 'ol/proj';
import { Style, Fill, Stroke, Text, Circle as CircleStyle } from 'ol/style';

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
            const feature = mapInstance.value.forEachFeatureAtPixel(evt.pixel, f => f);
            if (!feature) return;
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
                areaName.value = feature.get('name') || '';
                areaDescription.value = feature.get('description') || '';
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

                selectInteraction = new Select();
                selectInteraction.getFeatures().clear();
                selectInteraction.getFeatures().push(feature);
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

                selectInteraction = new Select();
                selectInteraction.getFeatures().clear();
                selectInteraction.getFeatures().push(feature);
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

            // Delete
            deleteBtn.onclick = async (e) => {
                e.stopPropagation();
                removeMenu();
                const confirmDelete = window.confirm('Are you sure you want to delete this area?');
                if (!confirmDelete) return;
                const id = feature.get('id');
                if (id) {
                    try {
                        await deleteAreaApi(id);
                        vectorSource.removeFeature(feature);
                        alert('Area deleted successfully!');
                    } catch (err) {
                        console.error('Error deleting area:', err);
                        alert('Error deleting area!');
                    }
                } else {
                    vectorSource.removeFeature(feature);
                }
            };
        });
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
