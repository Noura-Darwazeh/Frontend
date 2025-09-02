<template>
  <div class="sidebar-container" :class="{ collapsed: isCollapsed }">
    <div class="toggle-btn" @click="toggleSidebar">
      <img v-if="!isCollapsed" src="../../assets/drive.svg" alt="collapse" width="8" height="8" />
      <span v-else>›</span>
    </div>

    <div class="sidebar">
      <div class="logo" v-if="!isCollapsed">
        <img src="../../assets/logo.svg" alt="PITS4 Logo" />
      </div>

      <nav>
        <ul>
          <li :class="{ active: activeItem === 'dashboard' }">
            <a href="#" @click.prevent="setActive('dashboard')">
              <img class="icon" src="../../assets/dashboard.svg" alt="" />
              <span v-if="!isCollapsed">Dashboard</span>
            </a>
          </li>
          <li :class="{ active: activeItem === 'units' }">
            <a href="#" @click.prevent="setActive('units')">
              <img class="icon" src="../../assets/units.svg" alt="" />
              <span v-if="!isCollapsed">Units</span>
            </a>
          </li>
          <li :class="{ active: activeItem === 'drivers' }">
            <a href="#" @click.prevent="setActive('drivers')">
              <img class="icon" src="../../assets/drivers.svg" alt="" />
              <span v-if="!isCollapsed">Drivers</span>
            </a>
          </li>
          <li :class="{ active: activeItem === 'map' }">
            <a href="#" @click.prevent="setActive('map')">
              <img class="icon" src="../../assets/map.svg" alt="" />
              <span v-if="!isCollapsed">Map</span>
            </a>
          </li>
          <li :class="{ active: activeItem === 'areas' }">
            <a href="#" @click.prevent="setActive('areas')">
              <img class="icon" src="../../assets/areas.svg" alt="" />
              <span v-if="!isCollapsed">Areas</span>
            </a>
          </li>
          <li :class="{ active: activeItem === 'customers' }">
            <a href="#" @click.prevent="setActive('customers')">
              <img class="icon" src="../../assets/Customers.svg" alt="" />
              <span v-if="!isCollapsed">Customers</span>
            </a>
          </li>
          <li :class="{ active: activeItem === 'devices' }">
            <a href="#" @click.prevent="setActive('devices')">
              <img class="icon" src="../../assets/Devices and Providers.svg" alt="" />
              <span v-if="!isCollapsed">Devices and Providers</span>
            </a>
          </li>
          <li :class="{ active: activeItem === 'maintenance' }">
            <a href="#" @click.prevent="setActive('maintenance')">
              <img class="icon" src="../../assets/Maintenance.svg" alt="" />
              <span v-if="!isCollapsed">Maintenance</span>
            </a>
          </li>
          <li :class="{ active: activeItem === 'notifications' }">
            <a href="#" @click.prevent="setActive('notifications')">
              <img class="icon" src="../../assets/Notification Settings.svg" alt="" />
              <span v-if="!isCollapsed">Notification Settings</span>
            </a>
          </li>
        </ul>
      </nav>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeItem: "units",
      isCollapsed: false,
    };
  },
  methods: {
    setActive(item) {
      this.activeItem = item;
    },
    toggleSidebar() {
      this.isCollapsed = !this.isCollapsed;
    },
  },
};
</script>

<style scoped>
.sidebar-container {
  display: flex;
  position: relative;
}

.sidebar {
  width: 250px;
  background-color: #ffffff;
  padding: 20px;
  height: 100vh;
  transition: width 0.3s ease;
  border-right: 1px solid #e5e7eb;
}

.sidebar-container.collapsed .sidebar {
  width: 70px;
  padding: 20px 10px;
}

.logo img {
  width: 100px;
  margin-bottom: 20px;
  display: block;
}

nav ul {
  list-style: none;
  padding: 0;
}

nav ul li a {
  padding: 10px;
  text-decoration: none;
  color: #778897;
  display: flex;
  align-items: center;
  font-size: 16px;
  border-radius: 5px;
}

nav ul li a .icon {
  margin-right: 10px;
  filter: brightness(0) saturate(100%) invert(54%) sepia(7%) saturate(979%) hue-rotate(167deg) brightness(97%) contrast(85%);
}

nav ul li.active a {
  color: #ffffff;
  background-color: #0568A0;
  font-weight: bold;
}

nav ul li.active a .icon {
  filter: brightness(0) saturate(100%) invert(100%) sepia(86%) saturate(0%) hue-rotate(53deg) brightness(103%) contrast(102%);
}

.toggle-btn {
  position: absolute;
  right: 0px;
  top: 40px;
  background: #E1E9F0;
  border-radius: 5px 0 0 5px;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #555;
  font-weight: bold;
  transition: 0.2s;
  z-index: 10;
  border: none
}
</style>
