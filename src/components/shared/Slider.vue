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
import truck from "../../assets/vehicle/car.svg"
import truck1 from "../../assets/vehicle/Frame.svg"
import truck2 from "../../assets/vehicle/Frame1.svg"
import truck3 from "../../assets/vehicle/Frame2.svg"
import truck4 from "../../assets/vehicle/Frame3.svg"
import truck5 from "../../assets/vehicle/Frame4.svg"
import truck6 from "../../assets/vehicle/Frame5.svg"
import truck7 from "../../assets/vehicle/Frame6.svg"
import truck8 from "../../assets/vehicle/Frame7.svg"
import truck9 from "../../assets/vehicle/Frame8.svg"
import truck10 from "../../assets/vehicle/Frame9.svg"
import truck11 from "../../assets/vehicle/Frame10.svg"
import truck12 from "../../assets/vehicle/Frame11.svg"
import truck13 from "../../assets/vehicle/Frame12.svg"
import truck14 from "../../assets/vehicle/Frame13.svg"
import truck15 from "../../assets/vehicle/Frame14.svg"
import truck16 from "../../assets/vehicle/Frame16.svg"
import truck17 from "../../assets/vehicle/Frame17.svg"
import truck18 from "../../assets/vehicle/refrigeratorTruck.svg"
import truck19 from "../../assets/vehicle/Layer_1.svg"

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
    { id: 0, image: truck, title: "Truck " },
    { id: 1, image: truck1, title: "Truck 1" },
    { id: 2, image: truck2, title: "Truck 2" },
    { id: 3, image: truck3, title: "Truck 3" },
    { id: 4, image: truck4, title: "Truck 4" },
    { id: 5, image: truck5, title: "Truck 5" },
    { id: 6, image: truck6, title: "Truck 6" },
    { id: 7, image: truck7, title: "Truck 7" },
    { id: 8, image: truck8, title: "Truck 8" },
    { id: 9, image: truck9, title: "Truck 9" },
    { id: 10, image: truck10, title: "Truck 10" },
    { id: 11, image: truck11, title: "Truck 11" },
    { id: 12, image: truck12, title: "Truck 12" },
    { id: 13, image: truck13, title: "Truck 13" },
    { id: 14, image: truck14, title: "Truck 14" },
    { id: 15, image: truck15, title: "Truck 15" },
    { id: 16, image: truck16, title: "Truck 16" },
    { id: 17, image: truck17, title: "Truck 17" },
    { id: 18, image: truck18, title: "Truck 18" },
    { id: 19, image: truck19, title: "Truck 19" },



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
