<template>
    <div class="ms-multi-select">
        <div class="ms-select-box" @click="toggleDropdown">
            <div class="ms-selected-tags">
                <span v-if="selectedOptions.length === 0" class="ms-placeholder">
                     {{$t('buttons.group')}}
                </span>

                <span v-else v-for="(option, index) in selectedOptions" :key="index" class="ms-tag">
                    {{ option }}
                    <span class="ms-remove-tag" @click.stop="removeOption(option)">
                        <img src="../../assets/X.svg" alt="icon" width="14" height="14" />
                    </span>
                </span>
            </div>
            <img src="../../assets/arrow.svg" alt="arrow" class="ms-arrow" />
        </div>

        <div v-if="isOpen" class="ms-options">
            <label v-for="option in options" :key="option" class="ms-option">
                <input type="checkbox" :value="option" v-model="selectedOptions" />
                {{ option }}
            </label>
        </div>
    </div>
</template>

<script>
export default {
    name: "MultiSelect",
    props: {
        options: {
            type: Array,
            default: () => ["Group A", "Second Group", "Group Three", "Fourth Group"],
        },
    },
    data() {
        return {
            isOpen: false,
            selectedOptions: [],
        };
    },
    methods: {
        toggleDropdown() {
            this.isOpen = !this.isOpen;
        },
        removeOption(option) {
            this.selectedOptions = this.selectedOptions.filter((o) => o !== option);
        },
    },
};
</script>

<style scoped>
.ms-multi-select {
    position: relative;
    display: inline-block;
    min-width: 90px;
}

.ms-select-box {
    display: inline-flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 5px;
    min-height: 50px !important;
    border: 1px solid #d7dee4;
    border-radius: 5px;
    padding: 5px 30px 5px 20px;
    background-color: #ffffff;
    cursor: pointer;
    width: auto;
    max-width: 100%;


    
}

.ms-arrow {
    position: absolute;
    right: 12px;
    width: 16px;
    height: 16px;
    top: 45%;
    transform: translateY(-50%);
    pointer-events: none;
}

.ms-selected-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
}

.ms-tag {
    background-color: #0568A0;
    color: #ffffff;
    border-radius: 3px;
    padding: 4px 6px;
    font-size: 13px;
    display: flex;
    align-items: center;
}

.ms-remove-tag {
    margin-left: 4px;
    margin-top: 5px;
    cursor: pointer;
    font-weight: bold;
}

.ms-options {
    position: absolute;
    top: 100%;
    left: 0;
    width: 150px;
    border: 1px solid #d7dee4;
    border-radius: 6px;
    z-index: 1000;
    margin-top: 5px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
    background-color: #ffffff;
    padding: 10px;
}

.ms-option {
    display: flex;
    align-items: center;
    padding: 10px 0;
    cursor: pointer;
    border-bottom: 1px solid #E1E9F0;
}

.ms-option input[type="checkbox"] {
    margin-right: 8px;
    margin-left: 0;
    transform: translateY(1px);
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

.ms-option:last-child {
    border-bottom: none;
}

.ms-option input[type="checkbox"]:checked {
    background-color: #10B981;
    border-color: #10B981;
    background-image: url('../../assets/check.svg');
    background-size: 10px 10px;
    background-repeat: no-repeat;
    background-position: center;
}

.ms-option input[type="checkbox"]:checked::before {
    color: #ffffff;
    font-size: 14px;
    position: absolute;
    left: 2px;
    top: -1px;
}

.ms-placeholder {
    color: #50606E;
}
</style>
