import { Progress } from "@/components/ui/progress";
import { Check } from "lucide-react";

interface StepTimelineProps {
  currentStep: number;
  totalSteps: number;
}

export const StepTimeline = ({ currentStep, totalSteps }: StepTimelineProps) => {
  const steps = [
    "Micrófonos",
    "Previos", 
    "Interfaz",
    "Tomas",
    "Entrega",
    "Extras"
  ];

  const progress = ((currentStep + 1) / totalSteps) * 100;

  return (
    <div className="bg-card border rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-sm">Progreso de Configuración</h3>
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
            <span className={`text-xs ${
              index === currentStep ? 'text-primary font-medium' : 
              index < currentStep ? 'text-success' : 'text-muted-foreground'
            }`}>
              {step}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};