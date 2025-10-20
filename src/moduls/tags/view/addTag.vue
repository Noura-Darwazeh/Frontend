<template>
  <div class="add-tag-page">
    <!-- Tag Name -->
    <div class="tagName">
      <label>Tag Name</label>
      <input v-model="tagName" placeholder="Ex: Tag 1" />
      <span v-if="error" class="error">{{ error }}</span>
    </div>

    <!-- 🟩 Units Section -->
    <div class="section">
      <div class="section-header" @click.self="toggleSection('units')">
        <div class="selectAll">
          <input type="checkbox" :checked="allUnitsSelected" @change.stop="toggleSelectAllUnits" />
          <label>Select All Units</label>
        </div>
        <div class="selected">
          <span>Selected: {{ selectedUnits.length }}</span>
          <span class="arrow">{{ isUnitsOpen ? '▲' : '▼' }}</span>
        </div>
      </div>

      <div v-if="isUnitsOpen" class="section-body">
        <!-- Selected -->
        <div v-if="filteredSelectedUnits.length">
          <strong style="color: #0601ab;">Selected:</strong>
          <div class="items">
            <div v-for="unit in filteredSelectedUnits" :key="unit.id">
              <input type="checkbox" v-model="unit.selected" /> {{ unit.name }}
            </div>
          </div>
        </div>

        <!-- Unselected -->
        <div class="unselected" v-if="filteredUnselectedUnits.length">
          <strong style="color: #91a1b0;">Unselected:</strong>
          <input v-model="unitSearch" placeholder="Search in units..." />
          <div class="items">
            <div v-for="unit in filteredUnselectedUnits" :key="unit.id">
              <input type="checkbox" v-model="unit.selected" /> {{ unit.name }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 🟦 Drivers Section -->
    <div class="section">
      <div class="section-header" @click.self="toggleSection('drivers')">
        <div class="selectAll">
          <input type="checkbox" :checked="allDriversSelected" @change.stop="toggleSelectAllDrivers" />
          <label>Select All Drivers</label>
        </div>
        <div class="selected">
          <span>Selected: {{ selectedDrivers.length }}</span>
          <span class="arrow">{{ isDriversOpen ? '▲' : '▼' }}</span>
        </div>
      </div>

      <div v-if="isDriversOpen" class="section-body">
        <!-- Selected -->
        <div v-if="filteredSelectedDrivers.length">
          <strong style="color: #0601ab;">Selected:</strong>
          <div class="items">
            <div v-for="driver in filteredSelectedDrivers" :key="driver.id">
              <input type="checkbox" v-model="driver.selected" /> {{ driver.name }}
            </div>
          </div>
        </div>

        <!-- Unselected -->
        <div class="unselected" v-if="filteredUnselectedDrivers.length">
          <strong style="color: #91a1b0;">Unselected:</strong>
          <input v-model="driverSearch" placeholder="Search in drivers..." />
          <div class="items">
            <div v-for="driver in filteredUnselectedDrivers" :key="driver.id">
              <input type="checkbox" v-model="driver.selected" /> {{ driver.name }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer Save Button -->
    <div class="footer">
      <button @click="saveTag"> Save</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
// import { getUnitsDroplist, getDriversDroplist } from '../stores/tags'
import api, { getUnitsDroplist, getDriversDroplist, addTag } from '../stores/tags'

// ======================
// 🔹 Tag Name
// ======================
const tagName = ref('')
const error = ref('')

// ======================
// 🔹 Units Section
// ======================
const units = ref([])
const unitSearch = ref('')
const isUnitsOpen = ref(true)

const drivers = ref([])
const driverSearch = ref('')
const isDriversOpen = ref(true)

// Fetch units
onMounted(async () => {
  try {
    const res = await getUnitsDroplist()
    if (res.status === 'success' && Array.isArray(res.result)) {
      units.value = res.result.map(item => ({
        id: item.id,
        name: item.name,
        selected: false,
      }))
    }
  } catch (err) {
    console.error('Failed to fetch units:', err)
  }

  // Fetch drivers too (same mount)
  try {
    const resDrivers = await getDriversDroplist()
    console.log(' Drivers Response:', resDrivers)

    if (resDrivers.status === 'success' && Array.isArray(resDrivers.result.data)) {
      drivers.value = resDrivers.result.data.map(item => ({
        id: item.id,
        name: item.name,
        selected: false,
      }))
    }
  } catch (err) {
    console.error('Failed to fetch drivers:', err)
  }
})

// Computed for units
const selectedUnits = computed(() => units.value.filter(v => v.selected))
const unselectedUnits = computed(() => units.value.filter(v => !v.selected))

const filteredSelectedUnits = computed(() =>
  selectedUnits.value.filter(v =>
    v.name.toLowerCase().includes(unitSearch.value.toLowerCase())
  )
)
const filteredUnselectedUnits = computed(() =>
  unselectedUnits.value.filter(v =>
    v.name.toLowerCase().includes(unitSearch.value.toLowerCase())
  )
)
const allUnitsSelected = computed(() => units.value.length > 0 && units.value.every(v => v.selected))

const toggleSelectAllUnits = () => {
  const newValue = !allUnitsSelected.value
  units.value.forEach(v => (v.selected = newValue))
}

// ======================
// 🔹 Drivers Section
// ======================


const selectedDrivers = computed(() => drivers.value.filter(v => v.selected))
const unselectedDrivers = computed(() => drivers.value.filter(v => !v.selected))

const filteredSelectedDrivers = computed(() =>
  selectedDrivers.value.filter(v =>
    v.name.toLowerCase().includes(driverSearch.value.toLowerCase())
  )
)
const filteredUnselectedDrivers = computed(() =>
  unselectedDrivers.value.filter(v =>
    v.name.toLowerCase().includes(driverSearch.value.toLowerCase())
  )
)
const allDriversSelected = computed(() => drivers.value.length > 0 && drivers.value.every(v => v.selected))

const toggleSelectAllDrivers = () => {
  const newValue = !allDriversSelected.value
  drivers.value.forEach(v => (v.selected = newValue))
}

// ======================
// 🔹 Toggle Sections
// ======================
const toggleSection = section => {
  if (section === 'units') isUnitsOpen.value = !isUnitsOpen.value
  else if (section === 'drivers') isDriversOpen.value = !isDriversOpen.value
}

// ======================
// 🔹 Save Tag
// ======================
const saveTag = async () => {
  if (!tagName.value.trim()) {
    error.value = 'Tag Name is required'
    return
  }
  error.value = ''

  // Prepare payload
  const payload = {
    name: tagName.value,
    vehicles: selectedUnits.value.map(v => v.id),   // array of selected unit ids
    drivers: selectedDrivers.value.map(d => d.id),  // array of selected driver ids
  }

 try {
    // استخدم الدالة من ملف tags
    const response = await addTag(payload)
    console.log('Tag saved:', response)
    alert('Tag saved successfully!')
    window.location.href = '/tags' // redirect
  } catch (err) {
    console.error('Failed to save tag:', err)
    alert('Failed to save tag. Please try again.')
  }
}
</script>

<style scoped>
.add-tag-page {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
}

.tagName {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

input {
  border: 1px solid #e6eaed;
  padding: 5px;
  border-radius: 5px;
}

input:focus {
  border-color: #0601ab;
  outline: none;
}

.error {
  color: red;
  font-size: 12px;
}

.section {
  border: 1px solid #ccc;
  border-radius: 5px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  padding: 10px;
  cursor: pointer;
  background: #f7f7f7;
}

.selectAll,
.selected {
  display: flex;
  gap: 5px;
  align-items: center;
}

.section-body {
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.unselected {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.items {
  max-height: 150px;
  overflow-y: auto;
  border-top: 1px solid #eee;
  padding-top: 5px;
}

.footer {
  display: flex;
  justify-content: flex-end;
}
</style>
