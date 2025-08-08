import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Clock, Eye, Book } from "lucide-react";
import { useTranslate } from "@/hooks/useTranslate";

export const TutorialsTab = () => {
  const tr = useTranslate();
  const tutorials = [
    {
      id: "recording-tips",
      title: "Cómo Preparar tu Demo para Grabación",
      duration: "12:34",
      views: "15.2K",
      level: "Principiante",
      description: "Aprende los elementos esenciales que debe tener tu demo para obtener la mejor grabación de batería posible."
    },
    {
      id: "microphone-setup",
      title: "Setup de Micrófonos para Batería",
      duration: "18:45",
      views: "8.7K",
      level: "Intermedio",
      description: "Tour completo por mi configuración de micrófonos y cómo cada uno aporta al sonido final."
    },
    {
      id: "mixing-drums",
      title: "Fundamentos de Mezcla de Batería",
      duration: "25:18",
      views: "22.1K",
      level: "Avanzado",
      description: "Técnicas profesionales de mezcla que uso para darle vida y punch a las grabaciones de batería."
    },
    {
      id: "groove-analysis",
      title: "Análisis de Groove en Diferentes Géneros",
      duration: "16:22",
      views: "11.8K",
      level: "Intermedio",
      description: "Desgloso cómo adapto mi interpretación a diferentes estilos musicales para servir mejor a la canción."
    },
    {
      id: "home-studio",
      title: "Optimizar tu Home Studio para Batería",
      duration: "14:56",
      views: "9.3K",
      level: "Principiante",
      description: "Consejos prácticos para mejorar el sonido de tu batería en espacios domésticos."
    },
    {
      id: "collaboration",
      title: "Colaboración Remota Efectiva",
      duration: "11:12",
      views: "6.4K",
      level: "Principiante",
      description: "Mejores prácticas para trabajar de forma remota y comunicar tus ideas musicales efectivamente."
    }
  ];

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Principiante": return "bg-success/20 text-success";
      case "Intermedio": return "bg-primary/20 text-primary";
      case "Avanzado": return "bg-accent/20 text-accent";
      default: return "bg-muted";
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          {tr("Tutoriales")}
        </h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          {tr("Aprende técnicas profesionales de grabación, mezcla y producción de batería")}
        </p>
      </div>

      {/* Featured Tutorial */}
      <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Book className="h-6 w-6 text-primary" />
            <h3 className="text-lg font-semibold">{tr("Tutorial Destacado")}</h3>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
            <div className="space-y-3">
              <h4 className="text-xl font-bold">{tr(tutorials[2].title)}</h4>
              <p className="text-muted-foreground">{tr(tutorials[2].description)}</p>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {tutorials[2].duration}
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  {tutorials[2].views} {tr("visualizaciones")}
                </div>
                <Badge className={getLevelColor(tutorials[2].level)}>
                  {tr(tutorials[2].level)}
                </Badge>
              </div>
            </div>
            <div className="text-center lg:text-right">
              <Button variant="upgrade" size="lg" className="gap-2">
                <Play className="h-5 w-5" />
                Ver Tutorial
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tutorials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tutorials.map((tutorial) => (
          <Card key={tutorial.id} className="bg-gradient-to-br from-card to-muted hover:shadow-lg transition-all duration-300 group">
            <CardHeader className="pb-4">
              <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg flex items-center justify-center mb-3 group-hover:scale-105 transition-transform duration-300">
                <Play className="h-12 w-12 text-primary" />
              </div>
              <CardTitle className="text-lg leading-tight">{tutorial.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground line-clamp-3">
                {tutorial.description}
              </p>
              
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {tutorial.duration}
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="h-3 w-3" />
                  {tutorial.views}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Badge className={getLevelColor(tutorial.level)}>
                  {tutorial.level}
                </Badge>
                <Button variant="outline" size="sm" className="gap-2">
                  <Play className="h-3 w-3" />
                  Ver
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Subscribe CTA */}
      <Card className="bg-gradient-to-br from-card to-muted">
        <CardContent className="p-8 text-center space-y-4">
          <h3 className="text-2xl font-bold">¿Quieres más contenido?</h3>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Suscríbete a mi canal de YouTube para recibir tutoriales semanales sobre técnicas 
            de grabación, tips de producción y análisis de canciones famosas.
          </p>
          <Button variant="upgrade" size="lg" className="gap-2">
            <Play className="h-5 w-5" />
            Suscribirse al Canal
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};