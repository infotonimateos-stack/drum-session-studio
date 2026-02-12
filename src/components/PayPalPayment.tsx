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
  const [cardFieldsReady, setCardFieldsReady] = useState(false);
  const cardContainerRef = useRef<HTMLDivElement>(null);
  const paypalButtonRef = useRef<HTMLDivElement>(null);
  const cardFieldsInstanceRef = useRef<any>(null);
  const sdkLoadedRef = useRef(false);
  const orderPayloadRef = useRef(orderPayload);

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
      // Redirect to success
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
        // Get client token from edge function
        const { data, error } = await supabase.functions.invoke('get-paypal-client-token');
        if (error || !data?.clientId) {
          console.error("Failed to get PayPal client token:", error);
          setSdkLoading(false);
          return;
        }

        const { clientId, clientToken } = data;

        // Check if script already loaded
        const existingScript = document.querySelector('script[data-paypal-sdk]');
        if (existingScript) {
          existingScript.remove();
        }

        const script = document.createElement("script");
        script.setAttribute("data-paypal-sdk", "true");
        script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&components=buttons,card-fields&currency=EUR&intent=capture&locale=es_ES`;
        if (clientToken) {
          script.setAttribute("data-client-token", clientToken);
        }

        script.onload = () => {
          setSdkReady(true);
          setSdkLoading(false);
        };
        script.onerror = () => {
          console.error("Failed to load PayPal SDK");
          setSdkLoading(false);
        };

        document.body.appendChild(script);
      } catch (err) {
        console.error("Error loading PayPal SDK:", err);
        setSdkLoading(false);
      }
    };

    loadSdk();
  }, []);

  // Render PayPal buttons
  useEffect(() => {
    if (!sdkReady || !window.paypal || !paypalButtonRef.current) return;
    if (paypalButtonRef.current.childNodes.length > 0) return;

    try {
      window.paypal.Buttons({
        style: {
          layout: 'horizontal',
          color: 'gold',
          shape: 'rect',
          label: 'paypal',
          height: 48,
        },
        createOrder: async () => createOrder(),
        onApprove: async (data: any) => onApprove(data),
        onError: (err: any) => {
          console.error("PayPal button error:", err);
          toast.error(t("checkout.paypalError"));
        },
      }).render(paypalButtonRef.current);
    } catch (err) {
      console.error("Error rendering PayPal buttons:", err);
    }
  }, [sdkReady, createOrder, onApprove, t]);

  // Render Card Fields
  useEffect(() => {
    if (!sdkReady || !window.paypal || !cardContainerRef.current) return;
    if (!window.paypal.CardFields) {
      console.log("CardFields not available - account may not support Advanced Card Fields");
      return;
    }
    if (cardFieldsInstanceRef.current) return;

    try {
      const cardFields = window.paypal.CardFields({
        createOrder: async () => createOrder(),
        onApprove: async (data: any) => onApprove(data),
        onError: (err: any) => {
          console.error("Card fields error:", err);
          toast.error(t("checkout.paypalError"));
          setIsLoading(false);
        },
        style: {
          input: {
            "font-size": "14px",
            "font-family": "'Plus Jakarta Sans', system-ui, sans-serif",
            color: "#1a1a1a",
            padding: "12px",
          },
          ".invalid": {
            color: "#dc2626",
          },
        },
      });

      if (cardFields.isEligible()) {
        const numberField = cardFields.NumberField();
        const expiryField = cardFields.ExpiryField();
        const cvvField = cardFields.CVVField();

        const container = cardContainerRef.current;
        
        // Create field containers
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
      } else {
        console.log("Card fields not eligible for this merchant");
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

  // Fallback to redirect mode if SDK fails
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

  return (
    <div className="space-y-4">
      {/* Payment method tabs */}
      <div className="grid grid-cols-3 gap-2">
        <button
          type="button"
          onClick={() => onPaymentMethodChange('paypal')}
          className={`flex flex-col items-center gap-1.5 p-3 rounded-lg border-2 transition-all text-sm font-medium ${
            paymentMethod === 'paypal'
              ? 'border-primary bg-primary/5 text-foreground'
              : 'border-border text-muted-foreground hover:border-border hover:bg-muted/30'
          }`}
        >
          <CreditCard className="h-5 w-5" />
          <span>{t("checkout.debitOrCredit")}</span>
        </button>
        <button
          type="button"
          onClick={() => onPaymentMethodChange('paypal')}
          className={`flex flex-col items-center gap-1.5 p-3 rounded-lg border-2 transition-all text-sm font-medium ${
            paymentMethod === 'paypal'
              ? 'border-primary bg-primary/5 text-foreground'
              : 'border-border text-muted-foreground hover:border-border hover:bg-muted/30'
          }`}
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944 3.72a.78.78 0 0 1 .771-.66h6.487c2.025 0 3.538.507 4.497 1.507.921.961 1.261 2.217 1.046 3.849l-.016.112-.012.084.052.028c.628.349 1.115.809 1.446 1.371.35.593.528 1.336.528 2.207 0 1.015-.207 1.913-.616 2.668-.386.71-.93 1.31-1.618 1.783a6.08 6.08 0 0 1-2.167.936c-.772.181-1.635.274-2.562.274H12.2a.967.967 0 0 0-.955.816l-.033.196-.585 3.716-.027.14a.966.966 0 0 1-.955.79H7.076z"/></svg>
          <span>PayPal</span>
        </button>
        <button
          type="button"
          onClick={() => onPaymentMethodChange('transfer')}
          className={`flex flex-col items-center gap-1.5 p-3 rounded-lg border-2 transition-all text-sm font-medium ${
            paymentMethod === 'transfer'
              ? 'border-primary bg-primary/5 text-foreground'
              : 'border-border text-muted-foreground hover:border-border hover:bg-muted/30'
          }`}
        >
          <Landmark className="h-5 w-5" />
          <span>{t("transfer.bankTransfer")}</span>
        </button>
      </div>

      {/* Card fields (shown when paypal/card selected) */}
      {paymentMethod === 'paypal' && (
        <div className="space-y-4">
          {/* Inline card fields */}
          {sdkLoading && (
            <div className="flex items-center justify-center py-8 text-muted-foreground gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm">{t("checkout.processing")}...</span>
            </div>
          )}

          {sdkReady && (
            <>
              {/* Card fields container */}
              <div
                ref={cardContainerRef}
                className="space-y-3 [&_.paypal-card-field]:border [&_.paypal-card-field]:border-border [&_.paypal-card-field]:rounded-lg [&_.paypal-card-field]:overflow-hidden [&_.paypal-card-field]:bg-card [&_.paypal-card-field]:min-h-[48px]"
              />

              {cardFieldsReady && (
                <Button
                  onClick={handleCardSubmit}
                  disabled={isLoading || isDisabled}
                  className="w-full h-14 font-bold bg-foreground text-background hover:bg-foreground/90"
                  size="lg"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" />{t("checkout.processing")}</span>
                  ) : (
                    <span className="flex items-center gap-2"><CreditCard className="h-4 w-4" /> {t("checkout.payNow")} {displayTotal.toFixed(2)} €</span>
                  )}
                </Button>
              )}

              {/* Divider */}
              <div className="relative py-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-card px-3 text-muted-foreground">o</span>
                </div>
              </div>

              {/* PayPal button as secondary */}
              <div ref={paypalButtonRef} className="min-h-[48px]" />

              {/* Fallback if SDK buttons don't render */}
              {!cardFieldsReady && !sdkLoading && (
                <Button
                  onClick={handlePayPalRedirect}
                  disabled={isLoading || isDisabled}
                  className="w-full h-14 font-bold bg-[#0070ba] hover:bg-[#005ea6] text-white"
                  size="lg"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" />{t("checkout.processing")}</span>
                  ) : (
                    <span className="flex items-center gap-2">{t("checkout.payNow")} {displayTotal.toFixed(2)} €</span>
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

      {/* Bank transfer */}
      {paymentMethod === 'transfer' && (
        <div className="space-y-3">
          <p className="text-xs text-center text-muted-foreground">{t("transfer.noFeeInfo")}</p>
          <Button
            onClick={onTransferPayment}
            disabled={isLoading || isDisabled}
            className="w-full h-14 font-bold"
            size="lg"
          >
            {isLoading ? (
              <span className="flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" />{t("checkout.processing")}</span>
            ) : (
              <span className="flex items-center gap-2"><Landmark className="h-4 w-4" /> {t("transfer.confirmOrder")}</span>
            )}
          </Button>
        </div>
      )}
    </div>
  );
};
