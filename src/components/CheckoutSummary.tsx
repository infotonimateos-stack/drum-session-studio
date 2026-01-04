import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart, CreditCard, Loader2 } from "lucide-react";
import { CartState } from "@/types/cart";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface CheckoutSummaryProps {
  cartState: CartState;
  onConfirmOrder: () => void;
  onBack: () => void;
}

export const CheckoutSummary = ({ cartState, onConfirmOrder, onBack }: CheckoutSummaryProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const groupedItems = cartState.items.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, typeof cartState.items>);

  const handlePayment = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-payment', {
        body: {
          items: cartState.items,
          basePrice: cartState.basePrice,
          total: cartState.total,
        },
      });

      if (error) {
        console.error('Payment error:', error);
        toast.error('Error al procesar el pago. Por favor, inténtalo de nuevo.');
        return;
      }

      if (data?.url) {
        // Redirect to Stripe Checkout
        window.location.href = data.url;
      } else {
        toast.error('No se pudo crear la sesión de pago.');
      }
    } catch (err) {
      console.error('Payment error:', err);
      toast.error('Error al conectar con el servidor de pagos.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          🛒 Resumen del Pedido
        </h2>
        <p className="text-muted-foreground text-lg">
          Revisa tu configuración antes de finalizar la compra
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Order Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Base Package */}
          <Card className="bg-gradient-to-br from-success/10 to-emerald-100/50 border-success/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-success">
                ✅ Paquete Básico Incluido
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <p>• Grabación profesional de batería</p>
                <p>• Configuración básica de micrófonos</p>
                <p>• Entrega estándar (10 días)</p>
                <p>• 1 Toma básica incluida</p>
              </div>
              <div className="mt-4 flex justify-between items-center">
                <span className="font-semibold">Precio base:</span>
                <Badge variant="secondary" className="text-lg">{cartState.basePrice.toFixed(2)} €</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Selected Upgrades */}
          {Object.entries(groupedItems).map(([category, items]) => (
            <Card key={category} className="bg-gradient-to-br from-warm-peach/30 to-warm-apricot/30 border-warm-coral/40">
              <CardHeader>
                <CardTitle className="text-primary">
                  🎵 {category}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between items-center py-2">
                      <div>
                        <span className="font-medium">{item.name}</span>
                        {item.description && (
                          <p className="text-sm text-muted-foreground">{item.description}</p>
                        )}
                      </div>
                      <Badge variant="outline" className="text-primary font-bold">
                        {item.price.toFixed(2)} €
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}

          {cartState.items.length === 0 && (
            <Card className="bg-muted/20 border-dashed">
              <CardContent className="py-12 text-center">
                <ShoppingCart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  Solo el paquete básico seleccionado
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Price Summary */}
        <div className="lg:col-span-1">
          <Card className="bg-gradient-to-br from-gradient-warm sticky top-8">
            <CardHeader>
              <CardTitle className="text-center">💰 Total del Pedido</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Paquete básico:</span>
                  <span>{cartState.basePrice.toFixed(2)} €</span>
                </div>
                
                {cartState.items.length > 0 && (
                  <>
                    <Separator />
                    {cartState.items.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span>{item.name}:</span>
                        <span>{item.price.toFixed(2)} €</span>
                      </div>
                    ))}
                  </>
                )}
                
                <Separator className="my-4" />
                
                <div className="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span className="text-primary">{cartState.total.toFixed(2)} €</span>
                </div>
              </div>

              <div className="space-y-3 pt-4">
                <Button 
                  onClick={handlePayment}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-lg py-6"
                  size="lg"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      Procesando...
                    </>
                  ) : (
                    <>
                      <CreditCard className="h-5 w-5 mr-2" />
                      Pagar {cartState.total.toFixed(2)} €
                    </>
                  )}
                </Button>
                
                <Button 
                  onClick={onBack}
                  variant="outline"
                  className="w-full"
                  disabled={isLoading}
                >
                  ← Volver a Configurar
                </Button>
              </div>

              <div className="text-xs text-center text-muted-foreground pt-4">
                🔒 Pago seguro · Satisfacción garantizada
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};