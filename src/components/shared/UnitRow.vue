<template>
  <tr>
    <td>
      <div class="checkBox">
        <input type="checkbox" />
        <p>{{ unit.id }}</p>
      </div>
    </td>
    <td><a href="#">{{ unit.unit }}</a></td>
    <td>{{ unit.driver }}</td>
    <td class="lightLine">{{ unit.phone }}</td>
    <td class="centerLine">
      <span class="color-circle" :style="{ backgroundColor: unit.color, border: '1px solid #dddddd' }"></span>
    </td>
    <td class="lightLine ">{{ unit.model }}</td>
    <td class="lightLine">{{ unit.lastUpdate }}</td>
    <td>
      <span :class="['state', unit.state === 'ON' ? 'on' : 'off']">{{ unit.state }}</span>
    </td>
    <td class="lightLine centerLine">{{ unit.devices }}</td>
    <td class="lightLine">
      {{ unit.sim }}

    </td>
    <td>
      <V />
    </td>

  </tr>
</template>

<script>
import V from './OptionsColoumn.vue'

export default {
  name: "UnitRow",
  props: {
    unit: {
      type: Object,
      required: true
    }
  },
  components: {
    V
  }
};
</script>

<style scoped>
a {
  color: #0568A0;
}

.lightLine {
  color: #8D9DAB;
}

.centerLine {
  text-align: center;
}

.checkBox {
  display: flex;
  align-items: center;
  gap: 15px;
  color: #8D9DAB
}

.color-circle {
  width: 24px;
  height: 24px;
  display: inline-block;
  border-radius: 50%;
}

.state.on {
  color: #10B981;
  background-color: #dbf5ec;
  padding: 2px 8px;
  border-radius: 10px;
  font-weight: bold;
}

.state.off {
  color: #50606e;
  background-color: #e4ebf2;
  padding: 2px 8px;
  border-radius: 10px;
  font-weight: bold;
}

.simBox {
  display: flex;
  gap: 15px
}

td {
  vertical-align: middle;
  overflow: visible;
}
</style>
