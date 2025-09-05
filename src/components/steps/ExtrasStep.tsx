import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Plus, FileText, Video, Phone, Clapperboard, Camera, MonitorSpeaker } from "lucide-react";
import { CartItem } from "@/types/cart";

interface ExtrasStepProps {
  addItem: (item: CartItem) => void;
  removeItem: (itemId: string) => void;
  hasItem: (itemId: string) => boolean;
}

export const ExtrasStep = ({ addItem, removeItem, hasItem }: ExtrasStepProps) => {
  const extrasItems: CartItem[] = [
    {
      id: 'videocall-10min',
      name: 'Videollamada 10 minutos',
      price: 5.99,
      category: 'Extras',
      description: 'Para discutir detalles del proyecto'
    },
    {
      id: 'videocall-premium',
      name: 'Videollamada Premium Multicámara',
      price: 100.00,
      category: 'Extras',
      description: 'Sistema multicámara con audio y video en directo, producción en tiempo real'
    }
  ];

  const handleToggleItem = (item: CartItem) => {
    if (hasItem(item.id)) {
      removeItem(item.id);
    } else {
      addItem(item);
    }
  };

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="text-center space-y-6">
        <h2 className="text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          ➕ Extras
        </h2>
        <p className="text-muted-foreground text-xl max-w-3xl mx-auto leading-relaxed">
          Servicios adicionales para complementar tu experiencia musical.
        </p>
      </div>

      {/* Extras Items */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {extrasItems.map((item) => {
          const isSelected = hasItem(item.id);
          
          const getIcon = (itemId: string) => {
            switch (itemId) {
              case 'videocall-10min':
                return <MonitorSpeaker className="h-5 w-5" />;
              case 'videocall-premium':
                return <Video className="h-5 w-5" />;
              default:
                return <Plus className="h-5 w-5" />;
            }
          };

          const getItemColor = (itemId: string) => {
            switch (itemId) {
              case 'videocall-10min':
                return 'from-warm-peach/40 to-warm-coral/30 border-warm-peach/50';
              case 'videocall-premium':
                return 'from-warm-coral/40 to-warm-blush/30 border-warm-coral/50';
              default:
                return 'from-card to-muted';
            }
          };
          
          return (
            <Card 
              key={item.id}
              className={`transition-all duration-300 hover:shadow-xl cursor-pointer transform hover:scale-105 ${
                isSelected 
                  ? 'bg-gradient-to-br from-primary/20 to-accent/20 border-primary shadow-xl scale-105' 
                  : `bg-gradient-to-br ${getItemColor(item.id)} hover:border-primary/50`
              }`}
              onClick={() => handleToggleItem(item)}
            >
              <CardHeader className="pb-4">
                <div className="space-y-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    {getIcon(item.id)}
                    {item.name}
                  </CardTitle>
                  <div className="flex justify-center">
                    <Badge variant="outline" className="text-primary font-bold text-xl px-4 py-2">
                      €{item.price.toFixed(2)}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground text-sm">
                  {item.description}
                </p>
                
                {/* Special highlight for premium items */}
                {item.price >= 100 && (
                  <div className="p-3 bg-gradient-to-r from-warm-peach/20 to-warm-coral/20 rounded-lg border border-warm-peach/30">
                    <p className="text-primary font-semibold text-sm text-center">
                      ⭐ Experiencia Premium Única
                    </p>
                  </div>
                )}
                
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