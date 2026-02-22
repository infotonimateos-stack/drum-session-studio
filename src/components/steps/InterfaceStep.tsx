import { useEffect, useState } from "react";
import { CartItem, CartState } from "@/types/cart";
import { useTranslation } from "react-i18next";
import { ProductCard } from "@/components/ProductCard";
import { INTERFACE_IDS, isMotuBlockedByMicCount, hasLegendaryPreamps } from "@/hooks/useStepValidation";
import { AlertCircle } from "lucide-react";

interface InterfaceStepProps {
  addItem: (item: CartItem) => void;
  removeItem: (itemId: string) => void;
  hasItem: (itemId: string) => boolean;
  cartState: CartState;
}

export const InterfaceStep = ({
  addItem,
  removeItem,
  hasItem,
  cartState
}: InterfaceStepProps) => {
  const { t } = useTranslation();
  const [motuBlockedError, setMotuBlockedError] = useState<string | null>(null);

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
  const motuBlockedByMics = isMotuBlockedByMicCount(cartState);
  const motuBlockedByLegendary = hasLegendaryPreamps(cartState);
  const motuBlocked = motuBlockedByMics || motuBlockedByLegendary;

  // Auto-deselect MOTU if mic count exceeds 8 after returning from step 0
  useEffect(() => {
    if (motuBlocked && isMotuSelected) {
      removeItem(motuInterface.id);
      setMotuBlockedError(motuBlockedByLegendary ? t("interface.motuBlockedByLegendary") : t("interface.motuBlockedByMics"));
    }
  }, [motuBlocked, motuBlockedByLegendary, isMotuSelected]);

  // Clear error when user goes below 8 mics
  useEffect(() => {
    if (!motuBlocked) {
      setMotuBlockedError(null);
    }
  }, [motuBlocked]);

  // Exclusive selection: selecting one removes the other
  const removeAllInterfaces = () => {
    INTERFACE_IDS.forEach(id => removeItem(id));
  };

  const handleToggleMotu = () => {
    if (isMotuSelected) {
      removeItem(motuInterface.id);
      setMotuBlockedError(null);
    } else {
      if (motuBlocked) {
        setMotuBlockedError(motuBlockedByLegendary ? t("interface.motuBlockedByLegendary") : t("interface.motuBlockedByMics"));
        return;
      }
      setMotuBlockedError(null);
      removeAllInterfaces();
      addItem(motuInterface);
    }
  };

  const handleToggleDad = () => {
    if (isDadSelected) {
      removeItem(dadInterface.id);
    } else {
      removeAllInterfaces();
      addItem(dadInterface);
    }
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

      {motuBlockedError && (
        <div className="flex items-start gap-3 bg-destructive/10 border border-destructive/30 text-destructive rounded-lg px-4 py-3 max-w-3xl mx-auto">
          <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
          <p className="text-sm font-medium">{motuBlockedError}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6 lg:gap-10 max-w-6xl mx-auto">
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
          disabled={motuBlocked && !isMotuSelected}
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
