import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { ShoppingCart } from "lucide-react";
import { CartState } from "@/types/cart";
import { BillingData } from "@/components/BillingStep";
import { InvoiceForm, InvoiceData, isInvoiceDataValid, emptyInvoiceData } from "@/components/InvoiceForm";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { BankTransferConfirmation } from "@/components/BankTransferConfirmation";
import { PayPalPayment } from "@/components/PayPalPayment";

interface CheckoutSummaryProps {
  cartState: CartState;
  billingData: BillingData;
  onConfirmOrder: () => void;
  onBack: () => void;
}

export const CheckoutSummary = ({ cartState, billingData, onConfirmOrder, onBack }: CheckoutSummaryProps) => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'paypal' | 'transfer'>('paypal');
  const [acceptedPrivacyPolicy, setAcceptedPrivacyPolicy] = useState(false);
  const [transferOrderId, setTransferOrderId] = useState<string | null>(null);
  const [invoiceData, setInvoiceData] = useState<InvoiceData>(emptyInvoiceData);

  const taxRate = billingData.taxResult.taxRate;
  const taxAmount = cartState.total * (taxRate / 100);
  const subtotalWithTax = cartState.total + taxAmount;

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
    invoiceData: invoiceData.isProfessionalInvoice ? invoiceData : { isProfessionalInvoice: false },
  });

  const handleBankTransfer = async () => {
    setIsLoading(true);
    try {
      const orderPayload = buildOrderPayload();
      
      // Generate invoice number
      const { data: invoiceNumber } = await supabase.rpc('get_next_invoice_number', { p_series: 'W' });
      
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
        vat_number: invoiceData.isProfessionalInvoice ? invoiceData.vatNumber : (orderPayload.vatNumber || null),
        vies_valid: orderPayload.viesValid,
        payment_method: 'transfer',
        payment_status: 'awaiting_transfer',
        paypal_fee: 0,
        is_professional_invoice: invoiceData.isProfessionalInvoice,
        business_name: invoiceData.isProfessionalInvoice ? invoiceData.businessName : null,
        full_address: invoiceData.isProfessionalInvoice ? invoiceData.fullAddress : null,
        city: invoiceData.isProfessionalInvoice ? invoiceData.city : null,
        state_province: invoiceData.isProfessionalInvoice ? invoiceData.stateProvince : null,
        billing_email: invoiceData.isProfessionalInvoice ? invoiceData.billingEmail : null,
        billing_phone: invoiceData.isProfessionalInvoice ? invoiceData.billingPhone : null,
        invoice_number: invoiceNumber || null,
        invoice_series: 'W',
      }).select('id').single();

      if (error) { toast.error(t("checkout.connectionError")); setIsLoading(false); return; }
      setTransferOrderId(data.id);
    } catch { toast.error(t("checkout.connectionError")); }
    setIsLoading(false);
  };

  if (transferOrderId) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4">
          <BankTransferConfirmation orderId={transferOrderId} total={displayTotal} onBackHome={() => window.location.href = '/'} />
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
          <Card className="border-success/30 bg-success/5">
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

          {Object.entries(groupedItems).map(([category, items]) => (
            <Card key={category}>
              <CardHeader><CardTitle className="text-primary">🎵 {category}</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between items-start gap-4 py-2">
                      <div className="min-w-0 flex-1">
                        <span className="font-medium">{item.name}</span>
                        {item.description && <p className="text-sm text-muted-foreground">{item.description}</p>}
                      </div>
                      <Badge variant="outline" className="text-primary font-bold whitespace-nowrap shrink-0">{item.price.toFixed(2)} €</Badge>
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

        {/* Price Summary + Payment */}
        <div className="lg:col-span-1">
          <Card className="sticky top-8 min-w-[320px]">
            <CardHeader className="p-6 pb-4"><CardTitle className="text-center">{t("checkout.orderTotal")}</CardTitle></CardHeader>
            <CardContent className="space-y-4 p-6 pt-0">
              <div className="space-y-3">
                <div className="flex justify-between items-baseline gap-4">
                  <span className="shrink-0">{t("checkout.basicPackage")}</span>
                  <span className="whitespace-nowrap">{cartState.basePrice.toFixed(2)} €</span>
                </div>
                {cartState.items.length > 0 && (
                  <>
                    <Separator />
                    {cartState.items.map((item) => (
                      <div key={item.id} className="flex justify-between items-baseline gap-4 text-sm">
                        <span className="min-w-0">{item.name}:</span>
                        <span className="whitespace-nowrap">{item.price.toFixed(2)} €</span>
                      </div>
                    ))}
                  </>
                )}

                <Separator className="my-4" />

                <div className="flex justify-between items-baseline gap-4 text-sm font-medium">
                  <span>{t("billing.subtotal")}</span>
                  <span className="whitespace-nowrap">{cartState.total.toFixed(2)} €</span>
                </div>

                <div className="flex justify-between items-baseline gap-4 text-sm">
                  <span>{billingData.taxResult.taxLabel}</span>
                  <span className="whitespace-nowrap">{taxAmount > 0 ? `+${taxAmount.toFixed(2)} €` : '0.00 €'}</span>
                </div>

                {paymentMethod === 'paypal' && (
                  <div className="flex justify-between items-baseline gap-4 text-sm text-amber-600 dark:text-amber-400">
                    <span>{t("checkout.paypalFee")}</span>
                    <span className="whitespace-nowrap">+{paypalFee.toFixed(2)} €</span>
                  </div>
                )}

                {paymentMethod === 'transfer' && (
                  <div className="flex justify-between items-baseline gap-4 text-sm text-success">
                    <span>{t("transfer.noFee")}</span>
                    <span className="whitespace-nowrap">0.00 €</span>
                  </div>
                )}

                <Separator className="my-2" />
                <div className="flex justify-between items-baseline gap-4 text-lg font-bold">
                  <span>{t("checkout.total")}</span>
                  <span className="text-primary whitespace-nowrap">{displayTotal.toFixed(2)} €</span>
                </div>
              </div>

              {/* Invoice Form */}
              <InvoiceForm data={invoiceData} onChange={setInvoiceData} />

              {/* Privacy Policy */}
              <div className="space-y-3 pt-4 border-t border-border">
                <div className="flex items-start space-x-3">
                  <Checkbox id="privacy-policy" checked={acceptedPrivacyPolicy} onCheckedChange={(checked) => setAcceptedPrivacyPolicy(checked === true)} className="mt-1" />
                  <label htmlFor="privacy-policy" className="text-sm text-muted-foreground leading-relaxed cursor-pointer">
                    {t("checkout.privacyConsent")}{" "}
                    <Link to="/politica-privacidad" target="_blank" className="text-primary hover:underline font-medium">{t("checkout.privacyPolicy")}</Link>{" "}
                    {t("checkout.of")}
                  </label>
                </div>
                {!acceptedPrivacyPolicy && <p className="text-xs text-center text-muted-foreground">{t("checkout.mustAcceptPrivacy")}</p>}
              </div>

              {/* Payment */}
              <PayPalPayment
                orderPayload={buildOrderPayload()}
                displayTotal={displayTotal}
                paypalFee={paypalFee}
                isDisabled={!acceptedPrivacyPolicy || !isInvoiceDataValid(invoiceData)}
                paymentMethod={paymentMethod}
                onPaymentMethodChange={setPaymentMethod}
                onTransferPayment={handleBankTransfer}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
              />

              <Button onClick={onBack} variant="outline" className="w-full" disabled={isLoading}>{t("checkout.backToConfig")}</Button>

              <div className="text-xs text-center text-muted-foreground pt-4">{t("checkout.securePayment")}</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
