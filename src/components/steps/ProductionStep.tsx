import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Plus, Clock, Zap, Target, Package, Headphones } from "lucide-react";
import { CartItem } from "@/types/cart";

interface ProductionStepProps {
  addItem: (item: CartItem) => void;
  removeItem: (itemId: string) => void;
  hasItem: (itemId: string) => boolean;
}

export const ProductionStep = ({ addItem, removeItem, hasItem }: ProductionStepProps) => {
  const productionItems: CartItem[] = [
    {
      id: 'tiempo-adicional',
      name: 'Tiempo Adicional (canciones 4-8 min)',
      price: 2.99,
      category: 'Producción',
      description: 'Para canciones entre 4 y 8 minutos de duración'
    },
    {
      id: 'work-mix',
      name: 'Work Mix',
      price: 2.99,
      category: 'Producción',
      description: 'Premezcla de batería (wav stereo)'
    },
    {
      id: 'sample-pack',
      name: 'Sample Pack',
      price: 4.99,
      category: 'Producción',
      description: 'Te enviamos los sonidos por separado, a diferentes volúmenes, de tu sesión'
    }
  ];

  const handleToggleItem = (item: CartItem) => {
    if (hasItem(item.id)) {
      removeItem(item.id);
    } else {
      addItem(item);
    }
  };

  const getIcon = (itemId: string) => {
    switch (itemId) {
      case 'beat-detective':
        return <Target className="h-5 w-5" />;
      case 'tiempo-adicional':
        return <Clock className="h-5 w-5" />;
      case 'entrega-expres':
        return <Zap className="h-5 w-5" />;
      case 'sample-pack':
        return <Package className="h-5 w-5" />;
      default:
        return <Plus className="h-5 w-5" />;
    }
  };

  return (
    <div className="space-y-12 bg-gradient-to-br from-warm-peach/15 to-warm-coral/20 rounded-xl p-8">
      {/* Header */}
      <div className="text-center space-y-6">
        <h2 className="text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent flex items-center justify-center gap-3">
          <Headphones className="h-12 w-12 text-primary" />
          Producción
        </h2>
        <p className="text-muted-foreground text-xl max-w-3xl mx-auto leading-relaxed">
          Servicios adicionales para perfeccionar tu grabación y adaptarla a tus necesidades específicas.
        </p>
      </div>

      {/* Production Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {productionItems.map((item) => {
          const isSelected = hasItem(item.id);
          
          return (
            <Card 
              key={item.id}
              className={`transition-all duration-300 hover:shadow-xl cursor-pointer transform hover:scale-105 ${
                isSelected 
                  ? 'bg-gradient-to-br from-primary/20 to-accent/20 border-primary shadow-xl scale-105' 
                  : 'bg-gradient-to-br from-card to-muted hover:border-primary/50'
              }`}
              onClick={() => handleToggleItem(item)}
            >
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between mb-2">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    {getIcon(item.id)}
                    {item.name}
                  </CardTitle>
                  <Badge variant="outline" className="text-primary font-bold text-xl px-4 py-2">
                    {item.price.toFixed(2)} €
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground text-sm">
                  {item.description}
                </p>
                
                <Button
                  variant={isSelected ? "default" : "outline"}
                  size="sm"
                  className="w-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleItem(item);
                  }}
                >
                  {isSelected ? (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      Añadido
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-2" />
                      Añadir
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};