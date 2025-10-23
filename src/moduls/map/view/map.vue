<template>
  <div class="map-page">
    <div ref="mapContainer" class="map-container"></div>
    <div class="floating-button" @click="showDropdown = !showDropdown">
      ➕
      <ul v-if="showDropdown" class="drawing-options">
        <li @click="startDrawing('Point'), showDropdown = !showDropdown">Point</li>
        <li @click="startDrawing('Polygon'), showDropdown = !showDropdown">Polygon</li>
        <li @click="startDrawing('Box'), showDropdown = !showDropdown">Box</li>
        <li @click="startDrawing('Square'), showDropdown = !showDropdown">Square</li>
        <li @click="startDrawing('Circle'), showDropdown = !showDropdown">Circle</li>
      </ul>
    </div>

    <div class="clear-button" @click="clearAllAreas">
      🗑️ Clear All
    </div>

    <div v-if="showPopup" class="popup-overlay">
      <div class="popup">
        <h3>Save Area</h3>
        <label>Area Name <span style="color:red">*</span></label>
        <input v-model="areaName" placeholder="Enter area name" />

        <label>Description</label>
        <textarea v-model="areaDescription" placeholder="Optional description"></textarea>

        <div class="popup-buttons">
          <button @click="saveArea">Save</button>
          <button @click="cancelArea">Cancel</button>
        </div>
      </div>
    </div>

    <div ref="tooltip" class="map-tooltip" v-show="tooltipVisible">{{ tooltipText }}</div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import Map from 'ol/Map'
import View from 'ol/View'
import TileLayer from 'ol/layer/Tile'
import OSM from 'ol/source/OSM'
import Draw, { createBox } from 'ol/interaction/Draw'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'

const mapContainer = ref(null)
const tooltip = ref(null)
let mapInstance = null
const showDropdown = ref(false)
let drawInteraction = null

const showPopup = ref(false)
const areaName = ref('')
const areaDescription = ref('')
let lastDrawnFeature = null

const tooltipVisible = ref(false)
const tooltipText = ref('')

const vectorSource = new VectorSource()
const vectorLayer = new VectorLayer({ source: vectorSource })
let hoverTimeout = null
let currentDrawType = ''

import { getAreas, postArea } from '../store/map'
import { Point, Polygon, LineString, Circle as CircleGeom } from 'ol/geom'
import Feature from 'ol/Feature'
import { fromLonLat } from 'ol/proj'
import { Style, Fill, Stroke, Text, Circle as CircleStyle } from 'ol/style'

