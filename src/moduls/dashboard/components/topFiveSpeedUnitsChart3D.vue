<script setup>
import { ref, onMounted } from "vue";
import VChart from "vue-echarts";
import "echarts-gl";
import { getTop5SpeedUnits } from '../stores/fiveSpeedUnits';

const option = ref({
    title: {
        text: "Top 5 Speeding (3D)",
        left: "center",
    },
    tooltip: {},
    xAxis3D: {
        type: "value",
        min: 0,
        max: 30,
        interval: 5,
        name: "Speed",
    },
    yAxis3D: {
        type: "value",
        min: 0,
        max: 0,
        show: false,
    },
    zAxis3D: {
        type: "category",
        data: [],
    },
    grid3D: {
        boxWidth: 120,
        boxDepth: 50,
        viewControl: {
            projection: "perspective",
            autoRotate: false,
            autoRotateSpeed: 20,
        },
        light: {
            main: { intensity: 1.2, shadow: true },
            ambient: { intensity: 0.3 },
        },
    },
    series: [
        {
            type: "bar3D",
            data: [],
            shading: "lambert",
            barSize: 20,
            itemStyle: { color: "#5DADE2" },
        },
    ],
});

onMounted(async () => {
    try {
        const response = await getTop5SpeedUnits();
        const data = response.result.data;

        const categories = data.map(item => item.vehicle_name); // محور Z
        const values = data.map(item => item.last_speed);       // محور X

        // تحويل البيانات لصيغة 3D
        const seriesData = values.map((val, idx) => [val, idx, 1]);

        // تحديث الـ chart
        option.value.zAxis3D.data = categories;
        option.value.series[0].data = seriesData;

        // ضبط أقصى قيمة لمحور X تلقائي
        const maxSpeed = Math.max(...values);
        option.value.xAxis3D.max = Math.ceil(maxSpeed / 10) * 10;

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
    width: 100%;
    height: 400px;
}
</style>