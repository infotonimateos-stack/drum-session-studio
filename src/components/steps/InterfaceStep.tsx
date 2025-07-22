import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Plus, Cpu } from "lucide-react";
import { CartItem } from "@/types/cart";

interface InterfaceStepProps {
  addItem: (item: CartItem) => void;
  removeItem: (itemId: string) => void;
  hasItem: (itemId: string) => boolean;
}

export const InterfaceStep = ({ addItem, removeItem, hasItem }: InterfaceStepProps) => {
  const dadInterface: CartItem = {
    id: 'interface-dad',
    name: 'DAD AX64',
    price: 9.90,
    category: 'Interface',
    description: 'Interface de audio profesional con convertidores premium'
  };

  const isDadSelected = hasItem(dadInterface.id);

  const handleToggleDad = () => {
    if (isDadSelected) {
      removeItem(dadInterface.id);
    } else {
      addItem(dadInterface);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Interface de Audio
        </h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          El interface convierte tu sonido analógico a digital. La calidad del convertidor marca la diferencia.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* Basic Interface */}
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
              <Cpu className="h-8 w-8 text-success" />
              <div>
                <h3 className="font-semibold">Focusrite OctoPre</h3>
                <p className="text-sm text-muted-foreground">Interface ADAT de 8 canales</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Especificaciones:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• 24-bit / 192kHz</li>
                <li>• Convertidores estándar</li>
                <li>• Conexión ADAT</li>
                <li>• Perfecto para proyectos básicos</li>
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

        {/* Premium Interface */}
        <Card 
          className={`transition-all duration-300 hover:shadow-lg cursor-pointer ${
            isDadSelected 
              ? 'bg-gradient-to-br from-primary/20 to-accent/20 border-primary shadow-lg' 
              : 'bg-gradient-to-br from-card to-muted hover:border-primary/50'
          }`}
          onClick={handleToggleDad}
        >
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5 text-primary" />
                Premium
              </CardTitle>
              <Badge variant="outline" className="text-primary">+€9.90</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Cpu className="h-8 w-8 text-primary" />
              <div>
                <h3 className="font-semibold">DAD AX64</h3>
                <p className="text-sm text-muted-foreground">Interface premium con convertidores de alta gama</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Especificaciones:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• <strong>32-bit / 384kHz</strong> - Máxima resolución</li>
                <li>• Convertidores premium DAD</li>
                <li>• Rango dinámico superior</li>
                <li>• Usado en estudios de élite mundial</li>
              </ul>
            </div>

            <div className="p-3 bg-primary/10 rounded-lg">
              <p className="text-xs text-primary font-medium">
                💡 Mejora significativa en claridad y definición
              </p>
            </div>

            <Button
              variant={isDadSelected ? "default" : "upgrade"}
              className="w-full"
              onClick={(e) => {
                e.stopPropagation();
                handleToggleDad();
              }}
            >
              {isDadSelected ? (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Añadido al carrito
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Upgrade por €9.90
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};