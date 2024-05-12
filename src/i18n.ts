import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { en } from '@/locales/en-US';
import { cn } from '@/locales/zh-CN';

import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
    'zh-CN': {
        translation: cn
    },
    'en-US': {
        translation: en
    },
};

i18n.use(LanguageDetector) //嗅探当前浏览器语言
    .use(initReactI18next)
    .init({
        resources,
        lng:'zh-CN',
        fallbackLng: 'zh-CN',
        debug: false,
        interpolation: {
            escapeValue: false, // not needed for react as it escapes by default
        },
        detection: {
            caches: ['localStorage', 'sessionStorage', 'cookie'],
        }
    })

export default i18n;