import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      'Welcome to React': 'Welcome to React and react-i18next',
      key1: 'EN LOCAL | KEY 1 Value',
      key2: {
        key2_inner_key1: 'EN LOCAL | KEY 2 inner Key 1 Value',
      },
      'key3.dotted.name': 'EN LOCAL | KEY 3 Dotted Key Value',
    },
  },
  fr: {
    translation: {
      'Welcome to React': 'Bienvenue à React et react-i18next',
      key1: 'FR LOCAL | KEY 1 Value',
      key2: {
        key2_inner_key1: 'FR LOCAL | KEY 2 inner Key 1 Value',
      },
      'key3.dotted.name': 'FR LOCAL | KEY 3 Dotted Key Value',
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
