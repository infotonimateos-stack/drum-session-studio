import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { Card } from "@/components/ui/card";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { ConfigSidebar } from "@/components/ConfigSidebar";
import { StepNavigator } from "@/components/StepNavigator";
import { DrumKitStep } from "@/components/steps/DrumKitStep";
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
import { useCartContext } from "@/contexts/CartContext";
import { validateStep } from "@/hooks/useStepValidation";
import { useTranslation } from "react-i18next";
import { ExpertAdvisor } from "@/components/ExpertAdvisor";
import {
  extractPathSegment,
  getStepFromPath,
  getStepPath,
  getFullPath,
} from "@/config/routes";

interface ConfigurationFlowProps {
  onCheckout: () => void;
}

type FlowMode = "configuration" | "billing" | "checkout";

export const ConfigurationFlow = ({ onCheckout }: ConfigurationFlowProps) => {
  const { i18n } = useTranslation();
  const lang = i18n.language || "es-ES";
  const location = useLocation();
  const navigate = useNavigate();

  // Derive current step from URL
  const pathSegment = extractPathSegment(location.pathname);
  const currentStep = getStepFromPath(pathSegment, lang) ?? 0;

  const [mode, setMode] = useState<FlowMode>("configuration");
  const [billingData, setBillingData] = useState<BillingData | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const { cartState, addItem, removeItem, hasItem, clearCart } = useCartContext();
  const { t } = useTranslation();

  const steps = [
    { title: t("config.steps.drumKit"), component: <DrumKitStep addItem={addItem} removeItem={removeItem} hasItem={hasItem} /> },
    { title: t("config.steps.microphones"), component: <MicrophonesStep addItem={addItem} removeItem={removeItem} hasItem={hasItem} /> },
    { title: t("config.steps.preamps"), component: <PreampsStep addItem={addItem} removeItem={removeItem} hasItem={hasItem} cartState={cartState} /> },
    { title: t("config.steps.interface"), component: <InterfaceStep addItem={addItem} removeItem={removeItem} hasItem={hasItem} cartState={cartState} /> },
    { title: t("config.steps.production"), component: <ProductionStep addItem={addItem} removeItem={removeItem} hasItem={hasItem} /> },
    { title: t("config.steps.video"), component: <VideoStep addItem={addItem} removeItem={removeItem} hasItem={hasItem} /> },
    { title: t("config.steps.takes"), component: <TakesStep addItem={addItem} removeItem={removeItem} hasItem={hasItem} /> },
    { title: t("config.steps.delivery"), component: <DeliveryStep addItem={addItem} removeItem={removeItem} hasItem={hasItem} /> },
    { title: t("config.steps.extras"), component: <ExtrasStep addItem={addItem} removeItem={removeItem} hasItem={hasItem} /> },
  ];

  const goToStep = (stepIndex: number) => {
    const path = getFullPath(getStepPath(stepIndex, lang), lang);
    navigate(path);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePreviousStep = () => {
    if (currentStep > 0) {
      setValidationError(null);
      goToStep(currentStep - 1);
    }
  };

  const stepNames = [
    "inicio_registro", "detalles_proyecto", "configuracion_presupuesto", "confirmacion_final",
    "production", "video", "takes", "delivery", "extras",
  ];

  const trackStepView = (stepIndex: number) => {
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("event", "step_view", {
        step_number: stepIndex + 1,
        step_name: stepNames[stepIndex] || `step_${stepIndex + 1}`,
      });
    }
  };

  const handleNextStep = () => {
    const result = validateStep(currentStep, cartState, t);
    if (!result.valid) {
      setValidationError(result.error);
      return;
    }
    setValidationError(null);
    if (currentStep < steps.length - 1) {
      const nextStep = currentStep + 1;
      goToStep(nextStep);
      trackStepView(nextStep);
    }
  };

  const handleCheckout = () => {
    const result = validateStep(currentStep, cartState, t);
    if (!result.valid) {
      setValidationError(result.error);
      return;
    }
    setValidationError(null);
    setMode("billing");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBillingComplete = (data: BillingData) => {
    setBillingData(data);
    setMode("checkout");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBackToConfiguration = () => {
    setMode("configuration");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBackToBilling = () => {
    setMode("billing");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleConfirmOrder = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    onCheckout();
  };

  // Billing step
  if (mode === "billing") {
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
  if (mode === "checkout" && billingData) {
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
          <div className="container mx-auto px-3 sm:px-6 md:px-8 py-4 sm:py-8">
            <div className="lg:hidden mb-4">
              <SidebarTrigger className="mb-4" />
            </div>
            <div className="mb-6 sm:mb-8">
              <div className="relative overflow-hidden rounded-2xl border-2 border-primary/40 bg-gradient-to-br from-[hsl(18,30%,8%)] via-[hsl(220,15%,10%)] to-[hsl(220,12%,14%)] shadow-[0_0_60px_-12px_hsl(18,80%,52%/0.3),0_8px_40px_-8px_hsl(0,0%,0%/0.6)]">
                {/* Top glow line */}
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent" />
                {/* Corner glows */}
                <div className="absolute -top-24 -right-24 w-80 h-80 bg-primary/15 rounded-full blur-3xl" />
                <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-accent/10 rounded-full blur-3xl" />

                <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-10 p-6 sm:p-12">
                  <div className="space-y-5 sm:space-y-6 flex flex-col justify-center">
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.05] tracking-tight drop-shadow-[0_2px_12px_hsl(18,80%,52%/0.3)]">
                      {t("config.h1")}
                    </h1>
                    <h2 className="text-xl sm:text-2xl font-bold text-primary/90">
                      {t("config.h2subtitle")}
                    </h2>
                    <p className="text-base sm:text-lg text-white/75 leading-relaxed max-w-lg font-medium">{t("config.heroP1")}</p>
                    <div className="flex items-center gap-2.5 bg-gradient-to-r from-primary to-accent text-white px-5 py-2.5 rounded-full text-base font-bold w-fit shadow-[0_4px_24px_-4px_hsl(18,80%,52%/0.5)] hover:shadow-[0_4px_32px_-4px_hsl(18,80%,52%/0.7)] transition-shadow">
                      <ShoppingCart className="w-5 h-5" />
                      {t("config.priceFrom")}
                    </div>
                    <p className="text-sm text-white/55 font-medium">{t("config.heroP2")}</p>
                  </div>
                  <div className="flex items-center justify-center">
                    <div className="relative w-full rounded-xl overflow-hidden ring-1 ring-white/15 shadow-2xl">
                      <video
                        src="/videos/big-drums.mp4"
                        autoPlay
                        loop
                        muted
                        playsInline
                        preload="auto"
                        className="w-full h-auto"
                        style={{ aspectRatio: "16 / 9", objectFit: "cover" }}
                      />
                      <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-xl pointer-events-none" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <Card className="overflow-hidden border-border/60 shadow-sm">
              <div className="p-3 sm:p-6 md:p-8 min-h-[400px] sm:min-h-[600px]">{steps[currentStep].component}</div>
              <StepNavigator
                currentStep={currentStep}
                totalSteps={steps.length}
                onPreviousStep={handlePreviousStep}
                onNextStep={handleNextStep}
                onCheckout={handleCheckout}
                validationError={validationError}
              />
            </Card>
          </div>
        </main>
        <ExpertAdvisor addItem={addItem} clearCart={clearCart} onApply={() => goToStep(0)} />
      </div>
    </SidebarProvider>
  );
};
