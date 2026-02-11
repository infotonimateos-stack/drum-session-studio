import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { ShoppingCart, CreditCard, Loader2, Landmark } from "lucide-react";
import { CartState } from "@/types/cart";
import { BillingData } from "@/components/BillingStep";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { BankTransferConfirmation } from "@/components/BankTransferConfirmation";

interface CheckoutSummaryProps {
  cartState: CartState;
  billingData: BillingData;
  onConfirmOrder: () => void;
  onBack: () => void;
}

export const CheckoutSummary = ({ cartState, billingData, onConfirmOrder, onBack }: CheckoutSummaryProps) => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  // Stripe hidden but kept for future reactivation
  const showStripe = false;
  const [paymentMethod, setPaymentMethod] = useState<'paypal' | 'transfer'>('paypal');
  const [acceptedPrivacyPolicy, setAcceptedPrivacyPolicy] = useState(false);
  const [transferOrderId, setTransferOrderId] = useState<string | null>(null);

  // Tax calculation from billing data
  const taxRate = billingData.taxResult.taxRate;
  const taxAmount = cartState.total * (taxRate / 100);
  const subtotalWithTax = cartState.total + taxAmount;

  // PayPal fee only when paying via PayPal
  const PAYPAL_FEE_PERCENTAGE = 0.05;
  const paypalFee = paymentMethod === 'paypal' ? subtotalWithTax * PAYPAL_FEE_PERCENTAGE : 0;
  const displayTotal = subtotalWithTax + paypalFee;

  const groupedItems = cartState.items.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, typeof cartState.items>);

  const buildOrderPayload = () => ({
    items: cartState.items,
    basePrice: cartState.basePrice,
    subtotal: cartState.total,
    taxRate,
    taxAmount,
    taxRule: billingData.taxResult.taxRule,
    taxLabel: billingData.taxResult.taxLabel,
    total: displayTotal,
    billingCountry: billingData.country,
    billingPostalCode: billingData.postalCode,
    clientType: billingData.clientType,
    vatNumber: billingData.vatNumber || null,
    viesValid: billingData.viesValid ?? null,
  });

  const handleStripePayment = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-payment', {
        body: { ...buildOrderPayload(), paymentMethod: 'stripe' },
      });
      if (error) { toast.error(t("checkout.stripeError")); setIsLoading(false); return; }
      if (data?.url) { window.open(data.url, '_blank'); }
      else { toast.error(t("checkout.sessionError")); }
    } catch { toast.error(t("checkout.connectionError")); }
    setIsLoading(false);
  };

  const handlePayPalPayment = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-paypal-order', {
        body: { ...buildOrderPayload(), paypalFee, paymentMethod: 'paypal' },
      });
      if (error) { toast.error(t("checkout.paypalError")); setIsLoading(false); return; }
      if (data?.url) { window.open(data.url, '_blank'); }
      else { toast.error(t("checkout.paypalOrderError")); }
    } catch { toast.error(t("checkout.connectionError")); }
    setIsLoading(false);
  };

  const handleBankTransfer = async () => {
    setIsLoading(true);
    try {
      const orderPayload = {
        ...buildOrderPayload(),
        paypalFee: 0,
        paymentMethod: 'transfer',
      };
      const { data, error } = await supabase.from('orders').insert({
        items: orderPayload.items as any,
        base_price: orderPayload.basePrice,
        subtotal: orderPayload.subtotal,
        tax_rate: orderPayload.taxRate,
        tax_amount: orderPayload.taxAmount,
        tax_rule: orderPayload.taxRule,
        total: displayTotal,
        country_code: orderPayload.billingCountry,
        postal_code: orderPayload.billingPostalCode,
        client_type: orderPayload.clientType,
        vat_number: orderPayload.vatNumber,
        vies_valid: orderPayload.viesValid,
        payment_method: 'transfer',
        payment_status: 'awaiting_transfer',
        paypal_fee: 0,
      }).select('id').single();

      if (error) {
        toast.error(t("checkout.connectionError"));
        setIsLoading(false);
        return;
      }
      setTransferOrderId(data.id);
    } catch {
      toast.error(t("checkout.connectionError"));
    }
    setIsLoading(false);
  };

  const handlePayment = () => {
    if (paymentMethod === 'transfer') {
      handleBankTransfer();
    } else {
      handlePayPalPayment();
    }
  };

  // Show bank transfer confirmation if order was created
  if (transferOrderId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-warm-cream/30 to-warm-peach/20 py-8">
        <div className="container mx-auto px-4">
          <BankTransferConfirmation
            orderId={transferOrderId}
            total={displayTotal}
            onBackHome={() => window.location.href = '/'}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          {t("checkout.title")}
        </h2>
        <p className="text-muted-foreground text-lg">{t("checkout.subtitle")}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Order Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Base Package */}
          <Card className="bg-gradient-to-br from-success/10 to-emerald-100/50 border-success/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-success">{t("checkout.basePackage")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <p>• {t("checkout.basePackageDesc1")}</p>
                <p>• {t("checkout.basePackageDesc2")}</p>
                <p>• {t("checkout.basePackageDesc3")}</p>
                <p>• {t("checkout.basePackageDesc4")}</p>
              </div>
              <div className="mt-4 flex justify-between items-center">
                <span className="font-semibold">{t("checkout.basePrice")}</span>
                <Badge variant="secondary" className="text-lg">{cartState.basePrice.toFixed(2)} €</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Selected Upgrades */}
          {Object.entries(groupedItems).map(([category, items]) => (
            <Card key={category} className="bg-gradient-to-br from-warm-peach/30 to-warm-apricot/30 border-warm-coral/40">
              <CardHeader><CardTitle className="text-primary">🎵 {category}</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between items-center py-2">
                      <div>
                        <span className="font-medium">{item.name}</span>
                        {item.description && <p className="text-sm text-muted-foreground">{item.description}</p>}
                      </div>
                      <Badge variant="outline" className="text-primary font-bold">{item.price.toFixed(2)} €</Badge>
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
                <p className="text-muted-foreground">{t("checkout.emptyCart")}</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Price Summary */}
        <div className="lg:col-span-1">
          <Card className="bg-gradient-to-br from-gradient-warm sticky top-8">
            <CardHeader><CardTitle className="text-center">{t("checkout.orderTotal")}</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>{t("checkout.basicPackage")}</span>
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

                {/* Subtotal */}
                <div className="flex justify-between text-sm font-medium">
                  <span>{t("billing.subtotal")}</span>
                  <span>{cartState.total.toFixed(2)} €</span>
                </div>

                {/* Tax */}
                <div className="flex justify-between text-sm">
                  <span>{billingData.taxResult.taxLabel}</span>
                  <span>{taxAmount > 0 ? `+${taxAmount.toFixed(2)} €` : '0.00 €'}</span>
                </div>

                {/* PayPal Fee - only when PayPal selected */}
                {paymentMethod === 'paypal' && (
                  <div className="flex justify-between text-sm text-amber-600 dark:text-amber-400">
                    <span>{t("checkout.paypalFee")}</span>
                    <span>+{paypalFee.toFixed(2)} €</span>
                  </div>
                )}

                {paymentMethod === 'transfer' && (
                  <div className="flex justify-between text-sm text-green-600 dark:text-green-400">
                    <span>{t("transfer.noFee")}</span>
                    <span>0.00 €</span>
                  </div>
                )}

                <Separator className="my-2" />
                <div className="flex justify-between text-lg font-bold">
                  <span>{t("checkout.total")}</span>
                  <span className="text-primary">{displayTotal.toFixed(2)} €</span>
                </div>
              </div>

              {/* Payment Method Selection */}
              <div className="space-y-3 pt-4">
                <p className="text-sm font-medium text-center text-muted-foreground">{t("checkout.paymentMethod")}</p>
                <div className="grid grid-cols-1 gap-2">
                  {/* PayPal Account Button */}
                  <Button type="button" onClick={() => setPaymentMethod('paypal')} disabled={isLoading}
                    className={`h-12 bg-[#FFC439] hover:bg-[#f0b830] text-[#003087] font-bold ${paymentMethod === 'paypal' ? 'ring-2 ring-[#FFC439]/50 ring-offset-2' : 'opacity-60'}`}>
                    <div className="flex items-center justify-center gap-2">
                      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944 3.72a.78.78 0 0 1 .771-.66h6.487c2.025 0 3.538.507 4.497 1.507.921.961 1.261 2.217 1.046 3.849l-.016.112-.012.084.052.028c.628.349 1.115.809 1.446 1.371.35.593.528 1.336.528 2.207 0 1.015-.207 1.913-.616 2.668-.386.71-.93 1.31-1.618 1.783a6.08 6.08 0 0 1-2.167.936c-.772.181-1.635.274-2.562.274H12.2a.967.967 0 0 0-.955.816l-.033.196-.585 3.716-.027.14a.966.966 0 0 1-.955.79H7.076z"/></svg>
                      <span className="text-sm font-bold">PayPal</span>
                    </div>
                  </Button>
                  {/* Card via PayPal Button */}
                  <Button type="button" onClick={() => setPaymentMethod('paypal')} disabled={isLoading}
                    className={`h-12 bg-[#2C2E2F] hover:bg-[#1a1c1d] text-white font-bold ${paymentMethod === 'paypal' ? 'ring-2 ring-[#2C2E2F]/50 ring-offset-2' : 'opacity-60'}`}>
                    <div className="flex items-center justify-center gap-2">
                      <CreditCard className="h-5 w-5" />
                      <span className="text-sm font-bold">{t("checkout.debitOrCredit")}</span>
                    </div>
                  </Button>
                  {/* Bank Transfer Button */}
                  <Button type="button" onClick={() => setPaymentMethod('transfer')} disabled={isLoading}
                    className={`h-12 border font-bold ${paymentMethod === 'transfer' ? 'ring-2 ring-primary/50 ring-offset-2 bg-primary/10 text-primary border-primary/30' : 'opacity-60 bg-muted/10 text-muted-foreground border-border'}`}
                    variant="outline">
                    <div className="flex items-center justify-center gap-2">
                      <Landmark className="h-5 w-5" />
                      <span className="text-sm font-bold">{t("transfer.bankTransfer")}</span>
                    </div>
                  </Button>
                </div>
                <p className="text-xs text-center text-muted-foreground">
                  {paymentMethod === 'paypal' ? t("checkout.paypalSecureInfo") : t("transfer.noFeeInfo")}
                </p>
              </div>

              {/* Privacy Policy Consent */}
              <div className="space-y-3 pt-4 border-t border-border/50">
                <div className="flex items-start space-x-3">
                  <Checkbox id="privacy-policy" checked={acceptedPrivacyPolicy} onCheckedChange={(checked) => setAcceptedPrivacyPolicy(checked === true)} className="mt-1" />
                  <label htmlFor="privacy-policy" className="text-sm text-muted-foreground leading-relaxed cursor-pointer">
                    {t("checkout.privacyConsent")}{" "}
                    <Link to="/politica-privacidad" target="_blank" className="text-primary hover:underline font-medium">{t("checkout.privacyPolicy")}</Link>{" "}
                    {t("checkout.of")}
                  </label>
                </div>
              </div>

              <div className="space-y-3 pt-4">
                <Button onClick={handlePayment} disabled={isLoading || !acceptedPrivacyPolicy}
                  className={`w-full h-14 font-bold ${paymentMethod === 'transfer' ? 'bg-primary hover:bg-primary/90 text-primary-foreground' : 'bg-[#0070ba] hover:bg-[#005ea6] text-white disabled:bg-[#0070ba]/50'}`}
                  size="lg">
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2"><Loader2 className="h-4 w-4 animate-spin flex-shrink-0" /><span>{t("checkout.processing")}</span></span>
                  ) : paymentMethod === 'transfer' ? (
                    <span className="flex items-center justify-center gap-2"><Landmark className="h-4 w-4" /> {t("transfer.confirmOrder")}</span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">{t("checkout.payNow")} {displayTotal.toFixed(2)} €</span>
                  )}
                </Button>
                {!acceptedPrivacyPolicy && <p className="text-xs text-center text-muted-foreground">{t("checkout.mustAcceptPrivacy")}</p>}
                <Button onClick={onBack} variant="outline" className="w-full" disabled={isLoading}>{t("checkout.backToConfig")}</Button>
              </div>

              <div className="text-xs text-center text-muted-foreground pt-4">{t("checkout.securePayment")}</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
