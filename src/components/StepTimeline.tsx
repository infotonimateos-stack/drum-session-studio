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
    "Interface",
    "Producción",
    "Video",
    "Tomas",
    "Entrega",
    "Extras"
  ];

  const progress = ((currentStep + 1) / totalSteps) * 100;

  return (
    <div className="bg-gradient-to-br from-warm-peach/10 to-warm-blush/10 border-warm-coral/20 rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-sm">Progreso de Configuración</h3>
        <span className="text-xs text-muted-foreground">
          {currentStep + 1}/{totalSteps}
        </span>
      </div>
      
      {/* Circular Progress */}
      <div className="flex justify-center">
        <div className="relative w-24 h-24">
          <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
            {/* Background circle */}
            <circle 
              cx="50" 
              cy="50" 
              r="40" 
              fill="none" 
              stroke="hsl(var(--warm-cream))" 
              strokeWidth="6"
              className="opacity-30"
            />
            {/* Progress circle */}
            <circle 
              cx="50" 
              cy="50" 
              r="40" 
              fill="none" 
              stroke="url(#progressGradient)" 
              strokeWidth="6" 
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 40}`}
              strokeDashoffset={`${2 * Math.PI * 40 * (1 - progress / 100)}`}
              className="transition-all duration-500 ease-out"
            />
            <defs>
              <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="hsl(var(--warm-peach))" />
                <stop offset="50%" stopColor="hsl(var(--warm-coral))" />
                <stop offset="100%" stopColor="hsl(var(--warm-blush))" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xl font-bold bg-gradient-to-r from-warm-coral to-warm-blush bg-clip-text text-transparent">
              {Math.round(progress)}%
            </span>
          </div>
        </div>
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