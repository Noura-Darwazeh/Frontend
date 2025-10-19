// import { createApp } from 'vue'
// import './style.css'
// import App from './App.vue'
// import router from './rout'
// // Bootstrap
// import 'bootstrap/dist/css/bootstrap.min.css'
// import 'bootstrap/dist/js/bootstrap.bundle.min.js'

// createApp(App).use(router).mount('#app')

import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './rout'

// Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

// ✅ استيراد مكتبة vue-i18n
import { createI18n } from 'vue-i18n'

// ✅ استيراد ملفات الترجمة
import en from './locales/en.json'
import ar from './locales/ar.json'

// ✅ إعداد الرسائل (messages)
const messages = {
  en,
  ar
}

// ✅ تحديد اللغة الافتراضية
const savedLang = localStorage.getItem('lang') || 'en'

// ✅ إنشاء كائن i18n
const i18n = createI18n({
  legacy: false, // استخدام API الحديثة
  locale: savedLang,
  fallbackLocale: 'en',
  messages
})

// ✅ إنشاء التطبيق
const app = createApp(App)

// ✅ استخدام المكتبات
app.use(router)
app.use(i18n)

// ✅ ضبط اتجاه الصفحة (RTL/LTR) حسب اللغة
document.documentElement.setAttribute('dir', savedLang === 'ar' ? 'rtl' : 'ltr')

// ✅ تشغيل التطبيق
app.mount('#app')
