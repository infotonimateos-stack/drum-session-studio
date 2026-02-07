import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Footer } from "@/components/Footer";

export default function PoliticaCookies() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-warm-cream/30 to-warm-peach/20 flex flex-col">
      <div className="flex-1 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/")}
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al inicio
          </Button>

          <Card className="bg-background/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-primary">
                Política de Cookies
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none space-y-6">
              <section>
                <h2 className="text-xl font-semibold text-foreground">1. ¿Qué son las Cookies?</h2>
                <p className="text-muted-foreground">
                  Las cookies son pequeños archivos de texto que se almacenan en su dispositivo cuando visita un sitio web. 
                  Se utilizan para que el sitio web funcione correctamente, para recopilar información sobre el comportamiento 
                  de navegación y para recordar sus preferencias.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground">2. Cookies Utilizadas en Este Sitio Web</h2>
                <p className="text-muted-foreground">
                  Este sitio web utiliza <strong>únicamente cookies técnicas</strong> estrictamente necesarias para su 
                  funcionamiento. No utilizamos cookies de análisis, publicitarias ni de seguimiento.
                </p>
                <p className="text-muted-foreground mt-4">
                  Las cookies técnicas que utilizamos son:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>
                    <strong>Cookies de sesión del carrito:</strong> Necesarias para mantener los productos seleccionados 
                    en el carrito de compra durante su navegación.
                  </li>
                  <li>
                    <strong>Cookies de las pasarelas de pago:</strong> Stripe y PayPal utilizan cookies técnicas propias 
                    para procesar los pagos de forma segura y prevenir el fraude.
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground">3. Finalidad de las Cookies</h2>
                <p className="text-muted-foreground">
                  Las cookies técnicas utilizadas tienen como única finalidad:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                  <li>Garantizar el correcto funcionamiento del carrito de compra.</li>
                  <li>Permitir el procesamiento seguro de pagos a través de Stripe y PayPal.</li>
                  <li>Mantener la sesión de usuario durante el proceso de compra.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground">4. Cookies de Terceros</h2>
                <p className="text-muted-foreground">
                  Las únicas cookies de terceros presentes en este sitio web son las de las pasarelas de pago:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>
                    <strong>Stripe:</strong> Utiliza cookies técnicas para procesar pagos con tarjeta de forma segura. 
                    Puede consultar su política de privacidad en{" "}
                    <a href="https://stripe.com/es/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      stripe.com/es/privacy
                    </a>
                  </li>
                  <li>
                    <strong>PayPal:</strong> Utiliza cookies técnicas para procesar pagos de forma segura. 
                    Puede consultar su política de privacidad en{" "}
                    <a href="https://www.paypal.com/es/webapps/mpp/ua/privacy-full" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      paypal.com/es/privacy
                    </a>
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground">5. Gestión de Cookies</h2>
                <p className="text-muted-foreground">
                  Dado que solo utilizamos cookies técnicas estrictamente necesarias, no es posible desactivarlas sin 
                  afectar al funcionamiento del sitio web, especialmente del proceso de compra y pago.
                </p>
                <p className="text-muted-foreground mt-4">
                  Si lo desea, puede configurar su navegador para que rechace todas las cookies, pero en ese caso no 
                  podrá realizar compras en nuestro sitio web.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground">6. Contacto</h2>
                <p className="text-muted-foreground">
                  Si tiene alguna duda sobre nuestra Política de Cookies, puede contactar con nosotros en:{" "}
                  <a href="mailto:info@tonimateos.com" className="text-primary hover:underline">info@tonimateos.com</a>
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground">7. Actualización de la Política</h2>
                <p className="text-muted-foreground">
                  Esta Política de Cookies puede ser actualizada en cualquier momento. La fecha de la última actualización 
                  se indicará al final del documento.
                </p>
                <p className="text-muted-foreground mt-4">
                  <em>Última actualización: Febrero 2026</em>
                </p>
              </section>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
}
