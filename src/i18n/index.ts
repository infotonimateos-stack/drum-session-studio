import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Import translation files
import esCommon from "./locales/es-ES/common.json";
import enCommon from "./locales/en-GB/common.json";

const LANGUAGE_KEY = "drum-studio-language";

// Get saved language from localStorage or default to Spanish
const getSavedLanguage = (): string => {
  try {
    const saved = localStorage.getItem(LANGUAGE_KEY);
    if (saved && (saved === "es-ES" || saved === "en-GB")) {
      return saved;
    }
  } catch {
    // localStorage not available
  }
  return "es-ES";
};

const resources = {
  "es-ES": {
    common: esCommon
  },
  "en-GB": {
    common: enCommon
  }
};

const supportedLngs = ["es-ES", "en-GB"];

void i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: getSavedLanguage(),
    fallbackLng: "es-ES",
    supportedLngs,
    defaultNS: "common",
    interpolation: { escapeValue: false },
    returnNull: false
  });

// Keep <html lang> and dir attributes in sync
const setHtmlAttrs = (lng: string) => {
  const html = document.documentElement;
  html.setAttribute("lang", lng);
};

setHtmlAttrs(i18n.language);

// Save language to localStorage on change
i18n.on("languageChanged", (lng) => {
  setHtmlAttrs(lng);
  try {
    localStorage.setItem(LANGUAGE_KEY, lng);
  } catch {
    // localStorage not available
  }
});

export default i18n;
