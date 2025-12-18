import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import enJSON from './locales/en/translation.json';
import viJSON from './locales/vi/translation.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enJSON },
      vi: { translation: viJSON },
    },
    lng: 'vi', // Default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // React already escapes values
    },
  });

export default i18n;
