import { Check } from "lucide-react";
import { CartItem } from "@/types/cart";
import { useTranslation } from "react-i18next";

interface DrumKitStepProps {
  addItem: (item: CartItem) => void;
  removeItem: (itemId: string) => void;
  hasItem: (itemId: string) => boolean;
}

const DRUM_KIT_IDS = ["kit-modern", "kit-new-vintage", "kit-jazz", "kit-pure-vintage"];

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
    image: "/lovable-uploads/drum-kit-ludwig-centennial.webp",
    transparentBg: true,
  },
  {
    id: "kit-jazz",
    nameKey: "drumKit.jazzName",
    descKey: "drumKit.jazzDesc",
    price: 19.90,
    image: "/lovable-uploads/drum-kit-yamaha-manu-katche.webp",
  },
  {
    id: "kit-pure-vintage",
    nameKey: "drumKit.pureVintageName",
    descKey: "drumKit.pureVintageDesc",
    price: 29.90,
    image: "/lovable-uploads/drum-kit-ludwig-1938-antique.webp",
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
                  ? "border-primary shadow-[0_4px_24px_-4px_hsl(var(--primary)/0.35)] scale-[1.02]"
                  : "border-border hover:border-primary/50 hover:shadow-xl hover:scale-[1.01] bg-card"
              }`}
              style={{ background: selected ? "hsl(var(--primary) / 0.08)" : undefined }}
            >
              {/* Selection checkmark badge */}
              {selected && (
                <div className="absolute top-3 left-3 z-10 w-7 h-7 rounded-full bg-primary flex items-center justify-center shadow-md transition-transform duration-300 animate-in zoom-in-50">
                  <Check className="h-4 w-4 text-primary-foreground" strokeWidth={3} />
                </div>
              )}
              {/* Image — aspect-video to match microphone cards */}
              <div className="w-full aspect-video flex items-center justify-center overflow-hidden bg-white border-b border-border/50">
                <img
                  src={kit.image}
                  alt={t(kit.nameKey)}
                  className={`w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 ${
                    kit.id === 'kit-new-vintage' ? 'scale-110' : 'p-2'
                  }`}
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
                    : "bg-gradient-to-r from-[hsl(var(--card-dark-btn-from))] to-[hsl(var(--card-dark-btn-to))] text-white group-hover:shadow-lg"
                }`}>
                  {selected ? `✓ ${t("drumKit.selected")}` : t("drumKit.addFor", { price: kit.price.toFixed(2).replace('.', ',') })}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
