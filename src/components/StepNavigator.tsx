import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ShoppingCart } from "lucide-react";
import { useTranslation } from "react-i18next";

interface StepNavigatorProps {
  currentStep: number;
  totalSteps: number;
  onPreviousStep: () => void;
  onNextStep: () => void;
  onCheckout: () => void;
  validationError?: string | null;
}

export const StepNavigator = ({ 
  currentStep, 
  totalSteps, 
  onPreviousStep, 
  onNextStep, 
  onCheckout,
  validationError
}: StepNavigatorProps) => {
  const { t } = useTranslation();
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === totalSteps - 1;

  return (
    <div className="border-t border-border">
      <p className="text-xs text-muted-foreground text-center pt-3 italic">{t("cart.taxDisclaimer")}</p>
      {validationError && (
        <div className="px-4 sm:px-6 pt-4">
          <div className="bg-destructive/10 border border-destructive/30 text-destructive rounded-lg px-4 py-3 text-sm font-medium text-center">
            {validationError}
          </div>
        </div>
      )}
      <div className="flex justify-between items-center p-4 sm:p-6 bg-card">
        <Button
          variant="outline"
          onClick={onPreviousStep}
          disabled={isFirstStep}
          className="flex items-center gap-1 sm:gap-2 h-12 px-3 sm:px-4 text-sm sm:text-base"
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="hidden sm:inline">{t("stepNav.previous")}</span>
          <span className="sm:hidden">Ant.</span>
        </Button>

        <div className="flex space-x-1.5 sm:space-x-2">
          {Array.from({ length: totalSteps }).map((_, index) => (
            <div
              key={index}
              className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full transition-colors duration-200 ${
                index === currentStep
                  ? 'bg-primary shadow-lg'
                  : index < currentStep
                  ? 'bg-success'
                  : 'bg-muted'
              }`}
            />
          ))}
        </div>

        {isLastStep ? (
          <Button
            variant="upgrade"
            onClick={onCheckout}
            className="flex items-center gap-1 sm:gap-2 h-12 px-3 sm:px-4 text-sm sm:text-base"
          >
            <ShoppingCart className="h-4 w-4" />
            <span className="hidden sm:inline">{t("stepNav.checkout")}</span>
            <span className="sm:hidden">Pagar</span>
          </Button>
        ) : (
          <Button
            variant="default"
            onClick={onNextStep}
            className="flex items-center gap-1 sm:gap-2 h-12 px-3 sm:px-4 text-sm sm:text-base"
          >
            <span className="hidden sm:inline">{t("stepNav.next")}</span>
            <span className="sm:hidden">Sig.</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};
