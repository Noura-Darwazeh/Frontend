<template>
  <div class="modal fade" :id="id" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content p-4">
        <!-- Header -->
        <div class="modal-header p-0 mb-3 pb-4 position-relative">
          <img src="../../assets/record/truck-01.svg" alt="unit icon" class="me-2" />
          <h5 class="modal-title">
            {{ mode === 'add' ? 'Add New Unit' : 'Edit Unit' }}
          </h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          <div class="header-line"></div>
        </div>

        <!-- Form -->
        <form @submit.prevent="handleSubmit">
          <!-- Unit Name & Fuel Type -->
          <div class="mb-3 row g-5">
            <div class="col">
              <label>Unit Name</label>
              <input v-model="localForm.name" type="text" placeholder="E.g Kia Sorento"
                class="form-control custom-input" />
            </div>

            <div class="col">
              <label>Fuel Type</label>
              <div class="d-flex ">
                <button type="button" class="btn leftBtn"
                  :class="localForm.fuel_type === 'petrol_95' ? 'btn-primary' : 'btn-outline-secondary'"
                  @click="localForm.fuel_type = 'petrol_95'">Petrol</button>
                <button type="button" class="btn rightBtn"
                  :class="localForm.fuel_type === 'diesel' ? 'btn-primary' : 'btn-outline-secondary'"
                  @click="localForm.fuel_type = 'diesel'">Diesel</button>
              </div>
            </div>
          </div>

          <!-- Unit Icon -->
          <div class="container-fluid p-0">
            <label class="form-label">Unit Icon</label>
            <Slider v-model="localForm.unitIcon" />
          </div>

          <!-- Tank Capacity & Unit Model -->
          <div class="mb-3 mt-3 row g-2">
            <div class="col">
              <label>Tank Capacity</label>
              <input v-model="localForm.tank_capacity" type="number" placeholder="300"
                class="form-control custom-input" />
            </div>
            <div class="col">
              <label>Unit Model</label>
              <div class="app">
                <MyDatepicker v-model="localForm.unitModel" />
              </div>
            </div>
          </div>

          <!-- Engine Serial & Chassis -->
          <div class="mb-3 row g-2">
            <div class="col">
              <label>Engine Serial Number</label>
              <input v-model="localForm.engine_serial_number" type="text" placeholder="E.g 498 - 02358"
                class="form-control custom-input" />
            </div>
            <div class="col">
              <label>Chassis Serial Number</label>
              <input v-model="localForm.chassis_serial_number" type="text" placeholder="E.g 1HGBH41JXMN109186"
                class="form-control custom-input" />
            </div>
          </div>

          <!-- Oil Consumption -->
          <div class="mb-3 row g-2">
            <div class="col">
              <label>Oil Consumption(liter/Km)</label>
              <input v-model="localForm.oil_consumption" type="text" placeholder="E.g 60"
                class="form-control custom-input" />
            </div>
          </div>

          <!-- Vehicle Color -->
          <div class="mb-3">
            <label class="form-label">Vehicle Color</label>
            <div class="d-flex gap-3 flex-wrap">
              <span v-for="color in colors" :key="color" :style="{ backgroundColor: color }"
                :class="['rounded-circle border', localForm.color === color ? 'border-primary' : 'border-0']"
                style="width: 24px; height: 24px; cursor:pointer;" @click="localForm.color = color"></span>
              <button class="addColor">
                <img src="../../assets/record/Icon.svg" alt="unit icon" class="me-2" />
              </button>
            </div>
          </div>

          <!-- License & Insurance -->
          <div class="mb-3 mt-3 row g-2">
            <div class="col">
              <label>License Expiry At</label>
              <div class="app">
                <MyDatepicker v-model="localForm.licenseExpiry" />
              </div>
            </div>
            <div class="col">
              <label>Insurance Expiry At</label>
              <div class="app">
                <MyDatepicker v-model="localForm.insuranceExpiry" />
              </div>
            </div>
          </div>

          <!-- Tags -->
          <div class="mb-3 row g-2">
            <div class="col">
              <label>Tags</label>
              <div class="input-with-icon">
                <img src="../../assets/record/search.svg" alt="unit icon" />
                <input v-model="localForm.tags" type="text" placeholder="Search for tags"
                  class="form-control custom-input" style="border:none !important" />
              </div>
            </div>
          </div>

          <!-- Buttons -->
          <div class="addOrCancel">
            <button type="button" class="cancelBtn" data-bs-dismiss="modal">Cancel</button>
            <button type="submit" class="addBtn">{{ mode === 'add' ? 'Add' : 'Save' }}</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, watch } from 'vue'
