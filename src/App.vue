<script setup>
import UnitsTable from './moduls/units/view/units.vue'
import SideBar from './components/common/SideBar.vue'
import MainHeader from './components/common/Header.vue'
</script>

<template>
  <div class="container">
    <SideBar />
    <div class="RightContent">
      <MainHeader />
      <UnitsTable :units="units" />
    </div>
  </div>
</template>

<style>
.container {
  display: flex;
  align-items: self-start;
}

.RightContent{
  width: 100%;
  padding: 0 20px;
}
</style>