<script setup>
import UnitsTable from './components/UnitsTable.vue'
import SideBar from './components/SideBar.vue'
import Btn from './components/Button.vue'
import AddIcon from './assets/Switch.svg'
import RefreshIcon from './assets/refresh.svg'
import TrashIcon from './assets/trash-01.svg'
import CircularButton from './components/CircularButton.vue'
import NotificationIcon from './assets/notification.svg'
import LanguageIcon from './assets/language.svg'
import SelectBtn from './components/Select.vue'
import Search from './components/SearchBox.vue'
import PlusIcon from './assets/plus.svg'

const units = [
  { id: 1, unit: 'Ruptela testing', driver: 'Sam Jameson', phone: '+972569805716', color: '#B92D2D', model: '2024', lastUpdate: '13:34:33 2023-06-24', state: 'ON', devices: 2, sim: '+972569805716' },
  { id: 2, unit: 'SDF', driver: 'Jenna Walker', phone: '+972569805716', color: 'black', model: '2023', lastUpdate: '13:34:33 2023-06-24', state: 'OFF', devices: 3, sim: '+972569805716' },
  { id: 3, unit: 'Active Vehicle 3', driver: 'Janni Olsson', phone: '+972569805716', color: 'white', model: '2021', lastUpdate: '13:34:33 2023-06-24', state: 'ON', devices: 1, sim: '+972569805716' },
  { id: 4, unit: 'Active Vehicle 2', driver: 'Thomas Pellewever', phone: '+972569805716', color: 'black', model: '2022', lastUpdate: '13:34:33 2023-06-24', state: 'ON', devices: 0, sim: '+972569805716' },
  { id: 5, unit: 'Active Vehicle 2', driver: 'Thomas Pellewever', phone: '+972569805716', color: '#ffffff', model: '2022', lastUpdate: '13:34:33 2023-06-24', state: 'ON', devices: 0, sim: '+972569805716' },
  { id: 6, unit: 'Active Vehicle 2', driver: 'Thomas Pellewever', phone: '+972569805716', color: '#BDC8D1', model: '2022', lastUpdate: '13:34:33 2023-06-24', state: 'ON', devices: 0, sim: '+972569805716' },
  { id: 7, unit: 'Active Vehicle 2', driver: 'Thomas Pellewever', phone: '+972569805716', color: '#BDC8D1', model: '2022', lastUpdate: '13:34:33 2023-06-24', state: 'ON', devices: 0, sim: '+972569805716' },

]
</script>

<template>
  <div class="container">
    <SideBar />
    <div class="mainContent">

      <div class="header">
        <h2>Units</h2>
        <div class="headerRightSide">
          <CircularButton :icon="NotificationIcon" />
          <CircularButton :icon="LanguageIcon" />
          <CircularButton :icon="LanguageIcon" />
          <SelectBtn label="Amer Amin" bg-color="transparent" selectBorder="none" />

        </div>
      </div>


      <div class="toolbar">
        <div class="rightSection">
          <Search />
          <SelectBtn label="Group" />
          <Btn label="Sort" :iconRight="AddIcon" @click="addUnit" />

          <SelectBtn label="All Units" />

          <Btn label="Export" @click="exportUnits" />
          <Btn :iconRight="RefreshIcon" @click="addUnit" />
          <Btn label="Deleted Items" :iconLeft="TrashIcon" @click="addUnit" />
        </div>

        <Btn :iconLeft="PlusIcon" label="Add Unit" bg-color="#10B981" color="#fff" />
      </div>
      <UnitsTable :units="units" />
    </div>
  </div>
</template>

<style>
.container {
  display: flex;
  align-items: self-start;

}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.headerRightSide {
  display: flex;
  gap: 7px;
}

.mainContent {
  padding: 0 20px;
  width: 100%;
}

.toolbar {
  display: flex;
  justify-content: space-between;
}

.rightSection {
  display: flex;
  gap: 7px;
}
</style>