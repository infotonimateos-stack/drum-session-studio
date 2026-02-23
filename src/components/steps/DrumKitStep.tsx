import { CartItem } from "@/types/cart";
import { useTranslation } from "react-i18next";
import { ProductCard } from "@/components/ProductCard";

interface DrumKitStepProps {
  addItem: (item: CartItem) => void;
  removeItem: (itemId: string) => void;
  hasItem: (itemId: string) => boolean;
}

const DRUM_KIT_IDS = ["kit-modern", "kit-new-vintage", "kit-jazz", "kit-antique"];

const drumKits = [
  {
    id: "kit-modern",
    nameKey: "drumKit.modernName",
    descKey: "drumKit.modernDesc",
    price: 9.99,
    image: "/lovable-uploads/drum-kit-dw-modern.jpg",
  },
  {
    id: "kit-new-vintage",
    nameKey: "drumKit.newVintageName",
    descKey: "drumKit.newVintageDesc",
    price: 19.99,
    image: "/lovable-uploads/drum-kit-ludwig-centennial.png",
  },
  {
    id: "kit-jazz",
    nameKey: "drumKit.jazzName",
    descKey: "drumKit.jazzDesc",
    price: 19.90,
    image: "/lovable-uploads/drum-kit-yamaha-manu-katche.png",
  },
  {
    id: "kit-antique",
    nameKey: "drumKit.antiqueName",
    descKey: "drumKit.antiqueDesc",
    price: 29.90,
    image: "/lovable-uploads/drum-kit-ludwig-1938.png",
  },
];

export { DRUM_KIT_IDS };

export const DrumKitStep = ({ addItem, removeItem, hasItem }: DrumKitStepProps) => {
  const { t } = useTranslation();

  const handleSelect = (kit: typeof drumKits[0]) => {
    if (hasItem(kit.id)) {
      removeItem(kit.id);
      return;
    }
    // Exclusive selection: remove any other kit first
    DRUM_KIT_IDS.forEach((id) => {
      if (hasItem(id)) removeItem(id);
    });
    addItem({
      id: kit.id,
      name: t(kit.nameKey),
      price: kit.price,
      category: t("drumKit.category"),
      description: t(kit.descKey),
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2">
          🥁 {t("drumKit.title")}
        </h2>
        <p className="text-muted-foreground">{t("drumKit.subtitle")}</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {drumKits.map((kit) => (
          <ProductCard
            key={kit.id}
            name={t(kit.nameKey)}
            category={t("drumKit.category")}
            description={t(kit.descKey)}
            price={kit.price}
            image={kit.image}
            isSelected={hasItem(kit.id)}
            onToggle={() => handleSelect(kit)}
          />
        ))}
      </div>
    </div>
  );
};
