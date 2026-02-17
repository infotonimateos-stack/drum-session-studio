import { CartItem } from "@/types/cart";
import { useTranslation } from "react-i18next";
import { ProductCard } from "@/components/ProductCard";

interface InterfaceStepProps {
  addItem: (item: CartItem) => void;
  removeItem: (itemId: string) => void;
  hasItem: (itemId: string) => boolean;
}

export const InterfaceStep = ({
  addItem,
  removeItem,
  hasItem
}: InterfaceStepProps) => {
  const { t } = useTranslation();

  const motuInterface: CartItem = {
    id: 'interface-motu',
    name: 'MOTU 8Pre',
    price: 4.99,
    category: t("config.steps.interface"),
    description: `${t("interface.motuDesc")} · ${t("interface.feat1")} · ${t("interface.feat2")}`
  };

  const dadInterface: CartItem = {
    id: 'interface-dad',
    name: 'DAD AX64',
    price: 6.99,
    category: t("config.steps.interface"),
    description: t("interface.dadDesc")
  };

  const isMotuSelected = hasItem(motuInterface.id);
  const isDadSelected = hasItem(dadInterface.id);

  const handleToggleMotu = () => {
    if (isMotuSelected) removeItem(motuInterface.id);
    else addItem(motuInterface);
  };

  const handleToggleDad = () => {
    if (isDadSelected) removeItem(dadInterface.id);
    else addItem(dadInterface);
  };

  return (
    <div className="space-y-8 sm:space-y-12 bg-gradient-to-br from-warm-apricot/25 to-warm-cream/20 rounded-xl p-4 sm:p-8">
      <div className="text-center space-y-4 sm:space-y-6">
        <h2 className="text-3xl sm:text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          {t("interface.title")}
        </h2>
        <p className="text-muted-foreground text-base sm:text-xl max-w-3xl mx-auto leading-relaxed">
          {t("interface.subtitle")}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-12 max-w-6xl mx-auto">
        <ProductCard
          category={t("config.steps.interface")}
          price={motuInterface.price}
          name="MOTU 8Pre"
          description={`${t("interface.motuDesc")} · ${t("interface.feat1")} · ${t("interface.feat2")}`}
          image="/lovable-uploads/motu-8pre.png"
          imageAlt={t("interface.motuAlt")}
          isSelected={isMotuSelected}
          onToggle={handleToggleMotu}
          addLabel={t("video.addFor")}
          addedLabel={t("interface.addedToCart")}
        />

        <ProductCard
          category={t("config.steps.interface")}
          price={dadInterface.price}
          name="DAD AX64"
          description={t("interface.dadFullDesc")}
          image="/lovable-uploads/0d4521a3-d112-43ce-a820-f1afe53330c8.png"
          imageAlt={t("interface.dadAlt")}
          isSelected={isDadSelected}
          onToggle={handleToggleDad}
          addLabel={t("video.addFor")}
          addedLabel={t("interface.addedToCart")}
        />
      </div>
    </div>
  );
};
