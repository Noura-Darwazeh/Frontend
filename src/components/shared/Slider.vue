<template>
    <div class="  position-relative">
        <!-- Swiper أو Grid حسب الحالة -->
        <div v-if="!showAll">
            <swiper :modules="modules" :slides-per-view="5" :space-between="10" :breakpoints="breakpoints"
                @swiper="onSwiper" class="vehicle-swiper">
                <swiper-slide v-for="vehicle in vehicles" :key="vehicle.id">
                    <div class="slide d-flex align-items-center justify-content-center">
                        <img :src="vehicle.image" :alt="vehicle.title" class="img-fluid" />
                    </div>
                </swiper-slide>

                <!-- الأسهم المخصصة -->
                <div ref="prevRef" class="custom-arrow left-arrow">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3"
                        stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="15 18 9 12 15 6"></polyline>
                    </svg>
                </div>
                <div ref="nextRef" class="custom-arrow right-arrow">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3"
                        stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                </div>
            </swiper>
        </div>

        <div v-else class="row g-3">
            <div v-for="vehicle in vehicles" :key="vehicle.id" class="col-md-4">
                <div class="slide d-flex align-items-center justify-content-center">
                    <img :src="vehicle.image" :alt="vehicle.title" class="img-fluid" />
                </div>
            </div>
        </div>

        <!-- الزر -->
        <div class="text-center mt-3">
            <button @click="toggleShowAll" class="btn ">
                {{ showAll ? 'Show Less' : 'Show More' }}
            </button>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Navigation } from 'swiper/modules'

import 'swiper/css'
import 'swiper/css/navigation'

import truck1 from "../../assets/record/Frame.svg"

const modules = [Navigation]
const prevRef = ref(null)
const nextRef = ref(null)
const swiperInstance = ref(null)

const showAll = ref(false)

const breakpoints = {
    320: { slidesPerView: 2, spaceBetween: 5 },
    640: { slidesPerView: 3, spaceBetween: 8 },
    768: { slidesPerView: 4, spaceBetween: 10 },
    1024: { slidesPerView: 5, spaceBetween: 12 },
}

const vehicles = ref([
    { id: 1, image: truck1, title: "Truck 1" },
    { id: 2, image: truck1, title: "Truck 2" },
    { id: 3, image: truck1, title: "Truck 3" },
    { id: 4, image: truck1, title: "Truck 4" },
    { id: 5, image: truck1, title: "Truck 5" },
    { id: 6, image: truck1, title: "Truck 6" },
])

const onSwiper = (swiper) => {
    swiperInstance.value = swiper
    swiper.params.navigation.prevEl = prevRef.value
    swiper.params.navigation.nextEl = nextRef.value
    swiper.navigation.init()
    swiper.navigation.update()
}

const toggleShowAll = () => {
    showAll.value = !showAll.value
}
</script>

<style scoped>
.slide {
    border: 1px solid #BDC8E1;
    border-radius: 8px;
    height: 120px;


}

.vehicle-swiper {
    /* padding: 4px 0; */
    /* background-color: aqua !important; */


}

/* الأسهم المخصصة */
.custom-arrow {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background-color: #21282e;
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    z-index: 10;
    cursor: pointer;
}

.left-arrow {
    left: 10px;
}

.right-arrow {
    right: 10px;
}

.btn {
    color: #0568A0;
    border-bottom: 1px solid #0568A0;
    padding: 0;
    border-radius: 0;
}
</style>
