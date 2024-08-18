import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      'Welcome to React': 'Welcome to React and react-i18next',
    },
  },
  fr: {
    translation: {
      'Welcome to React': 'Bienvenue à React et react-i18next',
    },
  },
};

const currentLanguage = localStorage.getItem('language') || 'en';

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: currentLanguage, // language to use, more information here: https://www.i18next.com/overview/configuration-options#languages-namespaces-resources

    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;
