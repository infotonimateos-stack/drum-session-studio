import { useState, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Check, Loader2, AlertCircle, Building, User, Globe, Receipt } from "lucide-react";
import { COUNTRIES, EU_COUNTRIES, calculateTax, TaxResult } from "@/utils/taxCalculation";
import { supabase } from "@/integrations/supabase/client";
import { useTranslation } from "react-i18next";

export interface BillingData {
  country: string;
  postalCode: string;
  clientType: 'particular' | 'empresa';
  vatNumber: string;
  viesValid?: boolean;
  viesResponse?: any;
  taxResult: TaxResult;
}

interface BillingStepProps {
  onComplete: (data: BillingData) => void;
  onBack: () => void;
  subtotal: number;
  paypalFeePercent: number;
  paymentMethod: 'card' | 'paypal' | 'transfer';
}

export const BillingStep = ({
  onComplete,
  onBack,
  subtotal,
  paypalFeePercent,
  paymentMethod,
}: BillingStepProps) => {
  const { t } = useTranslation();
  const [country, setCountry] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [clientType, setClientType] = useState<'particular' | 'empresa'>('particular');
  const [vatNumber, setVatNumber] = useState("");
  const [viesLoading, setViesLoading] = useState(false);
  const [viesResult, setViesResult] = useState<{ valid: boolean; companyName?: string; error?: string } | null>(null);
  const [taxResult, setTaxResult] = useState<TaxResult | null>(null);

  // Recalculate tax whenever inputs change
  useEffect(() => {
    if (!country) { setTaxResult(null); return; }
    // For Spain, require postal code
    if (country === 'ES' && !postalCode) { setTaxResult(null); return; }

    const isEU = EU_COUNTRIES.includes(country) && country !== 'ES';
    const needsVies = isEU && clientType === 'empresa';

    if (needsVies && !viesResult) {
      // Haven't validated yet — show provisional tax
      const provisional = calculateTax(country, postalCode, clientType, false);
      setTaxResult(provisional);
      return;
    }

    const result = calculateTax(
      country,
      postalCode,
      clientType,
      needsVies ? viesResult?.valid : undefined,
    );
    setTaxResult(result);
  }, [country, postalCode, clientType, viesResult]);

  // Reset VIES when country or VAT changes
  useEffect(() => {
    setViesResult(null);
  }, [country, vatNumber, clientType]);

  const handleValidateVies = useCallback(async () => {
    if (!vatNumber || vatNumber.length < 4) return;
    setViesLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('validate-vies', {
        body: { countryCode: country, vatNumber },
      });
      if (error) {
        setViesResult({ valid: false, error: 'Error de conexión' });
      } else {
        setViesResult(data);
      }
    } catch {
      setViesResult({ valid: false, error: 'Error al validar' });
    }
    setViesLoading(false);
  }, [country, vatNumber]);

  const isEU = country && EU_COUNTRIES.includes(country) && country !== 'ES';
  const showVatField = clientType === 'empresa' && isEU;
  const needsViesValidation = showVatField && vatNumber.length >= 4 && !viesResult;

  // Calculate amounts
  const taxAmount = taxResult ? subtotal * (taxResult.taxRate / 100) : 0;
  const subtotalWithTax = subtotal + taxAmount;
  const paypalFee = paymentMethod === 'paypal' ? subtotalWithTax * paypalFeePercent : 0;
  const finalTotal = subtotalWithTax + paypalFee;

  const canProceed =
    country &&
    (country !== 'ES' || postalCode.length >= 4) &&
    taxResult &&
    !(showVatField && vatNumber.length >= 4 && !viesResult);

  const handleContinue = () => {
    if (!taxResult) return;
    onComplete({
      country,
      postalCode,
      clientType,
      vatNumber,
      viesValid: viesResult?.valid,
      viesResponse: viesResult,
      taxResult,
    });
  };

  return (
    <div className="space-y-6 sm:space-y-8 max-w-4xl mx-auto">
      <div className="text-center space-y-3 sm:space-y-4">
        <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent flex items-center justify-center gap-2 sm:gap-3">
          <Receipt className="h-8 w-8 sm:h-10 sm:w-10 text-primary" />
          {t("billing.title")}
        </h2>
        <p className="text-muted-foreground text-base sm:text-lg">{t("billing.subtitle")}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 sm:gap-8">
        {/* Form */}
        <div className="lg:col-span-3 space-y-6">
          <div
            className="rounded-2xl p-4 sm:p-6 space-y-5 sm:space-y-6"
            style={{ background: "hsl(var(--card-dark))" }}
          >
            {/* Country */}
            <div className="space-y-2">
              <Label className="text-card-dark-foreground flex items-center gap-2">
                <Globe className="h-4 w-4" /> {t("billing.country")}
              </Label>
              <Select value={country} onValueChange={setCountry}>
                <SelectTrigger className="bg-card-dark/80 border-card-dark-muted/30 text-card-dark-foreground">
                  <SelectValue placeholder={t("billing.selectCountry")} />
                </SelectTrigger>
                <SelectContent>
                  {COUNTRIES.map(c => (
                    <SelectItem key={c.code} value={c.code}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Postal Code */}
            <div className="space-y-2">
              <Label className="text-card-dark-foreground">{t("billing.postalCode")}</Label>
              <Input
                value={postalCode}
                onChange={e => setPostalCode(e.target.value.replace(/[^a-zA-Z0-9\s-]/g, '').substring(0, 10))}
                placeholder={country === 'ES' ? '28001' : '10115'}
                inputMode="numeric"
                className="bg-card-dark/80 border-card-dark-muted/30 text-card-dark-foreground placeholder:text-card-dark-muted/50 h-12 text-base"
              />
              {country === 'ES' && postalCode && (
                <p className="text-xs text-card-dark-muted">
                  {['35', '38'].includes(postalCode.substring(0, 2))
                    ? '🏝️ Canarias — IVA 0%'
                    : postalCode.startsWith('51')
                    ? '🏛️ Ceuta — IVA 0%'
                    : postalCode.startsWith('52')
                    ? '🏛️ Melilla — IVA 0%'
                    : '🇪🇸 Península/Baleares — IVA 21%'}
                </p>
              )}
            </div>

            {/* Client Type */}
            <div className="space-y-2">
              <Label className="text-card-dark-foreground">{t("billing.clientType")}</Label>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  type="button"
                  variant={clientType === 'particular' ? 'default' : 'outline'}
                  onClick={() => setClientType('particular')}
                  className={`h-14 ${clientType === 'particular'
                    ? 'ring-2 ring-primary ring-offset-2 ring-offset-[hsl(var(--card-dark))]'
                    : 'border-card-dark-muted/30 text-card-dark-foreground hover:bg-card-dark-muted/20'
                  }`}
                >
                  <User className="h-5 w-5 mr-2" />
                  {t("billing.particular")}
                </Button>
                <Button
                  type="button"
                  variant={clientType === 'empresa' ? 'default' : 'outline'}
                  onClick={() => setClientType('empresa')}
                  className={`h-14 ${clientType === 'empresa'
                    ? 'ring-2 ring-primary ring-offset-2 ring-offset-[hsl(var(--card-dark))]'
                    : 'border-card-dark-muted/30 text-card-dark-foreground hover:bg-card-dark-muted/20'
                  }`}
                >
                  <Building className="h-5 w-5 mr-2" />
                  {t("billing.empresa")}
                </Button>
              </div>
            </div>

            {/* VAT Number — only for EU companies */}
            {showVatField && (
              <div className="space-y-3">
                <Label className="text-card-dark-foreground">{t("billing.vatNumber")}</Label>
                <div className="flex gap-2">
                  <Input
                    value={vatNumber}
                    onChange={e => setVatNumber(e.target.value.replace(/[^a-zA-Z0-9]/g, '').substring(0, 20))}
                    placeholder={`${country}123456789`}
                    inputMode="text"
                    className="bg-card-dark/80 border-card-dark-muted/30 text-card-dark-foreground placeholder:text-card-dark-muted/50 flex-1 h-12 text-base"
                  />
                  <Button
                    onClick={handleValidateVies}
                    disabled={viesLoading || vatNumber.length < 4}
                    className="bg-gradient-to-r from-[hsl(var(--card-dark-btn-from))] to-[hsl(var(--card-dark-btn-to))] text-white"
                  >
                    {viesLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : t("billing.validate")}
                  </Button>
                </div>

                {/* VIES result */}
                {viesResult && (
                  <div className={`p-3 rounded-xl text-sm ${
                    viesResult.valid
                      ? 'bg-green-900/30 border border-green-500/30 text-green-400'
                      : 'bg-red-900/30 border border-red-500/30 text-red-400'
                  }`}>
                    {viesResult.valid ? (
                      <div className="flex items-start gap-2">
                        <Check className="h-5 w-5 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-medium">{t("billing.viesValid")}</p>
                          {viesResult.companyName && (
                            <p className="text-xs mt-1 opacity-80">{viesResult.companyName}</p>
                          )}
                          <p className="text-xs mt-1 opacity-80">{t("billing.reverseCharge")}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start gap-2">
                        <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-medium">{t("billing.viesInvalid")}</p>
                          <p className="text-xs mt-1 opacity-80">{t("billing.viesInvalidDesc")}</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Price Summary */}
        <div className="lg:col-span-2">
          <div
            className="rounded-2xl p-6 space-y-5 sticky top-8"
            style={{ background: "hsl(var(--card-dark))" }}
          >
            <h3 className="text-lg font-bold text-card-dark-foreground text-center">
              {t("billing.breakdown")}
            </h3>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-card-dark-muted">
                <span>{t("billing.subtotal")}</span>
                <span className="text-card-dark-foreground">{subtotal.toFixed(2)} €</span>
              </div>

              {taxResult && (
                <div className="flex justify-between text-card-dark-muted">
                  <span>{taxResult.taxLabel}</span>
                  <span className="text-card-dark-foreground">
                    {taxAmount > 0 ? `+${taxAmount.toFixed(2)} €` : '0.00 €'}
                  </span>
                </div>
              )}

              {paymentMethod === 'paypal' && (
                <div className="flex justify-between text-amber-400">
                  <span>{t("checkout.paypalFee")}</span>
                  <span>+{paypalFee.toFixed(2)} €</span>
                </div>
              )}

              <Separator className="bg-card-dark-muted/20" />

              <div className="flex justify-between text-lg font-bold">
                <span className="text-card-dark-foreground">{t("checkout.total")}</span>
                <span className="text-card-dark-price">{finalTotal.toFixed(2)} €</span>
              </div>
            </div>

            {!taxResult && (
              <p className="text-xs text-card-dark-muted text-center">
                {t("billing.selectCountryToCalc")}
              </p>
            )}

            <div className="space-y-3 pt-2">
              <Button
                onClick={handleContinue}
                disabled={!canProceed}
                className="w-full h-14 text-base font-bold bg-gradient-to-r from-[hsl(var(--card-dark-btn-from))] to-[hsl(var(--card-dark-btn-to))] text-white hover:shadow-lg"
              >
                {t("billing.continue")}
              </Button>
              <Button
                onClick={onBack}
                variant="outline"
                className="w-full border-card-dark-muted/30 text-card-dark-foreground hover:bg-card-dark-muted/20"
              >
                {t("checkout.backToConfig")}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
