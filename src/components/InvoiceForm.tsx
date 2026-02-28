import { useState, useMemo } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FileText, Building2, MapPin, CreditCard, Mail, Phone, Globe, Map, AlertCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { COUNTRIES, EU_COUNTRIES } from "@/utils/taxCalculation";

export interface InvoiceData {
  isProfessionalInvoice: boolean;
  businessName: string;
  vatNumber: string;
  fullAddress: string;
  city: string;
  stateProvince: string;
  postalCode: string;
  countryCode: string;
  billingEmail: string;
  billingPhone: string;
}

interface InvoiceFormProps {
  data: InvoiceData;
  onChange: (data: InvoiceData) => void;
}

/* ── Spanish NIF / CIF validation ── */
const NIF_LETTERS = "TRWAGMYFPDXBNJZSQVHLCKE";
function isValidNIF(value: string): boolean {
  const match = value.toUpperCase().match(/^(\d{8})([A-Z])$/);
  if (!match) return false;
  return NIF_LETTERS[parseInt(match[1], 10) % 23] === match[2];
}

function isValidCIF(value: string): boolean {
  return /^[ABCDEFGHJKLMNPQRSUVW]\d{7}[A-J0-9]$/i.test(value);
}

/* ── Conditional tax-ID validation ── */
function validateTaxId(value: string, countryCode: string): boolean {
  const v = value.trim();
  if (!v) return false;

  if (countryCode === "ES") {
    return isValidNIF(v) || isValidCIF(v);
  }

  if (EU_COUNTRIES.includes(countryCode) && countryCode !== "ES") {
    // Two-letter prefix + alphanumeric body (5-15 chars total)
    return /^[A-Z]{2}[A-Z0-9]{2,13}$/i.test(v);
  }

  // Rest of world: 5-20 alphanumeric
  return /^[A-Z0-9\-./]{5,20}$/i.test(v);
}

