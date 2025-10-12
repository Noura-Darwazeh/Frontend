<script setup>
import chartHeader from "./chartHeader.vue";
</script>

<template>
    <div class="chart">
        <chartHeader title="Total Vehicles" />
        <p>95</p>
        <!-- <v-chart :option="option" autoresize class="chart-box" /> -->
        <img src="../../../assets/chart/image.svg" width="230" height="126">
    </div>
</template>

<style scoped>
.chart {
    padding-top: 15px;
    padding-left: 10px;
    background-color: white;
    width: 50%;
    height: 350px;
    border: 1px solid #d7dee4;
    border-radius: 8px;
    /* padding: 10px; */
    display: flex;
    flex-direction: column;
    justify-content: start;
}

.chart-box {
    width: 100%;
    height: 100%;
}

p {
    font-size: 45px;
    font-weight: bold;
}

.chart img {
    align-self: flex-end;
}

@media (max-width: 900px) {
    .chart {
        width: 100%;
        align-items: center;
    }


}
</style>
