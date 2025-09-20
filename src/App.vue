<script setup>
import UnitsTable from './moduls/units/view/units.vue'
import SideBar from './components/common/SideBar.vue'
import MainHeader from './components/common/Header.vue'
</script>

<template>
  <div class="containerApp">
    <SideBar />
    <div class="RightContent">
      <MainHeader />
      <UnitsTable :units="units" />
    </div>
  </div>
</template>

<style>
.containerApp {
  display: flex;
  align-items: self-start;
}

.RightContent{
  background-color: #f0f5fa !important;
  width: 100%;
  padding: 10px 20px;
}
</style>