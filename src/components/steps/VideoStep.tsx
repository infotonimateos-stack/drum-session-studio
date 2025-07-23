import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Plus, Video, Phone, PlayCircle, Share2 } from "lucide-react";
import { CartItem } from "@/types/cart";

interface VideoStepProps {
  addItem: (item: CartItem) => void;
  removeItem: (itemId: string) => void;
  hasItem: (itemId: string) => boolean;
}

export const VideoStep = ({ addItem, removeItem, hasItem }: VideoStepProps) => {
  const videoItems: CartItem[] = [
    {
      id: 'social-greeting',
      name: 'Saludo para Redes Sociales',
      price: 4.99,
      category: 'Video',
      description: 'Video personalizado para tus redes sociales'
    },
    {
      id: 'playing-video',
      name: 'Video 30s Tocando',
      price: 9.99,
      category: 'Video',
      description: 'Video de 30 segundos tocando tu canción'
    },
    {
      id: 'instagram-share',
      name: 'Compartir en Instagram',
      price: 2.99,
      category: 'Video',
      description: 'Publicación en mi Instagram con tu canción'
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
      case 'social-greeting':
        return <Video className="h-5 w-5" />;
      case 'playing-video':
        return <PlayCircle className="h-5 w-5" />;
      case 'instagram-share':
        return <Share2 className="h-5 w-5" />;
      default:
        return <Plus className="h-5 w-5" />;
    }
  };

  const getItemColor = (itemId: string) => {
    switch (itemId) {
      case 'social-greeting':
        return 'from-orange-200/40 to-amber-200/40 border-orange-300/50';
      case 'playing-video':
        return 'from-rose-200/40 to-pink-200/40 border-rose-300/50';
      case 'instagram-share':
        return 'from-purple-200/40 to-violet-200/40 border-purple-300/50';
      default:
        return 'from-card to-muted';
    }
  };

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="text-center space-y-6">
        <h2 className="text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          🎥 Servicios de Video
        </h2>
        <p className="text-muted-foreground text-xl max-w-3xl mx-auto leading-relaxed">
          Servicios audiovisuales para complementar tu experiencia y promover tu música.
        </p>
      </div>

      {/* Video Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {videoItems.map((item) => {
          const isSelected = hasItem(item.id);
          
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
                <div className="flex items-center justify-between mb-2">
                  <CardTitle className="flex items-center gap-3 text-lg">
                    {getIcon(item.id)}
                    {item.name}
                  </CardTitle>
                  <Badge variant="outline" className="text-primary font-bold text-lg px-3 py-1">
                    €{item.price.toFixed(2)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-muted-foreground">
                  {item.description}
                </p>
                
                {/* Special highlight for premium items */}
                {item.price > 15 && (
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <p className="text-primary font-semibold text-sm text-center">
                      ⭐ Servicio Premium
                    </p>
                  </div>
                )}
                
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
  );
};