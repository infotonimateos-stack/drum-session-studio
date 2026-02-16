import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useCallback } from "react";

/**
 * Returns the current language prefix for building links.
 * Spanish (default) = "" | English = "/en"
 */
export const useLanguagePrefix = () => {
  const { i18n } = useTranslation();
  const prefix = i18n.language === "en-GB" ? "/en" : "";
  
  /** Build a localised path: localePath("/aviso-legal") → "/en/aviso-legal" or "/aviso-legal" */
  const localePath = useCallback(
    (path: string) => {
      // Ensure path starts with /
      const cleanPath = path.startsWith("/") ? path : `/${path}`;
      return `${prefix}${cleanPath}`;
    },
    [prefix]
  );

  return { prefix, localePath };
};

/**
 * Get the equivalent path in the other language.
 * Used by the language selector to navigate without losing route.
 */
export const getAlternateLanguagePath = (currentPath: string, currentLang: string): string => {
  const isEnglish = currentLang === "en-GB";
  
  if (isEnglish) {
    // Currently English → switch to Spanish: remove /en prefix
    const pathWithoutPrefix = currentPath.replace(/^\/en/, "") || "/";
    return pathWithoutPrefix;
  } else {
    // Currently Spanish → switch to English: add /en prefix
    return `/en${currentPath === "/" ? "" : currentPath}`;
  }
};