async function fetchZones() {
  try {
    const response = await getAreas()
    const zones = response.result.data

    zones.forEach((zone) => {
      if (!zone.type || !zone.coordinates) return

      let feature

      const type = zone.type.toLowerCase()

      if (type === 'polygon') {
        const coords = zone.coordinates[0].map(coord => fromLonLat(coord))
        feature = new Feature(new Polygon([coords]))
        feature.setStyle(
          new Style({
            stroke: new Stroke({ color: '#1976d2', width: 2 }),
            fill: new Fill({ color: 'rgba(25,118,210,0.1)' }),
            text: new Text({
              text: zone.name,
              font: '16px sans-serif',
              fill: new Fill({ color: '#000' }),
              offsetY: -10,
            }),
          })
        )
      } else if (type === 'point') {
        const coord = fromLonLat(zone.coordinates)
        feature = new Feature(new Point(coord))
        feature.setStyle(
          new Style({
            image: new CircleStyle({
              radius: 6,
              fill: new Fill({ color: 'red' }),
              stroke: new Stroke({ color: '#000', width: 1 }),
            }),
            text: new Text({
              text: zone.name,
              font: '14px sans-serif',
              fill: new Fill({ color: '#000' }),
              offsetY: -15,
            }),
          })
        )
      } else if (['circle', 'box', 'square'].includes(type)) {
        const center = fromLonLat(zone.coordinates)
        let radius = 500 // مثال: نصف قطر 500 متر
        feature = new Feature(new CircleGeom(center, radius))
        feature.setStyle(
          new Style({
            stroke: new Stroke({ color: 'green', width: 2 }),
            fill: new Fill({ color: 'rgba(0,255,0,0.1)' }),
            text: new Text({
              text: zone.name,
              font: '14px sans-serif',
              fill: new Fill({ color: '#000' }),
              offsetY: -10,
            }),
          })
        )
      }

      if (feature) {
        feature.set('name', zone.name)
        feature.set('description', zone.description || '')
        vectorSource.addFeature(feature)
      }
    })

    if (zones.length > 0) {
      const firstZone = zones[0]
      let center
      if (firstZone.center_point) center = fromLonLat(firstZone.center_point)
      else if (firstZone.coordinates) center = fromLonLat(firstZone.coordinates[0] || firstZone.coordinates)
      if (center) {
        mapInstance.getView().setCenter(center)
        mapInstance.getView().setZoom(10)
      }
    }
  } catch (error) {
    console.error('Error fetching zones:', error)
  }
}
onMounted(() => {
  mapInstance = new Map({
    target: mapContainer.value,
    layers: [
      new TileLayer({ source: new OSM() }),
      vectorLayer
    ],
    view: new View({
      center: [0, 0],
      zoom: 2
    })
  })

  mapInstance.on('pointermove', (evt) => {
    const feature = mapInstance.forEachFeatureAtPixel(evt.pixel, (f) => f)
    if (feature && feature.get('description')) {
      tooltipText.value = feature.get('description')
      tooltipVisible.value = true
      const tooltipEl = tooltip.value
      tooltipEl.style.left = evt.originalEvent.pageX + 10 + 'px'
      tooltipEl.style.top = evt.originalEvent.pageY + 10 + 'px'
    } else {
      tooltipVisible.value = false
    }
  })
  fetchZones()
})

onBeforeUnmount(() => {
  if (mapInstance) mapInstance.setTarget(null)
})

function startDrawing(type) {
  showDropdown.value = false
  currentDrawType = type.toLowerCase()

  if (drawInteraction && mapInstance) {
    mapInstance.removeInteraction(drawInteraction)
  }

  let drawType = ''
  if (type === 'Point') drawType = 'Point'
  else if (type === 'Polygon') drawType = 'Polygon'
  else if (['Circle', 'Box', 'Square'].includes(type)) drawType = 'Circle'

  drawInteraction = new Draw({
    source: vectorSource,
    type: drawType,
    geometryFunction:
      type === 'Box' || type === 'Square'
        ? createBox()
        : undefined
  })

  mapInstance.addInteraction(drawInteraction)

  drawInteraction.on('drawend', (event) => {
    lastDrawnFeature = event.feature
    showPopup.value = true
  })
}
//for save
import { toLonLat } from 'ol/proj'

