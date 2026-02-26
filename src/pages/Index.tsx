import { useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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
import { useCartContext } from "@/contexts/CartContext";
import { SEOHead } from "@/components/SEOHead";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import {
  extractPathSegment,
  getTabFromPath,
  getStepFromPath,
  getTabPath,
  getFullPath,
} from "@/config/routes";

const Index = () => {
  const { i18n } = useTranslation();
  const lang = i18n.language || "es-ES";
  const location = useLocation();
  const navigate = useNavigate();
  const { cartState } = useCartContext();
  const [showCheckout, setShowCheckout] = useState(false);

  // Derive active tab/step from URL
  const pathSegment = extractPathSegment(location.pathname);
  const activeTab = getTabFromPath(pathSegment, lang);
  const activeStep = getStepFromPath(pathSegment, lang);
  const isConfigurator = activeTab === "configure" || activeStep !== null;
  const currentTab = activeTab || (activeStep !== null ? "configure" : "configure");

  const handleTabChange = useCallback(
    (tab: string) => {
      const path = getFullPath(getTabPath(tab, lang), lang);
      navigate(path);
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [lang, navigate]
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
    if (isConfigurator) {
      return <ConfigurationFlow onCheckout={handleCheckout} />;
    }
    switch (activeTab) {
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
      <Header activeTab={currentTab} onTabChange={handleTabChange} />
      <div className="flex-1">{renderContent()}</div>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Index;
