import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Building, Headphones, Zap, Shield } from "lucide-react";
import { useTranslation } from "react-i18next";
export const StudioTab = () => {
  const { t } = useTranslation();
  return <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          {t("studio.title")}
        </h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          {t("studio.subtitle")}
        </p>
      </div>

      {/* Galería del Estudio */}
      <Card className="bg-gradient-to-br from-card to-muted">
        <CardHeader>
          <CardTitle>Galería del Estudio</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <img src="/lovable-uploads/55fddddd-e10a-4c7d-9852-36db51337402.png" alt="Estudio de batería: kit microfoneado vista 1" loading="lazy" className="w-full h-48 object-cover rounded-md" />
            <img src="/lovable-uploads/85028cc6-173f-44cd-a28f-5aeec1c79bed.png" alt="Estudio de batería: sala tratada vista 2" loading="lazy" className="w-full h-48 object-cover rounded-md" />
            <img src="/lovable-uploads/e499070f-a9d9-4586-bc17-dedc7a19da05.png" alt="Equipamiento profesional de audio: rack con previos API y otros procesadores" loading="lazy" className="w-full h-48 object-cover object-top rounded-md" />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Studio Features */}
        <Card className="bg-gradient-to-br from-card to-muted">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5 text-primary" />
              Características del Estudio
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <h4 className="font-semibold">Acústica Profesional</h4>
                  <p className="text-sm text-muted-foreground">Sala diseñada y tratada acústicamente por los mejores ingenieros acústicos para un sonido profesional impecable.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Headphones className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <h4 className="font-semibold">Sala de 50m2 y 3,5m de altura</h4>
                  <p className="text-sm text-muted-foreground">Para conseguir un sonido gigante!</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Zap className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <h4 className="font-semibold">Cadena de Audio Premium</h4>
                  <p className="text-sm text-muted-foreground">Microfonía Clase A, Previos API, Neve y DAD con convertidores de última generación</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Equipment */}
        <Card className="bg-gradient-to-br from-card to-muted">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Headphones className="h-5 w-5 text-primary" />
              Equipamiento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="multiple" className="w-full">
              <AccordionItem value="microfonos">
                <AccordionTrigger>Micrófonos</AccordionTrigger>
                <AccordionContent>
                  <ul className="grid sm:grid-cols-2 gap-2 text-sm">
                    <li>1 x Telefunken C12</li>
                    <li>1 x Neumann U47 FET</li>
                    <li>2 x Neumann U87 Ai Stereo Set</li>
                    <li>2 x Coles 4038 Ribbon Mics</li>
                    <li>2 x Neumann KM 184 Stereo set</li>
                    <li>2 x AKG 414 XLII Stereo Set</li>
                    <li>2 x AKG 414 LTD Nilon capsule Stereo Set</li>
                    <li>1 x AKG 414 XLS</li>
                    <li>4 x Sennheiser 421</li>
                    <li>1 x Shure Beta 52</li>
                    <li>1 x Audix D6</li>
                    <li>1 x Beyerdinamyc M160</li>
                    <li>1 x Solomon LoFreq</li>
                    <li>1 x Sennheiser MD441-U</li>
                    <li>3 x Shure SM57</li>
                    <li>1 x Shure SM81</li>
                    <li>1 x Sennheiser E602II</li>
                    <li>1 x Sennheiser E604</li>
                    <li>1 x Shure Beta 56</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="convertidores">
                <AccordionTrigger>Convertidores</AccordionTrigger>
                <AccordionContent>
                  <ul className="list-disc pl-5 text-sm">
                    <li>DAD AX64 Digital Audio Denmark</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="daw">
                <AccordionTrigger>DAW</AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm">
                    Pro Tools 2024 en Apple iMac 27″ Core i5 3,2GHz 32GB RAM
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="monitores">
                <AccordionTrigger>Monitores</AccordionTrigger>
                <AccordionContent>
                  <ul className="list-disc pl-5 text-sm">
                    <li>2 x Yamaha HS8</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="preamps">
                <AccordionTrigger>Preamplificadores</AccordionTrigger>
                <AccordionContent>
                  <ul className="list-disc pl-5 text-sm">
                    <li>12 x API 3124+</li>
                    <li>2 x NEVE 1073</li>
                    <li>16 x DAD AX64 Digital Audio Denmark</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="bateria">
                <AccordionTrigger>Batería (DW)</AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm mb-2">DW Collectors, Performance & Design Series</p>
                  <ul className="grid sm:grid-cols-2 gap-2 text-sm">
                    <li>Bd 20 x 16″</li>
                    <li>Bd 22 x 18″</li>
                    <li>Bd 24 x 18″</li>
                    <li>Tom 10″</li>
                    <li>Tom 12″</li>
                    <li>Tom 14″</li>
                    <li>Tom 16″</li>
                    <li>Tom 18″</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="platos">
                <AccordionTrigger>Platos</AccordionTrigger>
                <AccordionContent>
                  <ul className="list-disc pl-5 text-sm">
                    <li>Zildjian K Series</li>
                    <li>Zildjian A Series</li>
                    <li>Zildjian K Custom Series</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="cajas">
                <AccordionTrigger>Cajas</AccordionTrigger>
                <AccordionContent>
                  <ul className="grid sm:grid-cols-2 gap-2 text-sm">
                    <li>Dw Collectors Series 14 x 6,5″</li>
                    <li>Dw Performance Series 14 x 5,5″</li>
                    <li>Dw Performance Series 14 x 6,5″</li>
                    <li>Dw Performance Series 14 x 8″</li>
                    <li>Pdp 10 x 5″</li>
                    <li>Pearl Steve Ferrone Signature 14 x 6,5″</li>
                    <li>Pearl Piccolo 14 x 4″</li>
                    <li>Pearl Vinnie Paul Signature Series 14 x 8″</li>
                    <li>Premier Signia 1998 14 x 7″</li>
                    <li>Ludwig Supraphonic 1968 14 x 52</li>
                    <li>Mapex Black Panther Stainless Steel 14 x 5,5″</li>
                    <li>Mapex Black Panther 14 x 5″</li>
                    <li>Mapex Black Panther 13 x 5″</li>
                    <li>Mapex Black Panther 12 x 5″</li>
                    <li>Ludwig Black Beauty 14 x 6,5″</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      </div>

      {/* Galería del Estudio */}
      <Card className="bg-gradient-to-br from-card to-muted">
        <CardHeader>
          <CardTitle>Galería del Estudio</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <img src="/lovable-uploads/55fddddd-e10a-4c7d-9852-36db51337402.png" alt="Estudio de batería: kit microfoneado vista 1" loading="lazy" className="w-full h-auto rounded-md" />
            <img src="/lovable-uploads/85028cc6-173f-44cd-a28f-5aeec1c79bed.png" alt="Estudio de batería: sala tratada vista 2" loading="lazy" className="w-full h-auto rounded-md" />
            <img src="/lovable-uploads/e499070f-a9d9-4586-bc17-dedc7a19da05.png" alt="Equipamiento profesional de audio: rack con previos API y otros procesadores" loading="lazy" className="w-full h-48 object-cover object-top rounded-md" />
          </div>
        </CardContent>
      </Card>

      {/* Process */}
      <Card className="bg-gradient-to-br from-card to-muted">
        <CardHeader>
          <CardTitle>{t("studio.processTitle")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center space-y-3">
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
                <span className="text-primary font-bold">1</span>
              </div>
              <h4 className="font-semibold">{t("studio.step1Title")}</h4>
              <p className="text-sm text-muted-foreground">
                {t("studio.step1Text")}
              </p>
            </div>
            <div className="text-center space-y-3">
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
                <span className="text-primary font-bold">2</span>
              </div>
              <h4 className="font-semibold">{t("studio.step2Title")}</h4>
              <p className="text-sm text-muted-foreground">
                {t("studio.step2Text")}
              </p>
            </div>
            <div className="text-center space-y-3">
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
                <span className="text-primary font-bold">3</span>
              </div>
              <h4 className="font-semibold">{t("studio.step3Title")}</h4>
              <p className="text-sm text-muted-foreground">
                {t("studio.step3Text")}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>;
};