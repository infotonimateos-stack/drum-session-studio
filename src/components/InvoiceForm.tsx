import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileText, Building2, MapPin, CreditCard, Mail, Phone } from "lucide-react";
import { useTranslation } from "react-i18next";

export interface InvoiceData {
  needsInvoice: boolean;
  companyName: string;
  address: string;
  taxId: string;
  email: string;
  phone: string;
}

interface InvoiceFormProps {
  data: InvoiceData;
  onChange: (data: InvoiceData) => void;
}

export const InvoiceForm = ({ data, onChange }: InvoiceFormProps) => {
  const { t } = useTranslation();

  const update = (field: keyof InvoiceData, value: string | boolean) => {
    onChange({ ...data, [field]: value });
  };

  const isValid = !data.needsInvoice || (
    data.companyName.trim().length >= 2 &&
    data.address.trim().length >= 5 &&
    data.taxId.trim().length >= 4 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email) &&
    data.phone.trim().length >= 6
  );

  return (
    <div className="space-y-4">
      {/* Checkbox */}
      <div className="flex items-start space-x-3 p-4 rounded-xl border border-border/50 bg-muted/20 hover:bg-muted/30 transition-colors">
        <Checkbox
          id="needs-invoice"
          checked={data.needsInvoice}
          onCheckedChange={(c) => update("needsInvoice", c === true)}
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
      {data.needsInvoice && (
        <div
          className="rounded-2xl p-4 sm:p-6 space-y-4 animate-in slide-in-from-top-2 duration-300"
          style={{ background: "hsl(var(--card-dark))" }}
        >
          <h3 className="text-sm font-bold text-card-dark-foreground flex items-center gap-2">
            <FileText className="h-4 w-4 text-primary" />
            {t("invoice.fiscalData")}
          </h3>

          {/* Company Name */}
          <div className="space-y-1.5">
            <Label className="text-card-dark-foreground flex items-center gap-1.5 text-xs">
              <Building2 className="h-3.5 w-3.5" /> {t("invoice.companyName")}
            </Label>
            <Input
              value={data.companyName}
              onChange={(e) => update("companyName", e.target.value.substring(0, 100))}
              placeholder={t("invoice.companyNamePlaceholder")}
              className="bg-card-dark/80 border-card-dark-muted/30 text-card-dark-foreground placeholder:text-card-dark-muted/50 h-11"
            />
          </div>

          {/* Address */}
          <div className="space-y-1.5">
            <Label className="text-card-dark-foreground flex items-center gap-1.5 text-xs">
              <MapPin className="h-3.5 w-3.5" /> {t("invoice.address")}
            </Label>
            <Input
              value={data.address}
              onChange={(e) => update("address", e.target.value.substring(0, 200))}
              placeholder={t("invoice.addressPlaceholder")}
              className="bg-card-dark/80 border-card-dark-muted/30 text-card-dark-foreground placeholder:text-card-dark-muted/50 h-11"
            />
          </div>

          {/* Tax ID */}
          <div className="space-y-1.5">
            <Label className="text-card-dark-foreground flex items-center gap-1.5 text-xs">
              <CreditCard className="h-3.5 w-3.5" /> {t("invoice.taxId")}
            </Label>
            <Input
              value={data.taxId}
              onChange={(e) => update("taxId", e.target.value.replace(/[^a-zA-Z0-9\-./]/g, '').substring(0, 30))}
              placeholder={t("invoice.taxIdPlaceholder")}
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
              value={data.email}
              onChange={(e) => update("email", e.target.value.substring(0, 100))}
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
              value={data.phone}
              onChange={(e) => update("phone", e.target.value.replace(/[^0-9+\-\s()]/g, '').substring(0, 20))}
              placeholder={t("invoice.phonePlaceholder")}
              className="bg-card-dark/80 border-card-dark-muted/30 text-card-dark-foreground placeholder:text-card-dark-muted/50 h-11"
            />
          </div>

          {!isValid && (
            <p className="text-xs text-amber-400 text-center">{t("invoice.fillAllFields")}</p>
          )}
        </div>
      )}
    </div>
  );
};

export const isInvoiceDataValid = (data: InvoiceData): boolean => {
  if (!data.needsInvoice) return true;
  return (
    data.companyName.trim().length >= 2 &&
    data.address.trim().length >= 5 &&
    data.taxId.trim().length >= 4 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email) &&
    data.phone.trim().length >= 6
  );
};

export const emptyInvoiceData: InvoiceData = {
  needsInvoice: false,
  companyName: "",
  address: "",
  taxId: "",
  email: "",
  phone: "",
};
