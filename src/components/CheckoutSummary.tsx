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
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal'>('card');

  const groupedItems = cartState.items.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, typeof cartState.items>);

  const handleStripePayment = async () => {
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
        console.error('Stripe payment error:', error);
        toast.error('Error al procesar el pago con tarjeta. Por favor, inténtalo de nuevo.');
        return;
      }

      if (data?.url) {
        window.location.href = data.url;
      } else {
        toast.error('No se pudo crear la sesión de pago.');
      }
    } catch (err) {
      console.error('Stripe payment error:', err);
      toast.error('Error al conectar con el servidor de pagos.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePayPalPayment = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-paypal-order', {
        body: {
          items: cartState.items,
          basePrice: cartState.basePrice,
          total: cartState.total,
        },
      });

      if (error) {
        console.error('PayPal payment error:', error);
        toast.error('Error al procesar el pago con PayPal. Por favor, inténtalo de nuevo.');
        return;
      }

      if (data?.url) {
        window.location.href = data.url;
      } else {
        toast.error('No se pudo crear la orden de PayPal.');
      }
    } catch (err) {
      console.error('PayPal payment error:', err);
      toast.error('Error al conectar con PayPal.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePayment = () => {
    if (paymentMethod === 'card') {
      handleStripePayment();
    } else {
      handlePayPalPayment();
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

              {/* Payment Method Selection */}
              <div className="space-y-3 pt-2">
                <p className="text-sm font-medium text-center text-muted-foreground">Método de pago</p>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    type="button"
                    variant={paymentMethod === 'card' ? 'default' : 'outline'}
                    onClick={() => setPaymentMethod('card')}
                    disabled={isLoading}
                    className={`h-14 ${paymentMethod === 'card' ? 'ring-2 ring-primary ring-offset-2' : ''}`}
                  >
                    <div className="flex flex-col items-center gap-1">
                      <CreditCard className="h-5 w-5" />
                      <span className="text-xs">Tarjeta</span>
                    </div>
                  </Button>
                  <Button
                    type="button"
                    variant={paymentMethod === 'paypal' ? 'default' : 'outline'}
                    onClick={() => setPaymentMethod('paypal')}
                    disabled={isLoading}
                    className={`h-14 ${paymentMethod === 'paypal' ? 'ring-2 ring-primary ring-offset-2' : ''}`}
                  >
                    <div className="flex flex-col items-center gap-1">
                      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944 3.72a.78.78 0 0 1 .771-.66h6.487c2.025 0 3.538.507 4.497 1.507.921.961 1.261 2.217 1.046 3.849l-.016.112-.012.084.052.028c.628.349 1.115.809 1.446 1.371.35.593.528 1.336.528 2.207 0 1.015-.207 1.913-.616 2.668-.386.71-.93 1.31-1.618 1.783a6.08 6.08 0 0 1-2.167.936c-.772.181-1.635.274-2.562.274H12.2a.967.967 0 0 0-.955.816l-.033.196-.585 3.716-.027.14a.966.966 0 0 1-.955.79H7.076z"/>
                        <path d="M18.79 7.586c.035-.214.052-.434.052-.66 0-2.188-1.423-3.866-4.596-3.866H7.215a.967.967 0 0 0-.955.816l-2.8 17.762a.784.784 0 0 0 .774.91h4.283l1.075-6.82.033-.196a.967.967 0 0 1 .955-.816h1.481c3.255 0 5.802-1.322 6.545-5.148.022-.113.041-.223.058-.332.213-1.358.077-2.284-.532-2.946a3.21 3.21 0 0 0-.342-.304z"/>
                      </svg>
                      <span className="text-xs">PayPal</span>
                    </div>
                  </Button>
                </div>
              </div>

              <div className="space-y-3 pt-4">
                <Button 
                  onClick={handlePayment}
                  disabled={isLoading}
                  className={`w-full h-14 text-sm sm:text-base ${
                    paymentMethod === 'paypal' 
                      ? 'bg-[#0070ba] hover:bg-[#005ea6] text-white' 
                      : 'bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90'
                  }`}
                  size="lg"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin flex-shrink-0" />
                      <span>Procesando...</span>
                    </span>
                  ) : paymentMethod === 'paypal' ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="h-4 w-4 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944 3.72a.78.78 0 0 1 .771-.66h6.487c2.025 0 3.538.507 4.497 1.507.921.961 1.261 2.217 1.046 3.849l-.016.112-.012.084.052.028c.628.349 1.115.809 1.446 1.371.35.593.528 1.336.528 2.207 0 1.015-.207 1.913-.616 2.668-.386.71-.93 1.31-1.618 1.783a6.08 6.08 0 0 1-2.167.936c-.772.181-1.635.274-2.562.274H12.2a.967.967 0 0 0-.955.816l-.033.196-.585 3.716-.027.14a.966.966 0 0 1-.955.79H7.076z"/>
                      </svg>
                      <span className="truncate">PayPal {cartState.total.toFixed(2)} €</span>
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <CreditCard className="h-4 w-4 flex-shrink-0" />
                      <span className="truncate">Tarjeta {cartState.total.toFixed(2)} €</span>
                    </span>
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