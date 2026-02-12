import { Progress } from "@/components/ui/progress";
import { Check, Settings } from "lucide-react";
import { useTranslation } from "react-i18next";

interface StepTimelineProps {
  currentStep: number;
  totalSteps: number;
}

export const StepTimeline = ({ currentStep, totalSteps }: StepTimelineProps) => {
  const { t } = useTranslation();

  const steps = [
    t("config.steps.microphones"),
    t("config.steps.preamps"), 
    t("config.steps.interface"),
    t("config.steps.production"),
    t("config.steps.video"),
    t("config.steps.takes"),
    t("config.steps.delivery"),
    t("config.steps.extras")
  ];

  const progress = ((currentStep + 1) / totalSteps) * 100;

  return (
    <div className="bg-card border border-border rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Settings className="h-4 w-4 text-primary" />
          <h3 className="font-semibold text-sm">{t("config.progress")}</h3>
          <span className="text-xs font-medium text-primary">
            {Math.round(progress)}%
          </span>
        </div>
        <span className="text-xs text-muted-foreground">
          {currentStep + 1}/{totalSteps}
        </span>
      </div>
      
      <Progress value={progress} className="h-2" />
      
      <div className="relative">
        {steps.map((step, index) => (
          <div key={index} className="relative flex items-center gap-2 pb-3 last:pb-0">
            {/* Connecting line */}
            {index < steps.length - 1 && (
              <div className={`absolute left-2 top-4 w-0.5 h-3 ${
                index < currentStep ? 'bg-success' : 'bg-muted'
              }`} />
            )}
            <div className={`w-4 h-4 rounded-full flex items-center justify-center text-xs relative z-10 ${
              index < currentStep 
                ? 'bg-success text-success-foreground'
                : index === currentStep
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted'
            }`}>
              {index < currentStep ? (
                <Check className="h-3 w-3" />
              ) : (
                index + 1
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-xs ${
                index === currentStep ? 'text-primary font-medium' : 
                index < currentStep ? 'text-success' : 'text-muted-foreground'
              }`}>
                {step}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
