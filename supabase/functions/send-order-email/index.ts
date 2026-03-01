import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.2";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[SEND-ORDER-EMAIL] ${step}${detailsStr}`);
};

interface OrderEmailRequest {
  orderId: string;
  customerEmail?: string;
  customerName?: string;
}

// ---- Invoice HTML generator (same as generate-invoice but self-contained) ----
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

  const addressParts = [order.full_address, order.city, order.state_province, order.postal_code, order.country_code].filter(Boolean);
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
<head><meta charset="UTF-8"><title>${title} ${invoiceNumber}</title>
<style>
  @media print {
    .invoice-summary-block { page-break-inside: avoid !important; break-inside: avoid !important; }
  }
</style>
</head>
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
    <tbody>${itemRows}</tbody>
  </table>
  <div class="invoice-summary-block" style="display:block;width:100%;margin-top:8px;page-break-inside:avoid !important;break-inside:avoid-page !important;">
    <div style="display:block;width:320px;margin-left:auto;page-break-inside:avoid !important;break-inside:avoid-page !important;">
      <div style="display:flex;justify-content:space-between;align-items:center;padding:6px 0;"><span>Base Imponible:</span><span>${subtotal} €</span></div>
      <div style="display:flex;justify-content:space-between;align-items:center;padding:6px 0;"><span>${taxLabel}:</span><span>${taxAmount} €</span></div>
      ${paypalFee > 0 ? `<div style="display:flex;justify-content:space-between;align-items:center;padding:6px 0;"><span>Gastos de gestión:</span><span>${paypalFee.toFixed(2)} €</span></div>` : ''}
      <div style="display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-top:2px solid #1a1a2e;font-weight:bold;font-size:18px;"><span>TOTAL:</span><span>${total} €</span></div>
    </div>
  </div>
  <div style="margin-top:60px;padding-top:20px;border-top:1px solid #ddd;text-align:center;color:#999;font-size:11px;">
    <p>${COMPANY.name} · CIF: ${COMPANY.taxId} · ${COMPANY.address}</p>
    <p>Serie: ${order.invoice_series || 'W'} · Documento generado automáticamente</p>
  </div>
