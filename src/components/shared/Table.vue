<template>
  <div class="base-table">
    <table>
      <thead>
        <tr>
          <th v-if="showCheckbox">
            <input type="checkbox" v-model="selectAll" @change="toggleAll" />
          </th>

          <th v-for="col in columns" :key="col.key">
            <div class="th-with-icon">
              <span>{{ col.label }}</span>
              <img
                v-if="col.icon"
                :src="ChevronIcon"
                alt="icon"
                class="header-icon"
                @click="$emit('icon-click', col)"
              />
            </div>
          </th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="(row, index) in data" :key="index">
          <td v-if="showCheckbox">
            <input type="checkbox" v-model="selectedRows" :value="row" />
          </td>

          <td v-for="col in columns" :key="col.key">
            <slot :name="`cell-${col.key}`" :value="row[col.key]" :row="row">
              {{ row[col.key] }}
            </slot>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import ChevronIcon from '../../assets/chevron-selector-vertical.svg';
export default {
  name: "BaseTable",
  props: {
    columns: { type: Array, required: true },
    data: { type: Array, required: true },
    showCheckbox: { type: Boolean, default: false }
  },
  data() {
    return {
      selectedRows: [],
      selectAll: false,
      ChevronIcon
    };
  },
  methods: {
    toggleAll() {
      this.selectAll
        ? (this.selectedRows = [...this.data])
        : (this.selectedRows = []);
    },
  },
};
</script>

<style scoped>
table {
  background-color: #ffffff;
  width: 100%;
  margin-top: 20px;
  border: 1px solid #d7dee4;
  border-collapse: separate;
  border-spacing: 0;
  font-size: 12px;
  border-radius: 6px;
  overflow: hidden;
}
thead {
  background-color: #f0f5fa;
  color: #50606e;
}
th, td {
  padding: 12px;
  text-align: left;
}
.th-with-icon {
  display: flex;
  align-items: center;
  gap: 6px;
}
.header-icon {
  width: 14px;
  height: 14px;
}
</style>
