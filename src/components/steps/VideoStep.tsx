import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Plus, Video, PlayCircle, Share2, Film } from "lucide-react";
import { CartItem } from "@/types/cart";
import { useTranslation } from "react-i18next";

interface VideoStepProps {
  addItem: (item: CartItem) => void;
  removeItem: (itemId: string) => void;
  hasItem: (itemId: string) => boolean;
}

export const VideoStep = ({ addItem, removeItem, hasItem }: VideoStepProps) => {
  const { t } = useTranslation();

  const videoItems: CartItem[] = [
    {
      id: 'social-greeting',
      name: t("video.socialGreeting"),
      price: 4.99,
      category: t("config.steps.video"),
      description: t("video.socialGreetingDesc")
    },
    {
      id: 'playing-video',
      name: t("video.playingVideo"),
      price: 29.90,
      category: t("config.steps.video"),
      description: t("video.playingVideoDesc")
    },
    {
      id: 'instagram-share',
      name: t("video.instagramShare"),
      price: 29.90,
      category: t("config.steps.video"),
      description: t("video.instagramShareDesc")
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
        return 'from-warm-peach/40 to-warm-coral/30 border-warm-peach/50';
      case 'playing-video':
        return 'from-warm-coral/40 to-warm-blush/30 border-warm-coral/50';
      case 'instagram-share':
        return 'from-warm-blush/40 to-warm-apricot/30 border-warm-blush/50';
      default:
        return 'from-card to-muted';
    }
  };

  return (
    <div className="space-y-12 bg-gradient-to-br from-warm-peach/20 to-warm-apricot/30 rounded-xl p-8">
      {/* Header */}
      <div className="text-center space-y-6">
        <h2 className="text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent flex items-center justify-center gap-3">
          <Film className="h-12 w-12 text-primary" />
          {t("video.title")}
        </h2>
        <p className="text-muted-foreground text-xl max-w-3xl mx-auto leading-relaxed">
          {t("video.subtitle")}
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
                  <Badge variant="outline" className="text-primary font-bold text-xl px-4 py-2 whitespace-nowrap">
                    {item.price.toFixed(2)} €
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-muted-foreground">
                  {item.description}
                </p>
                
                {/* Special highlight for premium items */}
                {item.price >= 25 && (
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <p className="text-primary font-semibold text-sm text-center">
                      {t("video.premiumService")}
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
                      {t("video.added")}
                    </>
                  ) : (
                    <>
                      <Plus className="h-5 w-5 mr-2" />
                      {t("video.addFor")} {item.price.toFixed(2)} €
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
