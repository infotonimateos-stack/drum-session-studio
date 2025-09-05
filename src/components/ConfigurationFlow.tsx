import { useState } from "react";
import { Star } from "lucide-react";
import { Card } from "@/components/ui/card";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { ConfigSidebar } from "@/components/ConfigSidebar";
import { StepNavigator } from "@/components/StepNavigator";
import { MicrophonesStep } from "@/components/steps/MicrophonesStep";
import { PreampsStep } from "@/components/steps/PreampsStep";
import { InterfaceStep } from "@/components/steps/InterfaceStep";
import { ProductionStep } from "@/components/steps/ProductionStep";
import { VideoStep } from "@/components/steps/VideoStep";
import { TakesStep } from "@/components/steps/TakesStep";
import { DeliveryStep } from "@/components/steps/DeliveryStep";
import { ExtrasStep } from "@/components/steps/ExtrasStep";
import { CheckoutSummary } from "@/components/CheckoutSummary";
import { useCart } from "@/hooks/useCart";
import { useTranslation } from "react-i18next";
interface ConfigurationFlowProps {
  onCheckout: () => void;
}

type FlowMode = 'configuration' | 'checkout';

export const ConfigurationFlow = ({ onCheckout }: ConfigurationFlowProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [mode, setMode] = useState<FlowMode>('configuration');
  const { cartState, addItem, removeItem, hasItem } = useCart();
  const { t } = useTranslation();

  const steps = [
    { 
      title: t("config.steps.microphones"), 
      component: <MicrophonesStep addItem={addItem} removeItem={removeItem} hasItem={hasItem} />
    },
    { 
      title: t("config.steps.preamps"), 
      component: <PreampsStep addItem={addItem} removeItem={removeItem} hasItem={hasItem} />
    },
    { 
      title: t("config.steps.interface"), 
      component: <InterfaceStep addItem={addItem} removeItem={removeItem} hasItem={hasItem} />
    },
    { 
      title: t("config.steps.production"), 
      component: <ProductionStep addItem={addItem} removeItem={removeItem} hasItem={hasItem} />
    },
    { 
      title: t("config.steps.video"), 
      component: <VideoStep addItem={addItem} removeItem={removeItem} hasItem={hasItem} />
    },
    { 
      title: t("config.steps.takes"), 
      component: <TakesStep addItem={addItem} removeItem={removeItem} hasItem={hasItem} />
    },
    { 
      title: t("config.steps.delivery"), 
      component: <DeliveryStep addItem={addItem} removeItem={removeItem} hasItem={hasItem} />
    },
    { 
      title: t("config.steps.extras"), 
      component: <ExtrasStep addItem={addItem} removeItem={removeItem} hasItem={hasItem} />
    }
  ];

  const handlePreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleCheckout = () => {
    setMode('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToConfiguration = () => {
    setMode('configuration');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleConfirmOrder = () => {
    onCheckout();
  };

  // Show checkout summary
  if (mode === 'checkout') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-warm-cream/30 to-warm-peach/20">
        <div className="container mx-auto px-4 py-8">
          <CheckoutSummary
            cartState={cartState}
            onConfirmOrder={handleConfirmOrder}
            onBack={handleBackToConfiguration}
          />
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-gradient-to-br from-warm-cream/30 to-warm-peach/20 flex w-full">
        <ConfigSidebar
          currentStep={currentStep}
          totalSteps={steps.length}
          cartState={cartState}
          removeItem={removeItem}
          onCheckout={handleCheckout}
        />
        
        <main className="flex-1 overflow-auto">
          <div className="container mx-auto px-4 py-8">
            {/* Sidebar trigger for mobile */}
            <div className="lg:hidden mb-4">
              <SidebarTrigger className="mb-4" />
            </div>
            
            {/* Header Section */}
            <div className="mb-8">
              <Card className="overflow-hidden bg-gradient-to-br from-warm-peach/20 to-warm-apricot/30 shadow-xl border-warm-coral/30">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 flex-wrap">
                      <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                        {t("config.heroTitle")}
                      </h1>
                      <div className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-yellow-500 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg">
                        <Star className="w-4 h-4 fill-current" />
                        {t("config.priceFrom")}
                      </div>
                    </div>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                      {t("config.heroP1")}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {t("config.heroP2")}
                    </p>
                  </div>
                  <div className="flex items-center justify-center">
                    <img 
                      src="/lovable-uploads/3beb9f76-a64e-4bec-a58b-9b8f4990203b.png" 
                      alt={t("config.imgAlt")} 
                      className="rounded-lg shadow-lg object-cover object-[center_top_10%] w-full h-48 lg:h-64"
                    />
                  </div>
                </div>
              </Card>
            </div>

            {/* Main Content */}
            <Card className="overflow-hidden bg-gradient-to-br from-warm-peach/10 to-warm-blush/10 shadow-xl border-warm-coral/20">
              {/* Step Content */}
              <div className="p-8 min-h-[600px]">
                {steps[currentStep].component}
              </div>
              
              {/* Navigation */}
              <StepNavigator
                currentStep={currentStep}
                totalSteps={steps.length}
                onPreviousStep={handlePreviousStep}
                onNextStep={handleNextStep}
                onCheckout={handleCheckout}
              />
            </Card>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};