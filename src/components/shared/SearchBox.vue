<script setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
    <div class="sh-search">
        <img src="../../assets/search.svg" alt="search" class="sh-search-icon" />
        <input class="sh-input" :placeholder="t('placeholders.search')" />
    </div>
</template>

<style scoped>
.sh-search {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 5px;
    width: 200px;
    border: 1px solid #D7DEE4;
    border-radius: 5px;
    background-color: #FFFFFF;
    padding: 10px !important;
}

.sh-input {
    border: none;
    outline: none;
    width: 100%;
}

.sh-input::placeholder {
    color: #BDC8D1;
}
</style>
