import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Plus, Headphones } from "lucide-react";
import { baseMicrophones, upgradeMicrophones } from "@/data/microphones";
import { CartItem } from "@/types/cart";

interface MicrophonesStepProps {
  addItem: (item: CartItem) => void;
  removeItem: (itemId: string) => void;
  hasItem: (itemId: string) => boolean;
}

export const MicrophonesStep = ({ addItem, removeItem, hasItem }: MicrophonesStepProps) => {
  const handleToggleItem = (microphone: any) => {
    const cartItem: CartItem = {
      id: microphone.id,
      name: microphone.name,
      price: microphone.price,
      category: "Micrófono",
      description: `${microphone.description} - ${microphone.target}`
    };

    if (hasItem(microphone.id)) {
      removeItem(microphone.id);
    } else {
      addItem(cartItem);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Configuración de Micrófonos
        </h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Tu kit básico incluye 8 micrófonos profesionales. Mejora tu sonido añadiendo micrófonos premium.
        </p>
      </div>

      {/* Included Microphones */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Check className="h-5 w-5 text-success" />
          <h3 className="text-xl font-semibold">Incluido en tu Kit Básico</h3>
          <Badge variant="secondary">€49.90</Badge>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {baseMicrophones.map((mic) => (
            <Card key={mic.id} className="bg-gradient-to-br from-card to-muted border-success/30">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2 mb-2">
                  <Headphones className="h-4 w-4 text-success" />
                  <Badge variant="outline" className="border-success text-success">
                    {mic.target}
                  </Badge>
                </div>
                {mic.image && (
                  <div className="w-full h-20 flex items-center justify-center bg-muted/30 rounded">
                    <img 
                      src={mic.image} 
                      alt={mic.name}
                      className="max-h-16 max-w-full object-contain"
                    />
                  </div>
                )}
              </CardHeader>
              <CardContent>
                <h4 className="font-semibold text-sm mb-1">{mic.name}</h4>
                <p className="text-xs text-muted-foreground mb-2">{mic.description}</p>
                <div className="flex items-center gap-1">
                  <Check className="h-3 w-3 text-success" />
                  <span className="text-xs text-success font-medium">Incluido</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Upgrade Microphones */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Plus className="h-5 w-5 text-primary" />
          <h3 className="text-xl font-semibold">Mejoras Disponibles</h3>
          <Badge variant="outline">Premium</Badge>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {upgradeMicrophones.map((mic) => {
            const isSelected = hasItem(mic.id);
            
            return (
              <Card 
                key={mic.id} 
                className={`transition-all duration-300 hover:shadow-lg cursor-pointer ${
                  isSelected 
                    ? 'bg-gradient-to-br from-primary/20 to-accent/20 border-primary shadow-lg' 
                    : 'bg-gradient-to-br from-card to-muted hover:border-primary/50'
                }`}
                onClick={() => handleToggleItem(mic)}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline" className="text-xs">
                      {mic.target}
                    </Badge>
                    <span className="font-bold text-primary">€{mic.price.toFixed(2)}</span>
                  </div>
                  {mic.image && (
                    <div className="w-full h-24 flex items-center justify-center bg-muted/30 rounded">
                      <img 
                        src={mic.image} 
                        alt={mic.name}
                        className="max-h-20 max-w-full object-contain"
                      />
                    </div>
                  )}
                </CardHeader>
                <CardContent>
                  <h4 className="font-semibold mb-2">{mic.name}</h4>
                  <p className="text-sm text-muted-foreground mb-4">{mic.description}</p>
                  
                  <Button
                    variant={isSelected ? "default" : "upgrade"}
                    size="sm"
                    className="w-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleItem(mic);
                    }}
                  >
                    {isSelected ? (
                      <>
                        <Check className="h-4 w-4 mr-1" />
                        Añadido
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4 mr-1" />
                        Añadir €{mic.price.toFixed(2)}
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};