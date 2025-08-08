import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HelpCircle, Clock, Music, Headphones, CreditCard, FileText } from "lucide-react";
import { useTranslate } from "@/hooks/useTranslate";
export const FAQTab = () => {
  const tr = useTranslate();
  const faqCategories = [
    {
      icon: Music,
      title: "Proceso de Grabación",
      faqs: [
        {
          question: "¿Qué necesito enviar para empezar mi proyecto?",
          answer: "Necesitas enviar tu maqueta sin batería en formato WAV o MP3, y si tienes una demo de referencia con batería, también la incluyes. Además, especifica el tempo, referencias de sonido y cualquier indicación especial."
        },
        {
          question: "¿Puedo hacer cambios después de recibir la primera versión?",
          answer: "Sí, incluyo una revisión en el precio. Si necesitas cambios mayores después de la revisión incluida, podemos acordar un precio adicional según la complejidad."
        },
        {
          question: "¿En qué formatos recibo los archivos finales?",
          answer: "Recibes los archivos en el formato que elijas: WAV 24-bit/48kHz (estándar), o puedes solicitar otros formatos como 16-bit/44.1kHz para distribución digital."
        },
        {
          question: "¿Qué pasa si no tengo demo de batería?",
          answer: "No hay problema. Puedo trabajar solo con tu maqueta sin batería y crear la parte de batería basándome en tu música y referencias que me proporciones."
        }
      ]
    },
    {
      icon: Clock,
      title: "Tiempos y Entrega",
      faqs: [
        {
          question: "¿Cuánto tiempo toma el proceso completo?",
          answer: "El plazo estándar es de 10 días laborables. Ofrezco opciones express de 5 días (+€5.90) y ultra express de 2 días (+€39.90) para proyectos urgentes."
        },
        {
          question: "¿Qué pasa si necesito mi proyecto antes del plazo acordado?",
          answer: "Puedes contactarme para ver si es posible adelantar la entrega. Si está dentro de mis posibilidades, no hay costo adicional. Para garantía de entrega rápida, recomiendo elegir una opción express al hacer el pedido."
        },
        {
          question: "¿Trabajas los fines de semana?",
          answer: "Los plazos se calculan en días laborables (lunes a viernes). Sin embargo, a menudo trabajo fines de semana, lo que puede acelerar tu proyecto sin costo adicional."
        }
      ]
    },
    {
      icon: Headphones,
      title: "Calidad y Sonido",
      faqs: [
        {
          question: "¿Qué diferencia hay entre los previos básicos y premium?",
          answer: "Los previos básicos (Focusrite OctoPre) ofrecen un sonido limpio y transparente. Los premium (API, Neve, DAD) añaden carácter, calidez y el color vintage que caracteriza las producciones profesionales."
        },
        {
          question: "¿Todos los micrófonos se graban simultáneamente?",
          answer: "Sí, utilizo una configuración multimicrófono que captura todos los elementos de la batería simultáneamente, lo que preserva la naturalidad y la cohesión del sonido."
        },
        {
          question: "¿Puedo elegir micrófonos específicos para mi proyecto?",
          answer: "Absolutamente. En el configurador puedes añadir micrófonos premium específicos. También puedes contactarme si tienes preferencias particulares no listadas en las opciones."
        }
      ]
    },
    {
      icon: CreditCard,
      title: "Pagos y Facturación",
      faqs: [
        {
          question: "¿Qué métodos de pago aceptas?",
          answer: "Acepto tarjeta de crédito/débito, transferencia bancaria y PayPal. El pago se procesa de forma segura a través de Stripe."
        },
        {
          question: "¿Cuándo debo pagar?",
          answer: "El pago se realiza al hacer el pedido, antes de comenzar la grabación. Esto me permite reservar el tiempo necesario para tu proyecto."
        },
        {
          question: "¿Ofreces factura?",
          answer: "Sí, puedes solicitar factura durante el proceso de compra. Necesitaré tus datos fiscales completos (dirección y NIF/RUT/RUC/EIN según tu país)."
        },
        {
          question: "¿Hay garantía de devolución?",
          answer: "Si por algún motivo no estás satisfecho con el resultado y no podemos llegar a una solución, ofrezco devolución completa del dinero."
        }
      ]
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          {tr("Preguntas Frecuentes")}
        </h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          {tr("Encuentra respuestas a las preguntas más comunes sobre el proceso de grabación")}
        </p>
      </div>

      <div className="space-y-8">
        {faqCategories.map((category, categoryIndex) => (
          <Card key={categoryIndex} className="bg-gradient-to-br from-card to-muted">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <category.icon className="h-6 w-6 text-primary" />
                {tr(category.title)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {category.faqs.map((faq, faqIndex) => (
                  <AccordionItem key={faqIndex} value={`item-${categoryIndex}-${faqIndex}`}>
                    <AccordionTrigger className="text-left hover:text-primary">
                      {tr(faq.question)}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground leading-relaxed">
                      {tr(faq.answer)}
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
          <h3 className="text-2xl font-bold">{tr("¿No encuentras tu respuesta?")}</h3>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {tr("Si tienes alguna pregunta específica sobre tu proyecto o el proceso de grabación, no dudes en contactarme directamente. Estaré encantado de ayudarte.")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg hover:shadow-xl h-10 px-4 py-2">
              {tr("Enviar Mensaje")}
            </button>
            <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-card hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2">
              {tr("WhatsApp Directo")}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};