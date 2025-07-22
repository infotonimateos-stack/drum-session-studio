import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Play, Pause, Music, Headphones } from "lucide-react";
import { useState } from "react";

export const SamplesTab = () => {
  const [playingTrack, setPlayingTrack] = useState<string | null>(null);

  const samples = [
    {
      id: "rock-ballad",
      title: "Rock Ballad",
      genre: "Rock",
      bpm: "75 BPM",
      description: "Balada rock emotiva con dinámicas suaves y explosivas",
      equipment: ["Neumann U87", "API 3124+", "Neve 1073"]
    },
    {
      id: "indie-pop",
      title: "Indie Pop",
      genre: "Indie",
      bpm: "120 BPM", 
      description: "Groove moderno con texturas vintage y feeling relajado",
      equipment: ["AKG 414", "DAD AX64", "Coles 4038"]
    },
    {
      id: "alternative-rock",
      title: "Alternative Rock",
      genre: "Alternative",
      bpm: "140 BPM",
      description: "Energía potente con fills creativos y sonido moderno",
      equipment: ["Shure SM57", "Beta 52", "U47 FET"]
    },
    {
      id: "acoustic-folk",
      title: "Acoustic Folk",
      genre: "Folk",
      bpm: "90 BPM",
      description: "Percusión sutil y orgánica que complementa la guitarra acústica",
      equipment: ["KM184", "Ribbon Mics", "Vintage Preamps"]
    }
  ];

  const handlePlayPause = (trackId: string) => {
    if (playingTrack === trackId) {
      setPlayingTrack(null);
    } else {
      setPlayingTrack(trackId);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Descarga Muestras
        </h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Escucha ejemplos de mi trabajo en diferentes géneros musicales
        </p>
      </div>

      {/* Info Card */}
      <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Headphones className="h-6 w-6 text-primary" />
            <h3 className="text-lg font-semibold">Calidad Profesional</h3>
          </div>
          <p className="text-muted-foreground">
            Todas las muestras están grabadas con el mismo equipamiento y proceso que utilizaré 
            para tu proyecto. Descarga gratis y experimenta la calidad de sonido que obtendrás.
          </p>
        </CardContent>
      </Card>

      {/* Samples Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {samples.map((sample) => (
          <Card key={sample.id} className="bg-gradient-to-br from-card to-muted hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Music className="h-5 w-5 text-primary" />
                  {sample.title}
                </CardTitle>
                <div className="flex gap-2">
                  <Badge variant="outline">{sample.genre}</Badge>
                  <Badge variant="secondary">{sample.bpm}</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                {sample.description}
              </p>
              
              {/* Equipment Used */}
              <div className="space-y-2">
                <h4 className="text-sm font-semibold">Equipamiento utilizado:</h4>
                <div className="flex flex-wrap gap-1">
                  {sample.equipment.map((item) => (
                    <Badge key={item} variant="outline" className="text-xs">
                      {item}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Controls */}
              <div className="flex gap-2 pt-2">
                <Button
                  variant="upgrade"
                  size="sm"
                  className="flex-1"
                  onClick={() => handlePlayPause(sample.id)}
                >
                  {playingTrack === sample.id ? (
                    <>
                      <Pause className="h-4 w-4 mr-2" />
                      Pausar
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      Reproducir
                    </>
                  )}
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Descargar
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Download All */}
      <div className="text-center">
        <Card className="bg-gradient-to-br from-card to-muted max-w-md mx-auto">
          <CardContent className="p-6 space-y-4">
            <h3 className="text-lg font-semibold">Pack Completo</h3>
            <p className="text-sm text-muted-foreground">
              Descarga todas las muestras en alta calidad (24-bit/48kHz)
            </p>
            <Button variant="upgrade" className="w-full">
              <Download className="h-4 w-4 mr-2" />
              Descargar Pack Completo
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};