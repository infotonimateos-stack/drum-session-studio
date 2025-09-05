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
    <Sidebar className="w-72 border-r border-border bg-card/50 backdrop-blur-sm">
      <SidebarHeader className="border-b border-border p-3">
        <h2 className="text-sm font-semibold text-foreground">Progreso de Configuración</h2>
      </SidebarHeader>
      
      <SidebarContent className="p-3 space-y-4 overflow-hidden">
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