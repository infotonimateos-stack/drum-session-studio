import { useState } from "react";
import { Play, Copy, Crown, Folder, Minus, Plus } from "lucide-react";
import { CartItem } from "@/types/cart";
import { useTranslation } from "react-i18next";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";

interface TakesStepProps {
  addItem: (item: CartItem) => void;
  removeItem: (itemId: string) => void;
  hasItem: (itemId: string) => boolean;
}

export const TakesStep = ({
  addItem,
  removeItem,
  hasItem
}: TakesStepProps) => {
  const { t } = useTranslation();
  const [proQuantity, setProQuantity] = useState(1);

  const basicTake: CartItem = {
    id: 'take-basic',
    name: t("takes.basic"),
    price: 5.99,
    category: t("config.steps.takes"),
    description: `${t("takes.feat1")} · ${t("takes.feat2")}`
  };

  const exactCopyTake: CartItem = {
    id: 'take-exact-copy',
    name: t("takes.exactCopyName"),
    price: 49.90,
    category: t("config.steps.takes"),
    description: t("takes.exactFeat1")
  };

  const proTakeId = 'take-toni-interpretation';
  const proUnitPrice = 19.90;

  const isBasicSelected = hasItem(basicTake.id);
  const isExactCopySelected = hasItem(exactCopyTake.id);
  const isProSelected = hasItem(proTakeId);

  const handleToggleBasic = () => {
    if (isBasicSelected) removeItem(basicTake.id);
    else addItem(basicTake);
  };

  const handleToggleExactCopy = () => {
    if (isExactCopySelected) removeItem(exactCopyTake.id);
    else addItem(exactCopyTake);
  };

  const handleTogglePro = () => {
    if (isProSelected) {
      removeItem(proTakeId);
    } else {
      addItem({
        id: proTakeId,
        name: `${t("takes.proInterpretation")} x${proQuantity}`,
        price: proUnitPrice * proQuantity,
        category: t("config.steps.takes"),
        description: `${t("takes.proFeat1")} · ${t("takes.proFeat2")} · ${t("takes.proFeat3")}`
      });
    }
  };

  const updateProQuantity = (newQty: number) => {
    if (newQty < 1 || newQty > 5) return;
    setProQuantity(newQty);
    if (isProSelected) {
      removeItem(proTakeId);
      addItem({
        id: proTakeId,
        name: `${t("takes.proInterpretation")} x${newQty}`,
        price: proUnitPrice * newQty,
        category: t("config.steps.takes"),
        description: `${t("takes.proFeat1")} · ${t("takes.proFeat2")} · ${t("takes.proFeat3")}`
      });
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 bg-gradient-to-br from-warm-cream/30 to-warm-blush/20 rounded-xl p-4 sm:p-8">
      <div className="text-center space-y-4 sm:space-y-6">
        <h2 className="text-3xl sm:text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent flex items-center justify-center gap-2 sm:gap-3">
          <Folder className="h-8 w-8 sm:h-12 sm:w-12 text-primary" />
          {t("takes.title")}
        </h2>
        <p className="text-muted-foreground text-base sm:text-xl max-w-3xl mx-auto leading-relaxed">
          {t("takes.subtitle")}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <ProductCard
          category={t("config.steps.takes")}
          price={basicTake.price}
          name={t("takes.basic")}
          description={`${t("takes.feat1")} · ${t("takes.feat2")} · ${t("takes.feat3")}`}
          icon={<Play className="h-10 w-10" />}
          isSelected={isBasicSelected}
          onToggle={handleToggleBasic}
          addLabel={t("video.addFor")}
          addedLabel={t("takes.added")}
        />

        {/* Pro take with quantity selector */}
        <div className="flex flex-col">
          <ProductCard
            category={t("config.steps.takes")}
            price={proUnitPrice * proQuantity}
            name={t("takes.proInterpretation")}
            subtitle={t("takes.proSubtitle")}
            description={`${t("takes.proFeat1")} · ${t("takes.proFeat2")} · ${t("takes.proFeat3")}`}
            icon={<Crown className="h-10 w-10" />}
            isSelected={isProSelected}
            onToggle={handleTogglePro}
            addLabel={t("video.addFor")}
            addedLabel={t("takes.added")}
          />
          <div className="flex items-center justify-center gap-3 mt-3 bg-card/50 rounded-lg py-2 px-4">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={(e) => { e.stopPropagation(); updateProQuantity(proQuantity - 1); }}
              disabled={proQuantity <= 1}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="font-bold text-lg min-w-[2ch] text-center">{proQuantity}</span>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={(e) => { e.stopPropagation(); updateProQuantity(proQuantity + 1); }}
              disabled={proQuantity >= 5}
            >
              <Plus className="h-4 w-4" />
            </Button>
            <span className="text-sm text-muted-foreground">× {proUnitPrice.toFixed(2)} €</span>
          </div>
        </div>

        <ProductCard
          category={t("config.steps.takes")}
          price={exactCopyTake.price}
          name={t("takes.exactCopy")}
          description={`${t("takes.exactFeat1")} · ${t("takes.exactFeat2")} · ${t("takes.exactFeat3")}`}
          icon={<Copy className="h-10 w-10" />}
          isSelected={isExactCopySelected}
          onToggle={handleToggleExactCopy}
          addLabel={t("video.addFor")}
          addedLabel={t("takes.added")}
        />
      </div>
    </div>
  );
};
