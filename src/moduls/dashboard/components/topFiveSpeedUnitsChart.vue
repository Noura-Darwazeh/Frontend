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
import chartHeader from "./chartHeader.vue";
import refreshIcon from "../../../assets/chart/refresh.svg";
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
use([TitleComponent, TooltipComponent, GridComponent, BarChart, CanvasRenderer]);

const option = ref({

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
    <div class="chart">
        <chartHeader :title="t('charts.top-5-speed')" :icon="refreshIcon" />
        <v-chart :option="option" autoresize class="chart-box" />
    </div>
</template>

<style scoped>
.chart {
    background-color: white;
    width: 30%;
    height: 350px;
    border: 1px solid #d7dee4;
    border-radius: 8px;
    padding: 10px;
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.chart-box {
    width: 100%;
    height: 100%;
}

@media (max-width: 900px) {
    .chart {
        width: 100%;
        align-items: center;
    }


}
</style>
