import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Plus, FileText } from "lucide-react";
import { CartItem } from "@/types/cart";

interface ExtrasStepProps {
  addItem: (item: CartItem) => void;
  removeItem: (itemId: string) => void;
  hasItem: (itemId: string) => boolean;
}

export const ExtrasStep = ({ addItem, removeItem, hasItem }: ExtrasStepProps) => {
  const extrasItems: CartItem[] = [
    {
      id: 'partitura',
      name: 'Partitura',
      price: 0.99,
      category: 'Extras',
      description: 'Partitura profesional de tu canción'
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
      <div className="flex justify-center">
        <div className="max-w-md">
          {extrasItems.map((item) => {
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
                    <CardTitle className="flex items-center gap-3 text-xl">
                      <FileText className="h-6 w-6" />
                      {item.name}
                    </CardTitle>
                    <Badge variant="outline" className="text-primary font-bold text-lg px-3 py-1">
                      €{item.price.toFixed(2)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <p className="text-muted-foreground text-center">
                    {item.description}
                  </p>
                  
                  <div className="p-4 bg-muted/50 rounded-lg text-center">
                    <p className="text-sm text-muted-foreground">
                      📝 Perfecto para músicos que quieren la notación completa de su canción
                    </p>
                  </div>
                  
                  <Button
                    variant={isSelected ? "default" : "outline"}
                    size="lg"
                    className="w-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleItem(item);
                    }}
                  >
                    {isSelected ? (
                      <>
                        <Check className="h-5 w-5 mr-2" />
                        ✨ Añadido
                      </>
                    ) : (
                      <>
                        <Plus className="h-5 w-5 mr-2" />
                        Añadir por €{item.price.toFixed(2)}
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