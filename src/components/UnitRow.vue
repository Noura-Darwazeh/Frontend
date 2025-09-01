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
      <div class="simBox">
        {{ unit.sim }}
        <img src="../assets/dots-horizontal.svg" alt="icon" width="14" height="14" />

      </div>
    </td>

  </tr>
</template>

<script>
export default {
  name: "UnitRow",
  props: {
  unit: {
    type: Object,
    required: true
  }
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
  padding: 10px;
  border-radius: 50%;
  font-weight: bold;
}

.state.off {
  color: #50606e;
  background-color: #e4ebf2;
  padding: 8px;
  border-radius: 50%;
  font-weight: bold;
}

.simBox {
  display: flex;
  gap: 15px
}
</style>
