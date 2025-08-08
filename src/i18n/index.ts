import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Minimal resources (expand as needed)
const resources = {
  "es-ES": {
    common: {
      header: {
        brand: "Toni Mateos Online Drums Recording"
      },
      nav: {
        configure: "Configura tu Sesión",
        about: "Quién Soy",
        studio: "El Estudio",
        samples: "Descarga una Muestra",
        tutorials: "Tutoriales",
        faq: "Preguntas Frecuentes",
        contact: "Contacto"
      },
      samples: {
        heading: "Descarga nuestras pistas de muestra",
        subheading: "Mézclalas en tu estudio y comprueba la calidad de nuestras grabaciones",
        cardTitle: "Descarga las pistas de muestra",
        cardDesc: "Descarga las pistas en alta calidad (24-bit/48kHz)",
        button: "Descargar pistas de muestra",
        imageAlt: "Imagen hiperrealista de una sesión de Pro Tools con pistas de colores - muestras de batería"
      },
      studio: {
        title: "El Estudio",
        subtitle: "Un espacio diseñado específicamente para capturar el mejor sonido de batería",
        processTitle: "¿Cómo funciona?",
        step1Title: "Configuración",
        step1Text: "Configura tu setup según tus necesidades (desde 49,90 euros!)",
        step2Title: "Envíanos el material",
        step2Text: "Envíanos todo el material que necesitamos para empezar tu grabación",
        step3Title: "Grabación y envío de pistas",
        step3Text: "Te enviamos las pistas de batería por Wetransfer con la máxima calidad"
      }
    }
  },
  "en-GB": {
    common: {
      header: {
        brand: "Toni Mateos Online Drums Recording"
      },
      nav: {
        configure: "Configure your Session",
        about: "About Me",
        studio: "The Studio",
        samples: "Download a Sample",
        tutorials: "Tutorials",
        faq: "FAQ",
        contact: "Contact"
      },
      samples: {
        heading: "Download our sample tracks",
        subheading: "Mix them in your studio and check the quality of our recordings",
        cardTitle: "Download the sample stems",
        cardDesc: "Download high-quality stems (24-bit/48kHz)",
        button: "Download sample stems",
        imageAlt: "Hyper-realistic Pro Tools session with colourful tracks – drum samples"
      },
      studio: {
        title: "The Studio",
        subtitle: "A space designed specifically to capture the best drum sound",
        processTitle: "How does it work?",
        step1Title: "Setup",
        step1Text: "Configure your setup according to your needs (from €49.90!)",
        step2Title: "Send us your materials",
        step2Text: "Send everything we need to start your recording",
        step3Title: "Recording and delivery",
        step3Text: "We send the drum stems via WeTransfer in maximum quality"
      }
    }
  }
};

const supportedLngs = [
  "es-ES","en-GB",
  // German
  "de-DE","de-AT","de-CH",
  // French
  "fr-FR","fr-CH","fr-BE","fr-CA",
  // Japanese
  "ja-JP",
  // Chinese
  "zh-CN","zh-TW","zh-SG",
  // Korean
  "ko-KR",
  // Arabic (Gulf)
  "ar-AE","ar-QA","ar-SA","ar-KW",
  // Italian
  "it-IT","it-CH",
  // Dutch
  "nl-NL","nl-BE",
  // Swedish
  "sv-SE","sv-FI",
  // Norwegian
  "nb-NO",
  // Danish
  "da-DK",
  // Finnish
  "fi-FI",
  // Portuguese (Portugal)
  "pt-PT",
  // Russian
  "ru-RU",
  // Hebrew
  "he-IL",
  // Czech
  "cs-CZ",
  // Polish
  "pl-PL",
  // Turkish
  "tr-TR"
];

void i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "es-ES", // default language
    fallbackLng: "en-GB",
    supportedLngs,
    defaultNS: "common",
    interpolation: { escapeValue: false },
    returnNull: false
  });

// Keep <html lang> and dir attributes in sync
const setHtmlAttrs = (lng: string) => {
  const html = document.documentElement;
  html.setAttribute("lang", lng);
  const rtlLangs = ["ar", "he", "fa", "ur"]; // rtl set
  const dir = rtlLangs.some(code => lng.startsWith(code)) ? "rtl" : "ltr";
  html.setAttribute("dir", dir);
};

setHtmlAttrs(i18n.language);
i18n.on("languageChanged", setHtmlAttrs);

export default i18n;
