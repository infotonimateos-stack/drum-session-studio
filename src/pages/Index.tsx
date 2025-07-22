import { useState } from "react";
import { Header } from "@/components/Header";
import { ConfigurationFlow } from "@/components/ConfigurationFlow";
import { CheckoutForm } from "@/components/CheckoutForm";
import { AboutTab } from "@/components/tabs/AboutTab";
import { StudioTab } from "@/components/tabs/StudioTab";
import { SamplesTab } from "@/components/tabs/SamplesTab";
import { TutorialsTab } from "@/components/tabs/TutorialsTab";
import { FAQTab } from "@/components/tabs/FAQTab";
import { ContactTab } from "@/components/tabs/ContactTab";
import { useCart } from "@/hooks/useCart";

const Index = () => {
  const [activeTab, setActiveTab] = useState("configure");
  const [showCheckout, setShowCheckout] = useState(false);
  const { cartState } = useCart();

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
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-background">
      <Header activeTab={activeTab} onTabChange={setActiveTab} />
      {renderContent()}
    </div>
  );
};

export default Index;
