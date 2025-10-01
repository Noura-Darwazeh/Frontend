<script setup>
import { onMounted, ref } from "vue";
import { use } from "echarts/core";
import VChart from "vue-echarts";
import {
    TitleComponent,
    TooltipComponent,
    GridComponent,
} from "echarts/components";
import { BarChart } from "echarts/charts";
import { CanvasRenderer } from "echarts/renderers";
import { getTop5SpeedUnits } from '../stores/fiveSpeedUnits';

use([TitleComponent, TooltipComponent, GridComponent, BarChart, CanvasRenderer]);

const option = ref({
    title: {
        text: "Top 5 Speeding",
        left: "left",
    },
    tooltip: {
        trigger: "axis",
        axisPointer: { type: "shadow" },
    },
    grid: {
        left: "1%",
        right: "4%",
        bottom: "3%",
        containLabel: true,
    },
    xAxis: {
        type: "value",
        min: 0,
        max: 20,
        interval: 5,
        name: "Speed",
    },
    yAxis: {
        type: "category",
        data: [],
    },
    series: [
        {
            type: "bar",
            data: [],
            itemStyle: {
                color: "#2596be",
                borderRadius: [0, 8, 8, 0],
            },
            barWidth: "90%",
        },
    ],
});

onMounted(async () => {
    try {
        const response = await getTop5SpeedUnits();
        const data = response.result.data;
        console.log(data)


        const categories = data.map(item => item.vehicle_name);
        const values = data.map(item => item.last_speed);

        option.value.yAxis.data = categories;
        option.value.series[0].data = values;

        const maxSpeed = Math.max(...values);
        option.value.xAxis.max = Math.ceil(maxSpeed / 10) * 10;

    } catch (err) {
        console.error("Error fetching data:", err);
    }
});
</script>

<template>
    <v-chart class="chart" :option="option" autoresize />
</template>

<style>
.chart {
    background-color: white;
    width: 35%;
    height: 300px;
    padding: 10px 20px;
    border: 1px solid #d7dee4;
    border-radius: 8px;
}
</style>