</body>
</html>`;
}

// ---- HTML to PDF conversion using a headless approach ----
async function htmlToPdfBase64(html: string): Promise<string> {
  // Use a simple HTML-to-PDF service or encode the HTML as a data URI for attachment
  // Since we can't run a headless browser in edge functions, we'll attach the invoice as HTML
  // wrapped in a proper document that can be opened/printed as PDF by the client.
  // Actually, let's use the jsPDF-like approach via a third-party API or encode as HTML attachment.
  // For reliability, we'll attach the invoice HTML as a .html file that renders perfectly and can be printed to PDF.
  
  // Base64 encode the HTML for attachment
  const encoder = new TextEncoder();
  const bytes = encoder.encode(html);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

    if (!supabaseUrl || !serviceRoleKey) {
      throw new Error("Missing Supabase config");
    }

    // Verify caller is service_role
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const token = authHeader.replace("Bearer ", "");
    if (token !== serviceRoleKey) {
      logStep("Unauthorized: not a service role call");
      return new Response(JSON.stringify({ error: "Forbidden: internal use only" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    logStep("Service role authorization verified");

    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) {
      throw new Error("RESEND_API_KEY is not configured");
    }

    const resend = new Resend(resendApiKey);
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    const { orderId, customerEmail: overrideEmail, customerName: overrideName }: OrderEmailRequest = await req.json();
    logStep("Received request", { orderId });

    if (!orderId || typeof orderId !== "string") {
      throw new Error("orderId is required");
    }

    // Fetch the order from DB
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .single();

    if (orderError || !order) {
      throw new Error(`Order not found: ${orderError?.message || orderId}`);
    }

    logStep("Order fetched", { invoiceNumber: order.invoice_number, contactEmail: order.contact_email });

    // Determine recipient email and name
    const recipientEmail = overrideEmail || order.contact_email || order.billing_email;
    if (!recipientEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recipientEmail)) {
      throw new Error("No valid recipient email found");
    }

    const customerName = overrideName || 
      [order.first_name, order.last_name].filter(Boolean).join(' ') || 
      order.business_name || 
      'cliente';

    logStep("Recipient determined", { recipientEmail, customerName });

    // Generate invoice HTML and convert to base64
    const invoiceHtml = generateInvoiceHtml(order);
    const invoiceBase64 = await htmlToPdfBase64(invoiceHtml);
    const invoiceFilename = `factura-${order.invoice_number || 'W-0000'}.html`;

    // Build tracking pixel URL
    const trackingPixelUrl = `${supabaseUrl}/functions/v1/email-open-tracker?oid=${order.id}`;

    // Build email body HTML
    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Tu grabación en Groove Factory Studios</title>
</head>
<body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.7; color: #333; max-width: 640px; margin: 0 auto; padding: 0; background-color: #f4f4f4;">
  <div style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); padding: 32px; text-align: center;">
    <h1 style="color: #c8a45a; margin: 0; font-size: 22px; letter-spacing: 1px;">🥁 GROOVE FACTORY STUDIOS</h1>
    <p style="color: rgba(255,255,255,0.7); margin: 8px 0 0 0; font-size: 13px;">Grabación de Batería Profesional</p>
  </div>

  <div style="background: #ffffff; padding: 32px; border-radius: 0 0 8px 8px;">
    <p style="font-size: 16px; margin-top: 0;">Hola <strong>${escapeHtml(customerName)}</strong>,</p>

    <p>Gracias por confiar en Groove Factory para tu grabación. Adjunto a este mensaje encontrarás la factura correspondiente a tu pedido.</p>

    <div style="background: #f8f7f4; border-left: 4px solid #c8a45a; padding: 20px; margin: 24px 0; border-radius: 0 8px 8px 0;">
      <p style="margin: 0 0 12px 0; font-weight: bold; color: #1a1a2e;">📋 Recuerda enviarnos el siguiente material a <a href="mailto:info@tonimateos.com" style="color: #c8a45a; text-decoration: none; font-weight: bold;">info@tonimateos.com</a>:</p>
      <ul style="margin: 0; padding-left: 20px;">
        <li style="margin-bottom: 8px;">📁 Un archivo <strong>WAV estéreo</strong> de tu canción <strong>SIN BATERÍA</strong></li>
        <li style="margin-bottom: 8px;">🥁 Un archivo <strong>WAV estéreo</strong> de tu canción <strong>SOLO LA BATERÍA DEMO</strong></li>
        <li style="margin-bottom: 8px;">🎚️ El <strong>bit/sample rate</strong> de tu proyecto (frecuencia de muestreo y bits)</li>
        <li style="margin-bottom: 8px;">⏱️ El <strong>tempo exacto en BPMs</strong> (o archivo MIDI tempo map si contiene cambios de tempo)</li>
        <li style="margin-bottom: 0;">📝 Indicaciones sobre la <strong>sonoridad, estilo</strong>, etc. si lo consideras oportuno (puedes añadir links de YouTube o Spotify)</li>
      </ul>
    </div>

    <p>Aunque para esta sesión seleccionaste una configuración específica, te informamos de que hemos capturado tu batería utilizando <strong>toda nuestra infraestructura técnica</strong>. Esto significa que todavía estás a tiempo de potenciar tu sonido con los siguientes extras:</p>

    <div style="background: #1a1a2e; color: #e0e0e0; padding: 24px; border-radius: 8px; margin: 20px 0;">
      <p style="margin: 0 0 16px 0; font-weight: bold; color: #c8a45a; font-size: 15px;">🎯 Extras disponibles para tu sesión:</p>
      <ol style="margin: 0; padding-left: 20px; line-height: 2;">
        <li><strong style="color: #c8a45a;">Microfonía Premium:</strong> Consigue ese matiz legendario añadiendo pistas de micros como el Telefunken C12, Coles 4038, Neumann U47 FET o AEA R88.</li>
        <li><strong style="color: #c8a45a;">Contenido para Redes Sociales:</strong> Vídeos profesionales en 4K y saludos personalizados para tus seguidores.</li>
        <li><strong style="color: #c8a45a;">Servicios de Producción:</strong> Mezclas Work Mix o fotografías de las partituras que se usaron en tu grabación.</li>
        <li><strong style="color: #c8a45a;">Entrega Express:</strong> Recibe tus archivos finales en solo 48 horas con prioridad absoluta.</li>
        <li><strong style="color: #c8a45a;">Consultoría Técnica:</strong> Videollamada de 10 minutos para comentar detalles de la producción.</li>
      </ol>
    </div>

    <div style="text-align: center; margin: 28px 0;">
      <a href="https://tonimateos.com/ampliar-pedido" style="display: inline-block; background: linear-gradient(135deg, #c8a45a, #d4b06a); color: #1a1a2e; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 15px; letter-spacing: 0.5px;">➕ Añadir extras a mi pedido</a>
    </div>

    <p>Si tienes dudas, responde a este correo.</p>

    <div style="margin-top: 32px; padding-top: 20px; border-top: 1px solid #eee; text-align: center;">
      <p style="color: #666; font-size: 14px; margin: 0;">Un saludo,</p>
      <p style="color: #c8a45a; font-weight: bold; font-size: 16px; margin: 5px 0 0 0;">Toni Mateos</p>
      <p style="color: #888; font-size: 12px; margin: 5px 0 0 0;">Groove Factory Studios SL</p>
    </div>
  </div>

  <div style="text-align: center; margin-top: 20px; padding: 20px;">
    <p style="color: #888; font-size: 11px; margin: 0;">
      Groove Factory Studios SL · CIF: B42915165 · tonimateos.com
    </p>
  </div>

  <img src="${trackingPixelUrl}" width="1" height="1" style="display:none;" alt="" />
</body>
</html>`;

    // Send email with invoice attachment
    const emailResponse = await resend.emails.send({
      from: "Groove Factory Studios <web@tonimateos.com>",
      to: [recipientEmail],
      subject: `Tu factura ${order.invoice_number || ''} - Groove Factory Studios`,
      html: emailHtml,
      attachments: [
        {
          filename: invoiceFilename,
          content: invoiceBase64,
          type: "text/html",
        },
      ],
    });

    logStep("Email sent successfully", { emailResponse });

    // Update order email_status to 'sent'
    await supabase
      .from("orders")
      .update({ email_status: "sent", email_sent_at: new Date().toISOString() })
      .eq("id", orderId);

    logStep("Order email_status updated to 'sent'");

    return new Response(JSON.stringify({ success: true, emailId: emailResponse.id }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    logStep("ERROR", { message: error.message });
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
};

serve(handler);
