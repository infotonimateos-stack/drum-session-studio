import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Plus, Play, Copy, User } from "lucide-react";
import { CartItem } from "@/types/cart";
interface TakesStepProps {
  addItem: (item: CartItem) => void;
  removeItem: (itemId: string) => void;
  hasItem: (itemId: string) => boolean;
}
export const TakesStep = ({
  addItem,
  removeItem,
  hasItem
}: TakesStepProps) => {
  const exactCopyTake: CartItem = {
    id: 'take-exact-copy',
    name: 'Copia Exacta de tu Demo',
    price: 24.90,
    category: 'Tomas',
    description: 'Recreación fiel de tu demo con todos los detalles'
  };
  const toniInterpretation: CartItem = {
    id: 'take-toni-interpretation',
    name: 'Interpretación de Toni Mateos',
    price: 19.90,
    category: 'Tomas',
    description: 'Una toma adicional con la interpretación personal de Toni'
  };
  const isExactCopySelected = hasItem(exactCopyTake.id);
  const isToniSelected = hasItem(toniInterpretation.id);
  const handleToggleExactCopy = () => {
    if (isExactCopySelected) {
      removeItem(exactCopyTake.id);
    } else {
      addItem(exactCopyTake);
    }
  };
  const handleToggleToni = () => {
    if (isToniSelected) {
      removeItem(toniInterpretation.id);
    } else {
      addItem(toniInterpretation);
    }
  };
  return <div className="space-y-8 bg-gradient-to-br from-warm-cream/30 to-warm-blush/20 rounded-xl p-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent flex items-center justify-center gap-3">
          <img src="/lovable-uploads/21a8aa74-64cd-41c0-810e-3ce0ac3d388a.png" alt="Folder icon" className="w-12 h-12" />
          Número de Tomas
        </h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Decide cuántas versiones quieres de tu canción. Cada toma aporta una perspectiva única.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Basic Take */}
        <Card className="bg-gradient-to-br from-card to-muted border-success/30">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Check className="h-5 w-5 text-success" />
                Básico
              </CardTitle>
              <Badge variant="secondary">Incluido</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Play className="h-8 w-8 text-success" />
              <div>
                <h3 className="font-semibold">1 Toma Estándar</h3>
                <p className="text-sm text-muted-foreground">Versión profesional basada en tu demo</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Características:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Interpretación profesional</li>
                <li>• Basada en tu demo (parecida, pero no idéntica)</li>
                <li>• Sonido equilibrado</li>
              </ul>
            </div>

            <div className="pt-4">
              <div className="flex items-center gap-1">
                <Check className="h-4 w-4 text-success" />
                <span className="text-sm text-success font-medium">Incluido en kit básico</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Exact Copy */}
        <Card className={`transition-all duration-300 hover:shadow-lg cursor-pointer ${isExactCopySelected ? 'bg-gradient-to-br from-primary/20 to-accent/20 border-primary shadow-lg' : 'bg-gradient-to-br from-card to-muted hover:border-primary/50'}`} onClick={handleToggleExactCopy}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Copy className="h-5 w-5 text-primary" />
                Copia Exacta
              </CardTitle>
              <Badge variant="outline" className="text-primary font-bold whitespace-nowrap">+€24.90</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Características:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Recreación fiel de tu demo</li>
                <li>• Cada fill idéntico al original</li>
                <li>• Mismo feeling y groove</li>
                <li>• Respeta todos los matices</li>
                <li>• Para proyectos profesionales</li>
              </ul>
            </div>

            <Button variant={isExactCopySelected ? "default" : "upgrade"} className="w-full h-10" onClick={e => {
            e.stopPropagation();
            handleToggleExactCopy();
          }}>
              {isExactCopySelected ? <>
                  <Check className="h-4 w-4 mr-2" />
                  Añadido
                </> : <>
                  <Plus className="h-4 w-4 mr-2" />
                  Añadir €24.90
                </>}
            </Button>
          </CardContent>
        </Card>

        {/* Toni's Interpretation */}
        <Card className={`transition-all duration-300 hover:shadow-lg cursor-pointer ${isToniSelected ? 'bg-gradient-to-br from-primary/20 to-accent/20 border-primary shadow-lg' : 'bg-gradient-to-br from-card to-muted hover:border-primary/50'}`} onClick={handleToggleToni}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                Interpretación Pro
              </CardTitle>
              <Badge variant="outline" className="text-primary font-bold whitespace-nowrap">+€19.90</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Características:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Versión Toni Mateos</li>
                <li>• Interpretación creativa</li>
                <li>• Fills y variaciones únicas</li>
                <li>• Combínala con otras opciones</li>
                <li>• Puede mejorar tu canción</li>
              </ul>
            </div>

            <div className="p-3 bg-primary/10 rounded-lg">
              <p className="text-xs text-primary font-medium">
                🎵 Recomendado: Dos perspectivas de tu canción
              </p>
            </div>

            <Button variant={isToniSelected ? "default" : "upgrade"} className="w-full h-10" onClick={e => {
            e.stopPropagation();
            handleToggleToni();
          }}>
              {isToniSelected ? <>
                  <Check className="h-4 w-4 mr-2" />
                  Añadido
                </> : <>
                  <Plus className="h-4 w-4 mr-2" />
                  Añadir €19.90
                </>}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>;
};