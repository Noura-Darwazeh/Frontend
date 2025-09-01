<template>

    <select :style="{ backgroundColor: bgColor, border: selectBorder }">
        <option>{{ label }}</option>
    </select>
</template>

<script>

export default {
    props: {
        label: String,
        bgColor: {
            type: String,
            default: '#fff'
        },
        selectBorder: {
            type: String,
            default: '1px solid #D7DEE4'
        }
    }
}
</script>

<style>
select {
    padding: 5px;
    border: none;
    border-radius: 5px;
}
</style>