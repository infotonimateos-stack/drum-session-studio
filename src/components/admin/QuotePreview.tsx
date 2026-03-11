import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Download, Save, ArrowLeft, Eye } from "lucide-react";
import { CartState, CartItem } from "@/types/cart";
import { TaxResult } from "@/utils/taxCalculation";
import { QuoteClientData } from "./QuoteClientForm";
import html2pdf from "html2pdf.js";
import { toast } from "sonner";

const COMPANY = {
  name: "Groove Factory Studios SL",
  taxId: "B42915165",
  address: "C/ Balançó i Boter 22, Ático (2ª plt.), 08302 Mataró (Barcelona), España",
  email: "info@tonimateos.com",
};

function escapeHtml(str: string): string {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

interface QuotePricingData {
  songCount: number;
  taxResult: TaxResult;
  validityDays: number;
  notes: string;
  paymentTerms: string;
}

interface Props {
  clientData: QuoteClientData;
  cartState: CartState;
  pricing: QuotePricingData;
  quoteNumber: string;
  onBack: () => void;
  onSave: () => void;
  saving: boolean;
}

// TM logo as inline SVG for PDF embedding (no external URL dependency)
const TM_LOGO_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="60" height="60"><circle cx="100" cy="100" r="95" fill="#000" stroke="#000" stroke-width="5"/><circle cx="100" cy="100" r="85" fill="#000" stroke="#fff" stroke-width="0"/><path d="M50 55 L150 55 L150 75 L115 75 L115 150 L130 150 L130 95 L150 95 L150 150 L165 150 L165 45 L35 45 L35 150 L50 150 L50 95 L70 95 L70 150 L85 150 L85 75 L50 75 Z" fill="#fff"/></svg>`;

function generateQuoteHtml(
  clientData: QuoteClientData,
  cartState: CartState,
  pricing: QuotePricingData,
  quoteNumber: string
): string {
  const date = new Date().toLocaleDateString("es-ES", { year: "numeric", month: "long", day: "numeric" });
  const validUntil = new Date();
  validUntil.setDate(validUntil.getDate() + pricing.validityDays);
  const validUntilStr = validUntil.toLocaleDateString("es-ES", { year: "numeric", month: "long", day: "numeric" });

  const songCount = pricing.songCount || 1;
  const subtotal = cartState.total * songCount;
  const taxRate = pricing.taxResult.taxRate;
  const taxAmount = subtotal * (taxRate / 100);
  const total = subtotal + taxAmount;
  const taxLabel = taxRate > 0 ? `IVA ${taxRate}%` : "IVA 0% (Exento)";

  // Format quote number: ensure 4 digits (0001, 0002...)
  const numOnly = quoteNumber.replace(/\D/g, "");
  const displayNumber = numOnly ? numOnly.padStart(4, "0") : quoteNumber;

  // Group items by category, preserving insertion order
  const items = cartState.items;
  const grouped: { category: string; items: typeof items; isTakes: boolean; isDelivery: boolean }[] = [];
  const categoryMap = new Map<string, (typeof grouped)[0]>();

  for (const item of items) {
    const cat = item.category || "Otros";
    if (!categoryMap.has(cat)) {
      const group = { category: cat, items: [] as typeof items, isTakes: false, isDelivery: false };
      categoryMap.set(cat, group);
      grouped.push(group);
    }
    const group = categoryMap.get(cat)!;
    group.items.push(item);
    if (item.id?.startsWith("take-")) group.isTakes = true;
    if (item.id?.startsWith("delivery-")) group.isDelivery = true;
  }

  let itemRows = "";
  for (const group of grouped) {
    let headerLabel = group.category.toUpperCase();
    let headerNote = "";
    if (group.isTakes) {
      headerLabel = "NÚMERO DE TOMAS";
      headerNote = "Cada canción incluye las siguientes tomas de grabación:";
    } else if (group.isDelivery) {
      headerLabel = "PLAZO DE ENTREGA";
      headerNote = "Los plazos indicados se cuentan desde la confirmación del pago.";
    }

    itemRows += `<tr><td colspan="3" style="padding:10px 12px 4px;font-weight:bold;font-size:12px;color:#1a1a2e !important;border-bottom:2px solid #1a1a2e;letter-spacing:0.5px;">${headerLabel}</td></tr>`;

    if (headerNote) {
      itemRows += `<tr><td colspan="3" style="padding:2px 12px 6px;font-size:11px;color:#444 !important;font-style:italic;">${headerNote}</td></tr>`;
    }

    for (const item of group.items) {
      const name = escapeHtml(String(item.name || "Servicio"));
      const desc = (group.isTakes && item.description) ? `<br><span style="font-size:11px;color:#444 !important;font-style:italic;">${escapeHtml(item.description)}</span>` : "";
      const price = typeof item.price === "number" ? item.price.toFixed(2) : "0.00";
      itemRows += `<tr><td style="padding:6px 12px 6px 24px;border-bottom:1px solid #ddd;color:#000;">${name}${desc}</td><td style="padding:6px 12px;border-bottom:1px solid #ddd;text-align:center;color:#000;">${songCount}</td><td style="padding:6px 12px;border-bottom:1px solid #ddd;text-align:right;color:#000;">${price} €</td></tr>`;
    }
  }

  const addressParts = [clientData.fullAddress, clientData.city, clientData.stateProvince, clientData.postalCode].filter(Boolean);
  const fullAddressStr = addressParts.join(", ");

  const clientSection =
    clientData.clientType === "empresa"
      ? `
    <div style="flex:1;text-align:right;">
      <h3 style="margin:0 0 8px;color:#000;font-size:14px;font-weight:bold;">CLIENTE</h3>
      <p style="margin:2px 0;font-weight:bold;color:#000;">${escapeHtml(clientData.businessName || `${clientData.firstName} ${clientData.lastName}`)}</p>
      ${clientData.vatNumber ? `<p style="margin:2px 0;color:#000;">NIF/VAT: ${escapeHtml(clientData.vatNumber)}</p>` : ""}
      ${fullAddressStr ? `<p style="margin:2px 0;color:#000;">${escapeHtml(fullAddressStr)}</p>` : ""}
      <p style="margin:2px 0;color:#000;">${escapeHtml(clientData.contactEmail)}</p>
      ${clientData.phone ? `<p style="margin:2px 0;color:#000;">${escapeHtml(clientData.phone)}</p>` : ""}
    </div>
  `
      : `
    <div style="flex:1;text-align:right;">
      <h3 style="margin:0 0 8px;color:#000;font-size:14px;font-weight:bold;">CLIENTE</h3>
      <p style="margin:2px 0;font-weight:bold;color:#000;">${escapeHtml(clientData.firstName)} ${escapeHtml(clientData.lastName)}</p>
      ${fullAddressStr ? `<p style="margin:2px 0;color:#000;">${escapeHtml(fullAddressStr)}</p>` : ""}
      <p style="margin:2px 0;color:#000;">${escapeHtml(clientData.contactEmail)}</p>
      ${clientData.phone ? `<p style="margin:2px 0;color:#000;">${escapeHtml(clientData.phone)}</p>` : ""}
    </div>
  `;

  return `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><title>PRESUPUESTO ${displayNumber}</title>
<style>* { color: #000 !important; } body { background: #fff !important; }</style>
</head>
<body style="font-family:'Helvetica Neue',Arial,sans-serif;max-width:800px;margin:0 auto;padding:40px;color:#000;background:#fff;">
  <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:40px;">
    <div style="display:flex;align-items:center;gap:16px;">
      ${TM_LOGO_SVG}
      <div>
        <h1 style="margin:0;color:#1a1a2e !important;font-size:28px;">PRESUPUESTO</h1>
        <p style="margin:4px 0;color:#333 !important;">Nº: <strong>${displayNumber}</strong></p>
      </div>
    </div>
    <div style="text-align:right;">
      <p style="margin:4px 0;color:#333 !important;">Fecha: ${date}</p>
      <p style="margin:4px 0;color:#333 !important;">Válido hasta: ${validUntilStr}</p>
    </div>
  </div>

  <div style="display:flex;gap:40px;margin-bottom:40px;">
    <div style="flex:1;">
      <h3 style="margin:0 0 8px;color:#000 !important;font-size:14px;font-weight:bold;">EMISOR</h3>
      <p style="margin:2px 0;font-weight:bold;color:#000 !important;">${COMPANY.name}</p>
      <p style="margin:2px 0;color:#000 !important;">CIF: ${COMPANY.taxId}</p>
      <p style="margin:2px 0;color:#000 !important;">${COMPANY.address}</p>
      <p style="margin:2px 0;color:#000 !important;">${COMPANY.email}</p>
    </div>
    ${clientSection}
  </div>

  <table style="width:100%;border-collapse:collapse;margin-bottom:30px;">
    <thead>
      <tr style="background:#1a1a2e;color:#fff !important;">
        <th style="padding:10px 12px;text-align:left;color:#fff !important;">Concepto</th>
        <th style="padding:10px 12px;text-align:center;color:#fff !important;">Canciones</th>
        <th style="padding:10px 12px;text-align:right;color:#fff !important;">Precio/canción</th>
      </tr>
    </thead>
    <tbody>
      ${itemRows}
    </tbody>
  </table>

  <div style="display:block;width:100%;margin-top:8px;">
    <div style="display:block;width:320px;margin-left:auto;">
      <div style="display:flex;justify-content:space-between;align-items:center;padding:6px 0;color:#000 !important;">
        <span style="color:#000 !important;">Subtotal${songCount > 1 ? ` (×${songCount} canciones)` : ""}:</span>
        <span style="color:#000 !important;">${subtotal.toFixed(2)} €</span>
      </div>
      <div style="display:flex;justify-content:space-between;align-items:center;padding:6px 0;color:#000 !important;">
        <span style="color:#000 !important;">${taxLabel}:</span>
        <span style="color:#000 !important;">${taxAmount.toFixed(2)} €</span>
      </div>
      <div style="display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-top:2px solid #1a1a2e;font-weight:bold;font-size:18px;color:#000 !important;">
        <span style="color:#000 !important;">TOTAL:</span>
        <span style="color:#000 !important;">${total.toFixed(2)} €</span>
      </div>
    </div>
  </div>

  <div style="margin-top:40px;padding:20px;background:#f5f5f5;border-radius:8px;">
    <h3 style="margin:0 0 12px;color:#1a1a2e !important;font-size:14px;">CONDICIONES</h3>
    <ul style="margin:0;padding-left:20px;color:#000 !important;font-size:13px;line-height:1.8;">
      <li style="color:#000 !important;">Validez del presupuesto: ${pricing.validityDays} días desde la fecha de emisión.</li>
      <li style="color:#000 !important;">Forma de pago: ${escapeHtml(pricing.paymentTerms)}.</li>
      <li style="color:#000 !important;">Los precios incluyen la grabación profesional de batería según la configuración indicada.</li>
    </ul>
    ${pricing.notes ? `<p style="margin:12px 0 0;color:#000 !important;font-size:13px;"><strong>Notas:</strong> ${escapeHtml(pricing.notes)}</p>` : ""}
  </div>

  <div style="margin-top:60px;padding-top:20px;border-top:1px solid #ccc;text-align:center;color:#666 !important;font-size:11px;">
    <p style="color:#666 !important;">${COMPANY.name} · CIF: ${COMPANY.taxId} · ${COMPANY.address}</p>
    <p style="color:#666 !important;">www.tonimateos.com</p>
  </div>
</body>
</html>`;
}

export default function QuotePreview({ clientData, cartState, pricing, quoteNumber, onBack, onSave, saving }: Props) {
  const songCount = pricing.songCount || 1;
  const subtotal = cartState.total * songCount;
  const taxRate = pricing.taxResult.taxRate;
  const taxAmount = subtotal * (taxRate / 100);
  const total = subtotal + taxAmount;

  const groupedItems = cartState.items.reduce(
    (acc, item) => {
      if (!acc[item.category]) acc[item.category] = [];
      acc[item.category].push(item);
      return acc;
    },
    {} as Record<string, CartItem[]>
  );

  const handleDownloadPdf = () => {
    const html = generateQuoteHtml(clientData, cartState, pricing, quoteNumber);
    const container = document.createElement("div");
    container.innerHTML = html;
    document.body.appendChild(container);

    html2pdf()
      .set({
        margin: 10,
        filename: `Presupuesto_${quoteNumber}_${clientData.lastName || "cliente"}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, backgroundColor: "#ffffff", logging: false },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      })
      .from(container)
      .save()
      .then(() => {
        document.body.removeChild(container);
        toast.success("PDF descargado");
      })
      .catch(() => {
        document.body.removeChild(container);
        toast.error("Error generando PDF");
      });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">Vista previa del presupuesto</h2>
          <p className="text-sm text-muted-foreground">Revisa los datos antes de guardar o descargar.</p>
        </div>
        <Badge variant="outline" className="text-base px-3 py-1">
          {quoteNumber}
        </Badge>
      </div>

      {/* Client info */}
      <Card>
        <CardContent className="pt-4 pb-3">
          <h3 className="text-sm font-semibold mb-2 text-muted-foreground">CLIENTE</h3>
          <p className="font-medium">
            {clientData.firstName} {clientData.lastName}
            {clientData.businessName && <span className="text-muted-foreground"> — {clientData.businessName}</span>}
          </p>
          <p className="text-sm text-muted-foreground">{clientData.contactEmail}</p>
          {clientData.phone && <p className="text-sm text-muted-foreground">{clientData.phone}</p>}
        </CardContent>
      </Card>

      {/* Items grouped by category */}
      <Card>
        <CardContent className="pt-4 pb-3">
          <h3 className="text-sm font-semibold mb-3 text-muted-foreground">SERVICIOS SELECCIONADOS</h3>
          <div className="space-y-3">
            {Object.entries(groupedItems).map(([category, items]) => (
              <div key={category}>
                <p className="text-xs font-semibold text-primary uppercase mb-1">{category}</p>
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between py-1">
                    <span className="text-sm">{item.name}</span>
                    <span className="text-sm font-medium">{item.price.toFixed(2)} €</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Pricing summary */}
      <Card>
        <CardContent className="pt-4 pb-3">
          <h3 className="text-sm font-semibold mb-3 text-muted-foreground">RESUMEN ECONÓMICO</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Subtotal{songCount > 1 ? ` (×${songCount} canciones)` : ""}:</span>
              <span>{subtotal.toFixed(2)} €</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>{pricing.taxResult.taxLabel}:</span>
              <span>{taxAmount.toFixed(2)} €</span>
            </div>
            <div className="flex justify-between font-bold text-lg pt-2 border-t">
              <span>TOTAL:</span>
              <span>{total.toFixed(2)} €</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Conditions */}
      <Card>
        <CardContent className="pt-4 pb-3">
          <h3 className="text-sm font-semibold mb-2 text-muted-foreground">CONDICIONES</h3>
          <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
            <li>Validez: {pricing.validityDays} días</li>
            <li>Forma de pago: {pricing.paymentTerms}</li>
          </ul>
          {pricing.notes && (
            <p className="text-sm mt-2">
              <span className="font-medium">Notas:</span> {pricing.notes}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-1" /> Volver
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleDownloadPdf}>
            <Download className="h-4 w-4 mr-1" /> Descargar PDF
          </Button>
          <Button onClick={onSave} disabled={saving}>
            <Save className="h-4 w-4 mr-1" /> {saving ? "Guardando..." : "Guardar presupuesto"}
          </Button>
        </div>
      </div>
    </div>
  );
}

export { generateQuoteHtml };
