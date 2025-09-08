<script setup>
import CircularButton from '../shared/CircularButton.vue'
import LanguageIcon from '../../assets/language.svg'
import Notification from '../shared/Notification.vue'
import User from '../shared/User.vue'
</script>

<template>
    <div class="header">
        <h2>Units</h2>
        <div class="headerRightSide">
            <Notification />

            <CircularButton :icon="LanguageIcon" />
            <img src="../../assets/user.svg" alt="" />

            <User />
        </div>
    </div>
<button :class="active ? 'text-red' : 'text-green'"></button>
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