import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Check, Plus, Mic, Clock, Headphones, Video, PlayCircle, Share2,
  Copy, Plane, Rocket, Smartphone, FileMusic, CreditCard, Loader2, ShoppingCart, Film, Package
} from "lucide-react";
import { CartItem } from "@/types/cart";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { LanguageSelector } from "@/components/LanguageSelector";
import { upgradeMicrophones } from "@/data/microphones";
import logo from "@/assets/logo.png";

const AmpliarPedido = () => {
  const { t } = useTranslation();
  const [items, setItems] = useState<CartItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal'>('card');
  const [acceptedPrivacyPolicy, setAcceptedPrivacyPolicy] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const total = items.reduce((sum, i) => sum + i.price, 0);
  const PAYPAL_FEE_PERCENTAGE = 0.05;
  const paypalFee = total * PAYPAL_FEE_PERCENTAGE;
  const displayTotal = paymentMethod === 'paypal' ? total + paypalFee : total;

  const hasItem = (id: string) => items.some(i => i.id === id);

  const toggleItem = (item: CartItem) => {
    if (hasItem(item.id)) {
      setItems(prev => prev.filter(i => i.id !== item.id));
    } else {
      setItems(prev => [...prev, item]);
    }
  };

  // Mutually exclusive delivery
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
  ];

  // --- PAYMENT ---
  const handlePayment = async () => {
    if (items.length === 0) { toast.error("Selecciona al menos un servicio"); return; }
    setIsLoading(true);
    try {
      const fnName = paymentMethod === 'card' ? 'create-payment' : 'create-paypal-order';
      const body = paymentMethod === 'card'
        ? { items, basePrice: 0, total }
        : { items, basePrice: 0, total, paypalFee, totalWithFee: total + paypalFee };
      const { data, error } = await supabase.functions.invoke(fnName, { body });
      if (error) { toast.error(t("checkout.connectionError")); setIsLoading(false); return; }
      if (data?.url) { window.open(data.url, '_blank'); }
      else { toast.error(t("checkout.sessionError")); }
    } catch { toast.error(t("checkout.connectionError")); }
    setIsLoading(false);
  };

  // --- RENDER HELPERS ---
  const ServiceCard = ({ item, icon }: { item: CartItem; icon: React.ReactNode }) => {
    const selected = hasItem(item.id);
    return (
      <Card
        className={`transition-all duration-300 hover:shadow-xl cursor-pointer transform hover:scale-105 ${
          selected
            ? 'bg-gradient-to-br from-primary/20 to-accent/20 border-primary shadow-xl scale-105'
            : 'bg-gradient-to-br from-card to-muted hover:border-primary/50'
        }`}
        onClick={() => toggleItem(item)}
      >
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between mb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              {icon}
              {item.name}
            </CardTitle>
            <Badge variant="outline" className="text-primary font-bold text-xl px-4 py-2 whitespace-nowrap">
              {item.price.toFixed(2)} €
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {item.id === 'partitura-proceso' ? (
            <ul className="text-muted-foreground text-sm space-y-1.5 list-none">
              <li>📄 {t("extras.partituraDesc1")}</li>
              <li>✍️ {t("extras.partituraDesc2")}</li>
              <li>🎵 {t("extras.partituraDesc3")}</li>
            </ul>
          ) : (
            <p className="text-muted-foreground text-sm">{item.description}</p>
          )}
          <Button variant={selected ? "default" : "outline"} size="sm" className="w-full" onClick={(e) => { e.stopPropagation(); toggleItem(item); }}>
            {selected ? <><Check className="h-4 w-4 mr-2" />{t("extras.added")}</> : <><Plus className="h-4 w-4 mr-2" />{t("extras.add")}</>}
          </Button>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-background flex flex-col">
      {/* Simple header */}
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

        {/* MICROPHONES */}
        <section className="space-y-6 bg-gradient-to-br from-warm-cream/20 to-warm-peach/10 rounded-xl p-8">
          <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            🎤 {t("microphones.premiumUpgrades")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {micItems.map(item => {
              const mic = upgradeMicrophones.find(m => m.id === item.id);
              const selected = hasItem(item.id);
              return (
                <Card key={item.id}
                  className={`transition-all duration-300 hover:shadow-xl cursor-pointer transform hover:scale-105 ${
                    selected ? 'bg-gradient-to-br from-primary/20 to-accent/20 border-primary shadow-xl scale-105' : 'bg-gradient-to-br from-card to-muted hover:border-primary/50'
                  }`}
                  onClick={() => toggleItem(item)}
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between mb-4">
                      <Badge variant="outline" className="text-sm px-3 py-1">{mic ? t(mic.targetKey) : ''}</Badge>
                      <span className="font-bold text-xl text-primary">{item.price.toFixed(2)} €</span>
                    </div>
                    {mic?.image && (
                      <div className="w-full h-40 flex items-center justify-center bg-white rounded-lg">
                        <img src={mic.image} alt={item.name} className="max-h-36 max-w-full object-contain rounded-lg p-2" />
                      </div>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <h4 className="font-bold text-lg text-center">{item.name}</h4>
                    <p className="text-muted-foreground text-center leading-relaxed">{t(mic?.descriptionKey || '')}</p>
                    <Button variant={selected ? "default" : "outline"} size="lg" className="w-full h-12 text-base font-bold" onClick={e => { e.stopPropagation(); toggleItem(item); }}>
                      {selected ? <><Check className="h-5 w-5 mr-2" />{t("microphones.added")}</> : <><Plus className="h-5 w-5 mr-2" />{t("microphones.add")} {item.price.toFixed(2)} €</>}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* PRODUCTION */}
        <section className="space-y-6 bg-gradient-to-br from-warm-peach/15 to-warm-coral/20 rounded-xl p-8">
          <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent flex items-center justify-center gap-3">
            <Headphones className="h-8 w-8 text-primary" /> {t("production.title")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <ServiceCard item={productionItems[0]} icon={<Clock className="h-5 w-5" />} />
            <ServiceCard item={productionItems[1]} icon={<Headphones className="h-5 w-5" />} />
          </div>
        </section>

        {/* VIDEO */}
        <section className="space-y-6 bg-gradient-to-br from-warm-peach/20 to-warm-apricot/30 rounded-xl p-8">
          <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent flex items-center justify-center gap-3">
            <Film className="h-8 w-8 text-primary" /> {t("video.title")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <ServiceCard item={videoItems[0]} icon={<Video className="h-5 w-5" />} />
            <ServiceCard item={videoItems[1]} icon={<PlayCircle className="h-5 w-5" />} />
            <ServiceCard item={videoItems[2]} icon={<Share2 className="h-5 w-5" />} />
          </div>
        </section>

        {/* TAKES - Exact Copy only */}
        <section className="space-y-6 bg-gradient-to-br from-warm-cream/30 to-warm-blush/20 rounded-xl p-8">
          <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            {t("takes.title")}
          </h2>
          <div className="max-w-lg mx-auto">
            <ServiceCard item={takesItem} icon={<Copy className="h-5 w-5" />} />
          </div>
        </section>

        {/* DELIVERY */}
        <section className="space-y-6 bg-gradient-to-br from-warm-blush/20 to-warm-apricot/15 rounded-xl p-8">
          <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            {t("delivery.title")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* 5 days */}
            <Card className={`transition-all duration-300 hover:shadow-lg cursor-pointer ${hasItem(deliveryExpress5.id) ? 'bg-gradient-to-br from-primary/20 to-accent/20 border-primary shadow-lg' : 'bg-gradient-to-br from-card to-muted hover:border-primary/50'}`}
              onClick={() => toggleDelivery(deliveryExpress5, deliveryExpress2.id)}>
              <CardHeader>
                <div className="flex items-center justify-center"><CardTitle className="flex items-center gap-1"><Plane className="h-10 w-10 text-orange-500" /> {t("delivery.fastTitle")}</CardTitle></div>
                <div className="flex justify-center"><Badge variant="outline" className="text-primary text-xl px-4 py-2">5.90 €</Badge></div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-center font-semibold">{t("delivery.fast5Days")}</p>
                <p className="text-sm text-muted-foreground text-center">{t("delivery.fastTimeDesc")}</p>
                <Button variant={hasItem(deliveryExpress5.id) ? "default" : "outline"} className="w-full" onClick={e => { e.stopPropagation(); toggleDelivery(deliveryExpress5, deliveryExpress2.id); }}>
                  {hasItem(deliveryExpress5.id) ? <><Check className="h-4 w-4 mr-2" />{t("delivery.selected")}</> : <><Plus className="h-4 w-4 mr-2" />{t("delivery.upgradeFor")} 5.90 €</>}
                </Button>
              </CardContent>
            </Card>
            {/* 2 days */}
            <Card className={`transition-all duration-300 hover:shadow-lg cursor-pointer ${hasItem(deliveryExpress2.id) ? 'bg-gradient-to-br from-primary/20 to-accent/20 border-primary shadow-lg' : 'bg-gradient-to-br from-card to-muted hover:border-primary/50'}`}
              onClick={() => toggleDelivery(deliveryExpress2, deliveryExpress5.id)}>
              <CardHeader>
                <div className="flex items-center justify-center"><CardTitle className="flex items-center gap-1"><Rocket className="h-10 w-10 text-red-500" /> {t("delivery.expressTitle")}</CardTitle></div>
                <div className="flex justify-center"><Badge variant="outline" className="text-accent text-xl px-4 py-2">39.90 €</Badge></div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-center font-semibold">{t("delivery.express2Days")}</p>
                <p className="text-sm text-muted-foreground text-center">{t("delivery.expressTimeDesc")}</p>
                <div className="p-3 bg-accent/10 rounded-lg"><p className="text-xs text-accent font-medium">🚀 {t("delivery.extremeUrgency")}</p></div>
                <Button variant={hasItem(deliveryExpress2.id) ? "default" : "outline"} className="w-full" onClick={e => { e.stopPropagation(); toggleDelivery(deliveryExpress2, deliveryExpress5.id); }}>
                  {hasItem(deliveryExpress2.id) ? <><Check className="h-4 w-4 mr-2" />{t("delivery.selected")}</> : <><Plus className="h-4 w-4 mr-2" />{t("delivery.upgradeFor")} 39.90 €</>}
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* EXTRAS */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            {t("extras.title")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <ServiceCard item={extrasItems[0]} icon={<Smartphone className="h-5 w-5" />} />
            <ServiceCard item={extrasItems[1]} icon={<FileMusic className="h-5 w-5" />} />
          </div>
        </section>

        {/* CHECKOUT SUMMARY */}
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

              {paymentMethod === 'paypal' && total > 0 && (
                <div className="flex justify-between text-sm text-amber-600 dark:text-amber-400">
                  <span>{t("checkout.paypalFee")}</span>
                  <span>+{paypalFee.toFixed(2)} €</span>
                </div>
              )}

              <div className="flex justify-between text-lg font-bold">
                <span>{t("checkout.total")}</span>
                <span className="text-primary">{displayTotal.toFixed(2)} €</span>
              </div>

              {/* Payment method */}
              <div className="space-y-3 pt-4">
                <p className="text-sm font-medium text-center text-muted-foreground">{t("checkout.paymentMethod")}</p>
                <div className="grid grid-cols-2 gap-2">
                  <Button type="button" variant={paymentMethod === 'card' ? 'default' : 'outline'} onClick={() => setPaymentMethod('card')} disabled={isLoading} className={`h-14 ${paymentMethod === 'card' ? 'ring-2 ring-primary ring-offset-2' : ''}`}>
                    <div className="flex flex-col items-center gap-1"><CreditCard className="h-5 w-5" /><span className="text-xs">{t("checkout.card")}</span></div>
                  </Button>
                  <Button type="button" variant={paymentMethod === 'paypal' ? 'default' : 'outline'} onClick={() => setPaymentMethod('paypal')} disabled={isLoading} className={`h-14 ${paymentMethod === 'paypal' ? 'ring-2 ring-primary ring-offset-2' : ''}`}>
                    <div className="flex flex-col items-center gap-1">
                      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944 3.72a.78.78 0 0 1 .771-.66h6.487c2.025 0 3.538.507 4.497 1.507.921.961 1.261 2.217 1.046 3.849l-.016.112-.012.084.052.028c.628.349 1.115.809 1.446 1.371.35.593.528 1.336.528 2.207 0 1.015-.207 1.913-.616 2.668-.386.71-.93 1.31-1.618 1.783a6.08 6.08 0 0 1-2.167.936c-.772.181-1.635.274-2.562.274H12.2a.967.967 0 0 0-.955.816l-.033.196-.585 3.716-.027.14a.966.966 0 0 1-.955.79H7.076z"/></svg>
                      <span className="text-xs">{t("checkout.paypal")}</span>
                    </div>
                  </Button>
                </div>
                <p className="text-xs text-center text-amber-600 dark:text-amber-400">{t("checkout.paypalDisclaimer")}</p>
              </div>

              {/* Privacy consent */}
              <div className="space-y-3 pt-4 border-t border-border/50">
                <div className="flex items-start space-x-3">
                  <Checkbox id="privacy-addon" checked={acceptedPrivacyPolicy} onCheckedChange={(c) => setAcceptedPrivacyPolicy(c === true)} className="mt-1" />
                  <label htmlFor="privacy-addon" className="text-sm text-muted-foreground leading-relaxed cursor-pointer">
                    {t("checkout.privacyConsent")}{" "}
                    <Link to="/politica-privacidad" target="_blank" className="text-primary hover:underline font-medium">{t("checkout.privacyPolicy")}</Link>{" "}
                    {t("checkout.of")}
                  </label>
                </div>
              </div>

              <Button onClick={handlePayment} disabled={isLoading || !acceptedPrivacyPolicy || items.length === 0}
                className={`w-full h-14 text-sm sm:text-base ${paymentMethod === 'paypal' ? 'bg-[#0070ba] hover:bg-[#005ea6] text-white disabled:bg-[#0070ba]/50' : 'bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90'}`}
                size="lg">
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2"><Loader2 className="h-4 w-4 animate-spin" />{t("checkout.processing")}</span>
                ) : paymentMethod === 'paypal' ? (
                  <span className="flex items-center justify-center gap-2">PayPal {displayTotal.toFixed(2)} €</span>
                ) : (
                  <span className="flex items-center justify-center gap-2"><CreditCard className="h-4 w-4" />{t("checkout.card")} {displayTotal.toFixed(2)} €</span>
                )}
              </Button>
              {!acceptedPrivacyPolicy && <p className="text-xs text-center text-muted-foreground">{t("checkout.mustAcceptPrivacy")}</p>}
              <div className="text-xs text-center text-muted-foreground pt-4">{t("checkout.securePayment")}</div>
            </CardContent>
          </Card>
        </section>
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
