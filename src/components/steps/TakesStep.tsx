import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Plus, Play, Copy, Crown, Folder } from "lucide-react";
import { CartItem } from "@/types/cart";
import { useTranslation } from "react-i18next";

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
    if (isExactCopySelected) {
      removeItem(exactCopyTake.id);
    } else {
      addItem(exactCopyTake);
    }
  };

  const handleToggleToni = () => {
    if (isToniSelected) {
      removeItem(toniInterpretation.id);
    } else {
      addItem(toniInterpretation);
    }
  };

  return (
    <div className="space-y-8 bg-gradient-to-br from-warm-cream/30 to-warm-blush/20 rounded-xl p-8">
      {/* Header */}
      <div className="text-center space-y-6">
        <h2 className="text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent flex items-center justify-center gap-3">
          <Folder className="h-12 w-12 text-primary" />
          {t("takes.title")}
        </h2>
        <p className="text-muted-foreground text-xl max-w-3xl mx-auto leading-relaxed">
          {t("takes.subtitle")}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Basic Take */}
        <Card className="bg-gradient-to-br from-card to-muted border-success/30">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Check className="h-5 w-5 text-success" />
                {t("takes.basic")}
              </CardTitle>
              <Badge variant="secondary">{t("takes.included")}</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Play className="h-8 w-8 text-success" />
              <div>
                <h3 className="font-semibold">{t("takes.standardTake")}</h3>
                <p className="text-sm text-muted-foreground">{t("takes.standardTakeDesc")}</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium text-sm">{t("takes.features")}</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• {t("takes.feat1")}</li>
                <li>• {t("takes.feat2")}</li>
                <li>• {t("takes.feat3")}</li>
              </ul>
            </div>

            <div className="pt-4">
              <div className="flex items-center gap-1">
                <Check className="h-4 w-4 text-success" />
                <span className="text-sm text-success font-medium">{t("takes.includedInKit")}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Toni's Interpretation */}
        <Card 
          className={`transition-all duration-300 hover:shadow-lg cursor-pointer ${
            isToniSelected 
              ? 'bg-gradient-to-br from-primary/20 to-accent/20 border-primary shadow-lg' 
              : 'bg-gradient-to-br from-card to-muted hover:border-primary/50'
          }`} 
          onClick={handleToggleToni}
        >
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Crown className="h-5 w-5 text-primary" />
                {t("takes.proInterpretation")}
              </CardTitle>
              <Badge variant="outline" className="text-primary font-bold text-xl px-4 py-2 whitespace-nowrap">19.90 €</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium text-sm">{t("takes.features")}</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• {t("takes.proFeat1")}</li>
                <li>• {t("takes.proFeat2")}</li>
                <li>• {t("takes.proFeat3")}</li>
                <li>• {t("takes.proFeat4")}</li>
              </ul>
            </div>

            <div className="p-3 bg-primary/10 rounded-lg">
              <p className="text-xs text-primary font-medium">
                {t("takes.recommended")}
              </p>
            </div>

            <Button 
              variant={isToniSelected ? "default" : "upgrade"} 
              className="w-full h-10 text-lg" 
              onClick={e => {
                e.stopPropagation();
                handleToggleToni();
              }}
            >
              {isToniSelected ? (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  {t("takes.added")}
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  {t("takes.add")} 19.90 €
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Exact Copy */}
        <Card 
          className={`transition-all duration-300 hover:shadow-lg cursor-pointer ${
            isExactCopySelected 
              ? 'bg-gradient-to-br from-primary/20 to-accent/20 border-primary shadow-lg' 
              : 'bg-gradient-to-br from-card to-muted hover:border-primary/50'
          }`} 
          onClick={handleToggleExactCopy}
        >
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Copy className="h-5 w-5 text-primary" />
                {t("takes.exactCopy")}
              </CardTitle>
              <Badge variant="outline" className="text-primary font-bold text-xl px-4 py-2 whitespace-nowrap">49.90 €</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium text-sm">{t("takes.features")}</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• {t("takes.exactFeat1")}</li>
                <li>• {t("takes.exactFeat2")}</li>
                <li>• {t("takes.exactFeat3")}</li>
                <li>• {t("takes.exactFeat4")}</li>
                <li>• {t("takes.exactFeat5")}</li>
              </ul>
            </div>

            <Button 
              variant={isExactCopySelected ? "default" : "upgrade"} 
              className="w-full h-10 text-lg" 
              onClick={e => {
                e.stopPropagation();
                handleToggleExactCopy();
              }}
            >
              {isExactCopySelected ? (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  {t("takes.added")}
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  {t("takes.add")} 49.90 €
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
