import { useState, useEffect } from "react";
import { Progress } from "@/components/ui/progress";
import { Check, ChevronDown } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

interface StepTimelineProps {
  currentStep: number;
  totalSteps: number;
}

export const StepTimeline = ({ currentStep, totalSteps }: StepTimelineProps) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const steps = [
    t("config.steps.drumKit"),
    t("config.steps.microphones"),
    t("config.steps.preamps"),
    t("config.steps.interface"),
    t("config.steps.production"),
    t("config.steps.video"),
    t("config.steps.takes"),
    t("config.steps.delivery"),
    t("config.steps.extras"),
  ];

  const progress = ((currentStep + 1) / totalSteps) * 100;
  const currentStepLabel = steps[currentStep];

  useEffect(() => {
    setIsOpen(false);
  }, [currentStep]);

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      {/* Collapsible header — visible on tablet and below (< xl = <1024px) */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="xl:hidden w-full flex items-center justify-between px-4 py-3 text-left hover:bg-muted/30 transition-colors"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0 bg-primary text-primary-foreground">
            {currentStep + 1}
          </div>
          <span className="text-sm font-semibold text-foreground truncate">
            {t("config.steps.step")} {currentStep + 1}:{" "}
            <span className="text-primary">{currentStepLabel}</span>
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0 ml-2">
          <span className="text-xs font-medium text-primary">{Math.round(progress)}%</span>
          <ChevronDown
            className={cn(
              "h-4 w-4 text-muted-foreground transition-transform duration-300",
              isOpen && "rotate-180"
            )}
          />
        </div>
      </button>

      <div className="xl:hidden px-4 pb-2">
        <Progress value={progress} className="h-1.5" />
      </div>

      <div
        className={cn(
          "xl:block overflow-hidden transition-all duration-300 ease-in-out",
          isOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0 xl:max-h-none xl:opacity-100"
        )}
      >
        {/* Mobile expanded list */}
        <div className="xl:hidden p-4 space-y-4">
          <div className="relative">
            {steps.map((step, index) => (
              <div key={index} className="relative flex items-center gap-2 pb-3 last:pb-0">
                {index < steps.length - 1 && (
                  <div
                    className={cn(
                      "absolute left-2 top-4 w-0.5 h-3",
                      index < currentStep ? "bg-success" : "bg-muted"
                    )}
                  />
                )}
                <div
                  className={cn(
                    "w-4 h-4 rounded-full flex items-center justify-center text-xs relative z-10 shrink-0",
                    index < currentStep
                      ? "bg-success text-success-foreground"
                      : index === currentStep
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  )}
                >
                  {index < currentStep ? <Check className="h-3 w-3" /> : index + 1}
                </div>
                <span
                  className={cn(
                    "text-xs",
                    index === currentStep
                      ? "text-primary font-medium"
                      : index < currentStep
                      ? "text-success"
                      : "text-muted-foreground"
                  )}
                >
                  {step}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Desktop: ultra-compact horizontal dots ── */}
        <div className="hidden xl:block p-3 space-y-2">
          {/* Current step label */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-foreground">
              {currentStep + 1}/{totalSteps} · <span className="text-primary">{currentStepLabel}</span>
            </span>
            <span className="text-xs font-medium text-primary">{Math.round(progress)}%</span>
          </div>

          {/* Progress bar */}
          <Progress value={progress} className="h-1.5" />

          {/* Compact step indicators */}
          <div className="flex items-center gap-1 justify-between">
            {steps.map((step, index) => (
              <div
                key={index}
                className="group relative flex flex-col items-center"
                title={step}
              >
                <div
                  className={cn(
                    "w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold transition-colors",
                    index < currentStep
                      ? "bg-success text-success-foreground"
                      : index === currentStep
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {index < currentStep ? <Check className="h-3 w-3" /> : index + 1}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
