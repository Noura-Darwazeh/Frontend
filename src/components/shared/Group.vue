<template>
    <div class="multi-select">
        <div class="select-box" @click="toggleDropdown">
            <div class="selected-tags">
                <span v-if="selectedOptions.length === 0" class="placeholder">
                    Group
                </span>

                <span v-else v-for="(option, index) in selectedOptions" :key="index" class="tag">
                    {{ option }}
                    <span class="remove-tag" @click.stop="removeOption(option)">
                        <img src="../../assets//X.svg" alt="icon" width="14" height="14" />


                    </span>
                </span>
            </div>
            <img src="../../assets/arrow.svg" alt="arrow" class="arrow" />
        </div>

        <div v-if="isOpen" class="options">
            <label v-for="option in options" :key="option" class="option">
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

.selected-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
}

.tag {
    background-color: #0568A0;
    color: #ffffff;
    border-radius: 3px;
    padding: 4px 6px;
    font-size: 13px;
    display: flex;
    align-items: center;
}

.remove-tag {
    margin-left: 4px;
    margin-top: 5px;
    cursor: pointer;
    font-weight: bold;


}

.options {
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

.option {
    display: flex;
    align-items: center;
    padding: 10px 0;
    cursor: pointer;
    border-bottom: 1px solid #E1E9F0;
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

.placeholder {
    color: #50606E;
}
</style>
