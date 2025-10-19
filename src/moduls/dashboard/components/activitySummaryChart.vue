<script setup>
import { ref, onMounted } from "vue";
import VChart from "vue-echarts";
import { use } from "echarts/core";
import { PieChart } from "echarts/charts";
import { TooltipComponent, LegendComponent } from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";
import chartHeader from "./chartHeader.vue";
import { getVehiclesGroupedByStatus } from "../stores/getActivitySummary";
import refreshIcon from "../../../assets/chart/refresh.svg";
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
use([PieChart, TooltipComponent, LegendComponent, CanvasRenderer]);

const chartOptions = ref({
    tooltip: {
        trigger: "item",
        formatter: "{b}: {c} ({d}%)"
    },
    legend: {
        show: true,
        orient: "horizontal",
        bottom: 0,
        left: "center",
        data: ["OFF", "Driving", "Ideal"]
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
        const response = await getVehiclesGroupedByStatus();
        const data = response.result.data;

        chartOptions.value.series[1].data = [
            { value: Number(data.vehicle_off), name: "OFF", itemStyle: { color: "#a4bcd8", borderColor: "#fff", borderWidth: 2 } },
            { value: Number(data.driving), name: "Driving", itemStyle: { color: "#73ae5c", borderColor: "#fff", borderWidth: 2 } },
            { value: Number(data.idling), name: "Ideal", itemStyle: { color: "#ffce30", borderColor: "#fff", borderWidth: 2 } }
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
        <chartHeader :title="t('charts.activity-summary')" :icon="refreshIcon" />
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

@media (max-width: 900px) {
    .chart {
        width: 100%;
        align-items: center;
    }

}
</style>