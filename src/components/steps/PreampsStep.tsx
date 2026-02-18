import { CartItem } from "@/types/cart";
import { useTranslation } from "react-i18next";
import { ProductCard } from "@/components/ProductCard";
import { PREAMP_IDS } from "@/hooks/useStepValidation";

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

  const motuPreamp: CartItem = {
    id: 'preamps-motu',
    name: 'MOTU 8Pre',
    price: 4.99,
    category: t("config.steps.preamps"),
    description: `${t("preamps.motuDesc")} · ${t("preamps.cleanSound")} · ${t("preamps.flatResponse")}`
  };

  const proPreampsPack: CartItem = {
    id: 'preamps-pro',
    name: 'Pack Previos Pro: API, Neve y DAD',
    price: 6.99,
    category: t("config.steps.preamps"),
    description: t("preamps.subtitle")
  };

  const isMotuSelected = hasItem(motuPreamp.id);
  const isProSelected = hasItem(proPreampsPack.id);

  // Exclusive selection: selecting one removes the other
  const removeAllPreamps = () => {
    PREAMP_IDS.forEach(id => removeItem(id));
  };

  const handleToggleMotu = () => {
    if (isMotuSelected) {
      removeItem(motuPreamp.id);
    } else {
      removeAllPreamps();
      addItem(motuPreamp);
    }
  };

  const handleTogglePro = () => {
    if (isProSelected) {
      removeItem(proPreampsPack.id);
    } else {
      removeAllPreamps();
      addItem(proPreampsPack);
    }
  };

  return (
    <div className="space-y-8 sm:space-y-12 bg-gradient-to-br from-warm-coral/20 to-warm-blush/15 rounded-xl p-4 sm:p-8">
      <div className="text-center space-y-4 sm:space-y-6">
        <h2 className="text-3xl sm:text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          {t("preamps.title")}
        </h2>
        <p className="text-muted-foreground text-base sm:text-xl max-w-3xl mx-auto leading-relaxed">
          {t("preamps.subtitle")}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6 lg:gap-10 max-w-6xl mx-auto">
        <ProductCard
          category={t("config.steps.preamps")}
          price={motuPreamp.price}
          name="MOTU 8Pre"
          description={`${t("preamps.motuDesc")} · ${t("preamps.cleanSound")} · ${t("preamps.flatResponse")}`}
          image="/lovable-uploads/motu-8pre.png"
          imageAlt={t("preamps.motuAlt")}
          isSelected={isMotuSelected}
          onToggle={handleToggleMotu}
          addLabel={t("video.addFor")}
          addedLabel={t("preamps.addedToCart")}
        />

        <ProductCard
          category={t("config.steps.preamps")}
          price={proPreampsPack.price}
          name={t("preamps.legendaryPack")}
          descriptionList={[
            { emoji: "", text: `API: ${t("preamps.apiDesc")}` },
            { emoji: "", text: `Neve: ${t("preamps.neveDesc")}` },
            { emoji: "", text: `DAD: ${t("preamps.dadDesc")}` },
          ]}
          image="/lovable-uploads/preamps-pro-pack.png"
          imageAlt={t("preamps.proPackAlt")}
          imageContain={false}
          isSelected={isProSelected}
          onToggle={handleTogglePro}
          addLabel={t("video.addFor")}
          addedLabel={t("preamps.addedToCart")}
        />
      </div>
    </div>
  );
};
