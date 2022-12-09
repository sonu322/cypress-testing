import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import Backend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";

import translationEN from "./assets/i18n/0.1/en_US.json";
import translationDE from "./assets/i18n/0.1/de_DE.json";
import translationES from "./assets/i18n/0.1/es_ES.json";
import translationFR from "./assets/i18n/0.1/fr_FR.json";
import translationCN from "./assets/i18n/0.1/zh_CN.json";
// don't want to use this?
// have a look at the Quick start guide
// for passing in lng and translations on init

const resources = {
  en: {
    translation: translationEN,
  },
  en_US: {
    translation: translationEN,
  },
  de_DE: {
    translation: translationDE,
  },
  fr_FR: {
    translation: translationFR,
  },
  es_ES: {
    translation: translationES,
  },
  zh_CN: {
    translation: translationCN,
  },
};

i18n
  // load translation using http -> see /public/locales (i.e. https://github.com/i18next/react-i18next/tree/master/example/react/public/locales)
  // learn more: https://github.com/i18next/i18next-http-backend
  // want your translations to be loaded from a professional CDN? => https://github.com/locize/react-tutorial#step-2---use-the-locize-cdn
  .use(Backend)
  // detect user language
  // learn more: https://github.com/i18next/i18next-browser-languageDetector
  .use(LanguageDetector)
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    resources,
    fallbackLng: "en_US", // uncomment before commiting
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
  });

export default i18n;
