<script setup>
import CircularButton from '../shared/CircularButton.vue'
import NotificationIcon from '../../assets/notification.svg'
import LanguageIcon from '../../assets/language.svg'
import SelectBtn from '../shared/Select.vue'
</script>

<template>
    <div class="header">
        <h2>Units</h2>
        <div class="headerRightSide">
            <CircularButton :icon="NotificationIcon" />
            <CircularButton :icon="LanguageIcon" />
            <img src="../../assets/user.svg" alt="" />
            <SelectBtn option1="Amer Amin" bg-color="transparent" selectBorder="none" 
            customSelectWidth="120px" selectWidth="90%" :iconRightSpace="20"
            
            />
        </div>
    </div>

</template>

<style>
.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.headerRightSide {
    display: flex;
    gap: 7px;
}
</style>