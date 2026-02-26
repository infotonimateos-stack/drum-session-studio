import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useCallback } from "react";
import {
  extractPathSegment,
  getTabFromPath,
  getStepFromPath,
  getTabPath,
  getStepPath,
  getFullPath,
  getAlternateLanguagePathFromRoutes,
} from "@/config/routes";

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
 * Uses the route config to properly map tab/step paths between languages.
 */
export const getAlternateLanguagePath = (currentPath: string, currentLang: string): string => {
  return getAlternateLanguagePathFromRoutes(currentPath, currentLang);
};
