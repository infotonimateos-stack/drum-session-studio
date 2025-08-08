import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import protoolsImage from "@/assets/protools-tracks-hero.jpg";
export const SamplesTab = () => {
  const downloadUrl = "https://we.tl/t-j7ZNfBPKex";
  return <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Descarga nuestras pistas de muestra</h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">Mézclalas en tu estudio y comprueba la calidad de nuestras grabaciones</p>
      </div>

      <div className="max-w-4xl mx-auto">
        <img src={protoolsImage} alt="Imagen hiperrealista de una sesión de Pro Tools con pistas de colores - muestras de batería" className="w-full rounded-xl shadow-xl" loading="lazy" />
      </div>

      {/* Se eliminó la cuadrícula de estilos para dejar solo la descarga del pack */}

      {/* Download All */}
      <div className="text-center">
        <Card className="bg-gradient-to-br from-card to-muted max-w-md mx-auto">
          <CardContent className="p-6 space-y-4">
            <h3 className="text-lg font-semibold">Descarga las pistas de muestra</h3>
            <p className="text-sm text-muted-foreground">Descarga las pistas en alta calidad (24-bit/48kHz)</p>
            <Button variant="upgrade" className="w-full" asChild>
              <a href={downloadUrl} target="_blank" rel="noopener noreferrer">
                <Download className="h-4 w-4 mr-2" />
                Descargar pistas de muestra
              </a>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>;
};