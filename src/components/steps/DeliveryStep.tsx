import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Plus, Clock, Plane, Rocket } from "lucide-react";
import { CartItem } from "@/types/cart";

interface DeliveryStepProps {
  addItem: (item: CartItem) => void;
  removeItem: (itemId: string) => void;
  hasItem: (itemId: string) => boolean;
}

export const DeliveryStep = ({ addItem, removeItem, hasItem }: DeliveryStepProps) => {
  const express5Days: CartItem = {
    id: 'delivery-5days',
    name: 'Entrega Express 5 días',
    price: 5.90,
    category: 'Entrega',
    description: 'Entrega garantizada en 5 días laborables'
  };

  const express2Days: CartItem = {
    id: 'delivery-2days',
    name: 'Entrega Ultra Express 2 días',
    price: 39.90,
    category: 'Entrega',
    description: 'Entrega prioritaria en 2 días laborables'
  };

  const is5DaysSelected = hasItem(express5Days.id);
  const is2DaysSelected = hasItem(express2Days.id);

  const handleToggle5Days = () => {
    if (is5DaysSelected) {
      removeItem(express5Days.id);
    } else {
      // Remove 2-day option if selected
      if (is2DaysSelected) {
        removeItem(express2Days.id);
      }
      addItem(express5Days);
    }
  };

  const handleToggle2Days = () => {
    if (is2DaysSelected) {
      removeItem(express2Days.id);
    } else {
      // Remove 5-day option if selected
      if (is5DaysSelected) {
        removeItem(express5Days.id);
      }
      addItem(express2Days);
    }
  };

  return (
    <div className="space-y-8 bg-gradient-to-br from-warm-blush/20 to-warm-apricot/15 rounded-xl p-8">
      {/* Header */}
      <div className="text-center space-y-6">
        <h2 className="text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          🚚 Entrega
        </h2>
        <p className="text-muted-foreground text-xl max-w-3xl mx-auto leading-relaxed">
          ¿Cuándo necesitas tu grabación? Elige el plazo que mejor se adapte a tu proyecto.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Standard Delivery */}
        <Card className="bg-gradient-to-br from-card to-muted border-success/30">
          <CardHeader>
            <div className="flex items-center justify-center">
              <CardTitle className="flex items-center gap-1">
                <img src="/lovable-uploads/841a1a2f-0999-44b3-9a2a-4a97ad64f750.png" alt="Check" className="h-12 w-12" />
                Estándar
              </CardTitle>
            </div>
            <div className="flex justify-center">
              <Badge variant="secondary">Incluido</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-center">
              <div className="text-center">
                <h3 className="font-semibold">10 Días Laborables</h3>
                <p className="text-sm text-muted-foreground">Plazo estándar de producción</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Características:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Sin costo adicional</li>
                <li>• Ideal para la mayoría de proyectos</li>
              </ul>
            </div>

            <div className="pt-4">
              <div className="flex items-center gap-1">
                <Check className="h-4 w-4 text-success" />
                <span className="text-sm text-success font-medium">Incluido en kit básico</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 5 Days Express */}
        <Card 
          className={`transition-all duration-300 hover:shadow-lg cursor-pointer ${
            is5DaysSelected 
              ? 'bg-gradient-to-br from-primary/20 to-accent/20 border-primary shadow-lg' 
              : 'bg-gradient-to-br from-card to-muted hover:border-primary/50'
          }`}
          onClick={handleToggle5Days}
        >
          <CardHeader>
            <div className="flex items-center justify-center">
              <CardTitle className="flex items-center gap-1">
                <Plane className="h-12 w-12 text-orange-500" />
                Rápido
              </CardTitle>
            </div>
            <div className="flex justify-center">
              <Badge variant="outline" className="text-primary">+€5.90</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-center">
              <div className="text-center">
                <h3 className="font-semibold">5 Días Laborables</h3>
                <p className="text-sm text-muted-foreground">Prioridad en la entrega</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Características:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Prioridad en la cola de producción</li>
                <li>• Perfecto para deadlines ajustados</li>
              </ul>
            </div>

            <Button
              variant={is5DaysSelected ? "default" : "upgrade"}
              className="w-full"
              onClick={(e) => {
                e.stopPropagation();
                handleToggle5Days();
              }}
            >
              {is5DaysSelected ? (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Seleccionado
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Upgrade €5.90
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* 2 Days Ultra Express */}
        <Card 
          className={`transition-all duration-300 hover:shadow-lg cursor-pointer ${
            is2DaysSelected 
              ? 'bg-gradient-to-br from-primary/20 to-accent/20 border-primary shadow-lg' 
              : 'bg-gradient-to-br from-card to-muted hover:border-primary/50'
          }`}
          onClick={handleToggle2Days}
        >
          <CardHeader>
            <div className="flex items-center justify-center">
              <CardTitle className="flex items-center gap-1">
                <Rocket className="h-12 w-12 text-accent" />
                Express
              </CardTitle>
            </div>
            <div className="flex justify-center">
              <Badge variant="outline" className="text-accent">+€39.90</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-center">
              <div className="text-center">
                <h3 className="font-semibold">2 Días Laborables</h3>
                <p className="text-sm text-muted-foreground">Máxima prioridad absoluta</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Características:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• <strong>Prioridad absoluta</strong></li>
                <li>• Trabajo dedicado exclusivo</li>
                <li>• Para emergencias y urgencias</li>
              </ul>
            </div>

            <div className="p-3 bg-accent/10 rounded-lg">
              <p className="text-xs text-accent font-medium">
                🚀 Para casos de extrema urgencia
              </p>
            </div>

            <Button
              variant={is2DaysSelected ? "default" : "upgrade"}
              className="w-full"
              onClick={(e) => {
                e.stopPropagation();
                handleToggle2Days();
              }}
            >
              {is2DaysSelected ? (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Seleccionado
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Upgrade €39.90
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};