import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Clock, DollarSign, Globe, Video, ShoppingCart, ExternalLink } from "lucide-react";
import { useTranslate } from "@/hooks/useTranslate";

export const TutorialsTab = () => {
  const tr = useTranslate();
  
  const curso = {
    id: "mezcla-avanzada",
    title: "CURSO AVANZADO DE MEZCLA DE BATERÍAS",
    instructor: "Luis del Toro",
    duration: "1h 45min",
    format: "Video descargable",
    styles: ["Pop", "World Music"],
    price: {
      eur: "19,90 €",
      usd: "20,94 USD",
      cop: "100.200 pesos colombianos",
      mxn: "400 pesos mexicanos"
    },
    description: "Consigue los resultados profesionales que esperabas con este curso completo de mezcla de baterías.",
    url: "https://store.payloadz.com/details/2677048-music-other-curso-avanzado-mezcla-de-baterias.html"
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Curso de Mezcla
        </h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Aprende técnicas profesionales de mezcla de baterías con resultados garantizados
        </p>
      </div>

      {/* Curso Principal */}
      <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20 max-w-4xl mx-auto">
        <CardContent className="p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <div className="aspect-square bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl flex items-center justify-center border border-primary/30">
                <img 
                  src="/lovable-uploads/47653ee7-a23b-4807-80f6-1f266435b83a.png" 
                  alt="Curso Avanzado de Mezcla de Baterías"
                  className="w-full h-full object-cover rounded-2xl"
                />
              </div>
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-3xl font-black text-primary mb-2">{curso.title}</h3>
                <p className="text-lg text-accent font-semibold">Impartido por {curso.instructor}</p>
              </div>
              
              <p className="text-lg text-muted-foreground leading-relaxed">
                {curso.description}
              </p>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  <span className="font-semibold">{curso.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Video className="h-5 w-5 text-primary" />
                  <span className="font-semibold">{curso.format}</span>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-accent" />
                  <span className="font-semibold">Dos estilos diferentes:</span>
                </div>
                <div className="flex gap-2">
                  {curso.styles.map((style) => (
                    <Badge key={style} variant="outline" className="bg-accent/10 text-accent border-accent/30">
                      {style}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-muted to-card p-6 rounded-2xl border border-border/50">
                <div className="flex items-center gap-2 mb-3">
                  <DollarSign className="h-5 w-5 text-success" />
                  <span className="font-bold text-lg">Precios:</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="font-semibold">{curso.price.eur}</div>
                  <div className="font-semibold">{curso.price.usd}</div>
                  <div className="text-xs text-muted-foreground">{curso.price.cop}</div>
                  <div className="text-xs text-muted-foreground">{curso.price.mxn}</div>
                </div>
              </div>
              
              <Button 
                variant="upgrade" 
                size="lg" 
                className="w-full gap-3" 
                onClick={() => window.open(curso.url, '_blank')}
              >
                <ShoppingCart className="h-5 w-5" />
                Comprar Curso
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Información adicional */}
      <Card className="bg-gradient-to-br from-card to-muted max-w-2xl mx-auto">
        <CardContent className="p-8 text-center space-y-4">
          <h3 className="text-2xl font-bold">¿Por qué este curso?</h3>
          <p className="text-muted-foreground leading-relaxed">
            Luis del Toro es uno de los ingenieros de mezcla más reconocidos en la industria musical. 
            Con años de experiencia trabajando con los mejores artistas, este curso te dará las herramientas 
            para conseguir mezclas profesionales de batería.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};