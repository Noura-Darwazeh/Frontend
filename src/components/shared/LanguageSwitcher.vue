<template>
  <div class="language-switcher">
    <div class="language-button" @click="toggleDropdown">
      <img src="../../assets/language.svg" alt="language" width="18" height="18" />
    </div>
    
    <div v-if="isOpen" class="language-dropdown">
      <div 
        v-for="lang in languages" 
        :key="lang.code"
        class="language-option"
        :class="{ active: currentLanguage === lang.code }"
        @click="selectLanguage(lang.code)"
      >
        <span class="name">{{ lang.name }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "LanguageSwitcher",
  data() {
    return {
      isOpen: false,
      currentLanguage: 'en',
      languages: [
        { name: 'English' },
        { name: 'العربية' }
      ]
    };
  },
  mounted() {
    const savedLang = localStorage.getItem('lang');
    if (savedLang) {
      this.currentLanguage = savedLang;
    }
    
    this.applyLanguage();
    
    document.addEventListener('click', this.handleClickOutside);
  },
  beforeUnmount() {
    document.removeEventListener('click', this.handleClickOutside);
  },
  methods: {
    toggleDropdown() {
      this.isOpen = !this.isOpen;
    },
    selectLanguage(langCode) {
      this.currentLanguage = langCode;
      localStorage.setItem('lang', langCode);
      this.applyLanguage();
      this.isOpen = false;
      
      if (this.$i18n) {
        this.$i18n.locale = langCode;
        if (this.$i18n.global && this.$i18n.global.locale) {
          this.$i18n.global.locale.value = langCode;
        }
      }
      
      this.$emit('language-changed', langCode);
    },
    applyLanguage() {
      document.documentElement.lang = this.currentLanguage;
      document.documentElement.dir = this.currentLanguage === 'ar' ? 'rtl' : 'ltr';
      
      if (this.currentLanguage === 'ar') {
        document.body.classList.add('rtl');
      } else {
        document.body.classList.remove('rtl');
      }
    },
    handleClickOutside(event) {
      if (!this.$el.contains(event.target)) {
        this.isOpen = false;
      }
    }
  }
};
</script>

<style scoped>
.language-switcher {
  position: relative;
  display: inline-block;
}

.language-button {
  padding: 10px;
  border: none;
  border-radius: 50%;
  background-color: #d7dee4;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;
}

.language-button:hover {
  background-color: #c5d0d8;
}

.language-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  width: 150px;
  border: 1px solid #d7dee4;
  border-radius: 6px;
  z-index: 1000;
  margin-top: 5px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  background-color: #ffffff;
  padding: 8px 0;
}

.language-option {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 15px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.language-option:hover {
  background-color: #f8f9fa;
}

.language-option.active {
  background-color: #e3f2fd;
  color: #1976d2;
}

.flag {
  font-size: 16px;
}

.name {
  flex: 1;
  font-size: 14px;
}

.check {
  color: #10B981;
  font-weight: bold;
}

/* RTL Support */
.rtl .language-dropdown {
  right: auto;
  left: 0;
}

.rtl .language-option {
  text-align: right;
}
</style>
