<template>
  <div class="modal fade" id="unitModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-lg modal-dialog-centered">
      <div class="modal-content p-3">

        <!-- Header -->
        <div class="modal-header border-0 p-0 mb-3">
          <h5>Edit Unit</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>

        <form @submit.prevent="handleSubmit">
          <div class="modal-body">
            <div class="container-fluid">
              <!-- Vehicle Name & Fuel Type -->
              <div class="row info-row">
                <div class="col-6">
                  <label>Vehicle Name</label>
                  <input type="text" v-model="localUnit.name" class="form-control" />
                </div>
                <div class="col-6">
                  <label>Fuel Type</label>
                  <select v-model="localUnit.fuel_type" class="form-control">
                    <option>Petrol</option>
                    <option>Diesel</option>
                  </select>
                </div>
              </div>

              <!-- Tank & Model -->
              <div class="row info-row">
                <div class="col-6">
                  <label>Tank Capacity</label>
                  <input type="number" v-model="localUnit.tank_capacity" class="form-control" />
                </div>
                <div class="col-6">
                  <label>Vehicle Model</label>
                  <input type="text" v-model="localUnit.model" class="form-control" />
                </div>
              </div>

              <!-- Engine & Chassis -->
              <div class="row info-row">
                <div class="col-6">
                  <label>Chassis Serial Number</label>
                  <input type="text" v-model="localUnit.chassis_serial_number" class="form-control" />
                </div>
                <div class="col-6">
                  <label>Engine Serial Number</label>
                  <input type="text" v-model="localUnit.engine_serial_number" class="form-control" />
                </div>
              </div>

              <!-- Oil Consumption -->
              <div class="row info-row">
                <div class="col-6">
                  <label>Oil Consumption(liter/Km)</label>
                  <input type="text" v-model="localUnit.oil_consumption" class="form-control" />
                </div>
              </div>

              <!-- License & Insurance -->
              <div class="row info-row">
                <div class="col-6">
                  <label>License Expiry</label>
                  <input type="date" v-model="localUnit.license_expiry_at" class="form-control" />
                </div>
                <div class="col-6">
                  <label>Insurance Expiry</label>
                  <input type="date" v-model="localUnit.insurance_expiry_at" class="form-control" />
                </div>
              </div>

              <!-- Vehicle Color -->
              <div class="row info-row">
                <div class="col-6">
                  <label>Vehicle Color</label>
                  <div class="d-flex gap-2 flex-wrap">
                    <span
                      v-for="color in colors"
                      :key="color"
                      :style="{ backgroundColor: color }"
                      :class="['rounded-circle border', localUnit.color === color ? 'border-primary' : 'border-0']"
                      style="width:24px;height:24px;cursor:pointer"
                      @click="localUnit.color = color"
                    ></span>
                  </div>
                </div>
                <div class="col-6">
                  <label>Vehicle Icon</label>
                  <input type="text" v-model="localUnit.icon" class="form-control" />
                </div>
              </div>

              <!-- Tags -->
              <div class="row info-row">
                <div class="col-12">
                  <label>Tags</label>
                  <input type="text" v-model="localUnit.tags" class="form-control" />
                </div>
              </div>

            </div>
          </div>

          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
            <button type="submit" class="btn btn-primary">Save</button>
          </div>
        </form>

      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, watch } from 'vue'

const props = defineProps({
  modelValue: { type: Object, default: () => ({}) }
})

const emit = defineEmits(["update:modelValue", "submit"])

const colors = ["#000000","#FFFFFF","#FF0000","#0000FF","#008000","#FFFF00","#FFA500","#808080"]

const localUnit = reactive({
  name: '',
  fuel_type: 'Diesel',
  tank_capacity: '',
  model: '',
  chassis_serial_number: '',
  engine_serial_number: '',
  oil_consumption: '',
  license_expiry_at: '',
  insurance_expiry_at: '',
  color: '',
  icon: '',
  tags: '',
  ...props.modelValue
})

// كل مرة يتغير modelValue من الاب يتم تحديث localUnit
watch(() => props.modelValue, (newVal) => {
  Object.assign(localUnit, newVal)
}, { deep: true })

function handleSubmit() {
  emit("submit", localUnit)
}
</script>

<style scoped>
.info-row { margin-bottom: 10px; }
.border-primary { border: 2px solid #0568A0; }
</style>
