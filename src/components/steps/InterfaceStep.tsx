import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Plus, Cpu } from "lucide-react";
import { CartItem } from "@/types/cart";
interface InterfaceStepProps {
  addItem: (item: CartItem) => void;
  removeItem: (itemId: string) => void;
  hasItem: (itemId: string) => boolean;
}
export const InterfaceStep = ({
  addItem,
  removeItem,
  hasItem
}: InterfaceStepProps) => {
  const dadInterface: CartItem = {
    id: 'interface-dad',
    name: 'DAD AX64',
    price: 6.99,
    category: 'Interface',
    description: 'Interface de audio profesional con convertidores premium'
  };
  const isDadSelected = hasItem(dadInterface.id);
  const handleToggleDad = () => {
    if (isDadSelected) {
      removeItem(dadInterface.id);
    } else {
      addItem(dadInterface);
    }
  };
  return <div className="space-y-12 bg-gradient-to-br from-warm-apricot/25 to-warm-cream/20 rounded-xl p-8">
      {/* Header */}
      <div className="text-center space-y-6">
        <h2 className="text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent flex items-center justify-center gap-4">
          <img src="/lovable-uploads/f357eff5-387e-41d8-bacb-0f54d7d8eadd.png" alt="Interface" className="w-12 h-12" />
          Interface de Audio
        </h2>
        <p className="text-muted-foreground text-xl max-w-3xl mx-auto leading-relaxed">
          La puerta entre el mundo analógico y digital. La calidad del convertidor define tu sonido final.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
        {/* Basic Interface */}
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
              <img src="/lovable-uploads/93445061-0c3b-4d86-a30f-15ff4b018154.png" alt="MOTU 8Pre Interface" className="max-h-28 max-w-full object-contain bg-transparent" style={{
              filter: 'drop-shadow(0 0 10px rgba(0,0,0,0.1))'
            }} />
            </div>
            
            <div className="flex items-center gap-4 p-4 bg-success/10 rounded-lg">
              <div className="w-16 h-16 bg-success/20 rounded-full flex items-center justify-center">
                <Cpu className="h-10 w-10 text-success" />
              </div>
              <div>
                <h3 className="font-bold text-xl">MOTU 8Pre</h3>
                <p className="text-muted-foreground">Interface ADAT de 8 canales</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-bold text-lg">✓ Características:</h4>
              <ul className="text-muted-foreground space-y-3 text-base">
                <li>• <strong>24-bit / 192kHz</strong> máxima resolución</li>
                <li>• <strong>Convertidores</strong> estándar profesionales</li>
                <li>• <strong>Conexión ADAT</strong> estable</li>
                <li>• <strong>Perfecto</strong> para proyectos básicos</li>
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

        {/* Premium Interface */}
        <Card className={`transition-all duration-300 hover:shadow-xl cursor-pointer transform hover:scale-105 ${isDadSelected ? 'bg-gradient-to-br from-primary/20 to-accent/20 border-primary shadow-xl scale-105' : 'bg-gradient-to-br from-card to-muted hover:border-primary/50'}`} onClick={handleToggleDad}>
          <CardHeader className="pb-6">
            <div className="flex items-center justify-between mb-4">
              <CardTitle className="flex items-center gap-3 text-2xl">
                <Plus className="h-8 w-8 text-primary" />
                Premium
              </CardTitle>
              <Badge variant="outline" className="text-primary text-lg px-4 py-2 font-bold">+€6.99</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="w-full h-32 flex items-center justify-center bg-muted/30 rounded-lg mb-4">
              <img src="/lovable-uploads/f357eff5-387e-41d8-bacb-0f54d7d8eadd.png" alt="DAD AX64 Interface" className="max-h-28 max-w-full object-contain bg-transparent" style={{
              filter: 'drop-shadow(0 0 10px rgba(0,0,0,0.1))'
            }} />
            </div>
            
            <div className="flex items-center gap-4 p-4 bg-primary/10 rounded-lg">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
                <Cpu className="h-10 w-10 text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-xl">DAD AX64</h3>
                <p className="text-muted-foreground">Interface premium profesional</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-bold text-lg">🏆 Especificaciones premium:</h4>
              <ul className="text-muted-foreground space-y-3 text-base">
                <li>• <strong className="text-primary">32-bit / 384kHz</strong> - Máxima resolución</li>
                <li>• <strong className="text-primary">Convertidores premium</strong> DAD</li>
                <li>• <strong className="text-primary">Rango dinámico</strong> excepcional</li>
                <li>• <strong>Usado en</strong> estudios de élite mundial</li>
              </ul>
            </div>

            <div className="p-4 bg-primary/20 rounded-lg">
              <p className="text-primary font-bold text-center">
                🚀 Mejora drástica en claridad y definición
              </p>
            </div>

            <Button variant={isDadSelected ? "default" : "upgrade"} size="lg" className="w-full h-14 text-lg font-bold" onClick={e => {
            e.stopPropagation();
            handleToggleDad();
          }}>
              {isDadSelected ? <>
                  <Check className="h-6 w-6 mr-2" />
                  ✨ AÑADIDO AL CARRITO
                </> : <>
                  <Plus className="h-6 w-6 mr-2" />
                  UPGRADE POR €6.99
                </>}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>;
};