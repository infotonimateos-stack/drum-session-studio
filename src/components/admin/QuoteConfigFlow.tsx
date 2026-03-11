import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ArrowRight, ShoppingCart, Trash2, User, Building2 } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { CartItem } from "@/types/cart";
import { validateStep } from "@/hooks/useStepValidation";
import { calculateTax, COUNTRIES, TaxResult } from "@/utils/taxCalculation";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

// Step components
import { DrumKitStep } from "@/components/steps/DrumKitStep";
import { MicrophonesStep } from "@/components/steps/MicrophonesStep";
import { PreampsStep } from "@/components/steps/PreampsStep";
import { InterfaceStep } from "@/components/steps/InterfaceStep";
import { ProductionStep } from "@/components/steps/ProductionStep";
import { VideoStep } from "@/components/steps/VideoStep";
import { TakesStep } from "@/components/steps/TakesStep";
import { DeliveryStep } from "@/components/steps/DeliveryStep";
import { ExtrasStep } from "@/components/steps/ExtrasStep";

import QuoteClientForm, { QuoteClientData, emptyClientData } from "./QuoteClientForm";
import QuotePreview from "./QuotePreview";

interface Order {
  id: string;
  first_name: string | null;
  last_name: string | null;
  contact_email: string | null;
  billing_email: string | null;
  billing_phone: string | null;
  business_name: string | null;
  vat_number: string | null;
  full_address: string | null;
  city: string | null;
  state_province: string | null;
  postal_code: string | null;
  country_code: string;
  client_type: string;
}

type Phase = "client" | "config" | "billing" | "preview";

interface Props {
  orders: Order[];
  onCancel: () => void;
  onSave: (data: QuoteSaveData) => Promise<void>;
}

export interface QuoteSaveData {
  clientData: QuoteClientData;
  items: CartItem[];
  basePrice: number;
  subtotal: number;
  songCount: number;
  taxRate: number;
  taxAmount: number;
  taxRule: string;
  total: number;
  validityDays: number;
  notes: string;
  paymentTerms: string;
}

const STEP_NAMES = [
  "Batería",
  "Micrófonos",
  "Previos",
  "Interfaz",
  "Producción",
  "Vídeo",
  "Tomas",
  "Entrega",
  "Extras",
];

