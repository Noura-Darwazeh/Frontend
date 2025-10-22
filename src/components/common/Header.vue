<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
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

// reactive header title used in template
const headerTitle = ref(route.meta?.title ?? t(`header.titles.${route.name}`) ?? props.title)

// update headerTitle when route meta.title or route.name changes
watch(
  () => [route.meta && route.meta.title, route.name],
  ([metaTitle, routeName]) => {
    headerTitle.value = metaTitle ?? t(`header.titles.${routeName}`) ?? props.title
  }
)

// listen to global event (dispatched from child components) to force update header
const onUpdateHeader = (e) => {
  if (e && e.detail) headerTitle.value = e.detail
}

onMounted(() => {
  window.addEventListener('update-header-title', onUpdateHeader)
})

onBeforeUnmount(() => {
  window.removeEventListener('update-header-title', onUpdateHeader)
})
</script>

<template>
    <div class="header">
        <h2>{{ headerTitle }}</h2>
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