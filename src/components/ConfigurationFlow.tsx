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
import { BillingStep, BillingData } from "@/components/BillingStep";
import { CheckoutSummary } from "@/components/CheckoutSummary";
import { useCart } from "@/hooks/useCart";
import { useTranslation } from "react-i18next";

interface ConfigurationFlowProps {
  onCheckout: () => void;
}

type FlowMode = 'configuration' | 'billing' | 'checkout';

export const ConfigurationFlow = ({ onCheckout }: ConfigurationFlowProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [mode, setMode] = useState<FlowMode>('configuration');
  const [billingData, setBillingData] = useState<BillingData | null>(null);
  const { cartState, addItem, removeItem, hasItem } = useCart();
  const { t } = useTranslation();

  const steps = [
    { title: t("config.steps.microphones"), component: <MicrophonesStep addItem={addItem} removeItem={removeItem} hasItem={hasItem} /> },
    { title: t("config.steps.preamps"), component: <PreampsStep addItem={addItem} removeItem={removeItem} hasItem={hasItem} /> },
    { title: t("config.steps.interface"), component: <InterfaceStep addItem={addItem} removeItem={removeItem} hasItem={hasItem} /> },
    { title: t("config.steps.production"), component: <ProductionStep addItem={addItem} removeItem={removeItem} hasItem={hasItem} /> },
    { title: t("config.steps.video"), component: <VideoStep addItem={addItem} removeItem={removeItem} hasItem={hasItem} /> },
    { title: t("config.steps.takes"), component: <TakesStep addItem={addItem} removeItem={removeItem} hasItem={hasItem} /> },
    { title: t("config.steps.delivery"), component: <DeliveryStep addItem={addItem} removeItem={removeItem} hasItem={hasItem} /> },
    { title: t("config.steps.extras"), component: <ExtrasStep addItem={addItem} removeItem={removeItem} hasItem={hasItem} /> },
  ];

  const handlePreviousStep = () => {
    if (currentStep > 0) { setCurrentStep(currentStep - 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }
  };
  const handleNextStep = () => {
    if (currentStep < steps.length - 1) { setCurrentStep(currentStep + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }
  };

  const handleCheckout = () => {
    setMode('billing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBillingComplete = (data: BillingData) => {
    setBillingData(data);
    setMode('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToConfiguration = () => {
    setMode('configuration');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToBilling = () => {
    setMode('billing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleConfirmOrder = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    onCheckout();
  };

  // Billing step
  if (mode === 'billing') {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <BillingStep
            onComplete={handleBillingComplete}
            onBack={handleBackToConfiguration}
            subtotal={cartState.total}
            paypalFeePercent={0.05}
            paymentMethod="card"
          />
        </div>
      </div>
    );
  }

  // Checkout
  if (mode === 'checkout' && billingData) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <CheckoutSummary
            cartState={cartState}
            billingData={billingData}
            onConfirmOrder={handleConfirmOrder}
            onBack={handleBackToBilling}
          />
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-background flex w-full overflow-x-hidden">
        <ConfigSidebar
          currentStep={currentStep}
          totalSteps={steps.length}
          cartState={cartState}
          removeItem={removeItem}
          onCheckout={handleCheckout}
        />
        <main className="flex-1 overflow-x-hidden">
          <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
            <div className="lg:hidden mb-4">
              <SidebarTrigger className="mb-4" />
            </div>
            <div className="mb-6 sm:mb-8">
              <Card className="overflow-hidden border-border/60 shadow-sm">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8 p-4 sm:p-8">
                  <div className="space-y-3 sm:space-y-4">
                    <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
                      <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                        {t("config.h1")}
                      </h1>
                    </div>
                    <h2 className="text-lg sm:text-xl font-semibold text-foreground/80">
                      {t("config.h2subtitle")}
                    </h2>
                    <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">{t("config.heroP1")}</p>
                    <div className="flex items-center gap-2 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium w-fit">
                      <Star className="w-4 h-4 fill-current" />
                      {t("config.priceFrom")}
                    </div>
                    <p className="text-sm text-muted-foreground">{t("config.heroP2")}</p>
                  </div>
                  <div className="flex items-center justify-center">
                    <img src="/lovable-uploads/3beb9f76-a64e-4bec-a58b-9b8f4990203b.png" alt={t("config.imgAlt")} className="rounded-lg shadow-lg object-cover object-[center_top_10%] w-full h-40 sm:h-48 lg:h-64" />
                  </div>
                </div>
              </Card>
            </div>
            <Card className="overflow-hidden border-border/60 shadow-sm">
              <div className="p-3 sm:p-8 min-h-[400px] sm:min-h-[600px]">{steps[currentStep].component}</div>
              <StepNavigator currentStep={currentStep} totalSteps={steps.length} onPreviousStep={handlePreviousStep} onNextStep={handleNextStep} onCheckout={handleCheckout} />
            </Card>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};
