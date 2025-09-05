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
    { code: "+93", country: "Afganistán" },
    { code: "+355", country: "Albania" },
    { code: "+213", country: "Argelia" },
    { code: "+1684", country: "Samoa Americana" },
    { code: "+376", country: "Andorra" },
    { code: "+244", country: "Angola" },
    { code: "+1264", country: "Anguila" },
    { code: "+672", country: "Antártida" },
    { code: "+1268", country: "Antigua y Barbuda" },
    { code: "+54", country: "Argentina" },
    { code: "+374", country: "Armenia" },
    { code: "+297", country: "Aruba" },
    { code: "+61", country: "Australia" },
    { code: "+43", country: "Austria" },
    { code: "+994", country: "Azerbaiyán" },
    { code: "+1242", country: "Bahamas" },
    { code: "+973", country: "Baréin" },
    { code: "+880", country: "Bangladesh" },
    { code: "+1246", country: "Barbados" },
    { code: "+375", country: "Bielorrusia" },
    { code: "+32", country: "Bélgica" },
    { code: "+501", country: "Belice" },
    { code: "+229", country: "Benín" },
    { code: "+1441", country: "Bermuda" },
    { code: "+975", country: "Bután" },
    { code: "+591", country: "Bolivia" },
    { code: "+387", country: "Bosnia y Herzegovina" },
    { code: "+267", country: "Botsuana" },
    { code: "+55", country: "Brasil" },
    { code: "+246", country: "Territorio Británico del Océano Índico" },
    { code: "+673", country: "Brunéi" },
    { code: "+359", country: "Bulgaria" },
    { code: "+226", country: "Burkina Faso" },
    { code: "+257", country: "Burundi" },
    { code: "+855", country: "Camboya" },
    { code: "+237", country: "Camerún" },
    { code: "+1", country: "Canadá" },
    { code: "+238", country: "Cabo Verde" },
    { code: "+1345", country: "Islas Caimán" },
    { code: "+236", country: "República Centroafricana" },
    { code: "+235", country: "Chad" },
    { code: "+56", country: "Chile" },
    { code: "+86", country: "China" },
    { code: "+61", country: "Isla de Navidad" },
    { code: "+61", country: "Islas Cocos" },
    { code: "+57", country: "Colombia" },
    { code: "+269", country: "Comoras" },
    { code: "+242", country: "Congo" },
    { code: "+243", country: "República Democrática del Congo" },
    { code: "+682", country: "Islas Cook" },
    { code: "+506", country: "Costa Rica" },
    { code: "+225", country: "Costa de Marfil" },
    { code: "+385", country: "Croacia" },
    { code: "+53", country: "Cuba" },
    { code: "+357", country: "Chipre" },
    { code: "+420", country: "República Checa" },
    { code: "+45", country: "Dinamarca" },
    { code: "+253", country: "Yibuti" },
    { code: "+1767", country: "Dominica" },
    { code: "+1809", country: "República Dominicana" },
    { code: "+593", country: "Ecuador" },
    { code: "+20", country: "Egipto" },
    { code: "+503", country: "El Salvador" },
    { code: "+240", country: "Guinea Ecuatorial" },
    { code: "+291", country: "Eritrea" },
    { code: "+372", country: "Estonia" },
    { code: "+251", country: "Etiopía" },
    { code: "+500", country: "Islas Malvinas" },
    { code: "+298", country: "Islas Feroe" },
    { code: "+679", country: "Fiyi" },
    { code: "+358", country: "Finlandia" },
    { code: "+33", country: "Francia" },
    { code: "+594", country: "Guayana Francesa" },
    { code: "+689", country: "Polinesia Francesa" },
    { code: "+241", country: "Gabón" },
    { code: "+220", country: "Gambia" },
    { code: "+995", country: "Georgia" },
    { code: "+49", country: "Alemania" },
    { code: "+233", country: "Ghana" },
    { code: "+350", country: "Gibraltar" },
    { code: "+30", country: "Grecia" },
    { code: "+299", country: "Groenlandia" },
    { code: "+1473", country: "Granada" },
    { code: "+590", country: "Guadalupe" },
    { code: "+1671", country: "Guam" },
    { code: "+502", country: "Guatemala" },
    { code: "+224", country: "Guinea" },
    { code: "+245", country: "Guinea-Bisáu" },
    { code: "+592", country: "Guyana" },
    { code: "+509", country: "Haití" },
    { code: "+504", country: "Honduras" },
    { code: "+852", country: "Hong Kong" },
    { code: "+36", country: "Hungría" },
    { code: "+354", country: "Islandia" },
    { code: "+91", country: "India" },
    { code: "+62", country: "Indonesia" },
    { code: "+98", country: "Irán" },
    { code: "+964", country: "Iraq" },
    { code: "+353", country: "Irlanda" },
    { code: "+972", country: "Israel" },
    { code: "+39", country: "Italia" },
    { code: "+1876", country: "Jamaica" },
    { code: "+81", country: "Japón" },
    { code: "+962", country: "Jordania" },
    { code: "+7", country: "Kazajistán" },
    { code: "+254", country: "Kenia" },
    { code: "+686", country: "Kiribati" },
    { code: "+850", country: "Corea del Norte" },
    { code: "+82", country: "Corea del Sur" },
    { code: "+965", country: "Kuwait" },
    { code: "+996", country: "Kirguistán" },
    { code: "+856", country: "Laos" },
    { code: "+371", country: "Letonia" },
    { code: "+961", country: "Líbano" },
    { code: "+266", country: "Lesoto" },
    { code: "+231", country: "Liberia" },
    { code: "+218", country: "Libia" },
    { code: "+423", country: "Liechtenstein" },
    { code: "+370", country: "Lituania" },
    { code: "+352", country: "Luxemburgo" },
    { code: "+853", country: "Macao" },
    { code: "+389", country: "Macedonia del Norte" },
    { code: "+261", country: "Madagascar" },
    { code: "+265", country: "Malaui" },
    { code: "+60", country: "Malasia" },
    { code: "+960", country: "Maldivas" },
    { code: "+223", country: "Malí" },
    { code: "+356", country: "Malta" },
    { code: "+692", country: "Islas Marshall" },
    { code: "+596", country: "Martinica" },
    { code: "+222", country: "Mauritania" },
    { code: "+230", country: "Mauricio" },
    { code: "+262", country: "Mayotte" },
    { code: "+52", country: "México" },
    { code: "+691", country: "Micronesia" },
    { code: "+373", country: "Moldavia" },
    { code: "+377", country: "Mónaco" },
    { code: "+976", country: "Mongolia" },
    { code: "+382", country: "Montenegro" },
    { code: "+1664", country: "Montserrat" },
    { code: "+212", country: "Marruecos" },
    { code: "+258", country: "Mozambique" },
    { code: "+95", country: "Myanmar" },
    { code: "+264", country: "Namibia" },
    { code: "+674", country: "Nauru" },
    { code: "+977", country: "Nepal" },
    { code: "+31", country: "Países Bajos" },
    { code: "+599", country: "Antillas Neerlandesas" },
    { code: "+687", country: "Nueva Caledonia" },
    { code: "+64", country: "Nueva Zelanda" },
    { code: "+505", country: "Nicaragua" },
    { code: "+227", country: "Níger" },
    { code: "+234", country: "Nigeria" },
    { code: "+683", country: "Niue" },
    { code: "+672", country: "Isla Norfolk" },
    { code: "+1670", country: "Islas Marianas del Norte" },
    { code: "+47", country: "Noruega" },
    { code: "+968", country: "Omán" },
    { code: "+92", country: "Pakistán" },
    { code: "+680", country: "Palaos" },
    { code: "+970", country: "Palestina" },
    { code: "+507", country: "Panamá" },
    { code: "+675", country: "Papúa Nueva Guinea" },
    { code: "+595", country: "Paraguay" },
    { code: "+51", country: "Perú" },
    { code: "+63", country: "Filipinas" },
    { code: "+48", country: "Polonia" },
    { code: "+351", country: "Portugal" },
    { code: "+1787", country: "Puerto Rico" },
    { code: "+974", country: "Catar" },
    { code: "+262", country: "Reunión" },
    { code: "+40", country: "Rumania" },
    { code: "+7", country: "Rusia" },
    { code: "+250", country: "Ruanda" },
    { code: "+290", country: "Santa Elena" },
    { code: "+1869", country: "San Cristóbal y Nieves" },
    { code: "+1758", country: "Santa Lucía" },
    { code: "+508", country: "San Pedro y Miquelón" },
    { code: "+1784", country: "San Vicente y las Granadinas" },
    { code: "+685", country: "Samoa" },
    { code: "+378", country: "San Marino" },
    { code: "+239", country: "Santo Tomé y Príncipe" },
    { code: "+966", country: "Arabia Saudí" },
    { code: "+221", country: "Senegal" },
    { code: "+381", country: "Serbia" },
    { code: "+248", country: "Seychelles" },
    { code: "+232", country: "Sierra Leona" },
    { code: "+65", country: "Singapur" },
    { code: "+421", country: "Eslovaquia" },
    { code: "+386", country: "Eslovenia" },
    { code: "+677", country: "Islas Salomón" },
    { code: "+252", country: "Somalia" },
    { code: "+27", country: "Sudáfrica" },
    { code: "+211", country: "Sudán del Sur" },
    { code: "+34", country: "España" },
    { code: "+94", country: "Sri Lanka" },
    { code: "+249", country: "Sudán" },
    { code: "+597", country: "Surinam" },
    { code: "+268", country: "Suazilandia" },
    { code: "+46", country: "Suecia" },
    { code: "+41", country: "Suiza" },
    { code: "+963", country: "Siria" },
    { code: "+886", country: "Taiwán" },
    { code: "+992", country: "Tayikistán" },
    { code: "+255", country: "Tanzania" },
    { code: "+66", country: "Tailandia" },
    { code: "+670", country: "Timor Oriental" },
    { code: "+228", country: "Togo" },
    { code: "+690", country: "Tokelau" },
    { code: "+676", country: "Tonga" },
    { code: "+1868", country: "Trinidad y Tobago" },
    { code: "+216", country: "Túnez" },
    { code: "+90", country: "Turquía" },
    { code: "+993", country: "Turkmenistán" },
    { code: "+1649", country: "Islas Turcas y Caicos" },
    { code: "+688", country: "Tuvalu" },
    { code: "+256", country: "Uganda" },
    { code: "+380", country: "Ucrania" },
    { code: "+971", country: "Emiratos Árabes Unidos" },
    { code: "+44", country: "Reino Unido" },
    { code: "+1", country: "Estados Unidos" },
    { code: "+598", country: "Uruguay" },
    { code: "+998", country: "Uzbekistán" },
    { code: "+678", country: "Vanuatu" },
    { code: "+379", country: "Ciudad del Vaticano" },
    { code: "+58", country: "Venezuela" },
    { code: "+84", country: "Vietnam" },
    { code: "+1284", country: "Islas Vírgenes Británicas" },
    { code: "+1340", country: "Islas Vírgenes de EE.UU." },
    { code: "+681", country: "Wallis y Futuna" },
    { code: "+212", country: "Sahara Occidental" },
    { code: "+967", country: "Yemen" },
    { code: "+260", country: "Zambia" },
    { code: "+263", country: "Zimbabue" }
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

          <div className="max-w-2xl mx-auto">
            {/* Form */}
            <div className="space-y-6">
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
                  </CardContent>
                </Card>
              </form>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};