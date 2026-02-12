import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import esCommon from "./locales/es-ES/common.json";
import enCommon from "./locales/en-GB/common.json";

const LANGUAGE_KEY = "drum-studio-language";

export const languageConfig = [
  { code: "es-ES", name: "Español", flag: "🇪🇸", region: "es" },
  { code: "en-GB", name: "English", flag: "🇬🇧", region: "en" },
];

const supportedLngs = languageConfig.map(l => l.code);

const detectBrowserLanguage = (): string => {
  try {
    const browserLang = navigator.language || (navigator as any).userLanguage;
    if (supportedLngs.includes(browserLang)) return browserLang;
    const langCode = browserLang.split("-")[0];
    if (langCode === "en") return "en-GB";
  } catch {}
  return "es-ES";
};

const getSavedLanguage = (): string => {
  try {
    const saved = localStorage.getItem(LANGUAGE_KEY);
    if (saved && supportedLngs.includes(saved)) return saved;
  } catch {}
  return detectBrowserLanguage();
};

const resources = {
  "es-ES": { common: esCommon },
  "en-GB": { common: enCommon },
};

void i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: getSavedLanguage(),
    fallbackLng: "es-ES",
    supportedLngs,
    defaultNS: "common",
    interpolation: { escapeValue: false },
    returnNull: false,
  });

const setHtmlAttrs = (lng: string) => {
  const html = document.documentElement;
  const langConfig = languageConfig.find(l => l.code === lng);
  html.setAttribute("lang", langConfig?.region || lng.split("-")[0]);
  html.setAttribute("dir", "ltr");
};

setHtmlAttrs(i18n.language);

i18n.on("languageChanged", (lng) => {
  setHtmlAttrs(lng);
  try { localStorage.setItem(LANGUAGE_KEY, lng); } catch {}
});

// Dev-mode key integrity checker
if (import.meta.env.DEV) {
  const getKeys = (obj: Record<string, unknown>, prefix = ""): string[] =>
    Object.entries(obj).flatMap(([k, v]) => {
      const path = prefix ? `${prefix}.${k}` : k;
      return typeof v === "object" && v !== null
        ? getKeys(v as Record<string, unknown>, path)
        : [path];
    });

  const baseKeys = new Set(getKeys(esCommon as Record<string, unknown>));
  const enKeys = new Set(getKeys(enCommon as Record<string, unknown>));
  const missing = [...baseKeys].filter(k => !enKeys.has(k));
  const extra = [...enKeys].filter(k => !baseKeys.has(k));
  if (missing.length) console.warn(`[i18n] en-GB missing ${missing.length} keys:`, missing);
  if (extra.length) console.warn(`[i18n] en-GB has ${extra.length} extra keys:`, extra);
}

export const changeLanguage = (lng: string) => i18n.changeLanguage(lng);
export const getCurrentLanguage = () => i18n.language;
export default i18n;
