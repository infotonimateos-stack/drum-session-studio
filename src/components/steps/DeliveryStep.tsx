import { Package, Plane, Rocket } from "lucide-react";
import { CartItem } from "@/types/cart";
import { useTranslation } from "react-i18next";
import { ProductCard } from "@/components/ProductCard";

interface DeliveryStepProps {
  addItem: (item: CartItem) => void;
  removeItem: (itemId: string) => void;
  hasItem: (itemId: string) => boolean;
}

export const DeliveryStep = ({ addItem, removeItem, hasItem }: DeliveryStepProps) => {
  const { t } = useTranslation();

  const express5Days: CartItem = {
    id: 'delivery-5days',
    name: t("delivery.express5Name"),
    price: 5.90,
    category: t("config.steps.delivery"),
    description: t("delivery.express5Desc")
  };

  const express2Days: CartItem = {
    id: 'delivery-2days',
    name: t("delivery.express2Name"),
    price: 39.90,
    category: t("config.steps.delivery"),
    description: t("delivery.express2Desc")
  };

  const is5DaysSelected = hasItem(express5Days.id);
  const is2DaysSelected = hasItem(express2Days.id);

  const handleToggle5Days = () => {
    if (is5DaysSelected) {
      removeItem(express5Days.id);
    } else {
      if (is2DaysSelected) removeItem(express2Days.id);
      addItem(express5Days);
    }
  };

  const handleToggle2Days = () => {
    if (is2DaysSelected) {
      removeItem(express2Days.id);
    } else {
      if (is5DaysSelected) removeItem(express5Days.id);
      addItem(express2Days);
    }
  };

  return (
    <div className="space-y-8 bg-gradient-to-br from-warm-blush/20 to-warm-apricot/15 rounded-xl p-8">
      <div className="text-center space-y-6">
        <h2 className="text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          {t("delivery.title")}
        </h2>
        <p className="text-muted-foreground text-xl max-w-3xl mx-auto leading-relaxed">
          {t("delivery.subtitle")}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Standard Delivery - included */}
        <ProductCard
          category={t("config.steps.delivery")}
          price={0}
          name={t("delivery.standardTitle")}
          description={`${t("delivery.standard10Days")} · ${t("delivery.noCost")} · ${t("delivery.idealProjects")}`}
          icon={<Package className="h-10 w-10" />}
          isSelected={false}
          onToggle={() => {}}
          included
          includedLabel={t("delivery.includedInKit")}
        />

        {/* 5 Days Express */}
        <ProductCard
          category={t("config.steps.delivery")}
          price={express5Days.price}
          name={t("delivery.fastTitle")}
          description={`${t("delivery.fast5Days")} · ${t("delivery.fastTimeDesc")}`}
          icon={<Plane className="h-10 w-10" />}
          isSelected={is5DaysSelected}
          onToggle={handleToggle5Days}
          addLabel={t("video.addFor")}
          addedLabel={t("delivery.selected")}
        />

        {/* 2 Days Ultra Express */}
        <ProductCard
          category={t("config.steps.delivery")}
          price={express2Days.price}
          name={t("delivery.expressTitle")}
          description={`${t("delivery.express2Days")} · ${t("delivery.expressTimeDesc")}`}
          icon={<Rocket className="h-10 w-10" />}
          isSelected={is2DaysSelected}
          onToggle={handleToggle2Days}
          addLabel={t("video.addFor")}
          addedLabel={t("delivery.selected")}
        />
      </div>
    </div>
  );
};