function featureToPolygonCoordinates(feature) {
  const geom = feature.getGeometry()
  const type = geom.getType()

  if (type === 'Polygon') {
    const coords = geom.getCoordinates()[0].map(c => toLonLat(c))
    if (coords.length > 0) {
      const first = coords[0]
      const last = coords[coords.length - 1]
      if (first[0] !== last[0] || first[1] !== last[1]) {
        coords.push(first)
      }
    }
    return [coords]
  } else if (type === 'Circle') {
    const center = geom.getCenter()
    const radius = geom.getRadius()
    const points = 64
    const coords = []
    for (let i = 0; i < points; i++) {
      const angle = (i / points) * 2 * Math.PI
      const x = center[0] + radius * Math.cos(angle)
      const y = center[1] + radius * Math.sin(angle)
      coords.push(toLonLat([x, y]))
    }
    coords.push(coords[0])
    return [coords]
  } else if (type === 'Point') {
    return toLonLat(geom.getCoordinates())
  }
}
async function saveArea() {
  if (!areaName.value.trim()) {
    alert('Area name is required!')
    return
  }

  if (!lastDrawnFeature) {
    alert('No feature drawn!')
    return
  }
  lastDrawnFeature.set('name', areaName.value)
  lastDrawnFeature.set('description', areaDescription.value || '')

  lastDrawnFeature.setStyle(
    new Style({
      stroke: new Stroke({ color: '#1976d2', width: 2 }),
      fill: new Fill({ color: 'rgba(25,118,210,0.1)' }),
      text: new Text({
        text: areaName.value,
        font: '14px sans-serif',
        fill: new Fill({ color: '#000' }),
        offsetY: -10
      })
    })
  )

  const geom = lastDrawnFeature.getGeometry()
  let type = currentDrawType
  let coordinates = null

  if (type === 'polygon') {
    coordinates = geom.getCoordinates()[0].map(c => toLonLat(c))
    const first = coordinates[0]
    const last = coordinates[coordinates.length - 1]
    if (first[0] !== last[0] || first[1] !== last[1]) {
      coordinates.push(first)
    }
    coordinates = [coordinates]
  } else if (type === 'point') {
    coordinates = toLonLat(geom.getCoordinates())
  } else if (type === 'circle') {
    const center = geom.getCenter()
    const radius = geom.getRadius()
    const points = 64
    const ring = []
    for (let i = 0; i < points; i++) {
      const angle = (i / points) * 2 * Math.PI
      const x = center[0] + radius * Math.cos(angle)
      const y = center[1] + radius * Math.sin(angle)
      ring.push(toLonLat([x, y]))
    }
    ring.push(ring[0])
    coordinates = [ring]
    type = 'polygon'
  }
  const payload = {
    name: areaName.value,
    description: areaDescription.value || '',
    default_customer_name: 'test - customer',
    visibility: 'private',
    type: type,
    coordinates: coordinates,
    clients: []
  }
  console.log('Posting area payload:', payload)
  try {
    await postArea(payload)
    alert('Area saved and posted successfully!')
  } catch (err) {
    console.error('Error posting area:', err.response?.data || err)
    alert('Error posting area to API')
  }
  showPopup.value = false
  areaName.value = ''
  areaDescription.value = ''
  lastDrawnFeature = null
}
function cancelArea() {
  if (lastDrawnFeature) {
    vectorSource.removeFeature(lastDrawnFeature)
    lastDrawnFeature = null
  }
  showPopup.value = false
  areaName.value = ''
  areaDescription.value = ''
}
function clearAllAreas() {
  if (confirm('Are you sure you want to clear all drawn areas?')) {
    vectorSource.clear()
    alert('All areas cleared!')
  }
}
</script>

<style scoped>
.map-page {
  width: 100%;
  height: 100%;
}

.map-container {
  width: 100%;
  height: 100vh;
}

.floating-button {
  position: absolute;
  bottom: 20px;
  right: 20px;
  background-color: #1976d2;
  color: white;
  font-size: 24px;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  text-align: center;
  line-height: 50px;
  cursor: pointer;
  z-index: 1000;
}

.drawing-options {
  position: absolute;
  bottom: 60px;
  right: 0;
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 6px;
  list-style: none;
  padding: 5px 0;
  margin: 0;
}

.drawing-options li {
  padding: 6px 12px;
  cursor: pointer;
  background: black;
  color: white;
}

.clear-button {
  position: absolute;
  bottom: 20px;
  left: 20px;
  background-color: #d32f2f;
  color: white;
  font-size: 14px;
  border-radius: 6px;
  padding: 8px 14px;
  cursor: pointer;
  z-index: 1000;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
  transition: background-color 0.2s ease;
}

.clear-button:hover {
  background-color: #b71c1c;
}

.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
}

.popup {
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 320px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.popup h3 {
  margin-bottom: 10px;
}

.popup input,
.popup textarea {
  width: 100%;
  margin-bottom: 10px;
  padding: 6px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.popup-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.popup-buttons button {
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.popup-buttons button:first-child {
  background-color: #1976d2;
  color: white;
}

.map-tooltip {
  position: absolute;
  background: rgba(0, 0, 0, 0.75);
  color: #fff;
  padding: 5px 8px;
  border-radius: 4px;
  font-size: 13px;
  pointer-events: none;
  z-index: 3000;
  white-space: nowrap;
}
</style>
