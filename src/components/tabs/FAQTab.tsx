import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HelpCircle, Clock, Music, Headphones, CreditCard, FileText } from "lucide-react";
import { useTranslation } from "react-i18next";

export const FAQTab = () => {
  const { t } = useTranslation();
  const faqCategories = [
    {
      icon: Music,
      title: "Servicio y General",
      faqs: [
        {
          question: "¿En qué consiste el servicio de grabación de baterías online?",
          answer: "Consiste en la grabación profesional de baterías acústicas para tus canciones. Podemos grabar baterías para tus canciones. Aprovechando las nuevas tecnologías, nuestros podemos hacerlo desde nuestro estudio con la máxima calidad y probar la grabación por internet a cualquier parte del mundo. De esa manera se aprovechan hasta un 70% de los costes, obteniendo un sonido profesional."
        },
        {
          question: "¿Cuál es el equipamiento de estudio que usan las baterías?",
          answer: "Con el mejor. Micrófonos, baterías, cajas, etc. Puedes verlo en nuestra sección \"Estudio\""
        },
        {
          question: "¿Quién graba las baterías?",
          answer: "Toni Mateos. Cuenta con más de 30 años de experiencia y más de 1000 álbumes grabados, entre los que se encuentran John Legend, Alejandro Sanz, Jarabe de Palo, Raphael, Rozalén, Antonio Orozco, Pastora Soler..."
        },
        {
          question: "¿Qué estilos pueden grabar?",
          answer: "La mayoría: pop, rock, funk, jazz, blues, swing, R&B, hip hop, rap, folk, country, ballad, salsa, samba, bossa nova, ritmos latinos, etc... Por el momento no grabamos metal."
        },
        {
          question: "¿Ofrecen garantía de satisfacción?",
          answer: "Absolutamente. Si no quedas satisfecho, te devolvemos el 100% de tu dinero."
        }
      ]
    },
    {
      icon: CreditCard,
      title: "Precio y Pago",
      faqs: [
        {
          question: "¿Cuál es el precio?",
          answer: "Tú lo decides, configurando la sesión de grabación que mejor se ajuste a tus necesidades."
        },
        {
          question: "La moneda de mi país no es el euro, ¿eso es un problema?",
          answer: "No. Nosotros aceptamos pagos de cualquier país del mundo."
        },
        {
          question: "¿Cómo se realiza el pago?",
          answer: "Por Paypal, transferencia bancaria, o tarjeta de crédito."
        }
      ]
    },
    {
      icon: Clock,
      title: "Proceso y Grabación",
      faqs: [
        {
          question: "¿Podremos hablar sobre los detalles antes de la grabación?",
          answer: "Por supuesto. Nos encantaría conectar contigo por Whatsapp o email y que nos cuentes con detalle qué tipo de sonido es el que te gusta. Si necesitas que hagamos una videollamada, puedes solicitarla en nuestro configurador de precios."
        },
        {
          question: "¿Cómo recibiré la grabación?",
          answer: "Después de grabar para ti, recibirás un email para descargar todas las pistas."
        },
        {
          question: "¿Envían la batería \"mezclada\"?",
          answer: "No, nosotros grabamos multi-pistas, listo para que la mezcles tú."
        },
        {
          question: "¿Recibiré las pistas editadas?",
          answer: "Sí, cuantizadas con el Beat Detective para que estén perfectamente a tiempo y sin errores. Listas para mezclar."
        },
        {
          question: "¿Hay algo de la grabación que no me gusta, ¿puedo modificarlo?",
          answer: "No, las modificaciones no están contempladas."
        },
        {
          question: "¿Puedo pedir una muestra gratuita de una de tus pistas?",
          answer: "Sí, puedes descargar pistas de muestra en el apartado \"Descarga una muestra\""
        },
        {
          question: "¿Cuánto tardaré en recibir las pistas?",
          answer: "Puedes decidirlo tú, en nuestro configurador de precios."
        }
      ]
    },
    {
      icon: Headphones,
      title: "Aspectos Técnicos",
      faqs: [
        {
          question: "¿Las pistas están procesadas con algún tipo de EQ, compresión o efecto?",
          answer: "No. Recibirás las pistas \"en crudo\"."
        },
        {
          question: "¿Qué formato tienen las pistas de batería? ¿Son compatibles con mi DAW?",
          answer: "Te enviamos archivos en formato wav, totalmente compatibles con cualquier software de grabación y mezcla (Pro Tools, Logic, Cubase, Reaper...)."
        },
        {
          question: "¿Cuál será el bit/sample rate de las pistas?",
          answer: "El que tú nos digas."
        },
        {
          question: "¿Cómo sabré los micros y previos que han utilizado en mi grabación?",
          answer: "Recibirás una ficha técnica donde te explicaremos los micros, previos conversor que hemos utilizado para cada canal."
        }
      ]
    },
    {
      icon: FileText,
      title: "Requisitos y Composición",
      faqs: [
        {
          question: "Tengo una canción con la batería ya orquestada (midi, loops...). ¿Pueden copiarla exactamente?",
          answer: "Sí, sin problema. Deberás contratarlo en nuestro configurador de precios. También tienes la opción de que grabemos una batería muy parecida, aunque no idéntica (incluida en el plan básico), o que grabemos una toma adicional con ideas nuevas y frescas."
        },
        {
          question: "Tengo una canción casi terminada, pero no he programado la batería. ¿Es eso un problema?",
          answer: "No, nosotros podemos componer la batería de tu canción. Contacta con nosotros y perfilaremos los detalles."
        },
        {
          question: "¿Es necesario que mi canción esté grabada con metrónomo click?",
          answer: "Sí."
        },
        {
          question: "¿Qué debo enviar para que empiecen a grabar mi canción?",
          answer: "Pocas cosas: un archivo de audio estéreo en formato wav de tu canción SIN BATERÍA; un archivo de audio estéreo en formato wav de tu canción SOLO LA BATERÍA (programación midi, loops, etc...); El bit/Sample rate de tu proyecto; El tempo exacto en BPMs (si el tempo tiene variaciones, necesitaremos el archivo tempo map .mid)"
        },
        {
          question: "¿Es necesario que mi producción esté acabada para que graben las baterías?",
          answer: "No, en absoluto."
        }
      ]
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          {t("Preguntas Frecuentes")}
        </h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          {t("Encuentra respuestas a las preguntas más comunes sobre el proceso de grabación")}
        </p>
      </div>

      <div className="space-y-8">
        {faqCategories.map((category, categoryIndex) => (
          <Card key={categoryIndex} className="bg-gradient-to-br from-card to-muted">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <category.icon className="h-6 w-6 text-primary" />
                {t(category.title)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {category.faqs.map((faq, faqIndex) => (
                  <AccordionItem key={faqIndex} value={`item-${categoryIndex}-${faqIndex}`}>
                    <AccordionTrigger className="text-left hover:text-primary">
                      {t(faq.question)}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground leading-relaxed">
                      {t(faq.answer)}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Contact for more questions */}
      <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
        <CardContent className="p-8 text-center space-y-4">
          <div className="flex justify-center">
            <HelpCircle className="h-12 w-12 text-primary" />
          </div>
          <h3 className="text-2xl font-bold">{t("¿No encuentras tu respuesta?")}</h3>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t("Si tienes alguna pregunta específica sobre tu proyecto o el proceso de grabación, no dudes en contactarme directamente. Estaré encantado de ayudarte.")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg hover:shadow-xl h-10 px-4 py-2"
              onClick={() => window.location.href = 'mailto:info@tonimateos.com'}
            >
              {t("Enviar Mensaje")}
            </button>
            <button 
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-card hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
              onClick={() => window.open('https://wa.me/34670605604', '_blank')}
            >
              {t("WhatsApp Directo")}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};