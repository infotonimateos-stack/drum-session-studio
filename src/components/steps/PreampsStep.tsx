import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Plus, Zap } from "lucide-react";
import { CartItem } from "@/types/cart";

interface PreampsStepProps {
  addItem: (item: CartItem) => void;
  removeItem: (itemId: string) => void;
  hasItem: (itemId: string) => boolean;
}

export const PreampsStep = ({ addItem, removeItem, hasItem }: PreampsStepProps) => {
  const proPreampsPack: CartItem = {
    id: 'preamps-pro',
    name: 'Pack Previos Pro: API, Neve y DAD',
    price: 19.90,
    category: 'Previos',
    description: 'Previos analógicos premium para un sonido vintage y profesional'
  };

  const isProSelected = hasItem(proPreampsPack.id);

  const handleTogglePro = () => {
    if (isProSelected) {
      removeItem(proPreampsPack.id);
    } else {
      addItem(proPreampsPack);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Previos de Audio
        </h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Los previos determinan el carácter y la calidez de tu grabación. Elige entre básico o premium.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* Basic Preamps */}
        <Card className="bg-gradient-to-br from-card to-muted border-success/30">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Check className="h-5 w-5 text-success" />
                Básico
              </CardTitle>
              <Badge variant="secondary">Incluido</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Zap className="h-8 w-8 text-success" />
              <div>
                <h3 className="font-semibold">Focusrite OctoPre</h3>
                <p className="text-sm text-muted-foreground">8 canales de previos limpios y transparentes</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Características:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Sonido limpio y neutral</li>
                <li>• Respuesta de frecuencia plana</li>
                <li>• Perfecto para principiantes</li>
                <li>• Sin costo adicional</li>
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

        {/* Pro Preamps */}
        <Card 
          className={`transition-all duration-300 hover:shadow-lg cursor-pointer ${
            isProSelected 
              ? 'bg-gradient-to-br from-primary/20 to-accent/20 border-primary shadow-lg' 
              : 'bg-gradient-to-br from-card to-muted hover:border-primary/50'
          }`}
          onClick={handleTogglePro}
        >
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5 text-primary" />
                Premium
              </CardTitle>
              <Badge variant="outline" className="text-primary">+€19.90</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Zap className="h-8 w-8 text-primary" />
              <div>
                <h3 className="font-semibold">Pack Previos Pro</h3>
                <p className="text-sm text-muted-foreground">API, Neve y DAD - El sonido de los grandes estudios</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Características:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• <strong>API:</strong> Punch y presencia únicos</li>
                <li>• <strong>Neve:</strong> Calidez vintage legendaria</li>
                <li>• <strong>DAD:</strong> Precisión digital premium</li>
                <li>• Sonido usado en hits mundiales</li>
              </ul>
            </div>

            <Button
              variant={isProSelected ? "default" : "upgrade"}
              className="w-full"
              onClick={(e) => {
                e.stopPropagation();
                handleTogglePro();
              }}
            >
              {isProSelected ? (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Añadido al carrito
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Upgrade por €19.90
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};