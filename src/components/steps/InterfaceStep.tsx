import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Plus, Cpu } from "lucide-react";
import { CartItem } from "@/types/cart";
import { useState, useEffect } from "react";
import { processImageFromUrl } from "@/utils/backgroundRemoval";
import { useTranslation } from "react-i18next";

interface InterfaceStepProps {
  addItem: (item: CartItem) => void;
  removeItem: (itemId: string) => void;
  hasItem: (itemId: string) => boolean;
}

export const InterfaceStep = ({
  addItem,
  removeItem,
  hasItem
}: InterfaceStepProps) => {
  const { t } = useTranslation();
  const [processedIconUrl, setProcessedIconUrl] = useState<string | null>(null);
  
  const dadInterface: CartItem = {
    id: 'interface-dad',
    name: 'DAD AX64',
    price: 6.99,
    category: t("config.steps.interface"),
    description: t("interface.dadDesc")
  };
  
  const isDadSelected = hasItem(dadInterface.id);
  
  const handleToggleDad = () => {
    if (isDadSelected) {
      removeItem(dadInterface.id);
    } else {
      addItem(dadInterface);
    }
  };

  useEffect(() => {
    const processIcon = async () => {
      try {
        const processed = await processImageFromUrl('/lovable-uploads/53c6239d-a2ad-4218-b08e-c2a176eac089.png');
        setProcessedIconUrl(processed);
      } catch (error) {
        console.error('Failed to process icon:', error);
      }
    };
    
    processIcon();
  }, []);

  return (
    <div className="space-y-12 bg-gradient-to-br from-warm-apricot/25 to-warm-cream/20 rounded-xl p-8">
      {/* Header */}
      <div className="text-center space-y-6">
        <h2 className="text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          {t("interface.title")}
        </h2>
        <p className="text-muted-foreground text-xl max-w-3xl mx-auto leading-relaxed">
          {t("interface.subtitle")}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
        {/* Basic Interface */}
        <Card className="bg-gradient-to-br from-card to-muted border-success/30 hover:shadow-xl transition-all duration-300">
          <CardHeader className="pb-6">
            <div className="flex items-center justify-between mb-4">
              <CardTitle className="flex items-center gap-3 text-2xl">
                <Check className="h-8 w-8 text-success" />
                {t("interface.basicKit")}
              </CardTitle>
              <Badge variant="secondary" className="text-lg px-4 py-2">{t("interface.included")}</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="w-full h-32 flex items-center justify-center bg-muted/30 rounded-lg mb-4">
              <img 
                src="/lovable-uploads/93445061-0c3b-4d86-a30f-15ff4b018154.png" 
                alt="MOTU 8Pre Interface" 
                className="max-h-28 max-w-full object-contain bg-transparent" 
                style={{ filter: 'drop-shadow(0 0 10px rgba(0,0,0,0.1))' }} 
              />
            </div>
            
            <div className="flex items-center gap-4 p-4 bg-success/10 rounded-lg">
              <div className="w-16 h-16 bg-success/20 rounded-full flex items-center justify-center">
                <Cpu className="h-10 w-10 text-success" />
              </div>
              <div>
                <h3 className="font-bold text-xl">MOTU 8Pre</h3>
                <p className="text-muted-foreground">{t("interface.motuDesc")}</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-bold text-lg">{t("interface.features")}</h4>
              <ul className="text-muted-foreground space-y-3 text-base">
                <li>• <strong>{t("interface.feat1")}</strong></li>
                <li>• <strong>{t("interface.feat2")}</strong></li>
                <li>• <strong>{t("interface.feat3")}</strong></li>
                <li>• <strong>{t("interface.feat4")}</strong></li>
              </ul>
            </div>

            <div className="pt-4">
              <div className="flex items-center justify-center gap-2 bg-success/20 px-4 py-3 rounded-full">
                <Check className="h-5 w-5 text-success" />
                <span className="text-success font-bold text-lg">{t("interface.alreadyIncluded")}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Premium Interface */}
        <Card 
          className={`transition-all duration-300 hover:shadow-xl cursor-pointer transform hover:scale-105 ${
            isDadSelected 
              ? 'bg-gradient-to-br from-primary/20 to-accent/20 border-primary shadow-xl scale-105' 
              : 'bg-gradient-to-br from-card to-muted hover:border-primary/50'
          }`} 
          onClick={handleToggleDad}
        >
          <CardHeader className="pb-6">
            <div className="flex items-center justify-between mb-4">
              <CardTitle className="flex items-center gap-3 text-2xl">
                <Plus className="h-8 w-8 text-primary" />
                {t("interface.premium")}
              </CardTitle>
              <Badge variant="outline" className="text-primary text-2xl px-6 py-3 font-bold">6.99 €</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="w-full h-32 flex items-center justify-center bg-muted/30 rounded-lg mb-4">
              <img 
                src="/lovable-uploads/0d4521a3-d112-43ce-a820-f1afe53330c8.png" 
                alt="DAD AX64 Interface" 
                className="max-h-28 max-w-full object-contain bg-transparent" 
                style={{ filter: 'drop-shadow(0 0 10px rgba(0,0,0,0.1))' }} 
              />
            </div>
            
            <div className="flex items-center gap-4 p-4 bg-primary/10 rounded-lg">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
                <Cpu className="h-10 w-10 text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-xl">DAD AX64</h3>
                <p className="text-muted-foreground">{t("interface.dadDesc")}</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-bold text-lg">{t("interface.premiumSpecs")}</h4>
              <ul className="text-muted-foreground space-y-3 text-base">
                <li>• <strong className="text-primary">{t("interface.spec1")}</strong></li>
                <li>• <strong className="text-primary">{t("interface.spec2")}</strong></li>
                <li>• <strong className="text-primary">{t("interface.spec3")}</strong></li>
                <li>• <strong>{t("interface.spec4")}</strong></li>
              </ul>
            </div>

            <div className="p-4 bg-primary/20 rounded-lg">
              <p className="text-primary font-bold text-center">
                {t("interface.upgradeText")}
              </p>
            </div>

            <Button 
              variant={isDadSelected ? "default" : "upgrade"} 
              size="lg" 
              className="w-full h-14 text-xl font-bold" 
              onClick={e => {
                e.stopPropagation();
                handleToggleDad();
              }}
            >
              {isDadSelected ? (
                <>
                  <Check className="h-6 w-6 mr-2" />
                  {t("interface.addedToCart")}
                </>
              ) : (
                <>
                  <Plus className="h-6 w-6 mr-2" />
                  {t("interface.upgradeFor")} 6.99 €
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
