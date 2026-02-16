import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { languageConfig } from "@/i18n";

const BASE_URL = "https://drum-session-studio.lovable.app";

export const SEOHead = () => {
  const { i18n, t } = useTranslation();
  const location = useLocation();

  useEffect(() => {
    // Update document title
    document.title = t("seo.title", "Toni Mateos - Grabación Profesional de Baterías Online");

    // Update meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement("meta");
      metaDescription.setAttribute("name", "description");
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute("content", t("seo.description"));

    // Get the path without the language prefix for building alternates
    const pathWithoutLang = location.pathname.replace(/^\/en/, "") || "/";

    // Remove existing hreflang tags
    document.querySelectorAll('link[hreflang]').forEach(el => el.remove());

    // Spanish hreflang (default, no prefix)
    const esLink = document.createElement("link");
    esLink.rel = "alternate";
    esLink.hreflang = "es";
    esLink.href = `${BASE_URL}${pathWithoutLang}`;
    document.head.appendChild(esLink);

    // English hreflang (/en prefix)
    const enLink = document.createElement("link");
    enLink.rel = "alternate";
    enLink.hreflang = "en";
    enLink.href = `${BASE_URL}/en${pathWithoutLang === "/" ? "" : pathWithoutLang}`;
    document.head.appendChild(enLink);

    // x-default → Spanish
    const defaultLink = document.createElement("link");
    defaultLink.rel = "alternate";
    defaultLink.hreflang = "x-default";
    defaultLink.href = `${BASE_URL}${pathWithoutLang}`;
    document.head.appendChild(defaultLink);

    // Update canonical URL (current language version)
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    const isEnglish = i18n.language === "en-GB";
    canonical.setAttribute("href", isEnglish
      ? `${BASE_URL}/en${pathWithoutLang === "/" ? "" : pathWithoutLang}`
      : `${BASE_URL}${pathWithoutLang}`
    );

    // Update Open Graph locale
    let ogLocale = document.querySelector('meta[property="og:locale"]');
    if (!ogLocale) {
      ogLocale = document.createElement("meta");
      ogLocale.setAttribute("property", "og:locale");
      document.head.appendChild(ogLocale);
    }
    ogLocale.setAttribute("content", i18n.language.replace("-", "_"));

    // Add og:locale:alternate
    document.querySelectorAll('meta[property="og:locale:alternate"]').forEach(el => el.remove());
    const alternateLang = isEnglish ? "es_ES" : "en_GB";
    const ogAlt = document.createElement("meta");
    ogAlt.setAttribute("property", "og:locale:alternate");
    ogAlt.setAttribute("content", alternateLang);
    document.head.appendChild(ogAlt);

  }, [i18n.language, t, location.pathname]);

  return null;
};
