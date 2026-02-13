import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Trash2, ShoppingCart } from "lucide-react";
import { CartState } from "@/types/cart";
import { useTranslation } from "react-i18next";

interface CartProps {
  cartState: CartState;
  removeItem: (itemId: string) => void;
  onCheckout?: () => void;
}

export const Cart = ({ cartState, removeItem, onCheckout }: CartProps) => {
  const { t } = useTranslation();

  return (
    <Card className="w-full h-full bg-gradient-to-br from-card to-muted border-border shadow-lg flex flex-col overflow-hidden">
      <CardHeader className="pb-4 flex-shrink-0">
        <CardTitle className="flex items-center gap-2 text-lg">
          <ShoppingCart className="h-5 w-5 text-primary" />
          {t("cart.orderSummary")}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto space-y-4">
        {/* Order Total */}
        <div className="flex justify-between items-center gap-3 p-3 bg-primary/10 rounded-lg">
          <div className="min-w-0">
            <p className="font-medium text-sm">{t("cart.orderTotal")}</p>
            <p className="text-xs text-muted-foreground">{t("cart.basePlusExtras")}</p>
          </div>
          <span className="font-bold text-primary text-xl whitespace-nowrap shrink-0">{cartState.total.toFixed(2)} €</span>
        </div>

        {/* Items List */}
        <>
          <Separator />
          <div className="space-y-2">
            {/* Base Package - Always shown first */}
            <div className="flex justify-between items-center gap-3 p-2 bg-success/10 rounded-md">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{t("cart.basicKit")}</p>
                <p className="text-xs text-muted-foreground">{t("cart.microphonesIncluded")}</p>
              </div>
              <div className="flex items-center shrink-0">
                <span className="text-sm font-medium whitespace-nowrap">{cartState.basePrice.toFixed(2)} €</span>
              </div>
            </div>
            
            {/* Additional Items */}
            {cartState.items.map((item) => (
              <div key={item.id} className="flex justify-between items-center gap-3 p-2 hover:bg-muted/50 rounded-md group">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{item.name}</p>
                  <p className="text-xs text-muted-foreground">{item.category}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-sm font-medium whitespace-nowrap">{item.price.toFixed(2)} €</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removeItem(item.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </>

        <Separator />
        
        {/* Total */}
        <div className="flex justify-between items-center gap-3 p-3 bg-accent/20 rounded-lg">
          <span className="font-bold text-lg">{t("cart.total")}</span>
          <span className="font-bold text-xl text-primary whitespace-nowrap shrink-0">{cartState.total.toFixed(2)} €</span>
        </div>

      </CardContent>
    </Card>
  );
};
