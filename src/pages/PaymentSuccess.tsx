import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Home } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    // Scroll to top on mount
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-warm-cream/30 to-warm-peach/20 flex items-center justify-center p-4">
      <Card className="max-w-lg w-full bg-gradient-to-br from-success/10 to-emerald-100/50 border-success/30 shadow-2xl">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto w-20 h-20 bg-success/20 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-12 h-12 text-success" />
          </div>
          <CardTitle className="text-3xl font-bold text-success">
            ¡Pago Completado!
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 text-center">
          <p className="text-lg text-muted-foreground">
            Gracias por tu compra. Tu pedido de grabación de batería ha sido confirmado.
          </p>
          
          <div className="bg-background/50 rounded-lg p-4 space-y-2">
            <p className="text-sm text-muted-foreground">
              📧 Recibirás un email con los detalles de tu pedido y las instrucciones para enviar tus pistas.
            </p>
            <p className="text-sm text-muted-foreground">
              🎵 Una vez recibamos tu material, comenzaremos a trabajar en tu proyecto.
            </p>
          </div>

          <div className="bg-muted/30 rounded-lg p-4 border border-border/50">
            <p className="text-sm text-muted-foreground">
              🧾 Si necesitas una <strong>factura oficial</strong>, por favor contacta con nosotros en{" "}
              <a href="mailto:info@tonimateos.com" className="text-primary hover:underline font-medium">
                info@tonimateos.com
              </a>{" "}
              facilitando tus datos fiscales.
            </p>
          </div>

          <Button 
            onClick={() => navigate("/")}
            className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
            size="lg"
          >
            <Home className="w-5 h-5 mr-2" />
            Volver al Inicio
          </Button>

          <p className="text-xs text-muted-foreground">
            ¿Tienes alguna pregunta? Contáctanos en info@tonimateos.com
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
