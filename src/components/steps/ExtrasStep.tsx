import { Smartphone, Video, FileMusic } from "lucide-react";
import { CartItem } from "@/types/cart";
import { useTranslation } from "react-i18next";
import { ProductCard } from "@/components/ProductCard";

interface ExtrasStepProps {
  addItem: (item: CartItem) => void;
  removeItem: (itemId: string) => void;
  hasItem: (itemId: string) => boolean;
}

export const ExtrasStep = ({ addItem, removeItem, hasItem }: ExtrasStepProps) => {
  const { t } = useTranslation();

  const extrasItems: (CartItem & { icon: React.ReactNode })[] = [
    {
      id: 'videocall-10min',
      name: t("extras.videocall10"),
      price: 5.99,
      category: t("config.steps.extras"),
      description: t("extras.videocall10Desc"),
      icon: <Smartphone className="h-10 w-10" />,
    },
    {
      id: 'videocall-premium',
      name: t("extras.multicam"),
      price: 100.00,
      category: t("config.steps.extras"),
      description: t("extras.multicamDesc"),
      icon: <Video className="h-10 w-10" />,
    },
    {
      id: 'partitura-proceso',
      name: t("extras.partitura"),
      price: 1.99,
      category: t("config.steps.extras"),
      description: '',
      icon: <FileMusic className="h-10 w-10" />,
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
      <div className="text-center space-y-6">
        <h2 className="text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          {t("extras.title")}
        </h2>
        <p className="text-muted-foreground text-xl max-w-3xl mx-auto leading-relaxed">
          {t("extras.subtitle")}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {extrasItems.map((item) => (
          <ProductCard
            key={item.id}
            category={item.category}
            price={item.price}
            name={item.name}
            description={item.id !== 'partitura-proceso' ? item.description : undefined}
            descriptionList={
              item.id === 'partitura-proceso'
                ? [
                    { emoji: '📄', text: t("extras.partituraDesc1") },
                    { emoji: '✍️', text: t("extras.partituraDesc2") },
                    { emoji: '🎵', text: t("extras.partituraDesc3") },
                  ]
                : undefined
            }
            icon={item.icon}
            isSelected={hasItem(item.id)}
            onToggle={() => handleToggleItem(item)}
            addLabel={t("video.addFor")}
            addedLabel={t("extras.added")}
          />
        ))}
      </div>
    </div>
  );
};
