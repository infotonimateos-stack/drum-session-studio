import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Home, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Footer } from "@/components/Footer";
import { useTranslation } from "react-i18next";
import { useLanguagePrefix } from "@/hooks/useLanguagePrefix";

export default function Success() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { localePath } = useLanguagePrefix();
  const [searchParams] = useSearchParams();
  const [isCapturing, setIsCapturing] = useState(false);
  const [captureComplete, setCaptureComplete] = useState(false);
  const [captureError, setCaptureError] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const paymentMethod = searchParams.get('method');
    const token = searchParams.get('token');

    if (paymentMethod === 'paypal' && token) {
      capturePayPalOrder(token);
    } else {
      setCaptureComplete(true);
    }
  }, [searchParams]);

  const capturePayPalOrder = async (orderId: string) => {
    setIsCapturing(true);
    try {
      const { data, error } = await supabase.functions.invoke('capture-paypal-order', {
        body: { orderId },
      });

      if (error) {
        console.error('PayPal capture error:', error);
        setCaptureError(t("success.paypalConfirmError"));
      } else if (data?.success) {
        console.log('PayPal capture successful:', data);
        setCaptureComplete(true);
      } else {
        setCaptureError(data?.error || t("success.unknownError"));
      }
    } catch (err) {
      console.error('PayPal capture error:', err);
      setCaptureError(t("success.serverError"));
    } finally {
      setIsCapturing(false);
    }
  };

  if (isCapturing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-warm-cream/30 to-warm-peach/20 flex flex-col">
        <div className="flex-1 flex items-center justify-center p-4">
          <Card className="max-w-lg w-full bg-gradient-to-br from-warm-peach/30 to-warm-apricot/30 border-primary/30 shadow-2xl">
            <CardContent className="py-16 text-center">
              <Loader2 className="w-16 h-16 mx-auto text-primary animate-spin mb-6" />
              <h2 className="text-2xl font-bold text-primary mb-2">{t("success.confirming")}</h2>
              <p className="text-muted-foreground">{t("success.pleaseWait")}</p>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  if (captureError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-warm-cream/30 to-warm-peach/20 flex flex-col">
        <div className="flex-1 flex items-center justify-center p-4">
          <Card className="max-w-lg w-full bg-gradient-to-br from-destructive/10 to-destructive/5 border-destructive/30 shadow-2xl">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-20 h-20 bg-destructive/20 rounded-full flex items-center justify-center mb-4">
                <span className="text-4xl">⚠️</span>
              </div>
              <CardTitle className="text-3xl font-bold text-destructive">
                {t("success.errorTitle")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 text-center">
              <p className="text-lg text-muted-foreground">
                {captureError}
              </p>
              
              <div className="bg-background/50 rounded-lg p-4">
                <p className="text-sm text-muted-foreground">
                  {t("success.errorContact")}{" "}
                  <a href="mailto:info@tonimateos.com" className="text-primary hover:underline font-medium">
                    info@tonimateos.com
                  </a>{" "}
                  {t("success.errorResolve")}
                </p>
              </div>

              <Button 
                onClick={() => navigate(localePath("/"))}
                className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
                size="lg"
              >
                <Home className="w-5 h-5 mr-2" />
                {t("success.backHome")}
              </Button>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-warm-cream/30 to-warm-peach/20 flex flex-col">
      <div className="flex-1 flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full bg-gradient-to-br from-success/10 to-success/5 border-success/30 shadow-2xl">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto w-20 h-20 bg-success/20 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-12 h-12 text-success" />
            </div>
            <CardTitle className="text-3xl font-bold text-success">
              {t("success.title")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-lg text-center text-muted-foreground">
              {t("success.thankYou")}
            </p>
            
            {/* Materials Required Section - Prominent */}
            <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl p-6 border-2 border-primary/30">
              <h2 className="text-2xl font-bold text-primary text-center mb-6">
                {t("success.materialsTitle")}
              </h2>
              
              <ul className="space-y-4 text-base">
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center text-primary font-bold">1</span>
                  <span className="pt-1">
                    <strong>{t("success.material1Title")}</strong> {t("success.material1Desc")} <span className="text-primary font-semibold">{t("success.material1Highlight")}</span>
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center text-primary font-bold">2</span>
                  <span className="pt-1">
                    <strong>{t("success.material2Title")}</strong> {t("success.material2Desc")} <span className="text-primary font-semibold">{t("success.material2Highlight")}</span>
                    <span className="block text-sm text-muted-foreground mt-1">{t("success.material2Note")}</span>
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center text-primary font-bold">3</span>
                  <span className="pt-1">
                    {t("success.material3")}
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center text-primary font-bold">4</span>
                  <span className="pt-1">
                    {t("success.material4")}
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center text-primary font-bold">5</span>
                  <span className="pt-1">
                    {t("success.material5")}
                  </span>
                </li>
              </ul>

              <div className="mt-6 p-4 bg-background/60 rounded-lg text-center">
                <p className="text-lg font-medium">
                  {t("success.sendTo")}{" "}
                  <a 
                    href="mailto:info@tonimateos.com" 
                    className="text-primary hover:underline font-bold text-xl"
                  >
                    info@tonimateos.com
                  </a>
                </p>
              </div>
            </div>

            <div className="bg-muted/30 rounded-lg p-4 border border-border/50 text-center">
              <p className="text-sm text-muted-foreground">
                {t("success.invoiceNote")}{" "}
                <a href="mailto:info@tonimateos.com" className="text-primary hover:underline font-medium">
                  info@tonimateos.com
                </a>{" "}
                {t("success.invoiceData")}
              </p>
            </div>

            <Button 
              onClick={() => navigate(localePath("/"))}
              className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
              size="lg"
            >
              <Home className="w-5 h-5 mr-2" />
              {t("success.backHome")}
            </Button>

            <p className="text-xs text-muted-foreground text-center">
              {t("success.questions")} info@tonimateos.com
            </p>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
}
