import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Plus, Video, Share2, PlayCircle } from "lucide-react";
import { CartItem } from "@/types/cart";
import extrasIcon from "@/assets/extras-icon.png";

interface ExtrasStepProps {
  addItem: (item: CartItem) => void;
  removeItem: (itemId: string) => void;
  hasItem: (itemId: string) => boolean;
}

export const ExtrasStep = ({ addItem, removeItem, hasItem }: ExtrasStepProps) => {
  const videoGreeting: CartItem = {
    id: 'extra-video-greeting',
    name: 'Videosaludo para Redes (15s)',
    price: 3.90,
    category: 'Extras',
    description: 'Video personalizado nombrando tu proyecto para tus redes sociales'
  };

  const socialShare: CartItem = {
    id: 'extra-social-share',
    name: 'Promoción en mis Redes (30K followers)',
    price: 29.90,
    category: 'Extras',
    description: 'Promocionaré tu proyecto en mis redes sociales con 30K seguidores'
  };

  const performanceVideo: CartItem = {
    id: 'extra-performance-video',
    name: 'Video Performance (1 minuto)',
    price: 29.90,
    category: 'Extras',
    description: 'Video de 1 minuto de Toni tocando tu canción en el estudio'
  };

  const isVideoGreetingSelected = hasItem(videoGreeting.id);
  const isSocialShareSelected = hasItem(socialShare.id);
  const isPerformanceVideoSelected = hasItem(performanceVideo.id);

  const handleToggleVideoGreeting = () => {
    if (isVideoGreetingSelected) {
      removeItem(videoGreeting.id);
    } else {
      addItem(videoGreeting);
    }
  };

  const handleToggleSocialShare = () => {
    if (isSocialShareSelected) {
      removeItem(socialShare.id);
    } else {
      addItem(socialShare);
    }
  };

  const handleTogglePerformanceVideo = () => {
    if (isPerformanceVideoSelected) {
      removeItem(performanceVideo.id);
    } else {
      addItem(performanceVideo);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
       <div className="text-center space-y-6">
        <div className="flex items-center justify-center mb-4">
          <img 
            src={extrasIcon} 
            alt="Extras y Promoción"
            className="w-20 h-20 object-contain"
          />
        </div>
        <h2 className="text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Extras y Promoción
        </h2>
        <p className="text-muted-foreground text-xl max-w-3xl mx-auto leading-relaxed">
          Potencia tu música con contenido adicional para redes sociales y promoción profesional.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Video Greeting */}
        <Card 
          className={`transition-all duration-300 hover:shadow-lg cursor-pointer ${
            isVideoGreetingSelected 
              ? 'bg-gradient-to-br from-primary/20 to-accent/20 border-primary shadow-lg' 
              : 'bg-gradient-to-br from-card to-muted hover:border-primary/50'
          }`}
          onClick={handleToggleVideoGreeting}
        >
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Video className="h-5 w-5 text-primary" />
                Video Personal
              </CardTitle>
              <Badge variant="outline" className="text-primary">€3.90</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Video className="h-8 w-8 text-primary" />
              <div>
                <h3 className="font-semibold">Videosaludo 15s</h3>
                <p className="text-sm text-muted-foreground">Contenido para tus redes sociales</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Características:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Video de 15 segundos personalizado</li>
                <li>• Mención directa de tu proyecto</li>
                <li>• Optimizado para Instagram/TikTok</li>
                <li>• Entrega en alta calidad</li>
              </ul>
            </div>

            <Button
              variant={isVideoGreetingSelected ? "default" : "upgrade"}
              size="lg"
              className="w-full h-12 text-base font-bold"
              onClick={(e) => {
                e.stopPropagation();
                handleToggleVideoGreeting();
              }}
            >
              {isVideoGreetingSelected ? (
                <>
                  <Check className="h-5 w-5 mr-2" />
                  ✨ AÑADIDO
                </>
              ) : (
                <>
                  <Plus className="h-5 w-5 mr-2" />
                  AÑADIR €3.90
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Social Share */}
        <Card 
          className={`transition-all duration-300 hover:shadow-lg cursor-pointer ${
            isSocialShareSelected 
              ? 'bg-gradient-to-br from-primary/20 to-accent/20 border-primary shadow-lg' 
              : 'bg-gradient-to-br from-card to-muted hover:border-primary/50'
          }`}
          onClick={handleToggleSocialShare}
        >
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Share2 className="h-5 w-5 text-primary" />
                Promoción Pro
              </CardTitle>
              <Badge variant="outline" className="text-primary">€29.90</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Share2 className="h-8 w-8 text-primary" />
              <div>
                <h3 className="font-semibold">Promoción en mis Redes</h3>
                <p className="text-sm text-muted-foreground">30K seguidores + invitación a seguirte</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Características:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Post en todas mis redes sociales</li>
                <li>• Mención directa de tu perfil</li>
                <li>• Invitación a seguir tu música</li>
                <li>• Alcance de +30K seguidores</li>
              </ul>
            </div>

            <div className="p-3 bg-primary/10 rounded-lg">
              <p className="text-xs text-primary font-medium">
                📈 Exposición profesional garantizada
              </p>
            </div>

            <Button
              variant={isSocialShareSelected ? "default" : "upgrade"}
              size="lg"
              className="w-full h-12 text-base font-bold"
              onClick={(e) => {
                e.stopPropagation();
                handleToggleSocialShare();
              }}
            >
              {isSocialShareSelected ? (
                <>
                  <Check className="h-5 w-5 mr-2" />
                  ✨ AÑADIDO
                </>
              ) : (
                <>
                  <Plus className="h-5 w-5 mr-2" />
                  AÑADIR €29.90
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Performance Video */}
        <Card 
          className={`transition-all duration-300 hover:shadow-lg cursor-pointer ${
            isPerformanceVideoSelected 
              ? 'bg-gradient-to-br from-primary/20 to-accent/20 border-primary shadow-lg' 
              : 'bg-gradient-to-br from-card to-muted hover:border-primary/50'
          }`}
          onClick={handleTogglePerformanceVideo}
        >
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <PlayCircle className="h-5 w-5 text-primary" />
                Video Performance
              </CardTitle>
              <Badge variant="outline" className="text-primary">€29.90</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <PlayCircle className="h-8 w-8 text-primary" />
              <div>
                <h3 className="font-semibold">Performance 1 minuto</h3>
                <p className="text-sm text-muted-foreground">Video de Toni tocando tu canción</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Características:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Video de 1 minuto en el estudio</li>
                <li>• Audio sincronizado de calidad</li>
                <li>• Contenido único para promoción</li>
              </ul>
            </div>

            <div className="p-3 bg-primary/10 rounded-lg">
              <p className="text-xs text-primary font-medium">
                🎥 Contenido visual premium único
              </p>
            </div>

            <Button
              variant={isPerformanceVideoSelected ? "default" : "upgrade"}
              size="lg"
              className="w-full h-12 text-base font-bold"
              onClick={(e) => {
                e.stopPropagation();
                handleTogglePerformanceVideo();
              }}
            >
              {isPerformanceVideoSelected ? (
                <>
                  <Check className="h-5 w-5 mr-2" />
                  ✨ AÑADIDO
                </>
              ) : (
                <>
                  <Plus className="h-5 w-5 mr-2" />
                  AÑADIR €29.90
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};