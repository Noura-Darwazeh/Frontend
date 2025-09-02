<template>
    <div class="custom-select" :style="{ width: customSelectWidth }">
        <select :style="{
            backgroundColor: bgColor,
            border: selectBorder,
            width: selectWidth,

        }">
            <option>{{ option1 }}</option>
            <option v-if="option2">{{ option2 }}</option>
            <option v-if="option3">{{ option3 }}</option>
            <option v-if="option4">{{ option4 }}</option>
        </select>

        <img src="../../assets/arrow.svg" alt="arrow" class="select-icon" :style="{ right: iconRightSpace + 'px' }" />
    </div>
</template>

<script>
export default {
    props: {
        option1: String,
        option2: String,
        option3: String,
        option4: String,

        bgColor: {
            type: String,
            default: "#fff",
        },
        selectBorder: {
            type: String,
            default: "1px solid #D7DEE4",
        },

        customSelectWidth: {
            type: String,
            default: "90px"
        },
        selectWidth: {
            type: String,
            default: "100%"
        },
        iconRightSpace: {
            type: Number,
            default: 10
        }
    },
};
</script>

<style scoped>
.custom-select {
    position: relative;
    display: inline-block;
}

.custom-select select {
    height: 100%;
    padding: 8px 10px 8px 10px;
    border-radius: 5px;
    font-size: 14px;
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
}

.select-icon {
    position: absolute;
    right: 17px;
    top: 45%;
    width: 16px;
    height: 16px;
    pointer-events: none;
    transform: translateY(-50%);
}
</style>