export const InvoiceForm = ({ data, onChange }: InvoiceFormProps) => {
  const { t } = useTranslation();

  const update = (field: keyof InvoiceData, value: string | boolean) => {
    onChange({ ...data, [field]: value });
  };

  const taxIdTouched = data.vatNumber.length > 0;
  const taxIdValid = useMemo(
    () => validateTaxId(data.vatNumber, data.countryCode),
    [data.vatNumber, data.countryCode],
  );

  return (
    <div className="space-y-4">
      {/* Checkbox */}
      <div className="flex items-start space-x-3 p-4 rounded-xl border border-border/50 bg-muted/20 hover:bg-muted/30 transition-colors">
        <Checkbox
          id="needs-invoice"
          checked={data.isProfessionalInvoice}
          onCheckedChange={(c) => update("isProfessionalInvoice", c === true)}
          className="mt-0.5"
        />
        <label htmlFor="needs-invoice" className="cursor-pointer space-y-1">
          <span className="flex items-center gap-2 font-semibold text-sm">
            <FileText className="h-4 w-4 text-primary" />
            {t("invoice.needsProfessional")}
          </span>
          <p className="text-xs text-muted-foreground">{t("invoice.simplifiedDefault")}</p>
        </label>
      </div>

      {/* Conditional form */}
      {data.isProfessionalInvoice && (
        <div
          className="rounded-2xl p-4 sm:p-6 space-y-4 animate-in slide-in-from-top-2 duration-300"
          style={{ background: "hsl(var(--card-dark))" }}
        >
          <h3 className="text-sm font-bold text-card-dark-foreground flex items-center gap-2">
            <FileText className="h-4 w-4 text-primary" />
            {t("invoice.fiscalData")}
          </h3>

          {/* Country Selector */}
          <div className="space-y-1.5">
            <Label className="text-card-dark-foreground flex items-center gap-1.5 text-xs">
              <Globe className="h-3.5 w-3.5" /> {t("invoice.country")}
            </Label>
            <Select
              value={data.countryCode}
              onValueChange={(v) => {
                if (v !== data.countryCode) {
                  onChange({ ...data, countryCode: v, vatNumber: "" });
                } else {
                  update("countryCode", v);
                }
              }}
            >
              <SelectTrigger className="bg-card-dark/80 border-card-dark-muted/30 text-card-dark-foreground h-11">
                <SelectValue placeholder={t("invoice.countryPlaceholder")} />
              </SelectTrigger>
              <SelectContent>
                {COUNTRIES.filter((c) => c.code !== "OTHER").map((c) => (
                  <SelectItem key={c.code} value={c.code}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Business Name */}
          <div className="space-y-1.5">
            <Label className="text-card-dark-foreground flex items-center gap-1.5 text-xs">
              <Building2 className="h-3.5 w-3.5" /> {t("invoice.companyName")}
            </Label>
            <Input
              value={data.businessName}
              onChange={(e) => update("businessName", e.target.value.substring(0, 100))}
              placeholder={t("invoice.companyNamePlaceholder")}
              className="bg-card-dark/80 border-card-dark-muted/30 text-card-dark-foreground placeholder:text-card-dark-muted/50 h-11"
            />
          </div>

          {/* VAT / NIF / CIF */}
          <div className="space-y-1.5">
            <Label className="text-card-dark-foreground flex items-center gap-1.5 text-xs">
              <CreditCard className="h-3.5 w-3.5" /> {t("invoice.taxId")}
            </Label>
            <Input
              value={data.vatNumber}
              onChange={(e) =>
                update("vatNumber", e.target.value.replace(/[^a-zA-Z0-9\-./]/g, "").substring(0, 30))
              }
              placeholder={
                data.countryCode === "ES"
                  ? "12345678Z / B12345678"
                  : data.countryCode && EU_COUNTRIES.includes(data.countryCode)
                  ? `${data.countryCode}123456789`
                  : t("invoice.taxIdPlaceholder")
              }
              className={`bg-card-dark/80 border-card-dark-muted/30 text-card-dark-foreground placeholder:text-card-dark-muted/50 h-11 ${
                taxIdTouched && !taxIdValid ? "border-red-500/60 focus-visible:ring-red-500/40" : ""
              }`}
            />
            {taxIdTouched && !taxIdValid && (
              <p className="text-xs text-red-400 flex items-center gap-1 mt-1">
                <AlertCircle className="h-3.5 w-3.5" />
                {t("invoice.taxIdError")}
              </p>
            )}
          </div>

          {/* Full Address */}
          <div className="space-y-1.5">
            <Label className="text-card-dark-foreground flex items-center gap-1.5 text-xs">
              <MapPin className="h-3.5 w-3.5" /> {t("invoice.fullAddress")}
            </Label>
            <Input
              value={data.fullAddress}
              onChange={(e) => update("fullAddress", e.target.value.substring(0, 200))}
              placeholder={t("invoice.fullAddressPlaceholder")}
              className="bg-card-dark/80 border-card-dark-muted/30 text-card-dark-foreground placeholder:text-card-dark-muted/50 h-11"
            />
          </div>

          {/* City + State/Province row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-card-dark-foreground flex items-center gap-1.5 text-xs">
                <Map className="h-3.5 w-3.5" /> {t("invoice.city")}
              </Label>
              <Input
                value={data.city}
                onChange={(e) => update("city", e.target.value.substring(0, 100))}
                placeholder={t("invoice.cityPlaceholder")}
                className="bg-card-dark/80 border-card-dark-muted/30 text-card-dark-foreground placeholder:text-card-dark-muted/50 h-11"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-card-dark-foreground flex items-center gap-1.5 text-xs">
                <Globe className="h-3.5 w-3.5" /> {t("invoice.stateProvince")}
              </Label>
              <Input
                value={data.stateProvince}
                onChange={(e) => update("stateProvince", e.target.value.substring(0, 100))}
                placeholder={t("invoice.stateProvincePlaceholder")}
                className="bg-card-dark/80 border-card-dark-muted/30 text-card-dark-foreground placeholder:text-card-dark-muted/50 h-11"
              />
            </div>
          </div>

          {/* Postal Code */}
          <div className="space-y-1.5">
            <Label className="text-card-dark-foreground flex items-center gap-1.5 text-xs">
              <MapPin className="h-3.5 w-3.5" /> {t("invoice.postalCode")}
            </Label>
            <Input
              value={data.postalCode}
              onChange={(e) =>
                update("postalCode", e.target.value.replace(/[^a-zA-Z0-9\-\s]/g, "").substring(0, 10))
              }
              placeholder={t("invoice.postalCodePlaceholder")}
              className="bg-card-dark/80 border-card-dark-muted/30 text-card-dark-foreground placeholder:text-card-dark-muted/50 h-11"
            />
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <Label className="text-card-dark-foreground flex items-center gap-1.5 text-xs">
              <Mail className="h-3.5 w-3.5" /> {t("invoice.email")}
            </Label>
            <Input
              type="email"
              value={data.billingEmail}
              onChange={(e) => update("billingEmail", e.target.value.substring(0, 100))}
              placeholder={t("invoice.emailPlaceholder")}
              className="bg-card-dark/80 border-card-dark-muted/30 text-card-dark-foreground placeholder:text-card-dark-muted/50 h-11"
            />
          </div>

          {/* Phone */}
          <div className="space-y-1.5">
            <Label className="text-card-dark-foreground flex items-center gap-1.5 text-xs">
              <Phone className="h-3.5 w-3.5" /> {t("invoice.phone")}
            </Label>
            <Input
              type="tel"
              value={data.billingPhone}
              onChange={(e) =>
                update("billingPhone", e.target.value.replace(/[^0-9+\-\s()]/g, "").substring(0, 20))
              }
              placeholder={t("invoice.phonePlaceholder")}
              className="bg-card-dark/80 border-card-dark-muted/30 text-card-dark-foreground placeholder:text-card-dark-muted/50 h-11"
            />
          </div>

          {!isInvoiceDataValid(data) && (
            <p className="text-xs text-amber-400 text-center">{t("invoice.fillAllFields")}</p>
          )}
        </div>
      )}
    </div>
  );
};

export const isInvoiceDataValid = (data: InvoiceData): boolean => {
  if (!data.isProfessionalInvoice) return true;
  return (
    data.businessName.trim().length >= 2 &&
    data.countryCode.trim().length === 2 &&
    validateTaxId(data.vatNumber, data.countryCode) &&
    data.fullAddress.trim().length >= 5 &&
    data.city.trim().length >= 2 &&
    data.postalCode.trim().length >= 3 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.billingEmail) &&
    data.billingPhone.trim().length >= 6
  );
};

export const emptyInvoiceData: InvoiceData = {
  isProfessionalInvoice: false,
  businessName: "",
  vatNumber: "",
  fullAddress: "",
  city: "",
  stateProvince: "",
  postalCode: "",
  countryCode: "",
  billingEmail: "",
  billingPhone: "",
};
