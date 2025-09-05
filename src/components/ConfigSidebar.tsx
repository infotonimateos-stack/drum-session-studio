import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { StepTimeline } from "@/components/StepTimeline";
import { Cart } from "@/components/Cart";
import { CartState } from "@/types/cart";

interface ConfigSidebarProps {
  currentStep: number;
  totalSteps: number;
  cartState: CartState;
  removeItem: (id: string) => void;
  onCheckout: () => void;
}

export function ConfigSidebar({
  currentStep,
  totalSteps,
  cartState,
  removeItem,
  onCheckout,
}: ConfigSidebarProps) {
  return (
    <Sidebar className="w-80 border-r border-border bg-card/50 backdrop-blur-sm">
      <SidebarHeader className="border-b border-border p-4">
        <h2 className="text-lg font-semibold text-foreground">Configuración</h2>
      </SidebarHeader>
      
      <SidebarContent className="p-4 space-y-6">
        <StepTimeline
          currentStep={currentStep}
          totalSteps={totalSteps}
        />
        
        <Cart 
          cartState={cartState} 
          removeItem={removeItem}
          onCheckout={onCheckout}
        />
      </SidebarContent>
    </Sidebar>
  );
}