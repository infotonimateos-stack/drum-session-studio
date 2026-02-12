import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, CreditCard, Landmark } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Copy, Mail, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

interface PayPalPaymentProps {
  orderPayload: Record<string, any>;
  displayTotal: number;
  paypalFee: number;
  isDisabled?: boolean;
  paymentMethod: 'paypal' | 'transfer';
  onPaymentMethodChange: (method: 'paypal' | 'transfer') => void;
  onTransferPayment: () => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

declare global {
  interface Window {
    paypal?: any;
  }
}

type ExpandedMethod = 'card' | 'paypal' | null;

export const PayPalPayment = ({
  orderPayload,
  displayTotal,
  paypalFee,
  isDisabled = false,
  paymentMethod,
  onPaymentMethodChange,
  onTransferPayment,
  isLoading,
  setIsLoading,
}: PayPalPaymentProps) => {
  const { t } = useTranslation();
  const [sdkReady, setSdkReady] = useState(false);
  const [sdkLoading, setSdkLoading] = useState(true);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [expanded, setExpanded] = useState<ExpandedMethod>(null);
  const [cardRendered, setCardRendered] = useState(false);
  const [paypalRendered, setPaypalRendered] = useState(false);
  const sdkLoadedRef = useRef(false);
  const cardContainerRef = useRef<HTMLDivElement>(null);
  const paypalContainerRef = useRef<HTMLDivElement>(null);
  const orderPayloadRef = useRef(orderPayload);

  useEffect(() => { orderPayloadRef.current = orderPayload; }, [orderPayload]);

  const createOrderFn = useCallback(async () => {
    const { data, error } = await supabase.functions.invoke('create-paypal-order', {
      body: { ...orderPayloadRef.current, paypalFee, paymentMethod: 'paypal', sdkMode: true },
    });
    if (error || !data?.orderId) throw new Error("Failed to create order");
    return data.orderId;
  }, [paypalFee]);

  const onApprove = useCallback(async (data: any) => {
    setIsLoading(true);
    try {
      const { data: captureData, error } = await supabase.functions.invoke('capture-paypal-order', {
        body: { orderId: data.orderID },
      });
      if (error || !captureData?.success) { toast.error(t("checkout.paypalError")); return; }
      window.location.href = `/success?method=paypal&orderId=${data.orderID}`;
    } catch { toast.error(t("checkout.connectionError")); }
    finally { setIsLoading(false); }
  }, [t, setIsLoading]);

  // Load SDK
  useEffect(() => {
    if (sdkLoadedRef.current) return;
    sdkLoadedRef.current = true;
    (async () => {
      try {
        const { data, error } = await supabase.functions.invoke('get-paypal-client-token');
        if (error || !data?.clientId) { setSdkLoading(false); return; }
        const { clientId, clientToken } = data;
        const old = document.querySelector('script[data-paypal-sdk]');
        if (old) old.remove();
        const script = document.createElement("script");
        script.setAttribute("data-paypal-sdk", "true");
        script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&components=buttons&currency=EUR&intent=capture&locale=es_ES&enable-funding=card&disable-funding=credit,paylater`;
        if (clientToken) script.setAttribute("data-client-token", clientToken);
        script.onload = () => { setSdkReady(true); setSdkLoading(false); };
        script.onerror = () => { setSdkLoading(false); };
        document.body.appendChild(script);
      } catch { setSdkLoading(false); }
    })();
  }, []);

  // Render CARD SDK button when expanded
  useEffect(() => {
    if (expanded !== 'card' || !sdkReady || !window.paypal || !cardContainerRef.current || cardRendered) return;
    try {
      const btn = window.paypal.Buttons({
        fundingSource: window.paypal.FUNDING.CARD,
        style: { label: 'pay', height: 55, color: 'black', shape: 'rect' },
        createOrder: createOrderFn,
        onApprove,
        onError: (err: any) => { console.error("Card error:", err); toast.error(t("checkout.paypalError")); },
      });
      if (btn.isEligible()) {
        cardContainerRef.current.innerHTML = '';
        btn.render(cardContainerRef.current);
        setCardRendered(true);
      } else {
        // Fallback: use redirect
        toast.info(t("checkout.redirecting") || "Redirigiendo...");
        handleRedirectFallback();
      }
    } catch (err) { console.error("Card render error:", err); }
  }, [expanded, sdkReady, cardRendered, createOrderFn, onApprove, t]);

  // Render PAYPAL SDK button when expanded
  useEffect(() => {
    if (expanded !== 'paypal' || !sdkReady || !window.paypal || !paypalContainerRef.current || paypalRendered) return;
    try {
      const btn = window.paypal.Buttons({
        fundingSource: window.paypal.FUNDING.PAYPAL,
        style: { label: 'paypal', height: 55, color: 'gold', shape: 'rect' },
        createOrder: createOrderFn,
        onApprove,
        onError: (err: any) => { console.error("PayPal error:", err); toast.error(t("checkout.paypalError")); },
      });
      if (btn.isEligible()) {
        paypalContainerRef.current.innerHTML = '';
        btn.render(paypalContainerRef.current);
        setPaypalRendered(true);
      }
    } catch (err) { console.error("PayPal render error:", err); }
  }, [expanded, sdkReady, paypalRendered, createOrderFn, onApprove, t]);

  const handleRedirectFallback = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-paypal-order', {
        body: { ...orderPayloadRef.current, paypalFee, paymentMethod: 'paypal' },
      });
      if (error) { toast.error(t("checkout.paypalError")); setIsLoading(false); return; }
      if (data?.url) { window.location.href = data.url; }
      else { toast.error(t("checkout.paypalOrderError")); setIsLoading(false); }
    } catch { toast.error(t("checkout.connectionError")); setIsLoading(false); }
  };

  const handleCardClick = () => {
    if (isDisabled || isLoading) return;
    onPaymentMethodChange('paypal');
    if (!sdkReady) { handleRedirectFallback(); return; }
    setExpanded(expanded === 'card' ? null : 'card');
  };

  const handlePayPalClick = () => {
    if (isDisabled || isLoading) return;
    onPaymentMethodChange('paypal');
    if (!sdkReady) { handleRedirectFallback(); return; }
    setExpanded(expanded === 'paypal' ? null : 'paypal');
  };

  const handleTransferClick = () => {
    if (isDisabled) return;
    onPaymentMethodChange('transfer');
    setShowTransferModal(true);
  };

  const iban = "ES84 2100 0125 7602 0068 6553";
  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} ${t("transfer.copied")}`);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3">
        {/* TARJETA – Black */}
        <div>
          <button
            type="button"
            onClick={handleCardClick}
            disabled={isLoading || isDisabled}
            className={`w-full flex items-center gap-3 px-5 py-4 rounded-xl border-2 font-semibold text-sm transition-all duration-200 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed
              ${expanded === 'card'
                ? 'border-neutral-500 bg-neutral-900 text-white shadow-lg'
                : 'border-neutral-700 bg-neutral-900 text-white hover:bg-neutral-800 hover:border-neutral-500 hover:shadow-lg hover:scale-[1.01]'
              }`}
          >
            <CreditCard className="h-5 w-5 shrink-0" />
            <span className="flex-1 text-left">{t("checkout.debitOrCredit")}</span>
            <div className="flex gap-1 shrink-0">
              <svg className="h-6 w-auto" viewBox="0 0 48 32" fill="none">
                <rect width="48" height="32" rx="4" fill="#1A1F71"/>
                <text x="8" y="22" fontFamily="Arial" fontWeight="bold" fontSize="14" fill="white">VISA</text>
              </svg>
              <svg className="h-6 w-auto" viewBox="0 0 48 32" fill="none">
                <rect width="48" height="32" rx="4" fill="#252525"/>
                <circle cx="18" cy="16" r="9" fill="#EB001B"/>
                <circle cx="30" cy="16" r="9" fill="#F79E1B"/>
                <path d="M24 9.34A9 9 0 0 1 27 16a9 9 0 0 1-3 6.66A9 9 0 0 1 21 16a9 9 0 0 1 3-6.66z" fill="#FF5F00"/>
              </svg>
            </div>
          </button>
          {/* SDK Card button – visible when expanded */}
          {expanded === 'card' && (
            <div className="mt-2 px-1">
              {!cardRendered && sdkLoading && (
                <div className="flex items-center justify-center py-4 gap-2 text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm">{t("checkout.processing")}...</span>
                </div>
              )}
              <div ref={cardContainerRef} className="min-h-[55px]" />
              <p className="text-xs text-center text-muted-foreground mt-2">{t("checkout.paypalSecureInfo")}</p>
            </div>
          )}
        </div>

        {/* PAYPAL – Blue */}
        <div>
          <button
            type="button"
            onClick={handlePayPalClick}
            disabled={isLoading || isDisabled}
            className={`w-full flex items-center gap-3 px-5 py-4 rounded-xl border-2 font-semibold text-sm transition-all duration-200 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed
              ${expanded === 'paypal'
                ? 'border-[#002570] bg-[#003087] text-[#ffc439] shadow-lg'
                : 'border-[#003087] bg-[#003087] text-[#ffc439] hover:bg-[#002570] hover:border-[#002570] hover:shadow-lg hover:scale-[1.01]'
              }`}
          >
            <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="#ffc439">
              <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944 3.72a.78.78 0 0 1 .771-.66h6.487c2.025 0 3.538.507 4.497 1.507.921.961 1.261 2.217 1.046 3.849l-.016.112-.012.084.052.028c.628.349 1.115.809 1.446 1.371.35.593.528 1.336.528 2.207 0 1.015-.207 1.913-.616 2.668-.386.71-.93 1.31-1.618 1.783a6.08 6.08 0 0 1-2.167.936c-.772.181-1.635.274-2.562.274H12.2a.967.967 0 0 0-.955.816l-.033.196-.585 3.716-.027.14a.966.966 0 0 1-.955.79H7.076z"/>
            </svg>
            <span className="flex-1 text-left font-bold tracking-wide">PayPal</span>
          </button>
          {/* SDK PayPal button – visible when expanded */}
          {expanded === 'paypal' && (
            <div className="mt-2 px-1">
              {!paypalRendered && sdkLoading && (
                <div className="flex items-center justify-center py-4 gap-2 text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm">{t("checkout.processing")}...</span>
                </div>
              )}
              <div ref={paypalContainerRef} className="min-h-[55px]" />
              <p className="text-xs text-center text-muted-foreground mt-2">{t("checkout.paypalSecureInfo")}</p>
            </div>
          )}
        </div>

        {/* TRANSFERENCIA – Corporate Gold (sin cambios) */}
        <button
          type="button"
          onClick={handleTransferClick}
          disabled={isLoading || isDisabled}
          className="w-full flex items-center gap-3 px-5 py-4 rounded-xl border-2 border-[#d4a017] bg-gradient-to-r from-[#d4a017] to-[#e6b422] text-neutral-900 font-semibold text-sm transition-all duration-200 hover:from-[#c49215] hover:to-[#d4a017] hover:shadow-lg hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Landmark className="h-5 w-5 shrink-0" />
          <span className="flex-1 text-left">{t("transfer.bankTransfer")}</span>
          <span className="text-xs opacity-70">{t("transfer.noFee")}</span>
        </button>
      </div>

      {sdkLoading && (
        <div className="flex items-center justify-center py-2 text-muted-foreground gap-2">
          <Loader2 className="h-3 w-3 animate-spin" />
          <span className="text-xs">{t("checkout.processing")}...</span>
        </div>
      )}

      {/* Transfer Modal */}
      <Dialog open={showTransferModal} onOpenChange={setShowTransferModal}>
        <DialogContent className="max-w-lg" style={{ background: "hsl(var(--card-dark, var(--card)))" }}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Landmark className="h-5 w-5" />
              {t("transfer.bankDetails")}
            </DialogTitle>
            <DialogDescription>{t("transfer.subtitle")}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">{t("transfer.beneficiary")}</p>
              <p className="font-semibold text-lg">Groove Factory Studios SL</p>
            </div>
            <Separator />
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">IBAN</p>
              <div className="flex items-center gap-3">
                <p className="font-mono text-lg tracking-wider">{iban}</p>
                <Button variant="ghost" size="sm" onClick={() => copyToClipboard(iban.replace(/\s/g, ''), 'IBAN')}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <Separator />
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">{t("transfer.amount")}</p>
              <p className="font-bold text-2xl text-primary">{displayTotal.toFixed(2)} €</p>
            </div>
            <Separator />
            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 text-primary mt-1 shrink-0" />
              <p className="text-sm leading-relaxed">
                {t("transfer.sendProof")}{" "}
                <a href="mailto:info@tonimateos.com" className="text-primary font-semibold hover:underline">info@tonimateos.com</a>
              </p>
            </div>
            <Button
              onClick={() => { setShowTransferModal(false); onTransferPayment(); }}
              disabled={isLoading}
              className="w-full h-14 font-bold text-base bg-gradient-to-r from-[#d4a017] to-[#e6b422] text-neutral-900 hover:from-[#c49215] hover:to-[#d4a017] shadow-lg"
              size="lg"
            >
              {isLoading ? (
                <span className="flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" />{t("checkout.processing")}</span>
              ) : (
                <span className="flex items-center gap-2"><CheckCircle className="h-5 w-5" /> {t("transfer.confirmOrder")}</span>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
