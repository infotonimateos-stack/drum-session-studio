import { Smartphone, Video, FileMusic, Users } from "lucide-react";
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
      description: t("extras.partituraDesc"),
      icon: <FileMusic className="h-10 w-10" />,
    },
    {
      id: 'presencial',
      name: t("extras.inPerson"),
      price: 150.00,
      category: t("config.steps.extras"),
      description: t("extras.inPersonDesc"),
      icon: <Users className="h-10 w-10" />,
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
    <div className="space-y-8 sm:space-y-12 bg-gradient-to-br from-warm-blush/20 to-warm-apricot/15 rounded-xl p-4 sm:p-8">
      <div className="text-center space-y-4 sm:space-y-6">
        <h2 className="text-3xl sm:text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          {t("extras.title")}
        </h2>
        <p className="text-muted-foreground text-base sm:text-xl max-w-3xl mx-auto leading-relaxed">
          {t("extras.subtitle")}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5 lg:gap-6 max-w-4xl mx-auto">
        {extrasItems.map((item) => (
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
            addedLabel={t("extras.added")}
          />
        ))}
      </div>
    </div>
  );
};
