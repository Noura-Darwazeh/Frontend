<template>
    <div class="multi-select">
        <div class="select-box" @click="toggleDropdown">
            <span class="placeholder">
                Export
            </span>
        </div>

        <div v-if="isOpen" class="options">
            <label v-for="(option, index) in options" :key="option" class="option">
                <img :src="optionIcons[index]" class="option-icon" />
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
    name: "MultiSelect",
    data() {
        return {
            isOpen: false,
            options: ["Export as PDF", "Export as Excel", "Export as CSV"],
            optionIcons: [
                pdfIcon,
                excelIcon,
                csvIcon
            ],
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
.multi-select {
    position: relative;
    display: inline-block;
    min-width: 90px;
}

.select-box {
    display: inline-flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 5px;
    min-height: 32px;
    border: 1px solid #d7dee4;
    border-radius: 5px;
    padding: 5px 30px 5px 20px;
    background-color: #ffffff;
    cursor: pointer;
    width: auto;
    max-width: 100%;
}

.arrow {
    position: absolute;
    right: 12px;
    width: 16px;
    height: 16px;
    top: 45%;
    transform: translateY(-50%);
    pointer-events: none;

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
    border-bottom: 1px solid #e1e9f0;
}

.option input[type="checkbox"] {
    margin-right: 8px;
    margin-left: 0;
    transform: translateY(1px);
}

.option:last-child {
    border-bottom: none;
}

.option input[type="checkbox"] {
    appearance: none;
    -webkit-appearance: none;
    width: 16px;
    height: 16px;
    border: 2px solid #ccc;
    border-radius: 3px;
    display: inline-block;
    position: relative;
    cursor: pointer;
}

.option input[type="checkbox"]:checked {
    background-color: #10B981;
    border-color: #10B981;
    background-image: url('../../assets/check.svg');
    background-size: 10px 10px;
    background-repeat: no-repeat;
    background-position: center;
}

.option input[type="checkbox"]:checked::before {
    color: #ffffff;
    font-size: 14px;
    position: absolute;
    left: 2px;
    top: -1px;
}

.option-icon {
    width: 20px;
    height: 20px;
}

.placeholder {
    color: #50606E;
}
</style>
