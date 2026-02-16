import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Footer } from "@/components/Footer";
import { useTranslation } from "react-i18next";
import { useLanguagePrefix } from "@/hooks/useLanguagePrefix";

export default function PoliticaPrivacidad() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { localePath } = useLanguagePrefix();

  return (
    <div className="min-h-screen bg-gradient-to-br from-warm-cream/30 to-warm-peach/20 flex flex-col">
      <div className="flex-1 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <Button 
            variant="ghost" 
            onClick={() => navigate(localePath("/"))}
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t("success.backHome")}
          </Button>

          <Card className="bg-background/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-primary">
                Política de Privacidad
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none space-y-6">
              <section>
                <h2 className="text-xl font-semibold text-foreground">1. Responsable del Tratamiento</h2>
                <p className="text-muted-foreground">
                  El responsable del tratamiento de los datos personales recogidos a través de este sitio web es:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                  <li><strong>Razón Social:</strong> Groove Factory Studios SL</li>
                  <li><strong>NIF:</strong> B42915165</li>
                  <li><strong>Domicilio Social:</strong> C/ Mosteruelo, 2, 49334, Litos, Zamora, España</li>
                  <li><strong>Correo electrónico:</strong> info@tonimateos.com</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground">2. Finalidad del Tratamiento</h2>
                <p className="text-muted-foreground">
                  Los datos personales que nos facilite serán tratados con las siguientes finalidades:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                  <li>Gestión de pedidos y prestación de los servicios de grabación contratados.</li>
                  <li>Comunicación con el cliente para coordinar los detalles del servicio.</li>
                  <li>Facturación y cumplimiento de obligaciones legales.</li>
                  <li>Atención de consultas y solicitudes de información.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground">3. Legitimación</h2>
                <p className="text-muted-foreground">
                  La base legal para el tratamiento de sus datos es:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                  <li>La ejecución del contrato de prestación de servicios.</li>
                  <li>El consentimiento del interesado para finalidades específicas.</li>
                  <li>El cumplimiento de obligaciones legales aplicables.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground">4. Destinatarios de los Datos</h2>
                <p className="text-muted-foreground">
                  Sus datos personales podrán ser comunicados a:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                  <li>Pasarelas de pago (Stripe y PayPal) para procesar las transacciones.</li>
                  <li>Administraciones públicas cuando exista obligación legal.</li>
                </ul>
                <p className="text-muted-foreground">
                  No se realizarán transferencias internacionales de datos fuera de las necesarias para el funcionamiento 
                  de las pasarelas de pago mencionadas.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground">5. Conservación de los Datos</h2>
                <p className="text-muted-foreground">
                  Los datos personales se conservarán durante el tiempo necesario para cumplir con la finalidad para 
                  la que se recabaron y para determinar las posibles responsabilidades que se pudieran derivar de dicha 
                  finalidad, además de los períodos establecidos legalmente.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground">6. Derechos del Usuario</h2>
                <p className="text-muted-foreground">
                  Usted tiene derecho a:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                  <li><strong>Acceso:</strong> Conocer qué datos personales estamos tratando.</li>
                  <li><strong>Rectificación:</strong> Solicitar la corrección de datos inexactos.</li>
                  <li><strong>Supresión:</strong> Solicitar la eliminación de sus datos.</li>
                  <li><strong>Limitación:</strong> Solicitar la limitación del tratamiento de sus datos.</li>
                  <li><strong>Portabilidad:</strong> Recibir sus datos en un formato estructurado.</li>
                  <li><strong>Oposición:</strong> Oponerse al tratamiento de sus datos.</li>
                </ul>
                <p className="text-muted-foreground mt-4">
                  Para ejercer cualquiera de estos derechos, puede contactar con nosotros en:{" "}
                  <a href="mailto:info@tonimateos.com" className="text-primary hover:underline">info@tonimateos.com</a>
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground">7. Seguridad</h2>
                <p className="text-muted-foreground">
                  Groove Factory Studios SL ha adoptado las medidas técnicas y organizativas necesarias para garantizar la 
                  seguridad de los datos personales y evitar su alteración, pérdida, tratamiento o acceso no autorizado.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground">8. Reclamaciones</h2>
                <p className="text-muted-foreground">
                  Si considera que el tratamiento de sus datos personales no es adecuado, tiene derecho a presentar 
                  una reclamación ante la Agencia Española de Protección de Datos (www.aepd.es).
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
