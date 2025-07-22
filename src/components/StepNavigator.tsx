import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ShoppingCart } from "lucide-react";

interface StepNavigatorProps {
  currentStep: number;
  totalSteps: number;
  onPreviousStep: () => void;
  onNextStep: () => void;
  onCheckout: () => void;
}

export const StepNavigator = ({ 
  currentStep, 
  totalSteps, 
  onPreviousStep, 
  onNextStep, 
  onCheckout 
}: StepNavigatorProps) => {
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === totalSteps - 1;

  return (
    <div className="flex justify-between items-center p-6 bg-gradient-to-r from-card to-muted border-t border-border">
      <Button
        variant="outline"
        onClick={onPreviousStep}
        disabled={isFirstStep}
        className="flex items-center gap-2"
      >
        <ChevronLeft className="h-4 w-4" />
        Anterior
      </Button>

      <div className="flex space-x-2">
        {Array.from({ length: totalSteps }).map((_, index) => (
          <div
            key={index}
            className={`w-3 h-3 rounded-full transition-colors duration-200 ${
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
          className="flex items-center gap-2"
        >
          <ShoppingCart className="h-4 w-4" />
          Finalizar Compra
        </Button>
      ) : (
        <Button
          variant="default"
          onClick={onNextStep}
          className="flex items-center gap-2"
        >
          Siguiente
          <ChevronRight className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};