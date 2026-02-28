import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[GENERATE-INVOICE] ${step}${detailsStr}`);
};

// Groove Factory Studios SL fiscal data
const COMPANY = {
  name: "Groove Factory Studios SL",
  taxId: "B42915165",
  address: "C/ Balançó i Boter 22, Ático (2ª plt.), 08302 Mataró (Barcelona), España",
  email: "info@tonimateos.com",
};

function escapeHtml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function generateInvoiceHtml(order: any): string {
  const isProfessional = order.is_professional_invoice === true;
  const invoiceNumber = order.invoice_number || 'W-0000';
  const date = new Date(order.created_at).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
  const items = Array.isArray(order.items) ? order.items : [];

  // Build full address string from components
  const addressParts = [
    order.full_address,
    order.city,
    order.state_province,
    order.postal_code,
    order.country_code,
  ].filter(Boolean);
  const fullAddressStr = addressParts.join(', ');

  const recipientSection = isProfessional ? `
    <div style="flex:1;text-align:right;">
      <h3 style="margin:0 0 8px;color:#333;font-size:14px;">DATOS DEL CLIENTE</h3>
      <p style="margin:2px 0;font-weight:bold;">${escapeHtml(order.business_name || '')}</p>
      <p style="margin:2px 0;">${escapeHtml(order.vat_number || '')}</p>
      <p style="margin:2px 0;">${escapeHtml(fullAddressStr)}</p>
      <p style="margin:2px 0;">${escapeHtml(order.billing_email || '')}</p>
      <p style="margin:2px 0;">${escapeHtml(order.billing_phone || '')}</p>
    </div>
  ` : '';

  const title = isProfessional ? 'FACTURA' : 'FACTURA SIMPLIFICADA';

  let itemRows = '';
  for (const item of items) {
    const name = escapeHtml(String(item.name || 'Servicio'));
    const price = typeof item.price === 'number' ? item.price.toFixed(2) : '0.00';
    itemRows += `<tr><td style="padding:8px 12px;border-bottom:1px solid #eee;">${name}</td><td style="padding:8px 12px;border-bottom:1px solid #eee;text-align:center;">1</td><td style="padding:8px 12px;border-bottom:1px solid #eee;text-align:right;">${price} €</td></tr>`;
  }

  if (order.base_price > 0) {
    itemRows = `<tr><td style="padding:8px 12px;border-bottom:1px solid #eee;">Paquete Básico - Grabación de Batería</td><td style="padding:8px 12px;border-bottom:1px solid #eee;text-align:center;">1</td><td style="padding:8px 12px;border-bottom:1px solid #eee;text-align:right;">${Number(order.base_price).toFixed(2)} €</td></tr>` + itemRows;
  }

  const subtotal = Number(order.subtotal || 0).toFixed(2);
  const taxRate = Number(order.tax_rate || 0);
  const taxAmount = Number(order.tax_amount || 0).toFixed(2);
  const taxLabel = taxRate > 0 ? `IVA ${taxRate}%` : 'IVA 0% (Exento)';
  const paypalFee = Number(order.paypal_fee || 0);
  const total = Number(order.total || 0).toFixed(2);

  return `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><title>${title} ${invoiceNumber}</title></head>
