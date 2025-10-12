<script setup>
import { ref, onMounted } from "vue";
import VChart from "vue-echarts";
import { use } from "echarts/core";
import { PieChart } from "echarts/charts";
import { TooltipComponent, LegendComponent } from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";
import chartHeader from "./chartHeader.vue";
import { getVehiclesGroupedBySpeed } from "../stores/getSpeedSummary"
import refreshIcon from "../../../assets/chart/refresh.svg"; // استيراد الأيقونة

use([PieChart, TooltipComponent, LegendComponent, CanvasRenderer]);


const chartOptions = ref({
    tooltip: {
        trigger: "item",
        formatter: "{b}: {c} ({d}%)"
    },
    legend: {
        show: true,
        orient: "vertical",
        bottom: 0,
        left: "center",
        data: ["0-5: Low Risk", "5-90: Medium Risk", "90-120: Medium High Risk", "More Than 120: High Risk"]
    },
    series: [
        {
            type: "pie",
            radius: ["55%", "60%"],
            center: ["50%", "40%"],
            silent: true,
            data: [{ value: 1 }],
            itemStyle: {
                color: "transparent",
                borderColor: "#fff",
                borderWidth: 6
            }
        },
        {
            name: "Speed Summary",
            type: "pie",
            radius: "50%",
            center: ["50%", "40%"],
            label: { show: false },
            labelLine: { show: false },
            data: [],
            emphasis: {
                itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: "rgba(0, 0, 0, 0.5)"
                }
            }
        }
    ]
});

const updateChartData = async () => {
    try {
        const response = await getVehiclesGroupedBySpeed();
        const data = response.result.data;
        console.log(data)
        chartOptions.value.series[1].data = [
            { value: Number(data.speed_0_5_count), name: "0-5: Low Risk", itemStyle: { color: "#f7d448", borderColor: "#fff", borderWidth: 2 } },
            { value: Number(data.speed_6_90_count), name: "5-90: Medium Risk", itemStyle: { color: "#8fb56b", borderColor: "#fff", borderWidth: 2 } },
            { value: Number(data.speed_91_120_count), name: "90-120: Medium High Risk", itemStyle: { color: "#f09135", borderColor: "#fff", borderWidth: 2 } },
            { value: Number(data.speed_above_120_count), name: "More Than 120: High Risk", itemStyle: { color: "#ff001b", borderColor: "#fff", borderWidth: 2 } }
        ];
    } catch (error) {
        console.error("Error updating chart data:", error);
    }
};

onMounted(() => {
    updateChartData();
});
</script>

<template>
    <div class="chart">
        <chartHeader title="Speed Summary" :icon="refreshIcon" />
        <VChart :option="chartOptions" autoresize class="chart-box" />
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
</style>