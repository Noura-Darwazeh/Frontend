<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import VChart from "vue-echarts";
import { use } from "echarts/core";
import { GaugeChart } from "echarts/charts";
import { TooltipComponent } from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";
import chartHeader from "./chartHeader.vue";
import dawnloadIcon from "../../../assets/chart/download.svg";
import { getVehiclesGroupedBySpeed } from "../stores/getTopVehicleSpeed";
use([GaugeChart, TooltipComponent, CanvasRenderer]);

const speed = ref(0);
const vehicleName = ref("");

const option = ref({
    tooltip: {
        formatter: "{a} <br/>{b} : {c} km/h",
    },
    series: [
        {
            name: "Speed",
            type: "gauge",
            min: 0,
            max: 200,
            detail: { valueAnimation: true, formatter: "{value}" },
            data: [{ value: speed.value, name: "km/h" }],
            axisLine: {
                lineStyle: {
                    width: 15,
                    color: [
                        [0.3, "#8fb56b"],
                        [0.7, "#f7d448"],
                        [1, "#ff001b"],
                    ],
                },
            },
            pointer: {
                itemStyle: {
                    color: "black",
                },
            },
        },
    ],
});


const fetchSpeed = async () => {
    try {
        const data = await getVehiclesGroupedBySpeed();


        const vehicles = data?.result?.data ?? [];

        if (vehicles.length > 0) {
            const topVehicle = vehicles[0];

            speed.value = topVehicle.last_speed ?? 0;
            vehicleName.value = topVehicle.vehicle_name ?? "";

            option.value.series[0].data[0].value = speed.value;
            option.value.series[0].data[0].name = vehicleName.value || "km/h";
        }
    } catch (error) {
        console.error("Error fetching speed:", error);
    }
};

let intervalId;

onMounted(() => {
    fetchSpeed();
    intervalId = setInterval(fetchSpeed, 10000);
});

onUnmounted(() => {
    clearInterval(intervalId);
});
</script>

<template>
    <div class="chart">
        <chartHeader title="Speed Summary" :icon="dawnloadIcon" />
        <VChart :option="option" autoresize class="chart-box" />
    </div>
</template>

<style scoped>
.chart {
    background-color: white;
    width: 50%;
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
