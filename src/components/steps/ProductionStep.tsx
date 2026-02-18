import { Clock, Headphones, Package, Timer } from "lucide-react";
import { CartItem } from "@/types/cart";
import { useTranslation } from "react-i18next";
import { ProductCard } from "@/components/ProductCard";
import { DURATION_IDS } from "@/hooks/useStepValidation";

interface ProductionStepProps {
  addItem: (item: CartItem) => void;
  removeItem: (itemId: string) => void;
  hasItem: (itemId: string) => boolean;
}

export const ProductionStep = ({ addItem, removeItem, hasItem }: ProductionStepProps) => {
  const { t } = useTranslation();

  const standardDuration: CartItem = {
    id: 'duracion-estandar',
    name: t("production.standardDuration"),
    price: 3.99,
    category: t("config.steps.production"),
    description: t("production.standardDurationDesc"),
  };

  const additionalTime: CartItem = {
    id: 'tiempo-adicional',
    name: t("production.additionalTime"),
    price: 6.99,
    category: t("config.steps.production"),
    description: t("production.additionalTimeDesc"),
  };

  const workMix: CartItem = {
    id: 'work-mix',
    name: t("production.workMix"),
    price: 2.99,
    category: t("config.steps.production"),
    description: t("production.workMixDesc"),
  };

  const samplePack: CartItem = {
    id: 'sample-pack',
    name: t("production.samplePack"),
    price: 4.99,
    category: t("config.steps.production"),
    description: t("production.samplePackDesc"),
  };

  // Exclusive toggle for duration items
  const removeAllDurations = () => {
    DURATION_IDS.forEach(id => removeItem(id));
  };

  const handleToggleStandard = () => {
    if (hasItem(standardDuration.id)) {
      removeItem(standardDuration.id);
    } else {
      removeAllDurations();
      addItem(standardDuration);
    }
  };

  const handleToggleAdditional = () => {
    if (hasItem(additionalTime.id)) {
      removeItem(additionalTime.id);
    } else {
      removeAllDurations();
      addItem(additionalTime);
    }
  };

  const handleToggleWorkMix = () => {
    if (hasItem(workMix.id)) removeItem(workMix.id);
    else addItem(workMix);
  };

  const handleToggleSamplePack = () => {
    if (hasItem(samplePack.id)) removeItem(samplePack.id);
    else addItem(samplePack);
  };

  return (
    <div className="space-y-8 sm:space-y-12 bg-gradient-to-br from-warm-peach/15 to-warm-coral/20 rounded-xl p-4 sm:p-8">
      <div className="text-center space-y-4 sm:space-y-6">
        <h2 className="text-3xl sm:text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent flex items-center justify-center gap-2 sm:gap-3">
          <Headphones className="h-8 w-8 sm:h-12 sm:w-12 text-primary" />
          {t("production.title")}
        </h2>
        <p className="text-muted-foreground text-base sm:text-xl max-w-3xl mx-auto leading-relaxed">
          {t("production.subtitle")}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5 lg:gap-6 max-w-4xl mx-auto">
        <ProductCard
          category={standardDuration.category}
          price={standardDuration.price}
          name={standardDuration.name}
          description={standardDuration.description}
          icon={<Timer className="h-10 w-10" />}
          isSelected={hasItem(standardDuration.id)}
          onToggle={handleToggleStandard}
          addLabel={t("video.addFor")}
          addedLabel={t("production.added")}
        />
        <ProductCard
          category={additionalTime.category}
          price={additionalTime.price}
          name={additionalTime.name}
          description={additionalTime.description}
          icon={<Clock className="h-10 w-10" />}
          isSelected={hasItem(additionalTime.id)}
          onToggle={handleToggleAdditional}
          addLabel={t("video.addFor")}
          addedLabel={t("production.added")}
        />
        <ProductCard
          category={workMix.category}
          price={workMix.price}
          name={workMix.name}
          description={workMix.description}
          icon={<Headphones className="h-10 w-10" />}
          isSelected={hasItem(workMix.id)}
          onToggle={handleToggleWorkMix}
          addLabel={t("video.addFor")}
          addedLabel={t("production.added")}
        />
        <ProductCard
          category={samplePack.category}
          price={samplePack.price}
          name={samplePack.name}
          description={samplePack.description}
          icon={<Package className="h-10 w-10" />}
          isSelected={hasItem(samplePack.id)}
          onToggle={handleToggleSamplePack}
          addLabel={t("video.addFor")}
          addedLabel={t("production.added")}
        />
      </div>
    </div>
  );
};
