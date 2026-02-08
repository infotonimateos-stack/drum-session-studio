import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Clock, DollarSign, Globe, Video, ShoppingCart, ExternalLink } from "lucide-react";
import { useTranslation } from "react-i18next";

export const TutorialsTab = () => {
  const { t } = useTranslation();
  
  const cursos = [
    {
      id: "mezcla-avanzada",
      titleKey: "tutorials.advancedMixingTitle",
      instructor: "Luis del Toro",
      duration: "1h 45min",
      formatKey: "tutorials.downloadableVideo",
      styles: ["Pop", "World Music"],
      price: {
        eur: "19,90 €"
      },
      descriptionKey: "tutorials.advancedMixingDesc",
      url: "https://store.payloadz.com/details/2677048-music-other-curso-avanzado-mezcla-de-baterias.html",
      image: "/lovable-uploads/47653ee7-a23b-4807-80f6-1f266435b83a.png"
    },
    {
      id: "grabacion-baterias",
      titleKey: "tutorials.recordingTitle",
      instructor: "Luis del Toro",
      duration: "40 min",
      formatKey: "tutorials.videoMP4",
      microphonesKey: "tutorials.learnWith",
      microphonesList: ["2 mics", "3 mics", "4 mics", "6 mics", "8 mics", "11 mics"],
      price: {
        eur: "9,90 €"
      },
      descriptionKey: "tutorials.recordingDesc",
      url: "https://store.payloadz.com/details/2666816-music-popular-curso-grabacion-de-baterias.html",
      image: "/lovable-uploads/be94b2c6-9a7e-4eb4-bafc-5059556359a3.png"
    },
    {
      id: "mezcla-baterias",
      titleKey: "tutorials.mixingTitle",
      instructor: "Alex Carretero",
      duration: "101 min",
      formatKey: "tutorials.videoMP4",
      contentKey: "tutorials.courseContent",
      content: [
        "tutorials.content.freeTracks",
        "tutorials.content.gainStructure",
        "tutorials.content.phasePolarity",
        "tutorials.content.panning",
        "tutorials.content.bleeding",
        "tutorials.content.kickInOut",
        "tutorials.content.snareTopBottom",
        "tutorials.content.overheads",
        "tutorials.content.toms",
        "tutorials.content.room",
        "tutorials.content.hihatRide",
        "tutorials.content.subgroupMaster"
      ],
      price: {
        eur: "9,90 €"
      },
      descriptionKey: "tutorials.mixingDesc",
      url: "https://store.payloadz.com/details/2667272-music-other-curso-mezcla-de-baterias.html",
      image: "/lovable-uploads/b68b9884-03e0-40e8-8f4e-21e5ce19fc08.png"
    },
    {
      id: "beat-detective",
      titleKey: "tutorials.beatDetectiveTitle",
      instructor: "Toni Mateos",
      duration: "35 min",
      formatKey: "tutorials.videoMP4",
      contentKey: "tutorials.courseContent",
      content: [
        "tutorials.bd.whatIs",
        "tutorials.bd.proscons",
        "tutorials.bd.download",
        "tutorials.bd.import",
        "tutorials.bd.panoramaEQ",
        "tutorials.bd.gridTempo",
        "tutorials.bd.subgroups",
        "tutorials.bd.phases",
        "tutorials.bd.playlists",
        "tutorials.bd.separateClips",
        "tutorials.bd.quantize",
        "tutorials.bd.smoothing",
        "tutorials.bd.consolidate",
        "tutorials.bd.troubleshoot"
      ],
      price: {
        eur: "3,99 €",
        originalPrice: "12,99 €"
      },
      descriptionKey: "tutorials.beatDetectiveDesc",
      url: "https://store.payloadz.com/details/2655204-music-rock-curso-beat-detective.html",
      image: "/lovable-uploads/2c18e9ea-d4a6-4ca0-9525-525a6b9943cb.png"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          {t("tutorials.heading")}
        </h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          {t("tutorials.subheading")}
        </p>
      </div>

      {/* Grid de Cursos */}
      <div className="grid lg:grid-cols-2 gap-8">
        {cursos.map((curso) => (
          <Card key={curso.id} className="bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
            <CardContent className="p-8">
              <div className="space-y-6">
                <div className="aspect-square bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl flex items-center justify-center border border-primary/30 overflow-hidden">
                  <img 
                    src={curso.image} 
                    alt={t(curso.titleKey)}
                    className="w-full h-full object-cover rounded-2xl"
                  />
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-2xl font-black text-primary mb-2">{t(curso.titleKey)}</h3>
                    <p className="text-lg text-accent font-semibold">{t("tutorials.taughtBy")} {curso.instructor}</p>
                  </div>
                  
                  <p className="text-muted-foreground leading-relaxed">
                    {t(curso.descriptionKey)}
                  </p>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-primary" />
                      <span className="font-semibold">{curso.duration}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Video className="h-5 w-5 text-primary" />
                      <span className="font-semibold">{t(curso.formatKey)}</span>
                    </div>
                  </div>
                  
                  {/* Contenido específico por curso */}
                  {curso.styles && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Globe className="h-5 w-5 text-accent" />
                        <span className="font-semibold">{t("tutorials.twoStyles")}</span>
                      </div>
                      <div className="flex gap-2">
                        {curso.styles.map((style) => (
                          <Badge key={style} variant="outline" className="bg-accent/10 text-accent border-accent/30">
                            {style}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {curso.microphonesList && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Video className="h-5 w-5 text-accent" />
                        <span className="font-semibold">{t("tutorials.learnWith")}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {curso.microphonesList.map((mic) => (
                          <div key={mic} className="flex items-center gap-2 text-sm">
                            <span className="text-success">✅</span>
                            <span>{mic}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {curso.content && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Video className="h-5 w-5 text-accent" />
                        <span className="font-semibold">{t("tutorials.courseContent")}</span>
                      </div>
                      <div className="grid grid-cols-1 gap-2">
                        {curso.content.map((item) => (
                          <div key={item} className="flex items-center gap-2 text-sm">
                            <span className="text-success">✅</span>
                            <span>{t(item)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="bg-gradient-to-r from-muted to-card p-6 rounded-2xl border border-border/50">
                    <div className="flex items-center gap-2 mb-3">
                      <DollarSign className="h-5 w-5 text-success" />
                      <span className="font-bold text-lg">{t("tutorials.price")}</span>
                    </div>
                    <div className="space-y-1 text-sm">
                      <div className="font-semibold text-lg">{curso.price.eur}</div>
                      {curso.price.originalPrice && (
                        <div className="text-muted-foreground line-through text-sm">
                          {curso.price.originalPrice}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <Button 
                    variant="upgrade" 
                    size="lg" 
                    className="w-full gap-3" 
                    onClick={() => window.open(curso.url, '_blank')}
                  >
                    <ShoppingCart className="h-5 w-5" />
                    {t("tutorials.buyCourse")}
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Información adicional */}
      <Card className="bg-gradient-to-br from-card to-muted max-w-3xl mx-auto">
        <CardContent className="p-8 text-center space-y-4">
          <h3 className="text-2xl font-bold">{t("tutorials.whyTheseCourses")}</h3>
          <p className="text-muted-foreground leading-relaxed">
            {t("tutorials.whyTheseCoursesDesc")}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};