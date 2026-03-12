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

// TM logo as base64 PNG for PDF embedding (from favicon.ico, resized to 80x80)
const TM_LOGO_BASE64 = "data:image/png;base64,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";

// Map delivery item IDs to business days
const DELIVERY_DAYS: Record<string, string> = {
  "delivery-standard": "10 días laborables",
  "delivery-5days": "5 días laborables",
  "delivery-2days": "2 días laborables",
};

function generateQuoteHtml(
  clientData: QuoteClientData,
  cartState: CartState,
  pricing: QuotePricingData,
  quoteNumber: string,
  quoteId?: string
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

    itemRows += `<tr><td colspan="3" style="padding:12px 14px 5px;font-weight:700;font-size:11px;color:#6c63ff;border-bottom:2px solid #e5e7eb;letter-spacing:1px;text-transform:uppercase;">${headerLabel}</td></tr>`;

    if (headerNote) {
      itemRows += `<tr><td colspan="3" style="padding:2px 14px 6px;font-size:11px;color:#888;font-style:italic;">${headerNote}</td></tr>`;
    }

    let rowIdx = 0;
    for (const item of group.items) {
      const name = escapeHtml(String(item.name || "Servicio"));
      let desc = "";
      if (group.isTakes && item.description) {
        desc = `<br><span style="font-size:11px;color:#888;font-style:italic;">${escapeHtml(item.description)}</span>`;
      } else if (group.isDelivery && item.id && DELIVERY_DAYS[item.id]) {
        desc = `<br><span style="font-size:11px;color:#6c63ff;font-weight:600;">${DELIVERY_DAYS[item.id]}</span>`;
      }
      const price = typeof item.price === "number" ? item.price.toFixed(2) : "0.00";
      const rowBg = rowIdx % 2 === 0 ? "#fff" : "#fafafd";
      itemRows += `<tr style="background:${rowBg};"><td style="padding:8px 14px 8px 24px;border-bottom:1px solid #eee;color:#1a1a2e;font-size:13px;">${name}${desc}</td><td style="padding:8px 14px;border-bottom:1px solid #eee;text-align:center;color:#1a1a2e;font-size:13px;">${songCount}</td><td style="padding:8px 14px;border-bottom:1px solid #eee;text-align:right;color:#1a1a2e;font-size:13px;font-weight:600;">${price} €</td></tr>`;
      rowIdx++;
    }
  }

  const addressParts = [clientData.fullAddress, clientData.city, clientData.stateProvince, clientData.postalCode].filter(Boolean);
  const fullAddressStr = addressParts.join(", ");

  const clientSection =
    clientData.clientType === "empresa"
      ? `
    <div style="flex:1;padding:16px 20px;background:#f8f9fc;border-radius:8px;border-left:4px solid #6c63ff;text-align:right;">
      <h3 style="margin:0 0 8px;color:#1a1a2e;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;">Cliente</h3>
      <p style="margin:2px 0;font-weight:600;color:#1a1a2e;font-size:13px;">${escapeHtml(clientData.businessName || `${clientData.firstName} ${clientData.lastName}`)}</p>
      ${clientData.vatNumber ? `<p style="margin:2px 0;color:#555;font-size:12px;">NIF/VAT: ${escapeHtml(clientData.vatNumber)}</p>` : ""}
      ${fullAddressStr ? `<p style="margin:2px 0;color:#555;font-size:12px;">${escapeHtml(fullAddressStr)}</p>` : ""}
      <p style="margin:2px 0;color:#555;font-size:12px;">${escapeHtml(clientData.contactEmail)}</p>
      ${clientData.phone ? `<p style="margin:2px 0;color:#555;font-size:12px;">${escapeHtml(clientData.phone)}</p>` : ""}
    </div>
  `
      : `
    <div style="flex:1;padding:16px 20px;background:#f8f9fc;border-radius:8px;border-left:4px solid #6c63ff;text-align:right;">
      <h3 style="margin:0 0 8px;color:#1a1a2e;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;">Cliente</h3>
      <p style="margin:2px 0;font-weight:600;color:#1a1a2e;font-size:13px;">${escapeHtml(clientData.firstName)} ${escapeHtml(clientData.lastName)}</p>
      ${fullAddressStr ? `<p style="margin:2px 0;color:#555;font-size:12px;">${escapeHtml(fullAddressStr)}</p>` : ""}
      <p style="margin:2px 0;color:#555;font-size:12px;">${escapeHtml(clientData.contactEmail)}</p>
      ${clientData.phone ? `<p style="margin:2px 0;color:#555;font-size:12px;">${escapeHtml(clientData.phone)}</p>` : ""}
    </div>
  `;

  return `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><title>PRESUPUESTO ${displayNumber}</title>
<style>
  * { color: #1a1a2e; }
  body { background: #fff; margin: 0; padding: 0; }
</style>
</head>
<body style="font-family:'Helvetica Neue',Arial,sans-serif;max-width:800px;margin:0 auto;padding:0;color:#1a1a2e;background:#fff;">

  <!-- Header bar -->
  <div style="background:linear-gradient(135deg,#1a1a2e 0%,#2d2d4e 100%);padding:28px 36px;display:flex;justify-content:space-between;align-items:center;">
    <div style="display:flex;align-items:center;gap:16px;">
      <img src="${TM_LOGO_BASE64}" width="52" height="52" style="display:block;object-fit:contain;border-radius:6px;" alt="TM" />
      <div>
        <h1 style="margin:0;color:#fff;font-size:24px;font-weight:700;letter-spacing:1px;">PRESUPUESTO</h1>
        <p style="margin:3px 0 0;color:rgba(255,255,255,0.7);font-size:13px;">Nº ${displayNumber}</p>
      </div>
    </div>
    <div style="text-align:right;">
      <p style="margin:2px 0;color:rgba(255,255,255,0.85);font-size:13px;">Fecha: ${date}</p>
      <p style="margin:2px 0;color:rgba(255,255,255,0.85);font-size:13px;">Válido hasta: ${validUntilStr}</p>
    </div>
  </div>

  <div style="padding:32px 36px 40px;">

    <!-- Emisor / Cliente -->
    <div style="display:flex;gap:40px;margin-bottom:32px;">
      <div style="flex:1;padding:16px 20px;background:#f8f9fc;border-radius:8px;border-left:4px solid #1a1a2e;">
        <h3 style="margin:0 0 8px;color:#1a1a2e;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;">Emisor</h3>
        <p style="margin:2px 0;font-weight:600;color:#1a1a2e;font-size:13px;">${COMPANY.name}</p>
        <p style="margin:2px 0;color:#555;font-size:12px;">CIF: ${COMPANY.taxId}</p>
        <p style="margin:2px 0;color:#555;font-size:12px;">${COMPANY.address}</p>
        <p style="margin:2px 0;color:#555;font-size:12px;">${COMPANY.email}</p>
      </div>
      ${clientSection}
    </div>

    <!-- Items table -->
    <table style="width:100%;border-collapse:collapse;margin-bottom:28px;">
      <thead>
        <tr style="background:#1a1a2e;">
          <th style="padding:11px 14px;text-align:left;color:#fff;font-size:12px;font-weight:600;letter-spacing:0.5px;">Concepto</th>
          <th style="padding:11px 14px;text-align:center;color:#fff;font-size:12px;font-weight:600;letter-spacing:0.5px;">Canciones</th>
          <th style="padding:11px 14px;text-align:right;color:#fff;font-size:12px;font-weight:600;letter-spacing:0.5px;">Precio/canción</th>
        </tr>
      </thead>
      <tbody>
        ${itemRows}
      </tbody>
    </table>

    <!-- Totals -->
    <div style="display:block;width:100%;margin-top:8px;">
      <div style="display:block;width:320px;margin-left:auto;background:#f8f9fc;border-radius:8px;padding:16px 20px;">
        <div style="display:flex;justify-content:space-between;align-items:center;padding:5px 0;color:#444;font-size:13px;">
          <span>Subtotal${songCount > 1 ? ` (×${songCount} canciones)` : ""}:</span>
          <span>${subtotal.toFixed(2)} €</span>
        </div>
        <div style="display:flex;justify-content:space-between;align-items:center;padding:5px 0;color:#444;font-size:13px;">
          <span>${taxLabel}:</span>
          <span>${taxAmount.toFixed(2)} €</span>
        </div>
        <div style="display:flex;justify-content:space-between;align-items:center;padding:10px 0 4px;border-top:2px solid #1a1a2e;font-weight:700;font-size:18px;color:#1a1a2e;margin-top:6px;">
          <span>TOTAL:</span>
          <span>${total.toFixed(2)} €</span>
        </div>
        <p style="margin:4px 0 0;font-size:10px;color:#888;text-align:right;">* Pago con PayPal: recargo del 5%. Transferencia bancaria: sin recargos.</p>
      </div>
    </div>

    <!-- Conditions -->
    <div style="margin-top:32px;padding:18px 22px;background:#f8f9fc;border-radius:8px;border-left:4px solid #6c63ff;">
      <h3 style="margin:0 0 10px;color:#1a1a2e;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1px;">Condiciones</h3>
      <ul style="margin:0;padding-left:18px;color:#444;font-size:12px;line-height:1.9;">
        <li>Validez del presupuesto: ${pricing.validityDays} días desde la fecha de emisión.</li>
        <li>Forma de pago: ${escapeHtml(pricing.paymentTerms)}.</li>
        <li>Los precios incluyen la grabación profesional de batería según la configuración indicada.</li>
      </ul>
      ${pricing.notes ? `<p style="margin:10px 0 0;color:#444;font-size:12px;"><strong>Notas:</strong> ${escapeHtml(pricing.notes)}</p>` : ""}
    </div>

    <!-- CTA Button -->
    ${quoteId ? `
    <div style="text-align:center;margin-top:36px;">
      <a href="https://tonimateos.com/presupuesto/${quoteId}" style="display:inline-block;padding:16px 48px;background:linear-gradient(135deg,#6c63ff 0%,#1a1a2e 100%);color:#fff;text-decoration:none;border-radius:10px;font-weight:700;font-size:15px;letter-spacing:0.5px;box-shadow:0 4px 14px rgba(108,99,255,0.35);">CONFIRMAR PRESUPUESTO Y PAGAR</a>
      <p style="margin-top:10px;font-size:11px;color:#888;">Al hacer click serás redirigido a tonimateos.com para completar el pago de forma segura.</p>
    </div>
    ` : ""}

  </div>

  <!-- Footer -->
  <div style="padding:16px 36px;border-top:1px solid #e5e7eb;text-align:center;color:#999;font-size:10px;background:#fafafa;">
    <p style="margin:2px 0;">${COMPANY.name} · CIF: ${COMPANY.taxId}</p>
    <p style="margin:2px 0;">${COMPANY.address}</p>
    <p style="margin:2px 0;">www.tonimateos.com</p>
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
