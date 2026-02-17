import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Clock, Headphones, Video, PlayCircle, Share2,
  Copy, Plane, Rocket, Smartphone, FileMusic, ShoppingCart, Film, Landmark, Users
} from "lucide-react";
import { CartItem } from "@/types/cart";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { LanguageSelector } from "@/components/LanguageSelector";
import { upgradeMicrophones } from "@/data/microphones";
import { ProductCard } from "@/components/ProductCard";
import { BillingStep, BillingData } from "@/components/BillingStep";
import { BankTransferConfirmation } from "@/components/BankTransferConfirmation";
import { PayPalPayment } from "@/components/PayPalPayment";
import { InvoiceForm, InvoiceData, isInvoiceDataValid, emptyInvoiceData } from "@/components/InvoiceForm";
import logo from "@/assets/logo.png";

type Phase = 'select' | 'billing';

const AmpliarPedido = () => {
  const { t } = useTranslation();
  const [items, setItems] = useState<CartItem[]>([]);
  const [phase, setPhase] = useState<Phase>('select');
  const showStripe = false; // Stripe hidden, kept for future reactivation
  const [paymentMethod, setPaymentMethod] = useState<'paypal' | 'transfer'>('paypal');
  const [acceptedPrivacyPolicy, setAcceptedPrivacyPolicy] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [billingData, setBillingData] = useState<BillingData | null>(null);
  const [transferOrderId, setTransferOrderId] = useState<string | null>(null);
  const [invoiceData, setInvoiceData] = useState<InvoiceData>(emptyInvoiceData);

  const subtotal = items.reduce((sum, i) => sum + i.price, 0);

  const hasItem = (id: string) => items.some(i => i.id === id);

  const toggleItem = (item: CartItem) => {
    if (hasItem(item.id)) {
      setItems(prev => prev.filter(i => i.id !== item.id));
    } else {
      setItems(prev => [...prev, item]);
    }
  };

  const toggleDelivery = (item: CartItem, otherId: string) => {
    if (hasItem(item.id)) {
      setItems(prev => prev.filter(i => i.id !== item.id));
    } else {
      setItems(prev => [...prev.filter(i => i.id !== otherId), item]);
    }
  };

  // --- CATALOG ---
  const micItems: CartItem[] = upgradeMicrophones.map(mic => ({
    id: mic.id,
    name: mic.name,
    price: mic.price,
    category: t("microphones.category"),
    description: `${t(mic.descriptionKey)} - ${t(mic.targetKey)}`
  }));

  const productionItems: CartItem[] = [
    { id: 'tiempo-adicional', name: t("production.additionalTime"), price: 2.99, category: t("config.steps.production"), description: t("production.additionalTimeDesc") },
    { id: 'work-mix', name: t("production.workMix"), price: 2.99, category: t("config.steps.production"), description: t("production.workMixDesc") },
  ];

  const videoItems: CartItem[] = [
    { id: 'social-greeting', name: t("video.socialGreeting"), price: 4.99, category: t("config.steps.video"), description: t("video.socialGreetingDesc") },
    { id: 'playing-video', name: t("video.playingVideo"), price: 29.90, category: t("config.steps.video"), description: t("video.playingVideoDesc") },
    { id: 'instagram-share', name: t("video.instagramShare"), price: 29.90, category: t("config.steps.video"), description: t("video.instagramShareDesc") },
  ];

  const takesItem: CartItem = { id: 'take-exact-copy', name: t("takes.exactCopyName"), price: 49.90, category: t("config.steps.takes"), description: t("takes.exactFeat1") };

  const deliveryExpress5: CartItem = { id: 'delivery-5days', name: t("delivery.express5Name"), price: 5.90, category: t("config.steps.delivery"), description: t("delivery.express5Desc") };
  const deliveryExpress2: CartItem = { id: 'delivery-2days', name: t("delivery.express2Name"), price: 39.90, category: t("config.steps.delivery"), description: t("delivery.express2Desc") };

  const extrasItems: CartItem[] = [
    { id: 'videocall-10min', name: t("extras.videocall10"), price: 5.99, category: t("config.steps.extras"), description: t("extras.videocall10Desc") },
    { id: 'partitura-proceso', name: t("extras.partitura"), price: 1.99, category: t("config.steps.extras"), description: t("extras.partituraDesc") },
    { id: 'presencial', name: t("extras.inPerson"), price: 150.00, category: t("config.steps.extras"), description: t("extras.inPersonDesc") },
  ];

  const iconMap: Record<string, React.ReactNode> = {
    'tiempo-adicional': <Clock className="h-10 w-10" />,
    'work-mix': <Headphones className="h-10 w-10" />,
    'social-greeting': <Video className="h-10 w-10" />,
    'playing-video': <PlayCircle className="h-10 w-10" />,
    'instagram-share': <Share2 className="h-10 w-10" />,
    'take-exact-copy': <Copy className="h-10 w-10" />,
    'videocall-10min': <Smartphone className="h-10 w-10" />,
    'partitura-proceso': <FileMusic className="h-10 w-10" />,
    'presencial': <Users className="h-10 w-10" />,
  };

  // --- TAX AMOUNTS (once billing is complete) ---
  const taxRate = billingData?.taxResult.taxRate ?? 0;
  const taxAmount = subtotal * (taxRate / 100);
  const subtotalWithTax = subtotal + taxAmount;
  // PayPal fee only when paying via PayPal
  const PAYPAL_FEE_PERCENTAGE = 0.05;
  const paypalFee = paymentMethod === 'paypal' ? subtotalWithTax * PAYPAL_FEE_PERCENTAGE : 0;
  const displayTotal = subtotalWithTax + paypalFee;

  // --- BILLING HANDLERS ---
  const handleBillingComplete = (data: BillingData) => {
    setBillingData(data);
  };

  const handleProceedToCheckout = () => {
    if (items.length === 0) {
      toast.error("Selecciona al menos un servicio");
      return;
    }
    setPhase('billing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToSelect = () => {
    setPhase('select');
    setBillingData(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // --- PAYMENT ---
  const buildOrderPayload = () => ({
    items,
    basePrice: 0,
    subtotal,
    taxRate,
    taxAmount,
    taxRule: billingData?.taxResult.taxRule || 'spain_peninsula',
    taxLabel: billingData?.taxResult.taxLabel || 'IVA 21%',
    total: displayTotal,
    billingCountry: billingData?.country || 'ES',
    billingPostalCode: billingData?.postalCode || '',
    clientType: billingData?.clientType || 'particular',
    vatNumber: billingData?.vatNumber || null,
    viesValid: billingData?.viesValid ?? null,
    invoiceData: invoiceData.isProfessionalInvoice ? invoiceData : { isProfessionalInvoice: false },
  });

  const handlePayPalPayment = async () => {
    if (items.length === 0 || !billingData) return;
    // Handled by PayPalPayment component now
  };

  const handleBankTransfer = async () => {
    if (items.length === 0 || !billingData) return;
    setIsLoading(true);
    try {
      // Generate invoice number
      const { data: invoiceNumber } = await supabase.rpc('get_next_invoice_number', { p_series: 'W' });

      const { data, error } = await supabase.from('orders').insert({
        items: items as any,
        base_price: 0,
        subtotal,
        tax_rate: taxRate,
        tax_amount: taxAmount,
        tax_rule: billingData.taxResult.taxRule,
        total: displayTotal,
        country_code: billingData.country,
        postal_code: billingData.postalCode,
        client_type: billingData.clientType,
        vat_number: invoiceData.isProfessionalInvoice ? invoiceData.vatNumber : (billingData.vatNumber || null),
        vies_valid: billingData.viesValid ?? null,
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-background flex flex-col">
      {/* Header */}
      <header className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Logo" className="h-10 w-10 rounded-full" />
            <span className="font-bold text-lg">Add-on Services</span>
          </div>
          <LanguageSelector />
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8 space-y-16 max-w-7xl">
        {/* Hero */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            {t("config.heroTitle")} — Add-ons
          </h1>
          <p className="text-muted-foreground text-xl max-w-3xl mx-auto">
            Amplía tu sesión con servicios adicionales independientes.
          </p>
        </div>

        {phase === 'select' && (
          <>
            {/* MICROPHONES */}
            <section className="space-y-6">
              <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                🎤 {t("microphones.premiumUpgrades")}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {micItems.map(item => {
                  const mic = upgradeMicrophones.find(m => m.id === item.id);
                  return (
                    <ProductCard
                      key={item.id}
                      category={mic ? t(mic.targetKey) : t("microphones.category")}
                      price={item.price}
                      name={item.name}
                      description={mic ? t(mic.descriptionKey) : item.description}
                      image={mic?.image}
                      isSelected={hasItem(item.id)}
                      onToggle={() => toggleItem(item)}
                      addLabel={t("video.addFor")}
                      addedLabel={t("microphones.added")}
                    />
                  );
                })}
              </div>
            </section>

            {/* PRODUCTION */}
            <section className="space-y-6">
              <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent flex items-center justify-center gap-3">
                <Headphones className="h-8 w-8 text-primary" /> {t("production.title")}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                {productionItems.map(item => (
                  <ProductCard
                    key={item.id}
                    category={item.category}
                    price={item.price}
                    name={item.name}
                    description={item.description}
                    icon={iconMap[item.id]}
                    isSelected={hasItem(item.id)}
                    onToggle={() => toggleItem(item)}
                    addLabel={t("video.addFor")}
                    addedLabel={t("production.added")}
                  />
                ))}
              </div>
            </section>

            {/* VIDEO */}
            <section className="space-y-6">
              <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent flex items-center justify-center gap-3">
                <Film className="h-8 w-8 text-primary" /> {t("video.title")}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {videoItems.map(item => (
                  <ProductCard
                    key={item.id}
                    category={item.category}
                    price={item.price}
                    name={item.name}
                    description={item.description}
                    icon={iconMap[item.id]}
                    isSelected={hasItem(item.id)}
                    onToggle={() => toggleItem(item)}
                    addLabel={t("video.addFor")}
                    addedLabel={t("video.added")}
                  />
                ))}
              </div>
            </section>

            {/* TAKES */}
            <section className="space-y-6">
              <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                {t("takes.title")}
              </h2>
              <div className="max-w-lg mx-auto">
                <ProductCard
                  category={takesItem.category}
                  price={takesItem.price}
                  name={takesItem.name}
                  description={takesItem.description}
                  icon={iconMap[takesItem.id]}
                  isSelected={hasItem(takesItem.id)}
                  onToggle={() => toggleItem(takesItem)}
                  addLabel={t("video.addFor")}
                  addedLabel={t("takes.added")}
                />
              </div>
            </section>

            {/* DELIVERY */}
            <section className="space-y-6">
              <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                {t("delivery.title")}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                <ProductCard
                  category={t("config.steps.delivery")}
                  price={deliveryExpress5.price}
                  name={t("delivery.fastTitle")}
                  description={`${t("delivery.fast5Days")} · ${t("delivery.fastTimeDesc")}`}
                  icon={<Plane className="h-10 w-10" />}
                  isSelected={hasItem(deliveryExpress5.id)}
                  onToggle={() => toggleDelivery(deliveryExpress5, deliveryExpress2.id)}
                  addLabel={t("video.addFor")}
                  addedLabel={t("delivery.selected")}
                />
                <ProductCard
                  category={t("config.steps.delivery")}
                  price={deliveryExpress2.price}
                  name={t("delivery.expressTitle")}
                  description={`${t("delivery.express2Days")} · ${t("delivery.expressTimeDesc")}`}
                  icon={<Rocket className="h-10 w-10" />}
                  isSelected={hasItem(deliveryExpress2.id)}
                  onToggle={() => toggleDelivery(deliveryExpress2, deliveryExpress5.id)}
                  addLabel={t("video.addFor")}
                  addedLabel={t("delivery.selected")}
                />
              </div>
            </section>

            {/* EXTRAS */}
            <section className="space-y-6">
              <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                {t("extras.title")}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                <ProductCard
                  category={extrasItems[0].category}
                  price={extrasItems[0].price}
                  name={extrasItems[0].name}
                  description={extrasItems[0].description}
                  icon={iconMap[extrasItems[0].id]}
                  isSelected={hasItem(extrasItems[0].id)}
                  onToggle={() => toggleItem(extrasItems[0])}
                  addLabel={t("video.addFor")}
                  addedLabel={t("extras.added")}
                />
                <ProductCard
                  category={extrasItems[1].category}
                  price={extrasItems[1].price}
                  name={extrasItems[1].name}
                  descriptionList={[
                    { emoji: '📄', text: t("extras.partituraDesc1") },
                    { emoji: '✍️', text: t("extras.partituraDesc2") },
                    { emoji: '🎵', text: t("extras.partituraDesc3") },
                  ]}
                  icon={iconMap[extrasItems[1].id]}
                  isSelected={hasItem(extrasItems[1].id)}
                  onToggle={() => toggleItem(extrasItems[1])}
                  addLabel={t("video.addFor")}
                  addedLabel={t("extras.added")}
                />
                <ProductCard
                  category={extrasItems[2].category}
                  price={extrasItems[2].price}
                  name={extrasItems[2].name}
                  description={extrasItems[2].description}
                  icon={iconMap[extrasItems[2].id]}
                  isSelected={hasItem(extrasItems[2].id)}
                  onToggle={() => toggleItem(extrasItems[2])}
                  addLabel={t("video.addFor")}
                  addedLabel={t("extras.added")}
                />
              </div>
            </section>

            {/* FLOATING CART SUMMARY — bottom of select phase */}
            <section className="max-w-xl mx-auto">
              <Card className="bg-gradient-to-br from-gradient-warm sticky top-24">
                <CardHeader>
                  <CardTitle className="text-center flex items-center justify-center gap-2">
                    <ShoppingCart className="h-5 w-5" /> {t("checkout.orderTotal")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {items.length === 0 ? (
                    <p className="text-center text-muted-foreground py-4">Selecciona al menos un servicio</p>
                  ) : (
                    <div className="space-y-2">
                      {items.map(item => (
                        <div key={item.id} className="flex justify-between text-sm">
                          <span>{item.name}</span>
                          <span>{item.price.toFixed(2)} €</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <Separator />

                  <div className="flex justify-between text-lg font-bold">
                    <span>{t("billing.subtotal")}</span>
                    <span className="text-primary">{subtotal.toFixed(2)} €</span>
                  </div>

                  <p className="text-xs text-center text-muted-foreground">
                    {t("billing.taxCalcNext")}
                  </p>

                  <Button
                    onClick={handleProceedToCheckout}
                    disabled={items.length === 0}
                    className="w-full h-14 text-base font-bold bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
                    size="lg"
                  >
                    {t("billing.continue")} →
                  </Button>
                </CardContent>
              </Card>
            </section>
          </>
        )}

        {phase === 'billing' && (
          <>
            {/* Billing form + tax breakdown */}
            <BillingStep
              onComplete={handleBillingComplete}
              onBack={handleBackToSelect}
              subtotal={subtotal}
              paypalFeePercent={PAYPAL_FEE_PERCENTAGE}
              paymentMethod={paymentMethod}
            />

            {/* Show bank transfer confirmation or payment section */}
            {transferOrderId ? (
              <BankTransferConfirmation
                orderId={transferOrderId}
                total={displayTotal}
                onBackHome={() => window.location.href = '/'}
              />
            ) : billingData && (
              <section className="max-w-xl mx-auto">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-center flex items-center justify-center gap-2">
                      <ShoppingCart className="h-5 w-5" /> {t("checkout.orderTotal")}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Items */}
                    <div className="space-y-2">
                      {items.map(item => (
                        <div key={item.id} className="flex justify-between text-sm">
                          <span>{item.name}</span>
                          <span>{item.price.toFixed(2)} €</span>
                        </div>
                      ))}
                    </div>

                    <Separator />

                    <div className="flex justify-between text-sm font-medium">
                      <span>{t("billing.subtotal")}</span>
                      <span>{subtotal.toFixed(2)} €</span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span>{billingData.taxResult.taxLabel}</span>
                      <span>{taxAmount > 0 ? `+${taxAmount.toFixed(2)} €` : '0.00 €'}</span>
                    </div>

                    {paymentMethod === 'paypal' && (
                      <div className="flex justify-between text-sm text-amber-600 dark:text-amber-400">
                        <span>{t("checkout.paypalFee")}</span>
                        <span>+{paypalFee.toFixed(2)} €</span>
                      </div>
                    )}

                    {paymentMethod === 'transfer' && (
                      <div className="flex justify-between text-sm text-success">
                        <span>{t("transfer.noFee")}</span>
                        <span>0.00 €</span>
                      </div>
                    )}

                    <Separator />

                    <div className="flex justify-between text-lg font-bold">
                      <span>{t("checkout.total")}</span>
                      <span className="text-primary">{displayTotal.toFixed(2)} €</span>
                    </div>

                    {/* Invoice Form */}
                    <InvoiceForm data={invoiceData} onChange={setInvoiceData} />

                    {/* Privacy consent */}
                    <div className="space-y-3 pt-4 border-t border-border">
                      <div className="flex items-start space-x-3">
                        <Checkbox id="privacy-addon" checked={acceptedPrivacyPolicy} onCheckedChange={(c) => setAcceptedPrivacyPolicy(c === true)} className="mt-1" />
                        <label htmlFor="privacy-addon" className="text-sm text-muted-foreground leading-relaxed cursor-pointer">
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
                      isDisabled={!acceptedPrivacyPolicy || items.length === 0 || !isInvoiceDataValid(invoiceData)}
                      paymentMethod={paymentMethod}
                      onPaymentMethodChange={setPaymentMethod}
                      onTransferPayment={handleBankTransfer}
                      isLoading={isLoading}
                      setIsLoading={setIsLoading}
                    />

                    <div className="text-xs text-center text-muted-foreground pt-4">{t("checkout.securePayment")}</div>
                  </CardContent>
                </Card>
              </section>
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t bg-card/50 mt-16">
        <div className="container mx-auto px-4 py-8 text-center space-y-3">
          <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
            <Link to="/aviso-legal" className="hover:text-primary transition-colors">{t("footer.legalNotice")}</Link>
            <span>·</span>
            <Link to="/politica-privacidad" className="hover:text-primary transition-colors">{t("footer.privacyPolicy")}</Link>
            <span>·</span>
            <Link to="/politica-cookies" className="hover:text-primary transition-colors">{t("footer.cookiesPolicy")}</Link>
          </div>
          <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} Groove Factory Studios SL</p>
        </div>
      </footer>
    </div>
  );
};

export default AmpliarPedido;
