import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ShoppingCart, GraduationCap } from "lucide-react";
import { HeroVideoDual } from "@/components/HeroVideoTabs";
import { FloatingVideoPlayer } from "@/components/FloatingVideoPlayer";
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
  const [floatingVideo, setFloatingVideo] = useState(false);
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
            <div className="mb-8 sm:mb-12">
              <div className="relative overflow-hidden rounded-3xl border border-primary/50 shadow-[0_0_80px_-10px_hsl(18,80%,52%/0.35),0_0_30px_-5px_hsl(28,75%,55%/0.2)]">
                {/* Animated background */}
                <div className="absolute inset-0 bg-gradient-to-br from-[hsl(18,40%,6%)] via-[hsl(220,20%,8%)] to-[hsl(18,20%,4%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_20%_40%,hsl(18,80%,52%/0.15),transparent_70%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_80%_60%,hsl(28,75%,55%/0.1),transparent_70%)]" />
                
                {/* Orbiting glow — animated with inline styles */}
                <div
                  className="absolute rounded-full pointer-events-none"
                  style={{
                    width: 500, height: 500, top: -150, left: -150,
                    background: 'hsl(18 80% 52% / 0.18)',
                    filter: 'blur(100px)',
                    animation: 'orbit 8s ease-in-out infinite',
                  }}
                />
                <div
                  className="absolute rounded-full pointer-events-none"
                  style={{
                    width: 400, height: 400, bottom: -100, right: -100,
                    background: 'hsl(28 75% 55% / 0.14)',
                    filter: 'blur(80px)',
                    animation: 'orbit-reverse 10s ease-in-out infinite',
                  }}
                />

                {/* Sweeping light beam — piano-like specular reflection */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: 'linear-gradient(105deg, transparent 42%, hsl(0 0% 100% / 0.06) 46%, hsl(0 0% 100% / 0.18) 50%, hsl(0 0% 100% / 0.06) 54%, transparent 58%)',
                    backgroundSize: '300% 100%',
                    animation: 'sweep 12s cubic-bezier(0.4,0,0.6,1) infinite',
                  }}
                />

                {/* Top glow bar */}
                <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-primary/0 via-primary to-accent via-60% to-accent/0" />
                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
                <div className="absolute top-0 left-0 w-px h-full bg-gradient-to-b from-primary/50 via-primary/10 to-transparent" />
                <div className="absolute top-0 right-0 w-px h-full bg-gradient-to-b from-accent/50 via-accent/10 to-transparent" />



                <div className="relative grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-6 sm:gap-10 p-7 sm:p-14">
                  <div className="space-y-5 sm:space-y-6 flex flex-col justify-center">
                    {/* Badge */}
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-primary/80">
                      <span className="w-8 h-px bg-primary/60" />
                      {t("config.h2subtitle")}
                    </div>

                    {/* Main title */}
                    <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-white/60 leading-[1] tracking-tighter">
                      {t("config.h1")}
                    </h1>

                    {/* Subtitle — Configura tu sesión */}
                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_100%] animate-[shimmer_3s_ease-in-out_infinite] tracking-tight">
                      {t("config.heroTitle")}
                    </h2>

                    {/* Description */}
                    <p className="text-lg sm:text-xl text-white/65 leading-relaxed max-w-lg font-medium">
                      {t("config.heroP1")}
                    </p>

                    {/* CTA button */}
                    <div className="pt-1">
                      <div className="inline-flex items-center gap-3 bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_100%] animate-[shimmer_3s_ease-in-out_infinite] text-white px-7 py-3.5 rounded-full text-lg font-black shadow-[0_6px_30px_-6px_hsl(18,80%,52%/0.6)] hover:shadow-[0_8px_40px_-6px_hsl(18,80%,52%/0.8)] hover:scale-105 transition-all duration-300 cursor-default">
                        <ShoppingCart className="w-5 h-5" />
                        {t("config.priceFrom")}
                      </div>
                    </div>

                    {/* Tip */}
                    <p className="text-sm text-white/40 font-medium">{t("config.heroP2")}</p>
                  </div>

                  <div className="flex items-center justify-center">
                    <HeroVideoDual youtubeVideoId="y3ItF1koMLA" />
                  </div>
                </div>
              </div>
            </div>
            {!floatingVideo && (
              <button
                onClick={() => setFloatingVideo(true)}
                className="mb-3 inline-flex items-center gap-2 text-xs font-bold text-primary hover:text-accent transition-colors"
              >
                <GraduationCap className="w-4 h-4" />
                {t("config.videoTabTutorial")} — {t("config.videoLabelTutorial")}
              </button>
            )}
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
        <FloatingVideoPlayer
          videoId="y3ItF1koMLA"
          visible={floatingVideo}
          onClose={() => setFloatingVideo(false)}
        />
      </div>
    </SidebarProvider>
  );
};