<body style="font-family:'Helvetica Neue',Arial,sans-serif;max-width:800px;margin:0 auto;padding:40px;color:#333;">
  <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:40px;">
    <div>
      <h1 style="margin:0;color:#1a1a2e;font-size:28px;">${title}</h1>
      <p style="margin:4px 0;color:#666;">Nº: <strong>${invoiceNumber}</strong></p>
      <p style="margin:4px 0;color:#666;">Fecha: ${date}</p>
    </div>
  </div>

  <div style="display:flex;gap:40px;margin-bottom:40px;">
    <div style="flex:1;">
      <h3 style="margin:0 0 8px;color:#333;font-size:14px;">EMISOR</h3>
      <p style="margin:2px 0;font-weight:bold;">${COMPANY.name}</p>
      <p style="margin:2px 0;">CIF: ${COMPANY.taxId}</p>
      <p style="margin:2px 0;">${COMPANY.address}</p>
      <p style="margin:2px 0;">${COMPANY.email}</p>
    </div>
    ${recipientSection}
  </div>

  <table style="width:100%;border-collapse:collapse;margin-bottom:30px;">
    <thead>
      <tr style="background:#1a1a2e;color:white;">
        <th style="padding:10px 12px;text-align:left;">Concepto</th>
        <th style="padding:10px 12px;text-align:center;">Cantidad</th>
        <th style="padding:10px 12px;text-align:right;">Importe</th>
      </tr>
    </thead>
    <tbody>
      ${itemRows}
    </tbody>
  </table>

  <div class="invoice-summary-block" style="display:block;width:100%;margin-top:8px;page-break-inside:avoid !important;break-inside:avoid-page !important;-webkit-column-break-inside:avoid !important;">
    <div style="display:block;width:320px;margin-left:auto;page-break-inside:avoid !important;break-inside:avoid-page !important;">
      <div class="invoice-summary-row" style="display:flex;justify-content:space-between;align-items:center;padding:6px 0;page-break-inside:avoid !important;break-inside:avoid-page !important;">
        <span>Base Imponible:</span>
        <span>${subtotal} €</span>
      </div>
      <div class="invoice-summary-row" style="display:flex;justify-content:space-between;align-items:center;padding:6px 0;page-break-inside:avoid !important;break-inside:avoid-page !important;">
        <span>${taxLabel}:</span>
        <span>${taxAmount} €</span>
      </div>
      ${paypalFee > 0 ? `<div class="invoice-summary-row" style="display:flex;justify-content:space-between;align-items:center;padding:6px 0;page-break-inside:avoid !important;break-inside:avoid-page !important;"><span>Gastos de gestión:</span><span>${paypalFee.toFixed(2)} €</span></div>` : ''}
      <div class="invoice-summary-total" style="display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-top:2px solid #1a1a2e;font-weight:bold;font-size:18px;page-break-inside:avoid !important;break-inside:avoid-page !important;">
        <span>TOTAL:</span>
        <span>${total} €</span>
      </div>
    </div>
  </div>

  <div style="margin-top:60px;padding-top:20px;border-top:1px solid #ddd;text-align:center;color:#999;font-size:11px;">
    <p>${COMPANY.name} · CIF: ${COMPANY.taxId} · ${COMPANY.address}</p>
    <p>Serie: ${order.invoice_series || 'W'} · Documento generado automáticamente</p>
  </div>
</body>
</html>`;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!supabaseUrl || !serviceRoleKey) throw new Error("Missing Supabase config");

    // Validate authorization - only internal calls allowed
    const authHeader = req.headers.get("authorization");
    if (authHeader !== `Bearer ${serviceRoleKey}`) {
      // Also allow anon calls with orderId for client access
      const { orderId } = await req.json();
      if (!orderId || typeof orderId !== "string") throw new Error("Invalid order ID");

      const supabase = createClient(supabaseUrl, serviceRoleKey);
      const { data: order, error } = await supabase.from("orders").select("*").eq("id", orderId).single();
      if (error || !order) throw new Error("Order not found");

      logStep("Generating invoice HTML", { orderId, invoiceNumber: order.invoice_number });
      const html = generateInvoiceHtml(order);

      return new Response(JSON.stringify({ html, invoiceNumber: order.invoice_number }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { orderId } = await req.json();
    if (!orderId || typeof orderId !== "string") throw new Error("Invalid order ID");

    const supabase = createClient(supabaseUrl, serviceRoleKey);
    const { data: order, error } = await supabase.from("orders").select("*").eq("id", orderId).single();
    if (error || !order) throw new Error("Order not found");

    logStep("Generating invoice HTML (internal)", { orderId, invoiceNumber: order.invoice_number });
    const html = generateInvoiceHtml(order);

    return new Response(JSON.stringify({ html, invoiceNumber: order.invoice_number }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
