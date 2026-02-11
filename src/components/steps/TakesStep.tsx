import { Play, Copy, Crown, Folder } from "lucide-react";
import { CartItem } from "@/types/cart";
import { useTranslation } from "react-i18next";
import { ProductCard } from "@/components/ProductCard";

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

  const exactCopyTake: CartItem = {
    id: 'take-exact-copy',
    name: t("takes.exactCopyName"),
    price: 49.90,
    category: t("config.steps.takes"),
    description: t("takes.exactFeat1")
  };

  const toniInterpretation: CartItem = {
    id: 'take-toni-interpretation',
    name: 'Interpretación de Toni Mateos',
    price: 19.90,
    category: t("config.steps.takes"),
    description: t("takes.proFeat1")
  };

  const isExactCopySelected = hasItem(exactCopyTake.id);
  const isToniSelected = hasItem(toniInterpretation.id);

  const handleToggleExactCopy = () => {
    if (isExactCopySelected) removeItem(exactCopyTake.id);
    else addItem(exactCopyTake);
  };

  const handleToggleToni = () => {
    if (isToniSelected) removeItem(toniInterpretation.id);
    else addItem(toniInterpretation);
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
          price={0}
          name={t("takes.basic")}
          description={`${t("takes.feat1")} · ${t("takes.feat2")} · ${t("takes.feat3")}`}
          icon={<Play className="h-10 w-10" />}
          isSelected={false}
          onToggle={() => {}}
          included
          includedLabel={t("takes.includedInKit")}
        />

        <ProductCard
          category={t("config.steps.takes")}
          price={toniInterpretation.price}
          name={t("takes.proInterpretation")}
          description={`${t("takes.proFeat1")} · ${t("takes.proFeat2")} · ${t("takes.proFeat3")}`}
          icon={<Crown className="h-10 w-10" />}
          isSelected={isToniSelected}
          onToggle={handleToggleToni}
          addLabel={t("video.addFor")}
          addedLabel={t("takes.added")}
        />

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
