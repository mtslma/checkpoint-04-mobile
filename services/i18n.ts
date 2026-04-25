import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import * as Localization from "expo-localization";
import pt from "../locales/pt.json";
import en from "../locales/en.json";

i18n.use(initReactI18next) // Isso injeta a instância no react-i18next
    .init({
        resources: {
            pt: { translation: pt },
            en: { translation: en },
        },
        lng: Localization.getLocales()[0].languageCode ?? "pt",
        fallbackLng: "pt",
        interpolation: {
            escapeValue: false,
        },
    });

export default i18n;
