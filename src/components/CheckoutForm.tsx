import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Upload, FileAudio, CreditCard, Building, User, ArrowLeft } from "lucide-react";
import { CartState } from "@/types/cart";

interface CheckoutFormProps {
  cartState: CartState;
  onBack: () => void;
}

export const CheckoutForm = ({ cartState, onBack }: CheckoutFormProps) => {
  const [needsInvoice, setNeedsInvoice] = useState(false);
  const [noDrumsDemo, setNoDrumsDemo] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("card");

  const countryCodes = [
    { code: "+34", country: "España" },
    { code: "+1", country: "Estados Unidos" },
    { code: "+52", country: "México" },
    { code: "+54", country: "Argentina" },
    { code: "+56", country: "Chile" },
    { code: "+57", country: "Colombia" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí iría la integración con Stripe
    console.log("Processing payment...");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button variant="outline" onClick={onBack} className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Volver
            </Button>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Finalizar Compra
            </h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-2 space-y-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Info */}
                <Card className="bg-gradient-to-br from-card to-muted">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5 text-primary" />
                      Información Personal
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="fullName">Nombre Completo *</Label>
                        <Input id="fullName" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input id="email" type="email" required />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="countryCode">Código País</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona" />
                          </SelectTrigger>
                          <SelectContent>
                            {countryCodes.map((country) => (
                              <SelectItem key={country.code} value={country.code}>
                                {country.code} {country.country}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="md:col-span-2 space-y-2">
                        <Label htmlFor="phone">Teléfono *</Label>
                        <Input id="phone" required />
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="needsInvoice" 
                        checked={needsInvoice}
                        onCheckedChange={(checked) => setNeedsInvoice(checked as boolean)}
                      />
                      <Label htmlFor="needsInvoice">Necesito factura</Label>
                    </div>
                  </CardContent>
                </Card>

                {/* Invoice Info */}
                {needsInvoice && (
                  <Card className="bg-gradient-to-br from-card to-muted">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Building className="h-5 w-5 text-primary" />
                        Datos de Facturación
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="address">Dirección Completa *</Label>
                        <Textarea id="address" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="taxId">NIF / RUT / RUC / EIN *</Label>
                        <Input id="taxId" required />
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Audio Files */}
                <Card className="bg-gradient-to-br from-card to-muted">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileAudio className="h-5 w-5 text-primary" />
                      Archivos de Audio
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="trackWithoutDrums">Maqueta SIN batería * (WAV/MP3)</Label>
                      <div className="border-2 border-dashed border-border rounded-lg p-4 text-center hover:border-primary/50 transition-colors">
                        <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">Arrastra tu archivo aquí o haz clic para seleccionar</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="drumsOnlyTrack">Maqueta SOLO batería (WAV/MP3)</Label>
                      <div className="border-2 border-dashed border-border rounded-lg p-4 text-center hover:border-primary/50 transition-colors">
                        <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">Arrastra tu archivo aquí o haz clic para seleccionar</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="noDrumsDemo" 
                        checked={noDrumsDemo}
                        onCheckedChange={(checked) => setNoDrumsDemo(checked as boolean)}
                      />
                      <Label htmlFor="noDrumsDemo">No dispongo de batería demo</Label>
                    </div>
                  </CardContent>
                </Card>

                {/* Audio Settings */}
                <Card className="bg-gradient-to-br from-card to-muted">
                  <CardHeader>
                    <CardTitle>Configuración de Audio</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="bitDepth">Profundidad de Bits</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="16">16 bits</SelectItem>
                            <SelectItem value="24">24 bits</SelectItem>
                            <SelectItem value="32">32 bits</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="sampleRate">Frecuencia de Muestreo (kHz)</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="44.1">44.1 kHz</SelectItem>
                            <SelectItem value="48">48 kHz</SelectItem>
                            <SelectItem value="88.2">88.2 kHz</SelectItem>
                            <SelectItem value="96">96 kHz</SelectItem>
                            <SelectItem value="192">192 kHz</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tempo">Tempo (BPM)</Label>
                      <Input id="tempo" placeholder="120" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tempoMap">Tempo Map (MIDI) - Solo si el tempo es variable</Label>
                      <div className="border-2 border-dashed border-border rounded-lg p-4 text-center hover:border-primary/50 transition-colors">
                        <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">Archivo MIDI opcional</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="instructions">Indicaciones Especiales</Label>
                      <Textarea 
                        id="instructions" 
                        placeholder="Referencias de YouTube/Spotify, sonoridad deseada, estilo específico, etc."
                        className="min-h-[100px]"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Payment Method */}
                <Card className="bg-gradient-to-br from-card to-muted">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5 text-primary" />
                      Método de Pago
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Button
                        type="button"
                        variant={paymentMethod === "card" ? "default" : "outline"}
                        onClick={() => setPaymentMethod("card")}
                        className="h-16"
                      >
                        <div className="text-center">
                          <CreditCard className="h-6 w-6 mx-auto mb-1" />
                          <span className="text-sm">Tarjeta</span>
                        </div>
                      </Button>
                      <Button
                        type="button"
                        variant={paymentMethod === "transfer" ? "default" : "outline"}
                        onClick={() => setPaymentMethod("transfer")}
                        className="h-16"
                      >
                        <div className="text-center">
                          <Building className="h-6 w-6 mx-auto mb-1" />
                          <span className="text-sm">Transferencia</span>
                        </div>
                      </Button>
                      <Button
                        type="button"
                        variant={paymentMethod === "paypal" ? "default" : "outline"}
                        onClick={() => setPaymentMethod("paypal")}
                        className="h-16"
                      >
                        <div className="text-center">
                          <span className="text-lg font-bold mb-1">PP</span>
                          <br />
                          <span className="text-sm">PayPal</span>
                        </div>
                      </Button>
                    </div>
                    
                    <Button type="submit" variant="upgrade" size="lg" className="w-full h-16 text-xl font-bold">
                      💳 FINALIZAR COMPRA €{(cartState.basePrice + cartState.items.reduce((sum, item) => sum + item.price, 0)).toFixed(2)}
                    </Button>
                  </CardContent>
                </Card>
              </form>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                <Card className="bg-gradient-to-br from-card to-muted">
                  <CardHeader>
                    <CardTitle>Resumen del Pedido</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Base Package */}
                    <div className="flex justify-between items-center p-3 bg-primary/10 rounded-lg">
                      <div>
                        <p className="font-medium text-sm">Kit Básico de Grabación</p>
                        <p className="text-xs text-muted-foreground">8 micrófonos + previos + interface</p>
                      </div>
                      <span className="font-bold text-primary">€{cartState.basePrice.toFixed(2)}</span>
                    </div>

                    {/* Added Items */}
                    {cartState.items.length > 0 && (
                      <>
                        <Separator />
                        <div className="space-y-2 max-h-64 overflow-y-auto">
                          {cartState.items.map((item) => (
                            <div key={item.id} className="flex justify-between items-center p-2 bg-muted/30 rounded-md">
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{item.name}</p>
                                <Badge variant="outline" className="text-xs mt-1">
                                  {item.category}
                                </Badge>
                              </div>
                              <span className="text-sm font-medium ml-2">€{item.price.toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                        <Separator />
                      </>
                    )}
                    
                    {/* Total */}
                    <div className="flex justify-between items-center p-3 bg-accent/20 rounded-lg">
                      <span className="font-bold text-lg">Total</span>
                      <span className="font-bold text-xl text-primary">
                        €{(cartState.basePrice + cartState.items.reduce((sum, item) => sum + item.price, 0)).toFixed(2)}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};