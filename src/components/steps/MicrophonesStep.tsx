import { Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { baseMicrophones, upgradeMicrophones } from "@/data/microphones";
import { CartItem } from "@/types/cart";
import { useTranslation } from "react-i18next";
import { ProductCard } from "@/components/ProductCard";

interface MicrophonesStepProps {
  addItem: (item: CartItem) => void;
  removeItem: (itemId: string) => void;
  hasItem: (itemId: string) => boolean;
}

export const MicrophonesStep = ({
  addItem,
  removeItem,
  hasItem
}: MicrophonesStepProps) => {
  const { t } = useTranslation();

  const handleToggleItem = (microphone: any) => {
    const cartItem: CartItem = {
      id: microphone.id,
      name: microphone.name,
      price: microphone.price,
      category: t("microphones.category"),
      description: `${t(microphone.descriptionKey)} - ${t(microphone.targetKey)}`
    };
    if (hasItem(microphone.id)) {
      removeItem(microphone.id);
    } else {
      addItem(cartItem);
    }
  };

  return (
    <div className="space-y-12 bg-gradient-to-br from-warm-cream/20 to-warm-peach/10 rounded-xl p-8">
      {/* Header */}
      <div className="text-center space-y-6">
        <h2 className="text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          {t("microphones.title")}
        </h2>
        <p className="text-muted-foreground text-xl max-w-3xl mx-auto leading-relaxed">
          {t("microphones.subtitle")}
        </p>
      </div>

      {/* Included Microphones */}
      <div className="space-y-6">
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className="flex items-center gap-3 bg-[hsl(var(--card-dark-included))]/20 px-6 py-3 rounded-full">
            <h3 className="text-2xl font-bold">{t("microphones.basicKit")}</h3>
            <Badge variant="secondary" className="text-2xl px-5 py-2">49.90 €</Badge>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {baseMicrophones.map(mic => (
            <ProductCard
              key={mic.id}
              category={t(mic.targetKey)}
              price={0}
              name={mic.name}
              description={t(mic.descriptionKey)}
              image={mic.image}
              isSelected={false}
              onToggle={() => {}}
              included
              includedLabel={t("microphones.included")}
            />
          ))}
        </div>
      </div>

      {/* Upgrade Microphones */}
      <div className="space-y-6">
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className="flex items-center gap-3 bg-primary/20 px-6 py-3 rounded-full">
            <Plus className="h-6 w-6 text-primary" />
            <h3 className="text-2xl font-bold">{t("microphones.premiumUpgrades")}</h3>
            <Badge variant="outline" className="text-lg px-3 py-1">{t("microphones.optional")}</Badge>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {upgradeMicrophones.map(mic => (
            <ProductCard
              key={mic.id}
              category={t(mic.targetKey)}
              price={mic.price}
              name={mic.name}
              description={t(mic.descriptionKey)}
              image={mic.image}
              isSelected={hasItem(mic.id)}
              onToggle={() => handleToggleItem(mic)}
              addLabel={t("video.addFor")}
              addedLabel={t("microphones.added")}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
