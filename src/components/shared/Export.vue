<template>
    <div class="sh-multi-select">
        <div class="sh-select-box" @click="toggleDropdown">
            <span class="sh-placeholder">
                {{$t('buttons.export')}}
            </span>
        </div>

        <div v-if="isOpen" class="sh-options">
            <label v-for="(option, index) in options" :key="index" class="sh-option">
                <img :src="optionIcons[index]" class="sh-option-icon" />
                {{ option }}
            </label>
        </div>
    </div>
</template>

<script>
import pdfIcon from '../../assets/pdf.svg';
import excelIcon from '../../assets/excel.svg';
import csvIcon from '../../assets/csv.svg';

export default {
    name: "ShMultiSelect",
    data() {
        return {
            isOpen: false,
            options: ["Export as PDF", "Export as Excel", "Export as CSV"],
            optionIcons: [pdfIcon, excelIcon, csvIcon],
        };
    },
    methods: {
        toggleDropdown() {
            this.isOpen = !this.isOpen;
        },
    },
};
</script>

<style scoped>
.sh-multi-select {
    position: relative;
    display: inline-block;
    min-width: 90px;
}

.sh-select-box {
    display: inline-flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 5px;
    min-height: 50px;
    border: 1px solid #d7dee4;
    border-radius: 5px;
    padding: 5px 30px 5px 20px;
    background-color: #ffffff;
    cursor: pointer;
    width: auto;
    max-width: 100%;
}

.sh-options {
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

.sh-option {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 8px 5px;
    cursor: pointer;
    border-bottom: 1px solid #e1e9f0;
}

.sh-option:last-child {
    border-bottom: none;
}

.sh-option-icon {
    width: 20px;
    height: 20px;
}

.sh-placeholder {
    color: #50606E;
}
</style>
