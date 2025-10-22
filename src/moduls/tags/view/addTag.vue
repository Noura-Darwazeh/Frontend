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
import { ref, computed, onMounted, nextTick, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getUnitsDroplist, getDriversDroplist, addTag, getTagById, updateTag } from '../stores/tags'

const route = useRoute();
const router = useRouter();

// make editId reactive so component reacts when query changes
const tagId = computed(() => route.query.editId || null)

// Tag Name
const tagName = ref('')
const error = ref('')

// Units Section
const units = ref([])
const unitSearch = ref('')
const isUnitsOpen = ref(true)

// Drivers Section
const drivers = ref([])
const driverSearch = ref('')
const isDriversOpen = ref(true)

// Helper to set document title and route meta and dispatch an event for parent header
const setTitle = (title) => {
  // update document title
  document.title = title

  // try to update current route meta (useful if header reads route.meta.title)
  if (router && router.currentRoute && router.currentRoute.value) {
    router.currentRoute.value.meta = { ...router.currentRoute.value.meta, title }
  }

  // dispatch event in case parent layout listens to it to update its header
  try {
    window.dispatchEvent(new CustomEvent('update-header-title', { detail: title }))
  } catch (e) {
    // ignore
  }
}

// Fetch Units & Drivers
const fetchUnitsAndDrivers = async () => {
  try {
    const [resUnits, resDrivers] = await Promise.all([getUnitsDroplist(), getDriversDroplist()])

    if (resUnits.status === 'success' && Array.isArray(resUnits.result)) {
      units.value = resUnits.result.map(u => ({ id: u.id, name: u.name, selected: false }))
    }

    if (resDrivers.status === 'success' && Array.isArray(resDrivers.result.data)) {
      drivers.value = resDrivers.result.data.map(d => ({ id: d.id, name: d.name, selected: false }))
    }

  } catch (err) {
    console.error('Failed to fetch units or drivers:', err)
  }
}

// Load Tag for Edit
const loadTagData = async (id) => {
  try {
    const res = await getTagById(id)
    if (res?.result) {
      const tag = res.result
      console.log("info edit:", tag)
      tagName.value = tag.name || ''

      units.value.forEach(u => {
        u.selected = (tag.vehicles || []).map(v => String(v)).includes(String(u.id))
      })
      drivers.value.forEach(d => {
        d.selected = (tag.drivers || []).map(x => String(x)).includes(String(d.id))
      })

      // set title with tag name for clarity
      setTitle(`Edit Tag - ${tag.name || 'Untitled'}`)

      await nextTick()
    }
  } catch (err) {
    console.error('Failed to load tag for edit:', err)
  }
}

// Mounted
onMounted(async () => {
  await fetchUnitsAndDrivers()
  if (tagId.value) {
    await loadTagData(tagId.value)
  } else {
    setTitle('Add Tag')
  }
})

// Update title when tagName changes while editing
watch(tagName, (newVal) => {
  if (tagId.value) {
    setTitle(`Edit Tag - ${newVal || 'Untitled'}`)
  }
})

// Watch route changes (react to query change)
watch(() => route.fullPath, async () => {
  const newEditId = route.query.editId || null
  if (newEditId) {
    // reload data for new id
    await fetchUnitsAndDrivers()
    await loadTagData(newEditId)
  } else {
    // switched to add
    tagName.value = ''
    units.value.forEach(u => u.selected = false)
    drivers.value.forEach(d => d.selected = false)
    setTitle('Add Tag')
  }
})

// Computed
const selectedUnits = computed(() => units.value.filter(u => u.selected))
const unselectedUnits = computed(() => units.value.filter(u => !u.selected))
const filteredSelectedUnits = computed(() => selectedUnits.value.filter(u => u.name.toLowerCase().includes(unitSearch.value.toLowerCase())))
const filteredUnselectedUnits = computed(() => unselectedUnits.value.filter(u => u.name.toLowerCase().includes(unitSearch.value.toLowerCase())))
const allUnitsSelected = computed(() => units.value.length > 0 && units.value.every(u => u.selected))
const toggleSelectAllUnits = () => {
  const newValue = !allUnitsSelected.value
  units.value.forEach(u => u.selected = newValue)
}

const selectedDrivers = computed(() => drivers.value.filter(d => d.selected))
const unselectedDrivers = computed(() => drivers.value.filter(d => !d.selected))
const filteredSelectedDrivers = computed(() => selectedDrivers.value.filter(d => d.name.toLowerCase().includes(driverSearch.value.toLowerCase())))
const filteredUnselectedDrivers = computed(() => unselectedDrivers.value.filter(d => d.name.toLowerCase().includes(driverSearch.value.toLowerCase())))
const allDriversSelected = computed(() => drivers.value.length > 0 && drivers.value.every(d => d.selected))
const toggleSelectAllDrivers = () => {
  const newValue = !allDriversSelected.value
  drivers.value.forEach(d => d.selected = newValue)
}

const pageTitle = computed(() => {
  return tagId.value ? 'Edit Tag' : 'Add Tag';
});

// combine page title with the tag name for visible header inside this component
const pageTitleWithName = computed(() => {
  if (tagId.value) {
    return `Edit Tag${tagName.value ? ' - ' + tagName.value : ''}`
  }
  return 'Add Tag'
})

// Toggle Sections
const toggleSection = (section) => {
  if (section === 'units') isUnitsOpen.value = !isUnitsOpen.value
  else if (section === 'drivers') isDriversOpen.value = !isDriversOpen.value
}

// Save Tag
const saveTag = async () => {
  if (!tagName.value.trim()) {
    error.value = 'Tag Name is required'
    return
  }
  error.value = ''

  const payload = {
    name: tagName.value,
    vehicles: selectedUnits.value.map(u => u.id),
    drivers: selectedDrivers.value.map(d => d.id)
  }

  try {
    if (tagId.value) {
      await updateTag(tagId.value, payload)
      alert('Tag updated successfully!')
    } else {
      await addTag(payload)
      alert('Tag added successfully!')
    }
    router.push({ name: 'tags' })
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
