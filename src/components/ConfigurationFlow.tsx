import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Cart } from "@/components/Cart";
import { StepNavigator } from "@/components/StepNavigator";
import { MicrophonesStep } from "@/components/steps/MicrophonesStep";
import { PreampsStep } from "@/components/steps/PreampsStep";
import { InterfaceStep } from "@/components/steps/InterfaceStep";
import { TakesStep } from "@/components/steps/TakesStep";
import { DeliveryStep } from "@/components/steps/DeliveryStep";
import { ExtrasStep } from "@/components/steps/ExtrasStep";
import { useCart } from "@/hooks/useCart";

interface ConfigurationFlowProps {
  onCheckout: () => void;
}

export const ConfigurationFlow = ({ onCheckout }: ConfigurationFlowProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const { cartState, addItem, removeItem, hasItem } = useCart();

  const steps = [
    { 
      title: "Micrófonos", 
      component: <MicrophonesStep addItem={addItem} removeItem={removeItem} hasItem={hasItem} />
    },
    { 
      title: "Previos", 
      component: <PreampsStep addItem={addItem} removeItem={removeItem} hasItem={hasItem} />
    },
    { 
      title: "Interface", 
      component: <InterfaceStep addItem={addItem} removeItem={removeItem} hasItem={hasItem} />
    },
    { 
      title: "Tomas", 
      component: <TakesStep addItem={addItem} removeItem={removeItem} hasItem={hasItem} />
    },
    { 
      title: "Entrega", 
      component: <DeliveryStep addItem={addItem} removeItem={removeItem} hasItem={hasItem} />
    },
    { 
      title: "Extras", 
      component: <ExtrasStep addItem={addItem} removeItem={removeItem} hasItem={hasItem} />
    }
  ];

  const handlePreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleNextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleCheckout = () => {
    onCheckout();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/50">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <Card className="overflow-hidden bg-gradient-to-br from-card to-muted/30 shadow-xl">
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

          {/* Cart Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <Cart 
                cartState={cartState} 
                removeItem={removeItem}
                onCheckout={handleCheckout}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};