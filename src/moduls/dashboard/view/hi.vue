<script setup>
import { defineComponent, ref } from "vue";
import { use } from "echarts/core";
import VChart from "vue-echarts";
import {
    TitleComponent,
    TooltipComponent,
    GridComponent,
} from "echarts/components";
import { BarChart } from "echarts/charts";
import { CanvasRenderer } from "echarts/renderers";

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
        min: 100,
        max: 120,
          interval: 10,
    },
    yAxis: {
        type: "category",
        data: [
            "22-21758",
            "45-86557",
            "42-18851 موقف توران داؤد عبدالحيط النشه",
            "70-46988",
            "56-30189",
        ],
    },
    series: [
        {
            type: "bar",
            data: [118, 115, 120, 110, 112],
            itemStyle: {
                color: "red",
                borderRadius: [0, 8, 8, 0],
            },
            barWidth: "90%",
        },
    ],
});
</script>

<template>
    <v-chart class="chart" :option="option" autoresize />
</template>

<style>
.chart {
    width: 35%;
    height: 300px;
}
</style>
