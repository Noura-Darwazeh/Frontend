<template>
  <div class="multi-select">
    <img src="../../assets/dots-horizontal.svg" @click="toggleDropdown" alt="icon" width="14" height="14" />
    <div v-if="isOpen" class="options">
      <label v-for="(option, index) in options" :key="index" class="option" :class="{ active: option === activeOption }"
        @click="setActive(option)">
        <img :src="optionIcons[index]" class="option-icon" :class="{ 'icon-active': option === activeOption }" />
        {{ option }}
      </label>
    </div>
  </div>
</template>

<script>
import infoCircle from '../../assets/info-circle.svg';
import pencil from '../../assets/pencil-01.svg';
import trash from '../../assets/trash.svg';

export default {
  name: "MultiSelect",
  props: {
    rowData: { type: Object, required: true },
  },
  data() {
    return {
      isOpen: false,
      options: ["Unit details", "Edit", "Delete"],
      optionIcons: [infoCircle, pencil, trash],
      activeOption: null,
    };
  },
  methods: {
    toggleDropdown() {
      this.isOpen = !this.isOpen;
    },
    setActive(option) {
      this.activeOption = option;

      if (option === 'Unit details') this.$emit("show-details", this.rowData);
      if (option === 'Edit') this.$emit("edit", this.rowData);
      if (option === 'Delete') this.$emit("delete", this.rowData);

      this.isOpen = false;
    }
  },
};
</script>
<style scoped>
.multi-select {
  position: relative;
  text-align: center;

}

.options {
  position: absolute;
  top: 100%;
  right: 0;
  width: 150px;
  border: 1px solid #d7dee4;
  border-radius: 6px;
  z-index: 1000;
  margin-top: 5px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  background-color: #ffffff;
  padding: 10px;
}

.option {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 5px;
  cursor: pointer;
}

.option.active {
  color: #F73A1D;
}

.option-icon {
  filter: brightness(0) saturate(100%) invert(18%) sepia(2%) saturate(258%) hue-rotate(3deg) brightness(99%) contrast(95%);
}

.option-icon.icon-active {
  filter: brightness(0) saturate(100%) invert(29%) sepia(80%) saturate(2840%) hue-rotate(350deg) brightness(98%) contrast(99%);
}
</style>