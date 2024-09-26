import i18next from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./public/locales/english/common.json";
import ru from "./public/locales/russian/common.json";
import fr from "./public/locales/french/common.json";
import zh from "./public/locales/chinese/common.json";
import it from "./public/locales/italian/common.json";
import es from "./public/locales/spanish/common.json";
import ar from "./public/locales/arabic/common.json";

export const languageResources = {
    en: {translation: en},
    ru: {translation: ru},
    fr: {translation: fr},
    zh: {translation: zh},
    it: {translation: it},
    es: {translation: es},
    ar: {translation: ar},
};

i18next.use(initReactI18next).init({
    compatibilityJSON: "v3",
    lng : "en",
    fallbackLng: "en",
    resources: languageResources,

});

export default i18next;