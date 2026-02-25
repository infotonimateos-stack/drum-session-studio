import { useState, useEffect, useCallback } from "react";
import { Header } from "@/components/Header";
import { ConfigurationFlow } from "@/components/ConfigurationFlow";
import { CheckoutForm } from "@/components/CheckoutForm";
import { AboutTab } from "@/components/tabs/AboutTab";
import { StudioTab } from "@/components/tabs/StudioTab";
import { SamplesTab } from "@/components/tabs/SamplesTab";
import { TutorialsTab } from "@/components/tabs/TutorialsTab";
import { FAQTab } from "@/components/tabs/FAQTab";
import { ContactTab } from "@/components/tabs/ContactTab";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { useCart } from "@/hooks/useCart";
import { SEOHead } from "@/components/SEOHead";
import { useTranslation } from "react-i18next";

// SEO-optimized hash maps per language
const hashToTab: Record<string, Record<string, string>> = {
  "es-ES": {
    "grabacion-baterias-online": "configure",
    "baterista-sesion-profesional": "about",
    "estudio-grabacion-baterias-vintage": "studio",
    "muestras-pistas-bateria": "samples",
    "tutoriales": "tutorials",
    "faq-grabacion-baterias": "faq",
    "contacto": "contact",
  },
  "en-GB": {
    "online-drum-recording": "configure",
    "professional-session-drummer": "about",
    "vintage-drum-recording-studio": "studio",
    "drum-track-samples": "samples",
    "tutorials": "tutorials",
    "faq-drum-recording": "faq",
    "contact": "contact",
  },
};

const tabToHash: Record<string, Record<string, string>> = {
  "es-ES": {
    configure: "grabacion-baterias-online",
    about: "baterista-sesion-profesional",
    studio: "estudio-grabacion-baterias-vintage",
    samples: "muestras-pistas-bateria",
    tutorials: "tutoriales",
    faq: "faq-grabacion-baterias",
    contact: "contacto",
  },
  "en-GB": {
    configure: "online-drum-recording",
    about: "professional-session-drummer",
    studio: "vintage-drum-recording-studio",
    samples: "drum-track-samples",
    tutorials: "tutorials",
    faq: "faq-drum-recording",
    contact: "contact",
  },
};

const resolveTabFromHash = (hash: string, lang: string): string | null => {
  const clean = hash.replace("#", "");
  if (!clean) return null;
  const map = hashToTab[lang] || hashToTab["es-ES"];
  return map[clean] || null;
};

const Index = () => {
  const { i18n } = useTranslation();
  const lang = i18n.language || "es-ES";

  const getInitialTab = () => {
    const hash = window.location.hash.replace("#", "");
    if (hash) {
      const map = hashToTab[lang] || hashToTab["es-ES"];
      if (map[hash]) return map[hash];
    }
    return "configure";
  };

  const [activeTab, setActiveTab] = useState(getInitialTab);
  const [showCheckout, setShowCheckout] = useState(false);
  const { cartState } = useCart();

  // Sync hash → tab on popstate (back/forward)
  useEffect(() => {
    const onHashChange = () => {
      const tab = resolveTabFromHash(window.location.hash, lang);
      if (tab) setActiveTab(tab);
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, [lang]);

  // Update hash when tab changes
  const handleTabChange = useCallback(
    (tab: string) => {
      setActiveTab(tab);
      const hashes = tabToHash[lang] || tabToHash["es-ES"];
      const hash = hashes[tab];
      if (hash) {
        window.history.replaceState(null, "", `#${hash}`);
      }
    },
    [lang]
  );

  const handleCheckout = () => {
    setShowCheckout(true);
  };

  const handleBackToConfig = () => {
    setShowCheckout(false);
  };

  if (showCheckout) {
    return <CheckoutForm cartState={cartState} onBack={handleBackToConfig} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case "configure":
        return <ConfigurationFlow onCheckout={handleCheckout} />;
      case "about":
        return <AboutTab />;
      case "studio":
        return <StudioTab />;
      case "samples":
        return <SamplesTab />;
      case "tutorials":
        return <TutorialsTab />;
      case "faq":
        return <FAQTab />;
      case "contact":
        return <ContactTab />;
      default:
        return <ConfigurationFlow onCheckout={handleCheckout} />;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEOHead />
      <Header activeTab={activeTab} onTabChange={handleTabChange} />
      <div className="flex-1">
        {renderContent()}
      </div>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Index;
