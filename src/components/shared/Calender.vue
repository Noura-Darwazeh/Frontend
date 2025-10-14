<template>
  <div class="app">
    <Datepicker v-model="internalDate" :enable-time-picker="false"  />

  </div>
</template>

<script setup>
import { ref, watch, defineProps, defineEmits } from "vue";
import Datepicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";

const props = defineProps({
  modelValue: { type: [Date, null], default: null }
})
const emit = defineEmits(["update:modelValue"]);

const internalDate = ref(props.modelValue);

// لو تغير modelValue من الأب، حدّث internalDate
watch(() => props.modelValue, val => {
  internalDate.value = val ? new Date(val) : null;
});

// لما المستخدم يغيّر التاريخ، نرسل القيمة للأب
watch(internalDate, val => {
  emit("update:modelValue", val);
});

function yearOnlyFormatter(date) {
  if (!date) return '';
  return new Date(date).getFullYear();
}
</script>

<!-- <template>
  <Datepicker v-model="internalDate" :enable-time-picker="false" :format="yearOnlyFormatter" />
</template> -->


<style>
.dp__theme_light {
  --dp-primary-color: #f0f5fa;
  --dp-text-color: #21282e;
  --dp-border-radius: 6px;
}

.dp__theme_light button {
  font-weight: 700;

}

.dp__month_year_select {
  display: flex !important;
  gap: 0 !important;
  padding: 0 !important;
}

.dp__month_year_wrap {
  display: flex !important;
  gap: 0 !important;
}

.dp__month_year_wrap button[data-dp-element="overlay-month"] {
  width: 40px !important;
  margin-left: 70px !important;
}

.dp__month_year_wrap button[data-dp-element="overlay-year"] {
  width: 40px !important;
}

.dp__cell_inner:hover {
  background-color: #c1d9e7;
}

.dp--arrow-btn-nav {
  padding: 2px !important;
  border: 1px solid #D7DEE4;
  border-radius: 6px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);

}

.dp__calendar_header {
  border: none !important;
}

.dp__instance_calendar {
  padding: 10px;
}

.dp__calendar_header_item {
  color: #8D9DAB !important;
  font-size: 12px;
  font-weight: 400;
}

.dp__calendar_header_separator {
  background-color: #ffffff !important;
}

.dp--past {
  color: #BDC8D1 !important;
}

.dp__active_date {
  background-color: #0568A0 !important;
  color: #ffffff !important;
}

.dp--future {
  background-color: #f0f5fa;

}

.dp__cell_inner {
  margin-right: 5px !important;
}

.dp__cell_offset {
  background-color: #ffffff !important;
}

.dp__today {
  border: none !important;
  background-color: #f0f5fa;

}

.dp__overlay_cell_pad {
  background-color: #f0f5fa !important;
}

.dp__overlay_cell_active {
  background-color: #0568a0 !important;
  color: #ffffff !important
}

.dp__action_button.dp__action_cancel {
  display: none !important;
}

.dp__action_button.dp__action_select {
  background-color: #10B981 !important;
  padding: 20px !important;
  font-size: 16px !important;
}

.dp__selection_preview {
  font-weight: 700;
  font-size: 16px;
}

.dp__input_icon_pad {
  text-align: left;
  position: relative;
  padding: 6px;

}

.dp--clear-btn {
  display: none;
}

.dp__input_icon {
  left: auto !important;
  right: 5px !important;
  cursor: pointer;
}
</style>
