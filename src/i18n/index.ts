import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Import translation files
import esCommon from "./locales/es-ES/common.json";
import enCommon from "./locales/en-GB/common.json";

const LANGUAGE_KEY = "drum-studio-language";

// Language configuration with native names and regions
export const languageConfig = [
  { code: "es-ES", name: "Español", flag: "🇪🇸", region: "es" },
  { code: "en-GB", name: "English", flag: "🇬🇧", region: "en" },
  { code: "de-DE", name: "Deutsch", flag: "🇩🇪", region: "de" },
  { code: "fr-FR", name: "Français", flag: "🇫🇷", region: "fr" },
  { code: "ja-JP", name: "日本語", flag: "🇯🇵", region: "ja" },
  { code: "zh-CN", name: "中文", flag: "🇨🇳", region: "zh" },
  { code: "it-IT", name: "Italiano", flag: "🇮🇹", region: "it" },
  { code: "pt-BR", name: "Português", flag: "🇧🇷", region: "pt" },
  { code: "nl-NL", name: "Nederlands", flag: "🇳🇱", region: "nl" },
  { code: "ko-KR", name: "한국어", flag: "🇰🇷", region: "ko" },
  { code: "sv-SE", name: "Svenska", flag: "🇸🇪", region: "sv" },
  { code: "nb-NO", name: "Norsk", flag: "🇳🇴", region: "no" },
  { code: "da-DK", name: "Dansk", flag: "🇩🇰", region: "da" },
  { code: "fi-FI", name: "Suomi", flag: "🇫🇮", region: "fi" },
  { code: "pl-PL", name: "Polski", flag: "🇵🇱", region: "pl" },
  { code: "ru-RU", name: "Русский", flag: "🇷🇺", region: "ru" },
  { code: "tr-TR", name: "Türkçe", flag: "🇹🇷", region: "tr" },
  { code: "ar-SA", name: "العربية", flag: "🇸🇦", region: "ar" },
  { code: "he-IL", name: "עברית", flag: "🇮🇱", region: "he" },
  { code: "hi-IN", name: "हिन्दी", flag: "🇮🇳", region: "hi" },
];

const supportedLngs = languageConfig.map(l => l.code);

// Detect browser language
const detectBrowserLanguage = (): string => {
  try {
    const browserLang = navigator.language || (navigator as any).userLanguage;
    // Find exact match
    if (supportedLngs.includes(browserLang)) {
      return browserLang;
    }
    // Find by language code (e.g., "en" matches "en-GB")
    const langCode = browserLang.split("-")[0];
    const match = languageConfig.find(l => l.region === langCode);
    if (match) {
      return match.code;
    }
  } catch {
    // Browser detection failed
  }
  return "es-ES";
};

// Get saved language from localStorage or detect from browser
const getSavedLanguage = (): string => {
  try {
    const saved = localStorage.getItem(LANGUAGE_KEY);
    if (saved && supportedLngs.includes(saved)) {
      return saved;
    }
  } catch {
    // localStorage not available
  }
  return detectBrowserLanguage();
};

const resources: Record<string, { common: typeof esCommon }> = {
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

// Keep <html lang> and dir attributes in sync
const setHtmlAttrs = (lng: string) => {
  const html = document.documentElement;
  const langConfig = languageConfig.find(l => l.code === lng);
  html.setAttribute("lang", langConfig?.region || lng.split("-")[0]);
  const rtlLangs = ["ar", "he"];
  const dir = rtlLangs.some(code => lng.startsWith(code)) ? "rtl" : "ltr";
  html.setAttribute("dir", dir);
};

setHtmlAttrs(i18n.language);

// Language code mapping for translation API
const mapToTranslateCode = (lng: string): string => {
  const mapping: Record<string, string> = {
    "es-ES": "es",
    "en-GB": "en",
    "de-DE": "de",
    "fr-FR": "fr",
    "ja-JP": "ja",
    "zh-CN": "zh-CN",
    "it-IT": "it",
    "pt-BR": "pt",
    "nl-NL": "nl",
    "ko-KR": "ko",
    "sv-SE": "sv",
    "nb-NO": "no",
    "da-DK": "da",
    "fi-FI": "fi",
    "pl-PL": "pl",
    "ru-RU": "ru",
    "tr-TR": "tr",
    "ar-SA": "ar",
    "he-IL": "he",
    "hi-IN": "hi",
  };
  return mapping[lng] || lng.split("-")[0];
};

// Cache key for translations
const cacheKey = (lng: string) => `i18n-cache-${lng}-v3`;

// Type for nested translation object
interface TranslationDict {
  [key: string]: string | TranslationDict;
}

// Simple translation using MyMemory API (free, no auth required)
async function translateText(text: string, targetLang: string): Promise<string> {
  try {
    const response = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=es|${targetLang}`
    );
    const data = await response.json();
    if (data.responseStatus === 200 && data.responseData?.translatedText) {
      return data.responseData.translatedText;
    }
    return text;
  } catch {
    return text;
  }
}

// Translate nested object
async function translateObject(obj: TranslationDict, targetLang: string): Promise<TranslationDict> {
  const result: TranslationDict = {};
  
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === "string") {
      // Add small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
      result[key] = await translateText(value, targetLang);
    } else if (typeof value === "object" && value !== null) {
      result[key] = await translateObject(value as TranslationDict, targetLang);
    }
  }
  
  return result;
}

// Load or generate translations for a language
async function ensureBundle(lng: string): Promise<void> {
  // Skip if already loaded or is base language
  if (lng === "es-ES" || lng === "en-GB" || i18n.hasResourceBundle(lng, "common")) {
    return;
  }

  const key = cacheKey(lng);
  
  // Try to load from cache
  try {
    const cached = localStorage.getItem(key);
    if (cached) {
      const bundle = JSON.parse(cached);
      i18n.addResourceBundle(lng, "common", bundle, true, true);
      return;
    }
  } catch {
    // Cache read failed
  }

  // Generate translations
  const targetCode = mapToTranslateCode(lng);
  const bundle = await translateObject(esCommon as TranslationDict, targetCode);
  
  // Save to cache
  try {
    localStorage.setItem(key, JSON.stringify(bundle));
  } catch {
    // Cache write failed
  }

  i18n.addResourceBundle(lng, "common", bundle, true, true);
}

// Track loading state
let loadingLng: string | null = null;

// Handle language changes
i18n.on("languageChanged", async (lng) => {
  setHtmlAttrs(lng);
  
  // Save to localStorage
  try {
    localStorage.setItem(LANGUAGE_KEY, lng);
  } catch {
    // localStorage not available
  }

  // Load translations if needed
  if (lng !== "es-ES" && lng !== "en-GB" && !i18n.hasResourceBundle(lng, "common")) {
    if (loadingLng === lng) return;
    loadingLng = lng;
    await ensureBundle(lng);
    loadingLng = null;
  }
});

// Export for use in components
export const changeLanguage = (lng: string) => {
  return i18n.changeLanguage(lng);
};

export const getCurrentLanguage = () => i18n.language;

export default i18n;
