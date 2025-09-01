<template>
  <div class="sidebar">
    <div class="logo">
      <img src="../assets/logo.svg" alt="PITS4 Logo" />
    </div>
    <nav>
      <ul>
        <li :class="{ 'active': activeItem === 'dashboard' }">
          <a href="#" @click.prevent="setActive('dashboard')">
            <img class="icon" src="../assets/dashboard.svg" alt="" />Dashboard
          </a>
        </li>
        <li :class="{ 'active': activeItem === 'units' }">
          <a href="#" @click.prevent="setActive('units')">
            <img class="icon" src="../assets/units.svg" alt="" /> Units
          </a>
        </li>
        <li :class="{ 'active': activeItem === 'drivers' }">
          <a href="#" @click.prevent="setActive('drivers')">
            <img class="icon" src="../assets/drivers.svg" alt="" /> Drivers
          </a>
        </li>
        <li :class="{ 'active': activeItem === 'map' }">
          <a href="#" @click.prevent="setActive('map')">
            <img class="icon" src="../assets/map.svg" alt="" /> Map
          </a>
        </li>
        <li :class="{ 'active': activeItem === 'areas' }">
          <a href="#" @click.prevent="setActive('areas')">
            <img class="icon" src="../assets/areas.svg" alt="" /> Areas
          </a>
        </li>
        <li :class="{ 'active': activeItem === 'customers' }">
          <a href="#" @click.prevent="setActive('customers')">
            <img class="icon" src="../assets/Customers.svg" alt="" /> Customers
          </a>
        </li>
        <li :class="{ 'active': activeItem === 'devices' }">
          <a href="#" @click.prevent="setActive('devices')">
            <img class="icon" src="../assets/Devices and Providers.svg" alt="" /> Devices and Providers
          </a>
        </li>
        <li :class="{ 'active': activeItem === 'maintenance' }">
          <a href="#" @click.prevent="setActive('maintenance')">
            <img class="icon" src="../assets/Maintenance.svg" alt="" /> Maintenance
          </a>
        </li>
        <li :class="{ 'active': activeItem === 'notifications' }">
          <a href="#" @click.prevent="setActive('notifications')">
            <img class="icon" src="../assets/Notification Settings.svg" alt="" /> Notification Settings
          </a>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeItem: 'units'
    };
  },
  methods: {
    setActive(item) {
      this.activeItem = item;
    }
  }
};
</script>

<style scoped>
.sidebar {
  width: 250px;
  background-color: #ffffff;
  padding: 20px 20px;
  height: 100vh;
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
}

nav ul li a .icon {
  margin-right: 10px;
}

nav ul li.active a {
  color: #ffffff;
  background-color: #0568A0;
  font-weight: bold;
  border-radius: 5px;
}
</style>