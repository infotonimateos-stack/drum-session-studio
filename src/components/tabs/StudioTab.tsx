import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building, Headphones, Zap, Shield } from "lucide-react";

export const StudioTab = () => {
  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          El Estudio
        </h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Un espacio diseñado específicamente para capturar el mejor sonido de batería
        </p>
      </div>

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
                  <p className="text-sm text-muted-foreground">
                    Sala tratada acústicamente con paneles específicos para batería
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Headphones className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <h4 className="font-semibold">Monitoreo de Alta Gama</h4>
                  <p className="text-sm text-muted-foreground">
                    Monitores Yamaha HS8 y auriculares de referencia
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Zap className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <h4 className="font-semibold">Cadena de Audio Premium</h4>
                  <p className="text-sm text-muted-foreground">
                    Previos API, Neve y DAD con convertidores de última generación
                  </p>
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
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <h4 className="font-semibold text-sm mb-2">Micrófonos</h4>
                <div className="flex flex-wrap gap-1">
                  <Badge variant="outline" className="text-xs">Neumann U87</Badge>
                  <Badge variant="outline" className="text-xs">AKG 414</Badge>
                  <Badge variant="outline" className="text-xs">Shure SM57</Badge>
                  <Badge variant="outline" className="text-xs">Coles 4038</Badge>
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-sm mb-2">Previos</h4>
                <div className="flex flex-wrap gap-1">
                  <Badge variant="outline" className="text-xs">API 3124+</Badge>
                  <Badge variant="outline" className="text-xs">Neve 1073</Badge>
                  <Badge variant="outline" className="text-xs">DAD AX64</Badge>
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-sm mb-2">Software</h4>
                <div className="flex flex-wrap gap-1">
                  <Badge variant="outline" className="text-xs">Pro Tools HDX</Badge>
                  <Badge variant="outline" className="text-xs">Logic Pro X</Badge>
                  <Badge variant="outline" className="text-xs">Plugins UAD</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Process */}
      <Card className="bg-gradient-to-br from-card to-muted">
        <CardHeader>
          <CardTitle>Proceso de Grabación</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center space-y-3">
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
                <span className="text-primary font-bold">1</span>
              </div>
              <h4 className="font-semibold">Análisis</h4>
              <p className="text-sm text-muted-foreground">
                Estudio tu demo y referencias para entender el sonido que buscas
              </p>
            </div>
            <div className="text-center space-y-3">
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
                <span className="text-primary font-bold">2</span>
              </div>
              <h4 className="font-semibold">Configuración</h4>
              <p className="text-sm text-muted-foreground">
                Selecciono y configuro los micrófonos y equipos específicos
              </p>
            </div>
            <div className="text-center space-y-3">
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
                <span className="text-primary font-bold">3</span>
              </div>
              <h4 className="font-semibold">Grabación</h4>
              <p className="text-sm text-muted-foreground">
                Grabo las tomas necesarias con la máxima calidad y atención al detalle
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};