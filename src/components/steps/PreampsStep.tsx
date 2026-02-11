import { SlidersHorizontal } from "lucide-react";
import { CartItem } from "@/types/cart";
import { useTranslation } from "react-i18next";
import { ProductCard } from "@/components/ProductCard";

interface PreampsStepProps {
  addItem: (item: CartItem) => void;
  removeItem: (itemId: string) => void;
  hasItem: (itemId: string) => boolean;
}

export const PreampsStep = ({
  addItem,
  removeItem,
  hasItem
}: PreampsStepProps) => {
  const { t } = useTranslation();

  const proPreampsPack: CartItem = {
    id: 'preamps-pro',
    name: 'Pack Previos Pro: API, Neve y DAD',
    price: 6.99,
    category: t("config.steps.preamps"),
    description: t("preamps.subtitle")
  };

  const isProSelected = hasItem(proPreampsPack.id);

  const handleTogglePro = () => {
    if (isProSelected) removeItem(proPreampsPack.id);
    else addItem(proPreampsPack);
  };

  return (
    <div className="space-y-12 bg-gradient-to-br from-warm-coral/20 to-warm-blush/15 rounded-xl p-8">
      <div className="text-center space-y-6">
        <h2 className="text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          {t("preamps.title")}
        </h2>
        <p className="text-muted-foreground text-xl max-w-3xl mx-auto leading-relaxed">
          {t("preamps.subtitle")}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
        {/* Basic Preamps - included */}
        <ProductCard
          category={t("config.steps.preamps")}
          price={0}
          name="MOTU 8Pre"
          description={`${t("preamps.motuDesc")} · ${t("preamps.cleanSound")} · ${t("preamps.flatResponse")}`}
          icon={<SlidersHorizontal className="h-10 w-10" />}
          isSelected={false}
          onToggle={() => {}}
          included
          includedLabel={t("preamps.alreadyIncluded")}
        />

        {/* Pro Preamps */}
        <ProductCard
          category={t("config.steps.preamps")}
          price={proPreampsPack.price}
          name={t("preamps.legendaryPack")}
          description={`API: ${t("preamps.apiDesc")} · Neve: ${t("preamps.neveDesc")} · DAD: ${t("preamps.dadDesc")}`}
          icon={<SlidersHorizontal className="h-10 w-10" />}
          isSelected={isProSelected}
          onToggle={handleTogglePro}
          addLabel={t("video.addFor")}
          addedLabel={t("preamps.addedToCart")}
        />
      </div>
    </div>
  );
};
