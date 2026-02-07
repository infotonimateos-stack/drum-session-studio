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
    if (saved && supportedLngs.includes(saved)) {
      return saved;
    }
  } catch {
    // localStorage not available
  }
  return "es-ES";
};

// Top 20 world languages
const supportedLngs = [
  "es-ES",   // Spanish
  "en-GB",   // English
  "zh-CN",   // Chinese (Simplified)
  "hi-IN",   // Hindi
  "ar-SA",   // Arabic
  "pt-BR",   // Portuguese (Brazil)
  "pt-PT",   // Portuguese (Portugal)
  "ru-RU",   // Russian
  "ja-JP",   // Japanese
  "de-DE",   // German
  "fr-FR",   // French
  "ko-KR",   // Korean
  "it-IT",   // Italian
  "tr-TR",   // Turkish
  "vi-VN",   // Vietnamese
  "pl-PL",   // Polish
  "nl-NL",   // Dutch
  "uk-UA",   // Ukrainian
  "id-ID",   // Indonesian
  "th-TH",   // Thai
];

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
    returnNull: false
  });

// Keep <html lang> and dir attributes in sync
const setHtmlAttrs = (lng: string) => {
  const html = document.documentElement;
  html.setAttribute("lang", lng);
  const rtlLangs = ["ar", "he", "fa", "ur"];
  const dir = rtlLangs.some(code => lng.startsWith(code)) ? "rtl" : "ltr";
  html.setAttribute("dir", dir);
};

setHtmlAttrs(i18n.language);

// Language code mapping for translation API
const mapToTranslateCode = (lng: string): string => {
  const code = lng.split("-")[0];
  const mapping: Record<string, string> = {
    "zh": "zh-CN",
    "pt": "pt",
    "nb": "no",
  };
  return mapping[code] || code;
};

// Cache key for translations
const cacheKey = (lng: string) => `i18n-cache-${lng}-v2`;

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
      await new Promise(resolve => setTimeout(resolve, 50));
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

export default i18n;