export default function QuoteConfigFlow({ orders, onCancel, onSave }: Props) {
  const { t } = useTranslation();
  const { cartState, addItem, removeItem, hasItem, clearCart } = useCart();

  const [phase, setPhase] = useState<Phase>("client");
  const [currentStep, setCurrentStep] = useState(0);
  const [clientData, setClientData] = useState<QuoteClientData>(emptyClientData);
  const [saving, setSaving] = useState(false);

  // Billing phase state
  const [songCount, setSongCount] = useState(1);
  const [validityDays, setValidityDays] = useState(30);
  const [notes, setNotes] = useState("");
  const [paymentTerms, setPaymentTerms] = useState("PayPal o transferencia bancaria");

  // Tax calculation
  const taxResult = calculateTax(
    clientData.countryCode,
    clientData.postalCode,
    clientData.clientType,
    undefined // No VIES validation in admin
  );

  const subtotal = cartState.total * songCount;
  const taxAmount = subtotal * (taxResult.taxRate / 100);
  const total = subtotal + taxAmount;

  const quoteNumber = "P-XXXX"; // Placeholder, real number assigned on save

  // Step components
  const stepComponents = [
    <DrumKitStep key="drumkit" addItem={addItem} removeItem={removeItem} hasItem={hasItem} />,
    <MicrophonesStep key="mics" addItem={addItem} removeItem={removeItem} hasItem={hasItem} />,
    <PreampsStep key="preamps" addItem={addItem} removeItem={removeItem} hasItem={hasItem} cartState={cartState} />,
    <InterfaceStep key="interface" addItem={addItem} removeItem={removeItem} hasItem={hasItem} cartState={cartState} />,
    <ProductionStep key="production" addItem={addItem} removeItem={removeItem} hasItem={hasItem} />,
    <VideoStep key="video" addItem={addItem} removeItem={removeItem} hasItem={hasItem} />,
    <TakesStep key="takes" addItem={addItem} removeItem={removeItem} hasItem={hasItem} />,
    <DeliveryStep key="delivery" addItem={addItem} removeItem={removeItem} hasItem={hasItem} />,
    <ExtrasStep key="extras" addItem={addItem} removeItem={removeItem} hasItem={hasItem} />,
  ];

  const handleNextStep = () => {
    const result = validateStep(currentStep, cartState, t);
    if (!result.valid) {
      toast.error(result.error || "Completa este paso antes de continuar");
      return;
    }
    if (currentStep < 8) {
      setCurrentStep(currentStep + 1);
    } else {
      setPhase("billing");
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      setPhase("client");
    }
  };

  const handleGoToPreview = () => {
    if (cartState.items.length === 0) {
      toast.error("Selecciona al menos un servicio");
      return;
    }
    setPhase("preview");
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave({
        clientData,
        items: cartState.items,
        basePrice: cartState.basePrice,
        subtotal,
        songCount,
        taxRate: taxResult.taxRate,
        taxAmount,
        taxRule: taxResult.taxRule,
        total,
        validityDays,
        notes,
        paymentTerms,
      });
    } finally {
      setSaving(false);
    }
  };

  // ===== PHASE: CLIENT =====
  if (phase === "client") {
    return (
      <QuoteClientForm
        orders={orders}
        clientData={clientData}
        onClientDataChange={setClientData}
        onNext={() => setPhase("config")}
        onCancel={onCancel}
      />
    );
  }

  // ===== PHASE: PREVIEW =====
  if (phase === "preview") {
    return (
      <QuotePreview
        clientData={clientData}
        cartState={cartState}
        pricing={{ songCount, taxResult, validityDays, notes, paymentTerms }}
        quoteNumber={quoteNumber}
        onBack={() => setPhase("billing")}
        onSave={handleSave}
        saving={saving}
      />
    );
  }

  // ===== PHASE: BILLING =====
  if (phase === "billing") {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-foreground mb-1">Configuración fiscal y detalles</h2>
          <p className="text-sm text-muted-foreground">Ajusta la cantidad de canciones, impuestos y condiciones del presupuesto.</p>
        </div>

        <Card>
          <CardContent className="pt-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Número de canciones</Label>
                <Input
                  type="number"
                  min={1}
                  max={50}
                  value={songCount}
                  onChange={(e) => setSongCount(Math.max(1, parseInt(e.target.value) || 1))}
                />
              </div>
              <div>
                <Label>Validez (días)</Label>
                <Input
                  type="number"
                  min={1}
                  max={365}
                  value={validityDays}
                  onChange={(e) => setValidityDays(Math.max(1, parseInt(e.target.value) || 30))}
                />
              </div>
            </div>

            <div>
              <Label>Condiciones de pago</Label>
              <Input
                value={paymentTerms}
                onChange={(e) => setPaymentTerms(e.target.value)}
                placeholder="PayPal o transferencia bancaria"
              />
            </div>

            <div>
              <Label>Notas adicionales</Label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Notas opcionales que aparecerán en el presupuesto..."
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Tax info */}
        <Card>
          <CardContent className="pt-4 pb-3">
            <h3 className="text-sm font-semibold mb-3 text-muted-foreground">CÁLCULO FISCAL</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <span className="text-muted-foreground">País:</span>
              <span>{COUNTRIES.find((c) => c.code === clientData.countryCode)?.name || clientData.countryCode}</span>
              <span className="text-muted-foreground">Tipo cliente:</span>
              <span className="capitalize">{clientData.clientType}</span>
              <span className="text-muted-foreground">Regla fiscal:</span>
              <span>{taxResult.taxLabel}</span>
            </div>
            <div className="mt-4 pt-3 border-t space-y-2">
              <div className="flex justify-between text-sm">
                <span>Precio por canción:</span>
                <span>{cartState.total.toFixed(2)} €</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Subtotal{songCount > 1 ? ` (×${songCount})` : ""}:</span>
                <span>{subtotal.toFixed(2)} €</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>{taxResult.taxLabel}:</span>
                <span>{taxAmount.toFixed(2)} €</span>
              </div>
              <div className="flex justify-between font-bold text-lg pt-2 border-t">
                <span>TOTAL:</span>
                <span>{total.toFixed(2)} €</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-between">
          <Button variant="outline" onClick={() => { setCurrentStep(8); setPhase("config"); }}>
            <ArrowLeft className="h-4 w-4 mr-1" /> Volver a servicios
          </Button>
          <Button onClick={handleGoToPreview}>
            Vista previa <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>
    );
  }

  // ===== PHASE: CONFIG (9-step multistep) =====
  return (
    <div className="space-y-6">
      {/* Step progress bar */}
      <div className="flex items-center gap-1 overflow-x-auto pb-2">
        {STEP_NAMES.map((name, i) => (
          <button
            key={i}
            onClick={() => setCurrentStep(i)}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
              i === currentStep
                ? "bg-primary text-primary-foreground"
                : i < currentStep
                  ? "bg-primary/20 text-primary"
                  : "bg-muted text-muted-foreground"
            }`}
          >
            <span className="w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold border border-current">
              {i + 1}
            </span>
            {name}
          </button>
        ))}
      </div>

      {/* Current step content */}
      <div className="min-h-[400px]">{stepComponents[currentStep]}</div>

      {/* Cart summary panel */}
      {cartState.items.length > 0 && (
        <Card className="bg-card/50 border-primary/20">
          <CardContent className="pt-4 pb-3">
            <div className="flex items-center gap-2 mb-3">
              <ShoppingCart className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold">
                {cartState.items.length} items · {cartState.total.toFixed(2)} € / canción
              </span>
            </div>
            <div className="flex flex-wrap gap-1">
              {cartState.items.map((item) => (
                <Badge key={item.id} variant="secondary" className="text-xs gap-1">
                  {item.name}
                  <span className="text-primary font-semibold">{item.price.toFixed(2)}€</span>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="ml-1 text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Navigation buttons */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={handlePrevStep}>
          <ArrowLeft className="h-4 w-4 mr-1" />
          {currentStep === 0 ? "Datos cliente" : STEP_NAMES[currentStep - 1]}
        </Button>
        <Button onClick={handleNextStep}>
          {currentStep === 8 ? "Configurar detalles" : STEP_NAMES[currentStep + 1]}
          <ArrowRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}
