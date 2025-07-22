import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Plus, Zap } from "lucide-react";
import { CartItem } from "@/types/cart";

interface PreampsStepProps {
  addItem: (item: CartItem) => void;
  removeItem: (itemId: string) => void;
  hasItem: (itemId: string) => boolean;
}

export const PreampsStep = ({ addItem, removeItem, hasItem }: PreampsStepProps) => {
  const proPreampsPack: CartItem = {
    id: 'preamps-pro',
    name: 'Pack Previos Pro: API, Neve y DAD',
    price: 19.90,
    category: 'Previos',
    description: 'Previos analógicos premium para un sonido vintage y profesional'
  };

  const isProSelected = hasItem(proPreampsPack.id);

  const handleTogglePro = () => {
    if (isProSelected) {
      removeItem(proPreampsPack.id);
    } else {
      addItem(proPreampsPack);
    }
  };

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="text-center space-y-6">
        <h2 className="text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          ⚡ Previos de Audio
        </h2>
        <p className="text-muted-foreground text-xl max-w-3xl mx-auto leading-relaxed">
          El alma de tu sonido. Elige entre nuestros previos incluidos o mejora con los legendarios API, Neve y DAD.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
        {/* Basic Preamps */}
        <Card className="bg-gradient-to-br from-card to-muted border-success/30 hover:shadow-xl transition-all duration-300">
          <CardHeader className="pb-6">
            <div className="flex items-center justify-between mb-4">
              <CardTitle className="flex items-center gap-3 text-2xl">
                <Check className="h-8 w-8 text-success" />
                Kit Básico
              </CardTitle>
              <Badge variant="secondary" className="text-lg px-4 py-2">INCLUIDO</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="w-full h-32 flex items-center justify-center bg-muted/30 rounded-lg mb-4">
              <img 
                src="/lovable-uploads/336b755e-679f-4c19-9325-3c4f0e952191.png" 
                alt="Focusrite Interface"
                className="max-h-28 max-w-full object-contain bg-transparent"
                style={{ filter: 'drop-shadow(0 0 10px rgba(0,0,0,0.1))' }}
              />
            </div>
            
            <div className="flex items-center gap-4 p-4 bg-success/10 rounded-lg">
              <div className="w-16 h-16 bg-success/20 rounded-full flex items-center justify-center">
                <Zap className="h-10 w-10 text-success" />
              </div>
              <div>
                <h3 className="font-bold text-xl">Focusrite OctoPre</h3>
                <p className="text-muted-foreground">8 canales profesionales limpios</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-bold text-lg">✓ Lo que obtienes:</h4>
              <ul className="text-muted-foreground space-y-3 text-base">
                <li>• <strong>Sonido limpio</strong> y transparente</li>
                <li>• <strong>Respuesta plana</strong> ideal para mezcla</li>
                <li>• <strong>Sin ruido</strong> ni distorsión</li>
                <li>• <strong>Perfecto</strong> para tu primera grabación</li>
              </ul>
            </div>

            <div className="pt-4">
              <div className="flex items-center justify-center gap-2 bg-success/20 px-4 py-3 rounded-full">
                <Check className="h-5 w-5 text-success" />
                <span className="text-success font-bold text-lg">YA INCLUIDO</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pro Preamps */}
        <Card 
          className={`transition-all duration-300 hover:shadow-xl cursor-pointer transform hover:scale-105 ${
            isProSelected 
              ? 'bg-gradient-to-br from-primary/20 to-accent/20 border-primary shadow-xl scale-105' 
              : 'bg-gradient-to-br from-card to-muted hover:border-primary/50'
          }`}
          onClick={handleTogglePro}
        >
          <CardHeader className="pb-6">
            <div className="flex items-center justify-between mb-4">
              <CardTitle className="flex items-center gap-3 text-2xl">
                <Plus className="h-8 w-8 text-primary" />
                Premium
              </CardTitle>
              <Badge variant="outline" className="text-primary text-lg px-4 py-2 font-bold">+€19.90</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="w-full h-32 flex items-center justify-center bg-muted/30 rounded-lg mb-4">
              <img 
                src="/lovable-uploads/5fc42764-3380-4942-8c16-c462d1961fae.png" 
                alt="API Neve DAD Preamps"
                className="max-h-28 max-w-full object-contain bg-transparent"
                style={{ filter: 'drop-shadow(0 0 10px rgba(0,0,0,0.1))' }}
              />
            </div>
            
            <div className="flex items-center gap-4 p-4 bg-primary/10 rounded-lg">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
                <Zap className="h-10 w-10 text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-xl">Pack Previos Legendarios</h3>
                <p className="text-muted-foreground">API, Neve y DAD</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-bold text-lg">🏆 El sonido de los hits:</h4>
              <ul className="text-muted-foreground space-y-3 text-base">
                <li>• <strong className="text-primary">API:</strong> Punch y presencia únicos</li>
                <li>• <strong className="text-primary">Neve:</strong> Calidez vintage legendaria</li>
                <li>• <strong className="text-primary">DAD:</strong> Precisión digital premium</li>
                <li>• <strong>Usado en</strong> discos de platino</li>
              </ul>
            </div>

            <Button
              variant={isProSelected ? "default" : "upgrade"}
              size="lg"
              className="w-full h-14 text-lg font-bold"
              onClick={(e) => {
                e.stopPropagation();
                handleTogglePro();
              }}
            >
              {isProSelected ? (
                <>
                  <Check className="h-6 w-6 mr-2" />
                  ✨ AÑADIDO AL CARRITO
                </>
              ) : (
                <>
                  <Plus className="h-6 w-6 mr-2" />
                  UPGRADE POR €19.90
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};