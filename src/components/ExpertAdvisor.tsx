import { useState } from "react";
import { HelpCircle, ArrowRight, Check, Music, Disc3, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { CartItem } from "@/types/cart";
import { useCartContext, AdvisorProfile } from "@/contexts/CartContext";
import { useTranslation } from "react-i18next";
import { DRUM_KIT_IDS, drumKits } from "@/components/steps/DrumKitStep";
import { allMicrophones } from "@/data/microphones";

type ModalStep = "welcome" | "usage" | "style" | "result";
type UsageOption = "professional" | "selfproduced" | "demo";
type StyleOption = "modern" | "newvintage" | "jazz" | "purevintage" | "other";

interface ExpertAdvisorProps {
  addItem: (item: CartItem) => void;
  clearCart: () => void;
  onApply?: () => void;
}

// Style → drum kit mapping
const STYLE_TO_KIT: Record<StyleOption, string> = {
  modern: "kit-modern",
  newvintage: "kit-new-vintage",
  jazz: "kit-jazz",
  purevintage: "kit-pure-vintage",
  other: "kit-modern",
};

// Preset definitions using cart item IDs
const PRESET_PROFESSIONAL: { id: string; name: string; price: number; category: string }[] = [
  { id: "sm57-snare", name: "Shure SM 57", price: 2.99, category: "mic" },
  { id: "beta52-kick", name: "Shure Beta 52A", price: 2.99, category: "mic" },
  { id: "km184-hihat", name: "Neumann KM184", price: 2.99, category: "mic" },
  { id: "sen421-floor", name: "Sennheiser 602", price: 2.99, category: "mic" },
  { id: "sen421-tom1", name: "Sennheiser 421", price: 2.99, category: "mic" },
  { id: "sen421-tom2", name: "Sennheiser 421", price: 2.99, category: "mic" },
  { id: "akg414-overheads", name: "Par AKG 414 LTD", price: 5.99, category: "mic" },
  { id: "sen441-snare-bottom", name: "Sennheiser 441", price: 2.99, category: "mic" },
  { id: "beta91-kick", name: "Shure Beta 91", price: 2.99, category: "mic" },
  { id: "subkick-kick", name: "Solomon SubKick", price: 2.99, category: "mic" },
  { id: "u47fet-kick", name: "Neumann U47 FET", price: 4.99, category: "mic" },
  { id: "m160-hihat", name: "Beyerdynamic M160", price: 2.99, category: "mic" },
  { id: "akg414-snare", name: "AKG C414", price: 2.99, category: "mic" },
  { id: "km184-ride", name: "Neumann KM184", price: 2.99, category: "mic" },
  { id: "coles4038-oh", name: "Coles 4038", price: 4.99, category: "mic" },
  { id: "c12-overhead", name: "Telefunken C12", price: 6.99, category: "mic" },
  { id: "u87-room", name: "Neumann U87 Stereo Set", price: 6.99, category: "mic" },
  { id: "preamps-pro", name: "Pack Previos Pro", price: 6.99, category: "preamps" },
  { id: "interface-dad", name: "DAD AX64", price: 6.99, category: "interface" },
  { id: "duracion-estandar", name: "Duración Estándar", price: 3.99, category: "production" },
  { id: "sample-pack", name: "Sample Pack", price: 4.99, category: "production" },
  { id: "work-mix", name: "Work Mix", price: 2.99, category: "production" },
  { id: "social-greeting", name: "Saludo para Redes", price: 4.99, category: "video" },
  { id: "take-exact-copy", name: "Copia Exacta", price: 49.90, category: "takes" },
  { id: "take-toni-interpretation", name: "Versión Toni Mateos x2", price: 39.80, category: "takes" },
  { id: "delivery-5days", name: "Entrega Express 5 días", price: 5.90, category: "delivery" },
  { id: "videocall-10min", name: "Videollamada 10 min", price: 5.99, category: "extras" },
  { id: "partitura-proceso", name: "Partitura", price: 1.99, category: "extras" },
];

const PRESET_SELFPRODUCED: { id: string; name: string; price: number; category: string }[] = [
  { id: "sm57-snare", name: "Shure SM 57", price: 2.99, category: "mic" },
  { id: "beta52-kick", name: "Shure Beta 52A", price: 2.99, category: "mic" },
  { id: "km184-hihat", name: "Neumann KM184", price: 2.99, category: "mic" },
  { id: "sen421-floor", name: "Sennheiser 602", price: 2.99, category: "mic" },
  { id: "sen421-tom1", name: "Sennheiser 421", price: 2.99, category: "mic" },
  { id: "sen421-tom2", name: "Sennheiser 421", price: 2.99, category: "mic" },
  { id: "akg414-overheads", name: "Par AKG 414 LTD", price: 5.99, category: "mic" },
  { id: "sen441-snare-bottom", name: "Sennheiser 441", price: 2.99, category: "mic" },
  { id: "subkick-kick", name: "Solomon SubKick", price: 2.99, category: "mic" },
  { id: "u47fet-kick", name: "Neumann U47 FET", price: 4.99, category: "mic" },
  { id: "km184-ride", name: "Neumann KM184", price: 2.99, category: "mic" },
  { id: "u87-room", name: "Neumann U87 Stereo Set", price: 6.99, category: "mic" },
  { id: "preamps-pro", name: "Pack Previos Pro", price: 6.99, category: "preamps" },
  { id: "interface-dad", name: "DAD AX64", price: 6.99, category: "interface" },
  { id: "duracion-estandar", name: "Duración Estándar", price: 3.99, category: "production" },
  { id: "social-greeting", name: "Saludo para Redes", price: 4.99, category: "video" },
  { id: "take-toni-interpretation", name: "Versión Toni Mateos x2", price: 39.80, category: "takes" },
  { id: "delivery-standard", name: "Entrega Estándar", price: 3.99, category: "delivery" },
];

const PRESET_DEMO: { id: string; name: string; price: number; category: string }[] = [
  { id: "sm57-snare", name: "Shure SM 57", price: 2.99, category: "mic" },
  { id: "beta52-kick", name: "Shure Beta 52A", price: 2.99, category: "mic" },
  { id: "km184-hihat", name: "Neumann KM184", price: 2.99, category: "mic" },
  { id: "sen421-tom1", name: "Sennheiser 421", price: 2.99, category: "mic" },
  { id: "sen421-tom2", name: "Sennheiser 421", price: 2.99, category: "mic" },
  { id: "akg414-overheads", name: "Par AKG 414 LTD", price: 5.99, category: "mic" },
  { id: "sen441-snare-bottom", name: "Sennheiser 441", price: 2.99, category: "mic" },
  { id: "preamps-motu", name: "MOTU 8pre", price: 4.99, category: "preamps" },
  { id: "interface-motu", name: "MOTU 8pre", price: 4.99, category: "interface" },
  { id: "duracion-estandar", name: "Duración Estándar", price: 3.99, category: "production" },
  { id: "take-toni-interpretation", name: "Versión Toni Mateos x1", price: 19.90, category: "takes" },
  { id: "delivery-standard", name: "Entrega Estándar", price: 3.99, category: "delivery" },
];

// Special preset for demo + purevintage: only vintage mics, no basic mics
const PRESET_DEMO_VINTAGE: { id: string; name: string; price: number; category: string }[] = [
  { id: "preamps-motu", name: "MOTU 8pre", price: 4.99, category: "preamps" },
  { id: "interface-motu", name: "MOTU 8pre", price: 4.99, category: "interface" },
  { id: "duracion-estandar", name: "Duración Estándar", price: 3.99, category: "production" },
  { id: "take-toni-interpretation", name: "Versión Toni Mateos x1", price: 19.90, category: "takes" },
  { id: "delivery-standard", name: "Entrega Estándar", price: 3.99, category: "delivery" },
];

// Vintage microphones added when style is "purevintage"
const VINTAGE_MIC_ITEMS: { id: string; name: string; price: number; category: string }[] = [
  { id: "sm57-unidyne-vintage", name: "Shure SM 57 Unidyne", price: 2.99, category: "mic" },
  { id: "akg-d12-vintage", name: "AKG D12", price: 5.99, category: "mic" },
  { id: "aea-r88-vintage", name: "AEA R88", price: 6.99, category: "mic" },
  { id: "akg-d19c-vintage", name: "AKG D19C 200", price: 4.99, category: "mic" },
  { id: "sen-md421n-vintage-tom1", name: "Sennheiser MD 421-N", price: 3.99, category: "mic" },
  { id: "sen-md421n-vintage-tom2", name: "Sennheiser MD 421-N", price: 3.99, category: "mic" },
];

const PRESETS: Record<UsageOption, typeof PRESET_PROFESSIONAL> = {
  professional: PRESET_PROFESSIONAL,
  selfproduced: PRESET_SELFPRODUCED,
  demo: PRESET_DEMO,
};

const getEffectivePreset = (usage: UsageOption, style: StyleOption | null) => {
  if (usage === "demo" && style === "purevintage") {
    return PRESET_DEMO_VINTAGE;
  }
  return PRESETS[usage];
};

const computeTotal = (preset: typeof PRESET_PROFESSIONAL, kitPrice: number, style?: StyleOption | null): string => {
  let sum = preset.reduce((acc, item) => acc + item.price, 0) + kitPrice;
  if (style === "purevintage") {
    sum += VINTAGE_MIC_ITEMS.reduce((acc, item) => acc + item.price, 0);
  }
  return sum.toFixed(2).replace('.', ',');
};

// ─── Complete catalog of ALL available items per step ───
interface CatalogItem {
  id: string;
  name: string;
  price: number;
}

interface CatalogGroup {
  labelKey: string;
  emoji: string;
  colorClass: string;
  checkColor: string;
  items: CatalogItem[];
}

const buildFullCatalog = (t: (key: string) => string): CatalogGroup[] => {
  const allMics: CatalogItem[] = allMicrophones.map(m => ({ id: m.id, name: m.name, price: m.price }));

  return [
    {
      labelKey: "advisor.groupMics",
      emoji: "🎙️",
      colorClass: "text-sky-400",
      checkColor: "text-sky-400",
      items: allMics,
    },
    {
      labelKey: "advisor.groupPreamps",
      emoji: "🎛️",
      colorClass: "text-amber-400",
      checkColor: "text-amber-400",
      items: [
        { id: "preamps-motu", name: "MOTU 8Pre", price: 4.99 },
        { id: "preamps-pro", name: t("preamps.legendaryPack"), price: 6.99 },
        { id: "interface-motu", name: "MOTU 8Pre (Interface)", price: 4.99 },
        { id: "interface-dad", name: "DAD AX64", price: 6.99 },
      ],
    },
    {
      labelKey: "advisor.groupSession",
      emoji: "🎬",
      colorClass: "text-emerald-400",
      checkColor: "text-emerald-400",
      items: [
        { id: "duracion-estandar", name: t("production.standardDuration"), price: 3.99 },
        { id: "tiempo-adicional", name: t("production.additionalTime"), price: 6.99 },
        { id: "work-mix", name: t("production.workMix"), price: 2.99 },
        { id: "sample-pack", name: t("production.samplePack"), price: 4.99 },
        { id: "social-greeting", name: t("video.socialGreeting"), price: 4.99 },
        { id: "playing-video", name: t("video.playingVideo"), price: 29.90 },
        { id: "instagram-share", name: t("video.instagramShare"), price: 29.90 },
        { id: "take-toni-interpretation", name: t("takes.proInterpretation"), price: 19.90 },
        { id: "take-exact-copy", name: t("takes.exactCopy"), price: 49.90 },
        { id: "delivery-standard", name: t("delivery.standardTitle"), price: 3.99 },
        { id: "delivery-5days", name: t("delivery.express5Name"), price: 5.90 },
        { id: "delivery-2days", name: t("delivery.express2Name"), price: 39.90 },
        { id: "videocall-10min", name: t("extras.videocall10"), price: 5.99 },
        { id: "videocall-premium", name: t("extras.multicam"), price: 100.00 },
        { id: "partitura-proceso", name: t("extras.partitura"), price: 1.99 },
        { id: "presencial", name: t("extras.inPerson"), price: 150.00 },
      ],
    },
  ];
};

// ─── Collapsible group sub-component ───
const CollapsibleCatalogGroup = ({
  group,
  selectedIds,
  defaultOpen,
}: {
  group: CatalogGroup;
  selectedIds: Set<string>;
  defaultOpen: boolean;
}) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const selectedInGroup = group.items.filter(i => selectedIds.has(i.id));
  const selectedTotal = selectedInGroup.reduce((s, i) => s + i.price, 0);

  return (
    <div className="rounded-xl border border-border/50 overflow-hidden">
      {/* Group header — clickable */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-2.5 bg-muted/60 hover:bg-muted/80 transition-colors"
      >
        <span className={`text-xs font-bold uppercase tracking-wider ${group.colorClass} flex items-center gap-1.5`}>
          <span>{group.emoji}</span> {t(group.labelKey)}
          <span className="text-muted-foreground font-normal ml-1">
            ({selectedInGroup.length}/{group.items.length})
          </span>
        </span>
        <span className="flex items-center gap-2">
          <span className={`text-xs font-semibold ${group.colorClass}`}>
            {selectedTotal.toFixed(2)} €
          </span>
          {isOpen ? (
            <ChevronUp className="h-3.5 w-3.5 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
          )}
        </span>
      </button>
      {/* Group items */}
      {isOpen && (
        <ul className="px-4 py-2 space-y-1">
          {group.items.map((item) => {
            const isSelected = selectedIds.has(item.id);
            return (
              <li
                key={item.id}
                className={`flex justify-between text-xs transition-opacity ${
                  isSelected ? `${group.colorClass}/90` : "text-muted-foreground/50"
                }`}
              >
                <span className="flex items-center gap-1.5">
                  {isSelected ? (
                    <Check className={`h-3 w-3 ${group.checkColor}`} />
                  ) : (
                    <span className="w-3 h-3 rounded-full border border-muted-foreground/30 inline-block shrink-0" />
                  )}
                  <span className={isSelected ? "font-medium" : ""}>{item.name}</span>
                </span>
                <span className="whitespace-nowrap shrink-0">{item.price.toFixed(2)} €</span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export const ExpertAdvisor = ({ addItem, clearCart, onApply }: ExpertAdvisorProps) => {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<ModalStep>("welcome");
  const [usage, setUsage] = useState<UsageOption | null>(null);
  const [style, setStyle] = useState<StyleOption | null>(null);
  const [otherStyle, setOtherStyle] = useState("");
  const { t } = useTranslation();
  const { setAdvisorProfile } = useCartContext();

  const reset = () => {
    setStep("welcome");
    setUsage(null);
    setStyle(null);
    setOtherStyle("");
  };

  const handleOpen = () => {
    reset();
    setOpen(true);
  };

  const getSelectedKit = () => {
    if (!style) return null;
    const kitId = STYLE_TO_KIT[style];
    return drumKits.find((k) => k.id === kitId) || null;
  };

  const handleApply = () => {
    if (!usage || !style) return;
    clearCart();

    // Add drum kit
    const kit = getSelectedKit();
    if (kit) {
      addItem({
        id: kit.id,
        name: t(kit.nameKey),
        price: kit.price,
        category: t("drumKit.category"),
      });
    }

    // Add preset items (uses special preset for demo+purevintage)
    const preset = getEffectivePreset(usage, style);
    preset.forEach((item) => {
      addItem({
        id: item.id,
        name: item.name,
        price: item.price,
        category: item.category,
      });
    });

    // Add vintage mics when style is purevintage
    if (style === "purevintage") {
      VINTAGE_MIC_ITEMS.forEach((item) => {
        addItem({
          id: item.id,
          name: item.name,
          price: item.price,
          category: item.category,
        });
      });
    }

    // Store advisor profile for filtering
    setAdvisorProfile(usage as AdvisorProfile);

    setOpen(false);
    if (onApply) onApply();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const usageOptions: { key: UsageOption; labelKey: string; descKey: string }[] = [
    { key: "professional", labelKey: "advisor.usageProfessional", descKey: "advisor.usageProfessionalDesc" },
    { key: "selfproduced", labelKey: "advisor.usageSelfproduced", descKey: "advisor.usageSelfproducedDesc" },
    { key: "demo", labelKey: "advisor.usageDemo", descKey: "advisor.usageDemoDesc" },
  ];

  const styleOptions: { key: StyleOption; labelKey: string; descKey: string }[] = [
    { key: "modern", labelKey: "advisor.styleModern", descKey: "advisor.styleModernDesc" },
    { key: "newvintage", labelKey: "advisor.styleNewVintage", descKey: "advisor.styleNewVintageDesc" },
    { key: "jazz", labelKey: "advisor.styleJazz", descKey: "advisor.styleJazzDesc" },
    { key: "purevintage", labelKey: "advisor.stylePureVintage", descKey: "advisor.stylePureVintageDesc" },
    { key: "other", labelKey: "advisor.styleOther", descKey: "advisor.styleOtherDesc" },
  ];

  const selectedKit = getSelectedKit();

  return (
    <>
      {/* Floating button */}
      <button
        onClick={handleOpen}
        className="fixed bottom-24 right-6 z-40 flex items-center gap-2 px-5 py-3 rounded-full bg-accent text-accent-foreground shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 font-semibold text-sm animate-soft-breathe hover:animate-none"
        aria-label={t("advisor.buttonLabel")}
      >
        <HelpCircle className="h-5 w-5" />
        <span className="hidden sm:inline">{t("advisor.button")}</span>
        <span className="sm:hidden">{t("advisor.buttonShort")}</span>
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-center bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {t("advisor.title")}
            </DialogTitle>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-muted-foreground/20">
            {/* WELCOME */}
            {step === "welcome" && (
              <div className="space-y-6 text-center py-4">
                <p className="text-muted-foreground leading-relaxed text-sm">
                  {t("advisor.welcomeMessage")}
                </p>
                <Button
                  onClick={() => setStep("usage")}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 px-8"
                >
                  {t("advisor.letsGo")} <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            )}

            {/* STEP 1: USAGE */}
            {step === "usage" && (
              <div className="space-y-4 py-4">
                <h3 className="font-semibold text-center text-foreground">
                  {t("advisor.usageQuestion")}
                </h3>
                <div className="space-y-3">
                  {usageOptions.map((opt) => (
                    <button
                      key={opt.key}
                      onClick={() => setUsage(opt.key)}
                      className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                        usage === opt.key
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <div className="font-semibold text-sm text-foreground">{t(opt.labelKey)}</div>
                      <div className="text-xs text-muted-foreground mt-1">{t(opt.descKey)}</div>
                    </button>
                  ))}
                </div>
                <Button
                  onClick={() => usage && setStep("style")}
                  disabled={!usage}
                  className="w-full bg-primary text-primary-foreground"
                >
                  {t("stepNav.next")} <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            )}

            {/* STEP 2: STYLE (assigns drum kit) */}
            {step === "style" && (
              <div className="space-y-4 py-4">
                <h3 className="font-semibold text-center text-foreground flex items-center justify-center gap-2">
                  <Music className="h-5 w-5 text-primary" />
                  {t("advisor.styleQuestion")}
                </h3>
                <div className="space-y-3">
                  {styleOptions.map((opt) => (
                    <button
                      key={opt.key}
                      onClick={() => setStyle(opt.key)}
                      className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                        style === opt.key
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <div className="font-semibold text-sm text-foreground">{t(opt.labelKey)}</div>
                      <div className="text-xs text-muted-foreground mt-1">{t(opt.descKey)}</div>
                    </button>
                  ))}
                  {style === "other" && (
                    <Textarea
                      placeholder={t("advisor.styleOtherPlaceholder")}
                      value={otherStyle}
                      onChange={(e) => setOtherStyle(e.target.value)}
                      className="mt-2"
                    />
                  )}
                </div>
                <Button
                  onClick={() => style && setStep("result")}
                  disabled={!style}
                  className="w-full bg-primary text-primary-foreground"
                >
                  {t("advisor.seeRecommendation")} <Disc3 className="ml-2 h-4 w-4" />
                </Button>
              </div>
            )}

            {/* RESULT — shows ALL items, selected highlighted */}
            {step === "result" && usage && style && (() => {
              const preset = getEffectivePreset(usage, style);
              const vintageMics = style === "purevintage" ? VINTAGE_MIC_ITEMS : [];
              const allPresetItems = [...preset, ...vintageMics];
              const selectedIds = new Set(allPresetItems.map(i => i.id));

              // Also add selected kit id
              if (selectedKit) selectedIds.add(selectedKit.id);

              const fullCatalog = buildFullCatalog(t);

              const kitPrice = selectedKit?.price ?? 0;
              const totalStr = computeTotal(preset, kitPrice, style);

              // Non-selected drum kits
              const otherKits = drumKits.filter(k => k.id !== selectedKit?.id);

              return (
                <div className="space-y-5 py-4">
                  <p className="text-muted-foreground text-sm text-center leading-relaxed">
                    {t("advisor.resultMessage")}
                  </p>

                  {/* Drum Kit hero — selected */}
                  {selectedKit && (
                    <div className="bg-muted/50 rounded-xl p-4 flex items-center gap-4 ring-2 ring-primary/40">
                      <img src={selectedKit.image} alt={t(selectedKit.nameKey)} className="w-20 h-20 object-contain rounded-lg bg-white" />
                      <div className="flex-1 min-w-0">
                        <span className="text-xs uppercase tracking-wider text-muted-foreground">{t("advisor.drumKitLabel")}</span>
                        <p className="font-bold text-foreground flex items-center gap-1.5">
                          <Check className="h-3.5 w-3.5 text-primary" />
                          {t(selectedKit.nameKey)}
                        </p>
                        <p className="text-primary font-bold">{selectedKit.price.toFixed(2)} €</p>
                      </div>
                    </div>
                  )}

                  {/* Other drum kits — not selected */}
                  {otherKits.length > 0 && (
                    <div className="grid grid-cols-3 gap-2">
                      {otherKits.map(kit => (
                        <div key={kit.id} className="rounded-lg border border-border/30 p-2 opacity-40 flex flex-col items-center text-center">
                          <img src={kit.image} alt={t(kit.nameKey)} className="w-12 h-12 object-contain rounded bg-white mb-1" />
                          <span className="text-[10px] text-muted-foreground leading-tight">{t(kit.nameKey)}</span>
                          <span className="text-[10px] text-muted-foreground">{kit.price.toFixed(2)} €</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Full catalog grouped — collapsible */}
                  <div className="space-y-3">
                    {fullCatalog.map((group) => (
                      <CollapsibleCatalogGroup
                        key={group.labelKey}
                        group={group}
                        selectedIds={selectedIds}
                        defaultOpen={group.labelKey === "advisor.groupMics"}
                      />
                    ))}
                  </div>

                  {/* Total */}
                  <div className="flex justify-between items-center px-4 py-3 rounded-xl bg-primary/10 border border-primary/30">
                    <span className="font-bold text-foreground text-sm">{t(`advisor.preset${usage.charAt(0).toUpperCase() + usage.slice(1)}`)}</span>
                    <span className="font-bold text-primary text-lg">{totalStr} €</span>
                  </div>

                  <Button
                    onClick={handleApply}
                    className="w-full bg-accent text-accent-foreground hover:bg-accent/90 font-bold"
                  >
                    {t("advisor.applyConfig")} <Check className="ml-2 h-4 w-4" />
                  </Button>
                  <p className="text-xs text-muted-foreground text-center">
                    {t("advisor.modifyAfter")}
                  </p>
                </div>
              );
            })()}
          </div>

          {/* Tax disclaimer always visible at bottom */}
          <div className="pt-4 border-t border-border bg-background">
            <p className="text-[10px] sm:text-xs text-muted-foreground text-center italic leading-tight">
              {t("cart.taxDisclaimer")}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};