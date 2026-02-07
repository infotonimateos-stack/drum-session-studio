import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Footer } from "@/components/Footer";

export default function AvisoLegal() {
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
                Aviso Legal
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none space-y-6">
              <section>
                <h2 className="text-xl font-semibold text-foreground">1. Datos Identificativos del Titular</h2>
                <p className="text-muted-foreground">
                  En cumplimiento del deber de información recogido en el artículo 10 de la Ley 34/2002, de 11 de julio, 
                  de Servicios de la Sociedad de la Información y del Comercio Electrónico (LSSI-CE), se exponen a continuación 
                  los datos identificativos del titular de este sitio web:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                  <li><strong>Titular:</strong> Antonio Mateos</li>
                  <li><strong>Domicilio:</strong> C/ Mosteruelo, 2, 49334, Litos, Zamora, España</li>
                  <li><strong>Correo electrónico:</strong> info@tonimateos.com</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground">2. Objeto y Ámbito de Aplicación</h2>
                <p className="text-muted-foreground">
                  El presente Aviso Legal regula el uso del sitio web, del cual Antonio Mateos es titular. 
                  La navegación por este sitio web atribuye la condición de usuario del mismo e implica la aceptación 
                  plena y sin reservas de todas y cada una de las disposiciones incluidas en este Aviso Legal.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground">3. Propiedad Intelectual e Industrial</h2>
                <p className="text-muted-foreground">
                  Todos los contenidos del sitio web, incluyendo textos, fotografías, gráficos, imágenes, iconos, 
                  tecnología, software, así como su diseño gráfico y códigos fuente, constituyen una obra cuya propiedad 
                  pertenece a Antonio Mateos, sin que puedan entenderse cedidos al usuario ninguno de los derechos de 
                  explotación sobre los mismos más allá de lo estrictamente necesario para el correcto uso de la web.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground">4. Condiciones de Uso</h2>
                <p className="text-muted-foreground">
                  El usuario se compromete a utilizar el sitio web, los servicios y los contenidos de conformidad con la Ley, 
                  el presente Aviso Legal, las buenas costumbres y el orden público. Del mismo modo, el usuario se obliga a 
                  no utilizar el sitio web o los servicios que se presten a través de él con fines o efectos ilícitos o 
                  contrarios al contenido del presente Aviso Legal, lesivos de los intereses o derechos de terceros, o que 
                  de cualquier forma puedan dañar, inutilizar o deteriorar el sitio web o sus servicios, o impedir el normal 
                  disfrute del sitio web por otros usuarios.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground">5. Legislación Aplicable y Jurisdicción</h2>
                <p className="text-muted-foreground">
                  Las presentes condiciones se rigen por la legislación española. Para la resolución de cualquier controversia 
                  que pudiera derivarse del acceso al sitio web, el usuario y Antonio Mateos acuerdan someterse a los Juzgados 
                  y Tribunales del domicilio del usuario, siempre que el mismo esté ubicado en territorio español.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground">6. Contacto</h2>
                <p className="text-muted-foreground">
                  Para cualquier consulta o sugerencia relacionada con este Aviso Legal, puede ponerse en contacto a través 
                  del correo electrónico: <a href="mailto:info@tonimateos.com" className="text-primary hover:underline">info@tonimateos.com</a>
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
