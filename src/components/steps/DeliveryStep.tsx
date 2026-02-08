import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Plus, Plane, Rocket } from "lucide-react";
import { CartItem } from "@/types/cart";
import { useTranslation } from "react-i18next";

interface DeliveryStepProps {
  addItem: (item: CartItem) => void;
  removeItem: (itemId: string) => void;
  hasItem: (itemId: string) => boolean;
}

export const DeliveryStep = ({ addItem, removeItem, hasItem }: DeliveryStepProps) => {
  const { t } = useTranslation();

  const express5Days: CartItem = {
    id: 'delivery-5days',
    name: t("delivery.express5Name"),
    price: 5.90,
    category: t("config.steps.delivery"),
    description: t("delivery.express5Desc")
  };

  const express2Days: CartItem = {
    id: 'delivery-2days',
    name: t("delivery.express2Name"),
    price: 39.90,
    category: t("config.steps.delivery"),
    description: t("delivery.express2Desc")
  };

  const is5DaysSelected = hasItem(express5Days.id);
  const is2DaysSelected = hasItem(express2Days.id);

  const handleToggle5Days = () => {
    if (is5DaysSelected) {
      removeItem(express5Days.id);
    } else {
      // Remove 2-day option if selected
      if (is2DaysSelected) {
        removeItem(express2Days.id);
      }
      addItem(express5Days);
    }
  };

  const handleToggle2Days = () => {
    if (is2DaysSelected) {
      removeItem(express2Days.id);
    } else {
      // Remove 5-day option if selected
      if (is5DaysSelected) {
        removeItem(express5Days.id);
      }
      addItem(express2Days);
    }
  };

  return (
    <div className="space-y-8 bg-gradient-to-br from-warm-blush/20 to-warm-apricot/15 rounded-xl p-8">
      {/* Header */}
      <div className="text-center space-y-6">
        <h2 className="text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          {t("delivery.title")}
        </h2>
        <p className="text-muted-foreground text-xl max-w-3xl mx-auto leading-relaxed">
          {t("delivery.subtitle")}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Standard Delivery */}
        <Card className="bg-gradient-to-br from-card to-muted border-success/30">
          <CardHeader>
            <div className="flex items-center justify-center">
              <CardTitle className="flex items-center gap-1">
                <img src="/lovable-uploads/841a1a2f-0999-44b3-9a2a-4a97ad64f750.png" alt="Check" className="h-12 w-12" />
                {t("delivery.standardTitle")}
              </CardTitle>
            </div>
            <div className="flex justify-center">
              <Badge variant="secondary">{t("delivery.included")}</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-center">
              <div className="text-center">
                <h3 className="font-semibold">{t("delivery.standard10Days")}</h3>
                <p className="text-sm text-muted-foreground">{t("delivery.standardTimeDesc")}</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium text-sm">{t("delivery.features")}</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• {t("delivery.noCost")}</li>
                <li>• {t("delivery.idealProjects")}</li>
              </ul>
            </div>

            <div className="pt-4">
              <div className="flex items-center gap-1">
                <Check className="h-4 w-4 text-success" />
                <span className="text-sm text-success font-medium">{t("delivery.includedInKit")}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 5 Days Express */}
        <Card 
          className={`transition-all duration-300 hover:shadow-lg cursor-pointer ${
            is5DaysSelected 
              ? 'bg-gradient-to-br from-primary/20 to-accent/20 border-primary shadow-lg' 
              : 'bg-gradient-to-br from-card to-muted hover:border-primary/50'
          }`}
          onClick={handleToggle5Days}
        >
          <CardHeader>
            <div className="flex items-center justify-center">
              <CardTitle className="flex items-center gap-1">
                <Plane className="h-12 w-12 text-orange-500" />
                {t("delivery.fastTitle")}
              </CardTitle>
            </div>
            <div className="flex justify-center">
              <Badge variant="outline" className="text-primary text-xl px-4 py-2">5.90 €</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-center">
              <div className="text-center">
                <h3 className="font-semibold">{t("delivery.fast5Days")}</h3>
                <p className="text-sm text-muted-foreground">{t("delivery.fastTimeDesc")}</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium text-sm">{t("delivery.features")}</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• {t("delivery.priorityQueue")}</li>
                <li>• {t("delivery.deadlines")}</li>
              </ul>
            </div>

            <Button
              variant={is5DaysSelected ? "default" : "upgrade"}
              className="w-full"
              onClick={(e) => {
                e.stopPropagation();
                handleToggle5Days();
              }}
            >
              {is5DaysSelected ? (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  {t("delivery.selected")}
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  {t("delivery.upgradeFor")} 5.90 €
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* 2 Days Ultra Express */}
        <Card 
          className={`transition-all duration-300 hover:shadow-lg cursor-pointer ${
            is2DaysSelected 
              ? 'bg-gradient-to-br from-primary/20 to-accent/20 border-primary shadow-lg' 
              : 'bg-gradient-to-br from-card to-muted hover:border-primary/50'
          }`}
          onClick={handleToggle2Days}
        >
          <CardHeader>
            <div className="flex items-center justify-center">
              <CardTitle className="flex items-center gap-1">
                <Rocket className="h-12 w-12 text-red-500" />
                {t("delivery.expressTitle")}
              </CardTitle>
            </div>
            <div className="flex justify-center">
              <Badge variant="outline" className="text-accent text-xl px-4 py-2">39.90 €</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-center">
              <div className="text-center">
                <h3 className="font-semibold">{t("delivery.express2Days")}</h3>
                <p className="text-sm text-muted-foreground">{t("delivery.expressTimeDesc")}</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium text-sm">{t("delivery.features")}</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• <strong>{t("delivery.absolutePriority")}</strong></li>
                <li>• {t("delivery.dedicatedWork")}</li>
                <li>• {t("delivery.emergencies")}</li>
              </ul>
            </div>

            <div className="p-3 bg-accent/10 rounded-lg">
              <p className="text-xs text-accent font-medium">
                🚀 {t("delivery.extremeUrgency")}
              </p>
            </div>

            <Button
              variant={is2DaysSelected ? "default" : "upgrade"}
              className="w-full"
              onClick={(e) => {
                e.stopPropagation();
                handleToggle2Days();
              }}
            >
              {is2DaysSelected ? (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  {t("delivery.selected")}
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  {t("delivery.upgradeFor")} 39.90 €
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};