<script setup>
import LanguageSwitcher from '../shared/LanguageSwitcher.vue'
import Notification from '../shared/Notification.vue'
import User from '../shared/User.vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'

const { t } = useI18n()
const route = useRoute()
const props = defineProps({
    title: {
        type: String,
        default: 'Units'
    }
});
</script>

<template>
    <div class="header">
        <h2>{{ t(`header.titles.${route.name}`) }}</h2>
        <div class="headerRightSide">
            <Notification />
            <LanguageSwitcher />
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