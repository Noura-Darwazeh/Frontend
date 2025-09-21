<template>
  <div class="d-flex align-items-center">
    <img src="../../assets/record/vehicle.svg" width="56" class="me-2 mt-2" alt="car-icon" />
    <div>
      <div class="d-flex align-items-center gap-2">

        <h5 class="fw-bold fs-3 mb-0">Vehicle3</h5>
        <VehicleOnOff :isOn="true" :icon="OnOffIcon" bgColor="#dbf5ec" />

        <VehicleSpeed :value="73" />
      </div>
      <!-- <VehicleOnOff :isOn="false" :icon="OnOffIcon" bgColor="#d7dee4" /> -->
       <small class="d-flex align-items-center gap-2 fs-6" >
        <img :src="checkIcon" alt="check-icon" />
        <span :style="{ color: infoColor }">{{ statusText }}</span>-<span class="lastTime">{{ lastSynced }}</span>
      </small>
    </div>
  </div>
</template>

<script setup>
import VehicleSpeed from './VehicleSpeed.vue';
import VehicleOnOff from './VehicleOnOff.vue';
import OnOffIcon from '../../assets/record/onoff.svg';
const props = defineProps({

  checkIcon: String,
  statusText: String,
  lastSynced: String,
  infoColor: String
});

</script>

<style scoped>
.lastTime{
  color:#778797;
  
}
span{
  font-size: 14px;
}
</style>