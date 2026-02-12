import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, CreditCard, Landmark } from "lucide-react";
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

type ActiveView = 'card' | 'paypal' | 'transfer';

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
  const [activeView, setActiveView] = useState<ActiveView>('card');
  const [sdkReady, setSdkReady] = useState(false);
  const [sdkLoading, setSdkLoading] = useState(true);
  const [cardFieldsReady, setCardFieldsReady] = useState(false);
  const cardContainerRef = useRef<HTMLDivElement>(null);
  const paypalButtonRef = useRef<HTMLDivElement>(null);
  const cardFieldsInstanceRef = useRef<any>(null);
  const sdkLoadedRef = useRef(false);
  const orderPayloadRef = useRef(orderPayload);
  const paypalButtonRenderedRef = useRef(false);

  // Sync activeView with parent paymentMethod for fee calc
  const handleViewChange = (view: ActiveView) => {
    setActiveView(view);
    onPaymentMethodChange(view === 'transfer' ? 'transfer' : 'paypal');
  };

  // Keep payload ref current
  useEffect(() => {
    orderPayloadRef.current = orderPayload;
  }, [orderPayload]);

  const createOrder = useCallback(async () => {
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
      if (error || !captureData?.success) {
        toast.error(t("checkout.paypalError"));
        return;
      }
      window.location.href = `/success?method=paypal&orderId=${data.orderID}`;
    } catch {
      toast.error(t("checkout.connectionError"));
    } finally {
      setIsLoading(false);
    }
  }, [t, setIsLoading]);

  // Load PayPal SDK
  useEffect(() => {
    if (sdkLoadedRef.current) return;
    sdkLoadedRef.current = true;

    const loadSdk = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('get-paypal-client-token');
        if (error || !data?.clientId) {
          console.error("Failed to get PayPal client token:", error);
          setSdkLoading(false);
          return;
        }

        const { clientId, clientToken } = data;

        const existingScript = document.querySelector('script[data-paypal-sdk]');
        if (existingScript) existingScript.remove();

        const script = document.createElement("script");
        script.setAttribute("data-paypal-sdk", "true");
        script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&components=buttons,card-fields&currency=EUR&intent=capture&locale=es_ES`;
        if (clientToken) script.setAttribute("data-client-token", clientToken);

        script.onload = () => { setSdkReady(true); setSdkLoading(false); };
        script.onerror = () => { console.error("Failed to load PayPal SDK"); setSdkLoading(false); };

        document.body.appendChild(script);
      } catch (err) {
        console.error("Error loading PayPal SDK:", err);
        setSdkLoading(false);
      }
    };

    loadSdk();
  }, []);

  // Render PayPal buttons when PayPal view is active
  useEffect(() => {
    if (!sdkReady || !window.paypal || !paypalButtonRef.current) return;
    if (paypalButtonRenderedRef.current) return;

    try {
      paypalButtonRenderedRef.current = true;
      window.paypal.Buttons({
        style: { layout: 'vertical', color: 'gold', shape: 'rect', label: 'paypal', height: 48 },
        createOrder: async () => createOrder(),
        onApprove: async (data: any) => onApprove(data),
        onError: (err: any) => { console.error("PayPal button error:", err); toast.error(t("checkout.paypalError")); },
      }).render(paypalButtonRef.current);
    } catch (err) {
      console.error("Error rendering PayPal buttons:", err);
    }
  }, [sdkReady, activeView, createOrder, onApprove, t]);

  // Render Card Fields
  useEffect(() => {
    if (!sdkReady || !window.paypal || !cardContainerRef.current) return;
    if (!window.paypal.CardFields) {
      console.log("CardFields not available");
      return;
    }
    if (cardFieldsInstanceRef.current) return;

    try {
      const cardFields = window.paypal.CardFields({
        createOrder: async () => createOrder(),
        onApprove: async (data: any) => onApprove(data),
        onError: (err: any) => { console.error("Card fields error:", err); toast.error(t("checkout.paypalError")); setIsLoading(false); },
        style: {
          input: { "font-size": "14px", "font-family": "'Plus Jakarta Sans', system-ui, sans-serif", color: "#1a1a1a", padding: "12px" },
          ".invalid": { color: "#dc2626" },
        },
      });

      if (cardFields.isEligible()) {
        const numberField = cardFields.NumberField();
        const expiryField = cardFields.ExpiryField();
        const cvvField = cardFields.CVVField();

        const container = cardContainerRef.current;
        const numDiv = document.createElement("div");
        numDiv.id = "card-number-field";
        numDiv.className = "paypal-card-field";

        const rowDiv = document.createElement("div");
        rowDiv.className = "flex gap-3";

        const expDiv = document.createElement("div");
        expDiv.id = "card-expiry-field";
        expDiv.className = "paypal-card-field flex-1";

        const cvvDiv = document.createElement("div");
        cvvDiv.id = "card-cvv-field";
        cvvDiv.className = "paypal-card-field flex-1";

        rowDiv.appendChild(expDiv);
        rowDiv.appendChild(cvvDiv);

        container.innerHTML = "";
        container.appendChild(numDiv);
        container.appendChild(rowDiv);

        numberField.render("#card-number-field");
        expiryField.render("#card-expiry-field");
        cvvField.render("#card-cvv-field");

        cardFieldsInstanceRef.current = cardFields;
        setCardFieldsReady(true);
      }
    } catch (err) {
      console.error("Error rendering card fields:", err);
    }
  }, [sdkReady, createOrder, onApprove, t, setIsLoading]);

  const handleCardSubmit = async () => {
    if (!cardFieldsInstanceRef.current) return;
    setIsLoading(true);
    try {
      await cardFieldsInstanceRef.current.submit();
    } catch (err) {
      console.error("Card submit error:", err);
      toast.error(t("checkout.paypalError"));
      setIsLoading(false);
    }
  };

  const handlePayPalRedirect = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-paypal-order', {
        body: { ...orderPayload, paypalFee, paymentMethod: 'paypal' },
      });
      if (error) { toast.error(t("checkout.paypalError")); setIsLoading(false); return; }
      if (data?.url) { window.location.href = data.url; }
      else { toast.error(t("checkout.paypalOrderError")); setIsLoading(false); }
    } catch { toast.error(t("checkout.connectionError")); setIsLoading(false); }
  };

  // PayPal logo SVG
  const PayPalLogo = () => (
    <svg className="h-5 w-auto" viewBox="0 0 101 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12.237 2.8H4.437C3.937 2.8 3.508 3.164 3.427 3.658L0.637 20.976C0.577 21.335 0.856 21.658 1.221 21.658H4.951C5.451 21.658 5.88 21.294 5.961 20.8L6.793 15.756C6.873 15.262 7.303 14.898 7.803 14.898H10.173C15.113 14.898 17.945 12.502 18.651 7.762C18.969 5.67 18.664 4.028 17.744 2.882C16.73 1.62 14.819 2.8 12.237 2.8Z" fill="#ffc439"/>
      <path d="M12.237 2.8H4.437C3.937 2.8 3.508 3.164 3.427 3.658L0.637 20.976C0.577 21.335 0.856 21.658 1.221 21.658H4.951C5.451 21.658 5.88 21.294 5.961 20.8L6.793 15.756C6.873 15.262 7.303 14.898 7.803 14.898H10.173C15.113 14.898 17.945 12.502 18.651 7.762C18.969 5.67 18.664 4.028 17.744 2.882C16.73 1.62 14.819 2.8 12.237 2.8Z" fill="#ffc439"/>
      <path d="M35.869 2.8H28.069C27.569 2.8 27.14 3.164 27.059 3.658L24.269 20.976C24.209 21.335 24.488 21.658 24.853 21.658H28.893C29.233 21.658 29.525 21.402 29.578 21.066L30.425 15.756C30.505 15.262 30.935 14.898 31.435 14.898H33.805C38.745 14.898 41.577 12.502 42.283 7.762C42.601 5.67 42.296 4.028 41.376 2.882C40.362 1.62 38.451 2.8 35.869 2.8Z" fill="#ffc439"/>
      <text x="50" y="22" fontFamily="Arial" fontWeight="bold" fontSize="18" fill="#ffc439">Pay</text>
      <text x="74" y="22" fontFamily="Arial" fontWeight="bold" fontSize="18" fill="#003087">Pal</text>
    </svg>
  );

  return (
    <div className="space-y-4">
      {/* Payment method selector – stacked vertically */}
      <div className="flex flex-col gap-3">
        {/* CARD BUTTON – Black/Charcoal */}
        <button
          type="button"
          onClick={() => handleViewChange('card')}
          className={`relative flex items-center gap-3 px-5 py-4 rounded-xl border-2 transition-all duration-200 font-semibold text-sm
            ${activeView === 'card'
              ? 'border-neutral-900 dark:border-neutral-100 bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 shadow-lg scale-[1.01]'
              : 'border-neutral-300 dark:border-neutral-600 bg-neutral-800 dark:bg-neutral-200 text-white dark:text-neutral-900 hover:border-neutral-500 hover:shadow-md hover:scale-[1.005]'
            }`}
        >
          <CreditCard className="h-5 w-5 shrink-0" />
          <span>{t("checkout.debitOrCredit")}</span>
          {activeView === 'card' && (
            <span className="ml-auto text-[10px] uppercase tracking-wider opacity-70">✓</span>
          )}
        </button>

        {/* PAYPAL BUTTON – PayPal Blue #003087 + Yellow text #ffc439 */}
        <button
          type="button"
          onClick={() => handleViewChange('paypal')}
          className={`relative flex items-center gap-3 px-5 py-4 rounded-xl border-2 transition-all duration-200 font-semibold text-sm
            ${activeView === 'paypal'
              ? 'border-[#003087] bg-[#003087] text-[#ffc439] shadow-lg scale-[1.01]'
              : 'border-[#003087]/40 bg-[#003087]/90 text-[#ffc439]/90 hover:border-[#003087] hover:bg-[#003087] hover:text-[#ffc439] hover:shadow-md hover:scale-[1.005]'
            }`}
        >
          <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="#ffc439">
            <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944 3.72a.78.78 0 0 1 .771-.66h6.487c2.025 0 3.538.507 4.497 1.507.921.961 1.261 2.217 1.046 3.849l-.016.112-.012.084.052.028c.628.349 1.115.809 1.446 1.371.35.593.528 1.336.528 2.207 0 1.015-.207 1.913-.616 2.668-.386.71-.93 1.31-1.618 1.783a6.08 6.08 0 0 1-2.167.936c-.772.181-1.635.274-2.562.274H12.2a.967.967 0 0 0-.955.816l-.033.196-.585 3.716-.027.14a.966.966 0 0 1-.955.79H7.076z"/>
          </svg>
          <span className="font-bold tracking-wide">PayPal</span>
          {activeView === 'paypal' && (
            <span className="ml-auto text-[10px] uppercase tracking-wider opacity-70">✓</span>
          )}
        </button>

        {/* TRANSFER BUTTON – Corporate Gold */}
        <button
          type="button"
          onClick={() => handleViewChange('transfer')}
          className={`relative flex items-center gap-3 px-5 py-4 rounded-xl border-2 transition-all duration-200 font-semibold text-sm
            ${activeView === 'transfer'
              ? 'border-[#d4a017] bg-gradient-to-r from-[#d4a017] to-[#e6b422] text-neutral-900 shadow-lg scale-[1.01]'
              : 'border-[#d4a017]/40 bg-gradient-to-r from-[#d4a017]/85 to-[#e6b422]/85 text-neutral-900/90 hover:border-[#d4a017] hover:from-[#d4a017] hover:to-[#e6b422] hover:text-neutral-900 hover:shadow-md hover:scale-[1.005]'
            }`}
        >
          <Landmark className="h-5 w-5 shrink-0" />
          <span>{t("transfer.bankTransfer")}</span>
          {activeView === 'transfer' && (
            <span className="ml-auto text-[10px] uppercase tracking-wider opacity-70">✓</span>
          )}
        </button>
      </div>

      {/* ── CARD VIEW ── */}
      {activeView === 'card' && (
        <div className="space-y-4">
          {sdkLoading && (
            <div className="flex items-center justify-center py-8 text-muted-foreground gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm">{t("checkout.processing")}...</span>
            </div>
          )}

          {sdkReady && (
            <>
              <div
                ref={cardContainerRef}
                className="space-y-3 [&_.paypal-card-field]:border [&_.paypal-card-field]:border-border [&_.paypal-card-field]:rounded-lg [&_.paypal-card-field]:overflow-hidden [&_.paypal-card-field]:bg-card [&_.paypal-card-field]:min-h-[48px]"
              />

              {cardFieldsReady && (
                <Button
                  onClick={handleCardSubmit}
                  disabled={isLoading || isDisabled}
                  className="w-full h-14 font-bold text-base bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-200 shadow-lg"
                  size="lg"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" />{t("checkout.processing")}</span>
                  ) : (
                    <span className="flex items-center gap-2"><CreditCard className="h-5 w-5" /> {t("checkout.payNow")} {displayTotal.toFixed(2)} €</span>
                  )}
                </Button>
              )}

              {!cardFieldsReady && !sdkLoading && (
                <Button
                  onClick={handlePayPalRedirect}
                  disabled={isLoading || isDisabled}
                  className="w-full h-14 font-bold text-base bg-neutral-900 text-white hover:bg-neutral-800 shadow-lg"
                  size="lg"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" />{t("checkout.processing")}</span>
                  ) : (
                    <span className="flex items-center gap-2"><CreditCard className="h-5 w-5" /> {t("checkout.payNow")} {displayTotal.toFixed(2)} €</span>
                  )}
                </Button>
              )}
            </>
          )}

          <p className="text-xs text-center text-muted-foreground">
            {t("checkout.paypalSecureInfo")}
          </p>
        </div>
      )}

      {/* ── PAYPAL VIEW ── */}
      {activeView === 'paypal' && (
        <div className="space-y-4">
          {sdkLoading && (
            <div className="flex items-center justify-center py-8 text-muted-foreground gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm">{t("checkout.processing")}...</span>
            </div>
          )}

          {sdkReady && (
            <>
              <div ref={paypalButtonRef} className="min-h-[48px]" />

              {!paypalButtonRenderedRef.current && !sdkLoading && (
                <Button
                  onClick={handlePayPalRedirect}
                  disabled={isLoading || isDisabled}
                  className="w-full h-14 font-bold text-base bg-[#003087] hover:bg-[#002570] text-[#ffc439] shadow-lg"
                  size="lg"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" />{t("checkout.processing")}</span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="#ffc439"><path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944 3.72a.78.78 0 0 1 .771-.66h6.487c2.025 0 3.538.507 4.497 1.507.921.961 1.261 2.217 1.046 3.849l-.016.112-.012.084.052.028c.628.349 1.115.809 1.446 1.371.35.593.528 1.336.528 2.207 0 1.015-.207 1.913-.616 2.668-.386.71-.93 1.31-1.618 1.783a6.08 6.08 0 0 1-2.167.936c-.772.181-1.635.274-2.562.274H12.2a.967.967 0 0 0-.955.816l-.033.196-.585 3.716-.027.14a.966.966 0 0 1-.955.79H7.076z"/></svg>
                      {t("checkout.payNow")} {displayTotal.toFixed(2)} €
                    </span>
                  )}
                </Button>
              )}
            </>
          )}

          <p className="text-xs text-center text-muted-foreground">
            {t("checkout.paypalSecureInfo")}
          </p>
        </div>
      )}

      {/* ── TRANSFER VIEW ── */}
      {activeView === 'transfer' && (
        <div className="space-y-3">
          <p className="text-xs text-center text-muted-foreground">{t("transfer.noFeeInfo")}</p>
          <Button
            onClick={onTransferPayment}
            disabled={isLoading || isDisabled}
            className="w-full h-14 font-bold text-base bg-gradient-to-r from-[#d4a017] to-[#e6b422] text-neutral-900 hover:from-[#c49215] hover:to-[#d4a017] shadow-lg"
            size="lg"
          >
            {isLoading ? (
              <span className="flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" />{t("checkout.processing")}</span>
            ) : (
              <span className="flex items-center gap-2"><Landmark className="h-5 w-5" /> {t("transfer.confirmOrder")}</span>
            )}
          </Button>
        </div>
      )}
    </div>
  );
};
