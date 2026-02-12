import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { languageConfig } from "@/i18n";

const BASE_URL = "https://drum-session-studio.lovable.app";

export const SEOHead = () => {
  const { i18n, t } = useTranslation();

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
    metaDescription.setAttribute("content", t("seo.description", "Servicio profesional de grabación de baterías online. Más de 35 años de experiencia y 1000+ álbumes grabados."));

    // Remove existing hreflang tags
    document.querySelectorAll('link[hreflang]').forEach(el => el.remove());

    // Add hreflang tags for all supported languages
    languageConfig.forEach((lang) => {
      const link = document.createElement("link");
      link.rel = "alternate";
      link.hreflang = lang.region;
      link.href = `${BASE_URL}?lang=${lang.code}`;
      document.head.appendChild(link);
    });

    // Add x-default hreflang
    const defaultLink = document.createElement("link");
    defaultLink.rel = "alternate";
    defaultLink.hreflang = "x-default";
    defaultLink.href = BASE_URL;
    document.head.appendChild(defaultLink);

    // Update canonical URL
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", BASE_URL);

    // Update Open Graph locale
    let ogLocale = document.querySelector('meta[property="og:locale"]');
    if (!ogLocale) {
      ogLocale = document.createElement("meta");
      ogLocale.setAttribute("property", "og:locale");
      document.head.appendChild(ogLocale);
    }
    ogLocale.setAttribute("content", i18n.language.replace("-", "_"));

  }, [i18n.language, t]);

  return null;
};
