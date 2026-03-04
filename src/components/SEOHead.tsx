import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";

const BASE_URL = "https://tonimateos.com";

interface SEOHeadProps {
  titleKey?: string;
  descriptionKey?: string;
  image?: string;
}

export const SEOHead = ({ titleKey, descriptionKey, image }: SEOHeadProps) => {
  const { i18n, t } = useTranslation();
  const location = useLocation();
  const isEnglish = i18n.language === "en-GB";

  const title = titleKey ? t(titleKey) : t("seo.title");
  const description = descriptionKey ? t(descriptionKey) : t("seo.description");
  const ogImage = image || `${BASE_URL}/lovable-uploads/903f1003-c2ac-486f-970e-14aeef1bdc43.png`;

  const pathWithoutLang = location.pathname.replace(/^\/en/, "") || "/";
  const canonicalUrl = isEnglish
    ? `${BASE_URL}/en${pathWithoutLang === "/" ? "" : pathWithoutLang}`
    : `${BASE_URL}${pathWithoutLang}`;

  const esUrl = `${BASE_URL}${pathWithoutLang}`;
  const enUrl = `${BASE_URL}/en${pathWithoutLang === "/" ? "" : pathWithoutLang}`;

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />

      {/* hreflang alternates */}
      <link rel="alternate" hrefLang="es" href={esUrl} />
      <link rel="alternate" hrefLang="en" href={enUrl} />
      <link rel="alternate" hrefLang="x-default" href={esUrl} />

      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content="website" />
      <meta property="og:image" content={ogImage} />
      <meta property="og:locale" content={i18n.language.replace("-", "_")} />
      <meta property="og:locale:alternate" content={isEnglish ? "es_ES" : "en_GB"} />
      <meta property="og:site_name" content="Toni Mateos - Drum Recording" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* Language */}
      <html lang={isEnglish ? "en" : "es"} />
    </Helmet>
  );
};
