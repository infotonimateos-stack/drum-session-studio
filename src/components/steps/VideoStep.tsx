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
      id: 'video-saludo',
      name: 'Video - Saludo para redes sociales',
      price: 1.99,
      category: 'Video',
      description: 'Video personalizado para tus redes sociales'
    },
    {
      id: 'video-llamada-premium',
      name: 'Video - Llamada PREMIUM',
      price: 49.90,
      category: 'Video',
      description: 'Llamada de video premium personalizada'
    },
    {
      id: 'video-tocando-30s',
      name: 'Video tocando 30 segundos',
      price: 19.90,
      category: 'Video',
      description: 'Video de 30 segundos tocando tu canción'
    },
    {
      id: 'compartir-insta',
      name: 'Compartir en Instagram',
      price: 19.90,
      category: 'Video',
      description: 'Compartir tu sesión en mi Instagram'
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
      case 'video-saludo':
        return <Video className="h-5 w-5" />;
      case 'video-llamada-premium':
        return <Phone className="h-5 w-5" />;
      case 'video-tocando-30s':
        return <PlayCircle className="h-5 w-5" />;
      case 'compartir-insta':
        return <Share2 className="h-5 w-5" />;
      default:
        return <Plus className="h-5 w-5" />;
    }
  };

  const getItemColor = (itemId: string) => {
    switch (itemId) {
      case 'video-saludo':
        return 'from-green-500/20 to-blue-500/20 border-green-500/30';
      case 'video-llamada-premium':
        return 'from-purple-500/20 to-pink-500/20 border-purple-500/30';
      case 'video-tocando-30s':
        return 'from-orange-500/20 to-red-500/20 border-orange-500/30';
      case 'compartir-insta':
        return 'from-pink-500/20 to-purple-500/20 border-pink-500/30';
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