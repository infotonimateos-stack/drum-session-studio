import { Badge } from "@/components/ui/badge";
import { microphoneCategories } from "@/data/microphones";
import { CartItem } from "@/types/cart";
import { useTranslation } from "react-i18next";
import { ProductCard } from "@/components/ProductCard";
import { useCartContext } from "@/contexts/CartContext";

interface MicrophonesStepProps {
  addItem: (item: CartItem) => void;
  removeItem: (itemId: string) => void;
  hasItem: (itemId: string) => boolean;
}

export const MicrophonesStep = ({
  addItem,
  removeItem,
  hasItem,
}: MicrophonesStepProps) => {
  const { t } = useTranslation();
  const { advisorProfile } = useCartContext();
  const isDemoMode = advisorProfile === "demo";

  const handleToggleItem = (microphone: any) => {
    const cartItem: CartItem = {
      id: microphone.id,
      name: microphone.name,
      price: microphone.price,
      category: t("microphones.category"),
      description: `${t(microphone.descriptionKey)} - ${t(microphone.targetKey)}`,
    };
    if (hasItem(microphone.id)) {
      removeItem(microphone.id);
    } else {
      addItem(cartItem);
    }
  };

  // In demo mode, hide vintage mics
  const visibleCategories = microphoneCategories.map((cat) => ({
    ...cat,
    microphones: isDemoMode
      ? cat.microphones.filter((m) => !m.vintage)
      : cat.microphones,
  })).filter((cat) => cat.microphones.length > 0);

  return (
    <div className="space-y-8 sm:space-y-12 bg-gradient-to-br from-warm-cream/20 to-warm-peach/10 rounded-xl p-4 sm:p-8">
      {/* Header */}
      <div className="text-center space-y-4 sm:space-y-6">
        <h2 className="text-3xl sm:text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          {t("microphones.title")}
        </h2>
        <p className="text-muted-foreground text-base sm:text-xl max-w-3xl mx-auto leading-relaxed">
          {t("microphones.subtitle")}
        </p>
      </div>

      {/* Category Sections */}
      {visibleCategories.map((category) => (
        <section key={category.id} className="space-y-4 sm:space-y-6">
          {/* Sticky category header */}
          <div className="sticky top-0 z-20 py-2 -mx-4 px-4 sm:-mx-8 sm:px-8 bg-gradient-to-r from-warm-cream/95 to-warm-peach/80 backdrop-blur-md rounded-b-xl">
            <div className="flex items-center justify-center">
              <div className="flex items-center gap-2 sm:gap-3 bg-primary/20 px-4 sm:px-6 py-2 sm:py-3 rounded-full">
                <h3 className="text-lg sm:text-2xl font-bold">
                  {t(category.titleKey)}
                </h3>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-5 lg:gap-6">
            {category.microphones.map((mic) => (
              <ProductCard
                key={mic.id}
                category={t(mic.targetKey)}
                price={mic.price}
                name={mic.name}
                subtitle={mic.subtitleKey ? t(mic.subtitleKey) : undefined}
                description={t(mic.descriptionKey)}
                image={mic.image}
                isSelected={hasItem(mic.id)}
                onToggle={() => handleToggleItem(mic)}
                addLabel={t("video.addFor")}
                addedLabel={t("microphones.added")}
                vintageBadge={mic.vintage ? t("micData.vintage") : undefined}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
};
