import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Zap } from "lucide-react";
import { CartItem } from "@/types/cart";
import { useTranslation } from "react-i18next";
import { ProductCard } from "@/components/ProductCard";

interface PreampsStepProps {
  addItem: (item: CartItem) => void;
  removeItem: (itemId: string) => void;
  hasItem: (itemId: string) => boolean;
}

export const PreampsStep = ({
  addItem,
  removeItem,
  hasItem
}: PreampsStepProps) => {
  const { t } = useTranslation();

  const proPreampsPack: CartItem = {
    id: 'preamps-pro',
    name: 'Pack Previos Pro: API, Neve y DAD',
    price: 6.99,
    category: t("config.steps.preamps"),
    description: t("preamps.subtitle")
  };

  const isProSelected = hasItem(proPreampsPack.id);

  const handleTogglePro = () => {
    if (isProSelected) removeItem(proPreampsPack.id);
    else addItem(proPreampsPack);
  };

  return (
    <div className="space-y-12 bg-gradient-to-br from-warm-coral/20 to-warm-blush/15 rounded-xl p-8">
      <div className="text-center space-y-6">
        <h2 className="text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          {t("preamps.title")}
        </h2>
        <p className="text-muted-foreground text-xl max-w-3xl mx-auto leading-relaxed">
          {t("preamps.subtitle")}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
        {/* Basic Preamps - included */}
        <Card className="bg-gradient-to-br from-card to-muted border-success/30 hover:shadow-xl transition-all duration-300">
          <CardHeader className="pb-6">
            <div className="flex items-center justify-between mb-4">
              <CardTitle className="flex items-center gap-3 text-2xl">
                <Check className="h-8 w-8 text-success" />
                {t("preamps.basicKit")}
              </CardTitle>
              <Badge variant="secondary" className="text-lg px-4 py-2">{t("preamps.included")}</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="w-full h-32 flex items-center justify-center bg-muted/30 rounded-lg mb-4">
              <img src="/lovable-uploads/93445061-0c3b-4d86-a30f-15ff4b018154.png" alt="MOTU 8Pre Preamps" className="max-h-28 max-w-full object-contain bg-transparent" style={{ filter: 'drop-shadow(0 0 10px rgba(0,0,0,0.1))' }} />
            </div>
            <div className="flex items-center gap-4 p-4 bg-success/10 rounded-lg">
              <div className="w-16 h-16 bg-success/20 rounded-full flex items-center justify-center">
                <Zap className="h-10 w-10 text-success" />
              </div>
              <div>
                <h3 className="font-bold text-xl">MOTU 8Pre</h3>
                <p className="text-muted-foreground">{t("preamps.motuDesc")}</p>
              </div>
            </div>
            <ul className="text-muted-foreground space-y-3 text-base">
              <li>• <strong>{t("preamps.cleanSound")}</strong></li>
              <li>• <strong>{t("preamps.flatResponse")}</strong></li>
              <li>• <strong>{t("preamps.noNoise")}</strong></li>
              <li>• <strong>{t("preamps.perfectFor")}</strong></li>
            </ul>
            <div className="flex items-center justify-center gap-2 bg-success/20 px-4 py-3 rounded-full">
              <Check className="h-5 w-5 text-success" />
              <span className="text-success font-bold text-lg">{t("preamps.alreadyIncluded")}</span>
            </div>
          </CardContent>
        </Card>

        {/* Pro Preamps */}
        <ProductCard
          category={t("config.steps.preamps")}
          price={proPreampsPack.price}
          name={t("preamps.legendaryPack")}
          description={`API: ${t("preamps.apiDesc")} · Neve: ${t("preamps.neveDesc")} · DAD: ${t("preamps.dadDesc")}`}
          image="/lovable-uploads/9ead66c6-7787-437f-bbbe-b9b7a400a1c8.png"
          isSelected={isProSelected}
          onToggle={handleTogglePro}
          addLabel={t("video.addFor")}
          addedLabel={t("preamps.addedToCart")}
        />
      </div>
    </div>
  );
};
