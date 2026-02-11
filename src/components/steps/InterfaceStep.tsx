import { Cpu } from "lucide-react";
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

  const dadInterface: CartItem = {
    id: 'interface-dad',
    name: 'DAD AX64',
    price: 6.99,
    category: t("config.steps.interface"),
    description: t("interface.dadDesc")
  };

  const isDadSelected = hasItem(dadInterface.id);

  const handleToggleDad = () => {
    if (isDadSelected) removeItem(dadInterface.id);
    else addItem(dadInterface);
  };

  return (
    <div className="space-y-12 bg-gradient-to-br from-warm-apricot/25 to-warm-cream/20 rounded-xl p-8">
      <div className="text-center space-y-6">
        <h2 className="text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          {t("interface.title")}
        </h2>
        <p className="text-muted-foreground text-xl max-w-3xl mx-auto leading-relaxed">
          {t("interface.subtitle")}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
        {/* Basic Interface - included */}
        <ProductCard
          category={t("config.steps.interface")}
          price={0}
          name="MOTU 8Pre"
          description={`${t("interface.motuDesc")} · ${t("interface.feat1")} · ${t("interface.feat2")}`}
          icon={<Cpu className="h-10 w-10" />}
          isSelected={false}
          onToggle={() => {}}
          included
          includedLabel={t("interface.alreadyIncluded")}
        />

        {/* Premium Interface */}
        <ProductCard
          category={t("config.steps.interface")}
          price={dadInterface.price}
          name="DAD AX64"
          description={t("interface.dadFullDesc")}
          icon={<Cpu className="h-10 w-10" />}
          isSelected={isDadSelected}
          onToggle={handleToggleDad}
          addLabel={t("video.addFor")}
          addedLabel={t("interface.addedToCart")}
        />
      </div>
    </div>
  );
};
