import { Video, PlayCircle, Share2, Film } from "lucide-react";
import { CartItem } from "@/types/cart";
import { useTranslation } from "react-i18next";
import { ProductCard } from "@/components/ProductCard";

interface VideoStepProps {
  addItem: (item: CartItem) => void;
  removeItem: (itemId: string) => void;
  hasItem: (itemId: string) => boolean;
}

export const VideoStep = ({ addItem, removeItem, hasItem }: VideoStepProps) => {
  const { t } = useTranslation();

  const videoItems: (CartItem & { icon: React.ReactNode })[] = [
    {
      id: 'social-greeting',
      name: t("video.socialGreeting"),
      price: 4.99,
      category: t("config.steps.video"),
      description: t("video.socialGreetingDesc"),
      icon: <Video className="h-10 w-10" />,
    },
    {
      id: 'playing-video',
      name: t("video.playingVideo"),
      price: 29.90,
      category: t("config.steps.video"),
      description: t("video.playingVideoDesc"),
      icon: <PlayCircle className="h-10 w-10" />,
    },
    {
      id: 'instagram-share',
      name: t("video.instagramShare"),
      price: 29.90,
      category: t("config.steps.video"),
      description: t("video.instagramShareDesc"),
      icon: <Share2 className="h-10 w-10" />,
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
    <div className="space-y-12 bg-gradient-to-br from-warm-peach/20 to-warm-apricot/30 rounded-xl p-8">
      <div className="text-center space-y-6">
        <h2 className="text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent flex items-center justify-center gap-3">
          <Film className="h-12 w-12 text-primary" />
          {t("video.title")}
        </h2>
        <p className="text-muted-foreground text-xl max-w-3xl mx-auto leading-relaxed">
          {t("video.subtitle")}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {videoItems.map((item) => (
          <ProductCard
            key={item.id}
            category={item.category}
            price={item.price}
            name={item.name}
            description={item.description}
            icon={item.icon}
            isSelected={hasItem(item.id)}
            onToggle={() => handleToggleItem(item)}
            addLabel={t("video.addFor")}
            addedLabel={t("video.added")}
          />
        ))}
      </div>
    </div>
  );
};
