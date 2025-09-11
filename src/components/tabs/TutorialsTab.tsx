import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Clock, DollarSign, Globe, Video, ShoppingCart, ExternalLink } from "lucide-react";
import { useTranslate } from "@/hooks/useTranslate";

export const TutorialsTab = () => {
  const tr = useTranslate();
  
  const cursos = [
    {
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
      url: "https://store.payloadz.com/details/2677048-music-other-curso-avanzado-mezcla-de-baterias.html",
      image: "/lovable-uploads/47653ee7-a23b-4807-80f6-1f266435b83a.png"
    },
    {
      id: "grabacion-baterias",
      title: "CURSO DE GRABACIÓN DE BATERÍAS",
      instructor: "Luis del Toro",
      duration: "40 minutos",
      format: "Video MP4",
      microphones: ["2 micrófonos", "3 micrófonos", "4 micrófonos", "6 micrófonos", "8 micrófonos", "11 micrófonos"],
      price: {
        usd: "12 USD",
        cop: "44K pesos colombianos",
        mxn: "235 pesos mexicanos",
        ars: "1140 pesos argentinos",
        clp: "9280 pesos chilenos",
        other: "otras monedas disponibles"
      },
      description: "Aprende a grabar baterías de manera profesional, incluso con pocos micrófonos.",
      url: "https://store.payloadz.com/details/2666816-music-popular-curso-grabacion-de-baterias.html",
      image: "/lovable-uploads/be94b2c6-9a7e-4eb4-bafc-5059556359a3.png"
    },
    {
      id: "mezcla-baterias",
      title: "CURSO DE MEZCLA DE BATERÍAS",
      instructor: "Alex Carretero",
      duration: "101 minutos",
      format: "Video MP4",
      content: [
        "Pistas de batería gratuitas",
        "Estructura de ganancias", 
        "Fase y Polaridad",
        "Panorama",
        "Bleeding",
        "Bombo IN, OUT, SUBKICK",
        "Snare TOP+BOTTOM",
        "Overheads",
        "Toms",
        "Room",
        "Hi hat y Ride",
        "Subgrupo, Master, Print"
      ],
      price: {
        eur: "9,90 €",
        usd: "12 USD",
        cop: "44K pesos colombianos",
        mxn: "235 pesos mexicanos",
        ars: "1140 pesos argentinos",
        clp: "9280 pesos chilenos",
        other: "otras monedas disponibles"
      },
      description: "Aprende a mezclar tus baterías de manera profesional, y lleva tu música a otro nivel.",
      url: "#",
      image: "/lovable-uploads/be94b2c6-9a7e-4eb4-bafc-5059556359a3.png"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Cursos Profesionales
        </h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Aprende técnicas profesionales de grabación y mezcla de baterías con expertos de la industria
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
                    alt={curso.title}
                    className="w-full h-full object-cover rounded-2xl"
                  />
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-2xl font-black text-primary mb-2">{curso.title}</h3>
                    <p className="text-lg text-accent font-semibold">Impartido por {curso.instructor}</p>
                  </div>
                  
                  <p className="text-muted-foreground leading-relaxed">
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
                  
                  {/* Contenido específico por curso */}
                  {curso.styles && (
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
                  )}
                  
                  {curso.microphones && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Video className="h-5 w-5 text-accent" />
                        <span className="font-semibold">Aprende a grabar con:</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {curso.microphones.map((mic) => (
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
                        <span className="font-semibold">Contenido del curso:</span>
                      </div>
                      <div className="grid grid-cols-1 gap-2">
                        {curso.content.map((item) => (
                          <div key={item} className="flex items-center gap-2 text-sm">
                            <span className="text-success">✅</span>
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="bg-gradient-to-r from-muted to-card p-6 rounded-2xl border border-border/50">
                    <div className="flex items-center gap-2 mb-3">
                      <DollarSign className="h-5 w-5 text-success" />
                      <span className="font-bold text-lg">Precios:</span>
                    </div>
                    <div className="space-y-1 text-sm">
                      {curso.price.eur && <div className="font-semibold">{curso.price.eur}</div>}
                      {curso.price.usd && <div className="font-semibold">{curso.price.usd}</div>}
                      {curso.price.cop && <div className="text-muted-foreground">{curso.price.cop}</div>}
                      {curso.price.mxn && <div className="text-muted-foreground">{curso.price.mxn}</div>}
                      {curso.price.ars && <div className="text-muted-foreground">{curso.price.ars}</div>}
                      {curso.price.clp && <div className="text-muted-foreground">{curso.price.clp}</div>}
                      {curso.price.other && <div className="text-xs text-muted-foreground italic">{curso.price.other}</div>}
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
        ))}
      </div>

      {/* Información adicional */}
      <Card className="bg-gradient-to-br from-card to-muted max-w-3xl mx-auto">
        <CardContent className="p-8 text-center space-y-4">
          <h3 className="text-2xl font-bold">¿Por qué estos cursos?</h3>
          <p className="text-muted-foreground leading-relaxed">
            Luis del Toro es uno de los ingenieros de mezcla y grabación más reconocidos en la industria musical. 
            Con años de experiencia trabajando con los mejores artistas, estos cursos te darán las herramientas 
            para conseguir grabaciones y mezclas profesionales de batería, sin importar tu nivel o equipo.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};