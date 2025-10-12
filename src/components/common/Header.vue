<script setup>
import CircularButton from '../shared/CircularButton.vue'
import LanguageIcon from '../../assets/language.svg'
import Notification from '../shared/Notification.vue'
import User from '../shared/User.vue'

const props = defineProps({
    title: {
        type: String,
        default: 'Units'
    }
});
</script>

<template>
    <div class="header">
        <h2>{{ title }}</h2>
        <div class="headerRightSide">
            <Notification />

            <CircularButton :icon="LanguageIcon" />
            <img src="../../assets/user.svg" alt="" />

            <User />
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