import Slider from './Slider.vue'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import MyDatepicker from "./Calender.vue";

const props = defineProps({
  id: { type: String, required: true },
  mode: { type: String, default: "add" }, // add | edit
  modelValue: { type: Object, default: () => ({}) },
})

const emit = defineEmits(["update:modelValue", "submit"])

const colors = ref([
  "#000000","#FFFFFF","#FF0000","#0000FF","#008000","#FFFF00","#FFA500","#808080",
])

const localForm = reactive({
  name: "",
  fuel_type: "diesel",
  unitIcon: "",
  tank_capacity: "",
  unitModel: "",
  engine_serial_number: "",
  chassis_serial_number: "",
  oil_consumption: "",
  color: "",
  licenseExpiry: "",
  insuranceExpiry: "",
  tags: "",
  ...props.modelValue
})

watch(
  () => props.modelValue,
  (newVal) => {
    if (!newVal) return;
    Object.assign(localForm, {
      ...newVal,
      unitModel: newVal.model ? new Date(newVal.model + "-01-01") : null,
      licenseExpiry: newVal.license_expiry_at ? new Date(newVal.license_expiry_at) : null,
      insuranceExpiry: newVal.insurance_expiry_at ? new Date(newVal.insurance_expiry_at) : null,
    })
  },
  { deep: true }
)

function handleSubmit() {
  emit("submit", localForm)
}
</script>
<style scoped>
.modal-header {
  border: none !important;
}

.header-line {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 1px;
  background-color: #e1e9f0;
  z-index: 1;
}

.btn-close {
  filter: brightness(0) saturate(100%) invert(79%) sepia(7%) saturate(485%) hue-rotate(167deg) brightness(87%) contrast(93%) !important;
}

label {
  color: #778897;
  margin-bottom: 5px;
}

.custom-input {
  border: 1px solid #BDC8D1 !important;
}

.custom-input::placeholder {
  color: #BDC8D1 !important;
  opacity: 1;
}

.btn {
  padding: 6px 70px !important;
}

.leftBtn {
  border-top-right-radius: 0 !important;
  border-bottom-right-radius: 0 !important;
}

.rightBtn {
  border-top-left-radius: 0 !important;
  border-bottom-left-radius: 0 !important;
}

.btn-primary {
  background-color: #d9e8f1 !important;
  color: #0568A0 !important;
  border: 1px solid #0568A0 !important;
}

.btn-outline-secondary {
  color: #BDC8D1 !important;
  border: 1px solid #BDC8D1 !important;
}

.border-primary {
  border: 2px solid #0568A0 !important;
}

.addColor {
  width: 24px;
  height: 24px;
  border: 1px solid #D7DEE4;
  border-radius: 8px;
  background-color: #ffffff;
  display: flex;
  align-items: center;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.15);
}

.input-with-icon {
  display: flex;
  align-items: center;
  gap: 0px;
  border: 1px solid #BDC8D1;
  border-radius: 8px;
  padding: 5px;
}

.input-with-icon img {
  width: 20px;
  height: 20px;
}

.addOrCancel {
  display: flex;
  justify-content: space-between;
  margin-top: 40px;
}

.cancelBtn {
  background-color: #ffffff;
  border: 1px solid #D7DEE4;
  border-radius: 6px;
  padding: 10px 15px;
  box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.15);
}

.addBtn {
  background-color: #D7DEE4;
  color: #ffffff;
  border: none;
  border-radius: 6px;
  padding: 10px 15px;
}

.dateInput {
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid #D7DEE4;

}

.date-input {
  border: none;
}

.calender-btn {
  border: none;
  background-color: transparent;
}
</style>