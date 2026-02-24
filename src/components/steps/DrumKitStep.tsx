import { CartItem } from "@/types/cart";
import { useTranslation } from "react-i18next";

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
    transparentBg: true,
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
    image: "/lovable-uploads/drum-kit-ludwig-1938-antique.png",
    transparentBg: true,
  },
];

export { DRUM_KIT_IDS, drumKits };

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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {drumKits.map((kit) => {
          const selected = hasItem(kit.id);
          return (
            <button
              key={kit.id}
              onClick={() => handleSelect(kit)}
              className={`group relative flex flex-col rounded-2xl overflow-hidden transition-all duration-300 text-left border-2 ${
                selected
                  ? "border-primary shadow-2xl scale-[1.02] bg-primary/5"
                  : "border-border hover:border-primary/50 hover:shadow-xl hover:scale-[1.01] bg-card"
              }`}
            >
              {/* Large image */}
              <div className="w-full aspect-[4/3] flex items-center justify-center overflow-hidden bg-white border-b border-border/50">
                <img
                  src={kit.image}
                  alt={t(kit.nameKey)}
                  className="w-full h-full object-contain p-1 group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Content */}
              <div className="p-5 flex flex-col flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-bold text-foreground">{t(kit.nameKey)}</h3>
                  <span className="text-xl font-bold text-primary whitespace-nowrap ml-3">
                    {kit.price.toFixed(2)} €
                  </span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                  {t(kit.descKey)}
                </p>
                <div className={`mt-4 w-full py-2.5 rounded-xl text-center text-sm font-bold transition-all ${
                  selected
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
                }`}>
                  {selected ? `✓ ${t("drumKit.selected")}` : t("drumKit.select")}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
