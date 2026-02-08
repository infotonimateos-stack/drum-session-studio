import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HelpCircle, Clock, Music, Headphones, CreditCard, FileText } from "lucide-react";
import { useTranslation } from "react-i18next";

export const FAQTab = () => {
  const { t } = useTranslation();
  
  const faqCategories = [
    {
      icon: Music,
      titleKey: "faq.serviceGeneral",
      faqs: [
        { questionKey: "faq.q1", answerKey: "faq.a1" },
        { questionKey: "faq.q2", answerKey: "faq.a2" },
        { questionKey: "faq.q3", answerKey: "faq.a3" },
        { questionKey: "faq.q4", answerKey: "faq.a4" },
        { questionKey: "faq.q5", answerKey: "faq.a5" }
      ]
    },
    {
      icon: CreditCard,
      titleKey: "faq.pricePayment",
      faqs: [
        { questionKey: "faq.q6", answerKey: "faq.a6" },
        { questionKey: "faq.q7", answerKey: "faq.a7" },
        { questionKey: "faq.q8", answerKey: "faq.a8" }
      ]
    },
    {
      icon: Clock,
      titleKey: "faq.processRecording",
      faqs: [
        { questionKey: "faq.q9", answerKey: "faq.a9" },
        { questionKey: "faq.q10", answerKey: "faq.a10" },
        { questionKey: "faq.q11", answerKey: "faq.a11" },
        { questionKey: "faq.q12", answerKey: "faq.a12" },
        { questionKey: "faq.q13", answerKey: "faq.a13" },
        { questionKey: "faq.q14", answerKey: "faq.a14" },
        { questionKey: "faq.q15", answerKey: "faq.a15" }
      ]
    },
    {
      icon: Headphones,
      titleKey: "faq.technical",
      faqs: [
        { questionKey: "faq.q16", answerKey: "faq.a16" },
        { questionKey: "faq.q17", answerKey: "faq.a17" },
        { questionKey: "faq.q18", answerKey: "faq.a18" },
        { questionKey: "faq.q19", answerKey: "faq.a19" }
      ]
    },
    {
      icon: FileText,
      titleKey: "faq.requirements",
      faqs: [
        { questionKey: "faq.q20", answerKey: "faq.a20" },
        { questionKey: "faq.q21", answerKey: "faq.a21" },
        { questionKey: "faq.q22", answerKey: "faq.a22" },
        { questionKey: "faq.q23", answerKey: "faq.a23" },
        { questionKey: "faq.q24", answerKey: "faq.a24" }
      ]
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          {t("faq.heading")}
        </h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          {t("faq.subheading")}
        </p>
      </div>

      <div className="space-y-8">
        {faqCategories.map((category, categoryIndex) => (
          <Card key={categoryIndex} className="bg-gradient-to-br from-card to-muted">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <category.icon className="h-6 w-6 text-primary" />
                {t(category.titleKey)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {category.faqs.map((faq, faqIndex) => (
                  <AccordionItem key={faqIndex} value={`item-${categoryIndex}-${faqIndex}`}>
                    <AccordionTrigger className="text-left hover:text-primary">
                      {t(faq.questionKey)}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground leading-relaxed">
                      {t(faq.answerKey)}
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
          <h3 className="text-2xl font-bold">{t("faq.noAnswer")}</h3>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t("faq.noAnswerDesc")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg hover:shadow-xl h-10 px-4 py-2"
              onClick={() => window.location.href = 'mailto:info@tonimateos.com'}
            >
              {t("faq.sendMessage")}
            </button>
            <button 
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-card hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
              onClick={() => window.open('https://wa.me/34670605604', '_blank')}
            >
              {t("faq.whatsappDirect")}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};