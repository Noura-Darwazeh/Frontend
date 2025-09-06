<template>
    <div class="notification-wrapper">
        <Notification :icon="NotificationIcon" @click="toggleNotifications" />

        <div v-if="showNotifications" class="notifications">
            <h3>Notifications</h3>

            <div v-for="(item, index) in notifications" :key="index" class="notification-item">
                <div class="icon"> <img :src="item.icon" alt="icon" style="width:32px; height:32px;" />
                </div>
                <div class="content">
                    <h4>{{ item.title }}</h4>
                    <p>{{ item.message }}</p>
                    <small>{{ item.time }}</small>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import Notification from './CircularButton.vue'
import NotificationIcon from '../../assets/notification.svg'
import overSpeed from '../../assets/Frame.svg'
import HightTemp from '../../assets/Frame 2458.svg'
import Accident from '../../assets/Frame 2459.svg'
import Report from '../../assets/Frame 2460.svg'
import Lock from '../../assets/Frame 2461.svg'
import Unlock from '../../assets/Frame 2462.svg'


const showNotifications = ref(false)

const notifications = ref([
    { icon: overSpeed, title: "Over Speed", message: "Over speed by 7 km/h", time: "13:34:33 2023-06-24" },
    { icon: HightTemp, title: "High Temperature", message: "High temperature by 30°", time: "13:34:33 2023-06-24" },
    { icon: Accident, title: "Accident", message: "Lorem Ipsum is simply dummy text.", time: "13:34:33 2023-06-24" },
    { icon: Report, title: "New Report", message: "Contrary to popular belief, Lorem Ipsum is not simply random text.", time: "13:34:33 2023-06-24" },
    { icon: Lock, title: "Lock", message: "Lorem Ipsum has been the industry's standard dummy text.", time: "13:34:33 2023-06-24" },
    { icon: Unlock, title: "Unlock", message: "Lorem Ipsum is simply dummy text of the printing.", time: "13:34:33 2023-06-24" }
])

function toggleNotifications() {
    console.log("hi")
    showNotifications.value = !showNotifications.value
}
</script>

<style>
.notification-wrapper {
    position: relative;
    display: inline-block;
}

.notifications {
    position: absolute;
    top: 40px;
    right: 0;
    width: 320px;
    background: #ffffff;
    border-radius: 12px;
    border: 1px solid #BDC8D1;
    box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.2);
    padding: 15px 0;
    z-index: 1000;
}

.notifications h3 {
    margin-left: 15px;
}

.notification-item {
    display: flex;
    gap: 10px;
    padding: 10px 15px;
    border-bottom: 1px solid #E1E9F0;
}

.notification-item:last-child {
    border-bottom: none;
}

.notification-item:first-of-type {
    border-top: 1px solid #E1E9F0;
}


.notification-item .content h4 {
    margin: 0;
    font-size: 14px;
    font-weight: bold;
    color: #21282e;
}

.notification-item .content p {
    margin: 2px 0;
    font-size: 12px;
    color: #778897;
    font-weight: 400;
}

.notification-item .content small {
    margin: 2px 0;
    font-size: 12px;
    color: #A5B2BE;
    font-weight: 400;
}
</style>
