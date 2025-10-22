<script setup>
import { useRoute } from 'vue-router';

import SideBar from './components/common/SideBar.vue'
import MainHeader from './components/common/Header.vue'
const route = useRoute();
import { ref } from 'vue'
const dynamicTitle = ref('')

</script>

<template>
  <div v-if="$route.meta.hideLayout">
    <router-view />
  </div>

  <div v-else class="containerApp">
    <SideBar />
    <div class="RightContent">
      <MainHeader :title="route.meta.title || pageTitle" />
      <router-view />

    </div>
  </div>
</template>

<style>
.containerApp {
  display: flex;
  align-items: flex-start;
}

.RightContent {
  background-color: #f0f5fa !important;
  width: 100%;
  padding: 10px 20px;
}
</style>