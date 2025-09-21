<template>
    <div class="container py-1">
        <div v-for="(driver, index) in drivers" :key="index" class="position-relative ps-5 mb-4">
            <div class="timeline-line"></div>
            <div class="timeline-dot" :class="driver.status === 'On Schedule' ? 'bg-success' : 'bg-secondary'"></div>

            <div>
                <h5 class="mb-1 ">{{ driver.name }}</h5>
                <p class="text-muted small mb-2 currentDriver">
                    <span v-if="driver.current">Current Driver, </span>
                    Start {{ driver.start }}
                    <span v-if="driver.end"> → End {{ driver.end }}</span>
                </p>

                <!-- الحالة -->
                <span class="badge"
                    :class="driver.status === 'On Schedule' ? 'bg-success-subtle text-success' : 'bg-warning-subtle text-warning'">
                    <i v-if="driver.status === 'On Schedule'" class="bi bi-check-circle me-1"></i>
                    <i v-else class="bi bi-x-circle me-1"></i>
                    {{ driver.status }}
                </span>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "DriversTimeline",
    props: {
        drivers: {
            type: Array,
            required: true,
        },
    },
};
</script>

<style>
.badge {
    font-size: 14px;
    font-weight: 400;
}

.timeline-line {
    position: absolute;
    top: 6px;
    left: 7px;
    width: 2px;
    height: 100%;
    background: #d7dee4;
}

.timeline-dot {
    position: absolute;
    top: 6px;
    left: 0;
    width: 16px;
    height: 16px;
    border-radius: 50%;
}

.bg-success {
    background-color: #10b981 !important;
}

.bg-secondary {
    background-color: #bdc8e1 !important;

}

.currentDriver {
    color: #778897 !important;
    font-size: 16px;
    font-weight: 400;
}

.text-warning {
    color: #f7941D !important;
}
</style>
