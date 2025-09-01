<template>
  <table class="units-table">
    <thead>
      <tr>
        <th>
          <input type="checkbox" />
        </th>
        <th>
          <div class="th-with-icon">
            UNIT
            <img src="../assets/chevron-selector-vertical.svg" alt="icon" width="14" height="14" />
          </div>
        </th>
        <th>
          <div class="th-with-icon">

            DRIVER
            <img src="../assets/chevron-selector-vertical.svg" alt="icon" width="14" height="14" />
          </div>
        </th>
        <th>PHONE</th>
        <th>COLOR</th>
        <th>
          <div class="th-with-icon">

            MODEL
            <img src="../assets/chevron-selector-vertical.svg" alt="icon" width="14" height="14" />
          </div>
        </th>
        <th>
          <div class="th-with-icon">

            LAST UPDATE
            <img src="../assets/chevron-selector-vertical.svg" alt="icon" width="14" height="14" />
          </div>
        </th>
        <th>STATE</th>
        <th>DEVICES</th>
        <th>SIM</th>
      </tr>
    </thead>
    <tbody>
      <UnitRow v-for="unit in units" :key="unit.id" :unit="unit" />
    </tbody>
  </table>
</template>

<script>
import UnitRow from "./UnitRow.vue";

export default {
  name: "UnitsTable",
  props: {
    units: {
      type: Array,
      required: true
    }
  },
  components: { UnitRow }
};
</script>

<style>
.units-table {
  background-color: #ffffff;
  width: 100%;
  margin-top: 20px;
  border-radius: 5px;
  border: 1px solid #D7DEE4;
  padding: 0;
  border-collapse: collapse;
  font-size: 12px;

}

thead {
  background-color: #D7DEE4;
  color: #778897
}

th,
td {
  padding: 12px;
  text-align: left;
}

.th-with-icon {
  display: flex;
  align-items: self-start;
  justify-content: center;
  gap: 2px;

}

.units-table td {
  border-bottom: 1px solid #ddd;

}
</style>