import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Plus, Headphones } from "lucide-react";
import { baseMicrophones, upgradeMicrophones } from "@/data/microphones";
import { CartItem } from "@/types/cart";
interface MicrophonesStepProps {
  addItem: (item: CartItem) => void;
  removeItem: (itemId: string) => void;
  hasItem: (itemId: string) => boolean;
}
export const MicrophonesStep = ({
  addItem,
  removeItem,
  hasItem
}: MicrophonesStepProps) => {
  const handleToggleItem = (microphone: any) => {
    const cartItem: CartItem = {
      id: microphone.id,
      name: microphone.name,
      price: microphone.price,
      category: "Micrófono",
      description: `${microphone.description} - ${microphone.target}`
    };
    if (hasItem(microphone.id)) {
      removeItem(microphone.id);
    } else {
      addItem(cartItem);
    }
  };
  return <div className="space-y-12 bg-gradient-to-br from-warm-cream/20 to-warm-peach/10 rounded-xl p-8">
      {/* Header */}
      <div className="text-center space-y-6">
            <h2 className="text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              🎤 Micrófonos
            </h2>
            <p className="text-muted-foreground text-xl max-w-3xl mx-auto leading-relaxed">
              Incluye 8 micrófonos profesionales. Añade mejoras premium para lograr un sonido excepcional.
            </p>
      </div>

      {/* Included Microphones */}
      <div className="space-y-6">
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className="flex items-center gap-3 bg-success/20 px-6 py-3 rounded-full">
            <Check className="h-6 w-6 text-success" />
            <h3 className="text-2xl font-bold">Kit Básico Incluido</h3>
            <Badge variant="secondary" className="text-2xl px-5 py-2">€49.90</Badge>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {baseMicrophones.map(mic => <Card key={mic.id} className="bg-gradient-to-br from-card/50 to-muted/30 border-success/30 hover:shadow-xl transition-all duration-300">
              <CardHeader className="pb-4">
                <Badge variant="outline" className="border-success text-success mb-3 self-center text-sm px-3 py-1">
                  {mic.target}
                </Badge>
                {mic.image && <div className="w-full h-32 flex items-center justify-center bg-white rounded-lg">
                     <img src={mic.image} alt={mic.name} className="max-h-28 max-w-full object-contain rounded-lg p-2" />
                   </div>}
              </CardHeader>
              <CardContent className="pt-0">
                <h4 className="font-bold text-base mb-2 text-center">{mic.name}</h4>
                <div className="flex items-center justify-center gap-2 mt-3">
                  <Check className="h-4 w-4 text-success" />
                  <span className="text-sm text-success font-bold">INCLUIDO</span>
                </div>
              </CardContent>
            </Card>)}
        </div>
      </div>

      {/* Upgrade Microphones */}
      <div className="space-y-6">
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className="flex items-center gap-3 bg-primary/20 px-6 py-3 rounded-full">
            <Plus className="h-6 w-6 text-primary" />
            <h3 className="text-2xl font-bold">Mejoras Premium</h3>
            <Badge variant="outline" className="text-lg px-3 py-1">Opcional</Badge>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {upgradeMicrophones.map(mic => {
          const isSelected = hasItem(mic.id);
          return <Card key={mic.id} className={`transition-all duration-300 hover:shadow-xl cursor-pointer transform hover:scale-105 ${isSelected ? 'bg-gradient-to-br from-primary/20 to-accent/20 border-primary shadow-xl scale-105' : 'bg-gradient-to-br from-card to-muted hover:border-primary/50'}`} onClick={() => handleToggleItem(mic)}>
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between mb-4">
                    <Badge variant="outline" className="text-sm px-3 py-1">
                      {mic.target}
                    </Badge>
                    <span className="font-bold text-xl text-primary">€{mic.price.toFixed(2)}</span>
                  </div>
                   {mic.image && <div className="w-full h-40 flex items-center justify-center bg-white rounded-lg">
                        <img src={mic.image} alt={mic.name} className="max-h-36 max-w-full object-contain rounded-lg p-2" />
                     </div>}
                </CardHeader>
                <CardContent className="space-y-4">
                  <h4 className="font-bold text-lg text-center">{mic.name}</h4>
                  <p className="text-muted-foreground text-center leading-relaxed">{mic.description}</p>
                  
                  <Button variant={isSelected ? "default" : "upgrade"} size="lg" className="w-full h-12 text-base font-bold" onClick={e => {
                e.stopPropagation();
                handleToggleItem(mic);
              }}>
                    {isSelected ? <>
                        <Check className="h-5 w-5 mr-2" />
                        ✨ AÑADIDO
                      </> : <>
                        <Plus className="h-5 w-5 mr-2" />
                        AÑADIR €{mic.price.toFixed(2)}
                      </>}
                  </Button>
                </CardContent>
              </Card>;
        })}
        </div>
      </div>
    </div>;
};