import { Clock, Headphones, Package, Timer } from "lucide-react";
import { CartItem } from "@/types/cart";
import { useTranslation } from "react-i18next";
import { ProductCard } from "@/components/ProductCard";

interface ProductionStepProps {
  addItem: (item: CartItem) => void;
  removeItem: (itemId: string) => void;
  hasItem: (itemId: string) => boolean;
}

export const ProductionStep = ({ addItem, removeItem, hasItem }: ProductionStepProps) => {
  const { t } = useTranslation();

  const includedItem = {
    id: 'duracion-estandar',
    name: t("production.standardDuration"),
    category: t("config.steps.production"),
    description: t("production.standardDurationDesc"),
    icon: <Timer className="h-10 w-10" />,
    price: 0,
  };

  const productionItems: (CartItem & { icon: React.ReactNode })[] = [
    {
      id: 'tiempo-adicional',
      name: t("production.additionalTime"),
      price: 2.99,
      category: t("config.steps.production"),
      description: t("production.additionalTimeDesc"),
      icon: <Clock className="h-10 w-10" />,
    },
    {
      id: 'work-mix',
      name: t("production.workMix"),
      price: 2.99,
      category: t("config.steps.production"),
      description: t("production.workMixDesc"),
      icon: <Headphones className="h-10 w-10" />,
    },
    {
      id: 'sample-pack',
      name: t("production.samplePack"),
      price: 4.99,
      category: t("config.steps.production"),
      description: t("production.samplePackDesc"),
      icon: <Package className="h-10 w-10" />,
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
    <div className="space-y-12 bg-gradient-to-br from-warm-peach/15 to-warm-coral/20 rounded-xl p-8">
      <div className="text-center space-y-6">
        <h2 className="text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent flex items-center justify-center gap-3">
          <Headphones className="h-12 w-12 text-primary" />
          {t("production.title")}
        </h2>
        <p className="text-muted-foreground text-xl max-w-3xl mx-auto leading-relaxed">
          {t("production.subtitle")}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
        <ProductCard
          category={includedItem.category}
          price={includedItem.price}
          name={includedItem.name}
          description={includedItem.description}
          icon={includedItem.icon}
          isSelected={false}
          onToggle={() => {}}
          included
          includedLabel={t("production.alreadyIncluded")}
        />
        {productionItems.map((item) => (
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
            addedLabel={t("production.added")}
          />
        ))}
      </div>
    </div>
  );
};
