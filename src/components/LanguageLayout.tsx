import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { changeLanguage } from "@/i18n";

interface LanguageLayoutProps {
  lang: "es-ES" | "en-GB";
}

/**
 * Layout route that syncs the URL prefix with i18next language.
 * Wraps all routes for a given language.
 */
export const LanguageLayout = ({ lang }: LanguageLayoutProps) => {
  const { i18n } = useTranslation();
  const location = useLocation();

  useEffect(() => {
    if (i18n.language !== lang) {
      changeLanguage(lang);
    }
  }, [lang, i18n.language, location.pathname]);

  return <Outlet />;
};
