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
  customerEmail: string;
  customerName?: string;
  paymentMethod: 'stripe' | 'paypal';
  orderId?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    // Verify the caller is a service role (internal call from other edge functions)
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const token = authHeader.replace("Bearer ", "");
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: authHeader } } }
    );

    // getClaims will succeed for both service_role and authenticated users
    const { data: claimsData, error: claimsError } = await supabase.auth.getClaims(token);
    
    // Only allow service_role calls (from other edge functions)
    if (claimsError || !claimsData?.claims || claimsData.claims.role !== "service_role") {
      logStep("Unauthorized: not a service role call", { role: claimsData?.claims?.role });
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
    logStep("Resend API key verified");

    const resend = new Resend(resendApiKey);

    const { customerEmail, customerName, paymentMethod, orderId }: OrderEmailRequest = await req.json();
    logStep("Received request", { customerEmail, paymentMethod, orderId });

    // Validate required fields
    if (!customerEmail || typeof customerEmail !== "string" || customerEmail.length > 255) {
      throw new Error("Invalid customer email");
    }

    // Basic email format check
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail)) {
      throw new Error("Invalid email format");
    }

    const greeting = customerName ? `¡Hola ${customerName}!` : "¡Hola!";

    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Instrucciones para tu grabación</title>
</head>
<body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
  <div style="background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
    <h1 style="color: white; margin: 0; font-size: 24px;">🥁 Drum Session Studio</h1>
    <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">Groove Factory Studios SL</p>
  </div>
  
  <div style="background: white; padding: 30px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
    <h2 style="color: #ea580c; margin-top: 0;">${greeting}</h2>
    
    <p style="font-size: 16px;">Hemos recibido tu pago, <strong>muchas gracias</strong>. Para empezar la grabación necesitamos que nos envíes lo siguiente a <a href="mailto:info@tonimateos.com" style="color: #ea580c; text-decoration: none; font-weight: bold;">info@tonimateos.com</a>:</p>
    
    <div style="background: #fff7ed; border-left: 4px solid #ea580c; padding: 20px; margin: 20px 0; border-radius: 0 8px 8px 0;">
      <ul style="margin: 0; padding-left: 20px;">
        <li style="margin-bottom: 12px;">📁 Un archivo <strong>WAV estéreo</strong> de tu canción <strong>SIN BATERÍA</strong></li>
        <li style="margin-bottom: 12px;">🥁 Un archivo <strong>WAV estéreo</strong> de tu canción <strong>SOLO LA BATERÍA DEMO</strong></li>
        <li style="margin-bottom: 12px;">🎚️ El <strong>bit/sample rate</strong> de tu proyecto (frecuencia de muestreo y bits)</li>
        <li style="margin-bottom: 12px;">⏱️ El <strong>tempo exacto en BPMs</strong> (o archivo MIDI tempo map si contiene cambios de tempo)</li>
        <li style="margin-bottom: 0;">📝 Indicaciones sobre la <strong>sonoridad, estilo</strong>, etc. si lo consideras oportuno (puedes añadir links de YouTube o Spotify)</li>
      </ul>
    </div>
    
    <p style="font-size: 16px; margin-top: 25px;">Pronto recibirás tus pistas de batería. <strong>Muchas gracias</strong>.</p>
    
    <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center;">
      <p style="color: #666; font-size: 14px; margin: 0;">Un saludo,</p>
      <p style="color: #ea580c; font-weight: bold; font-size: 16px; margin: 5px 0 0 0;">Toni Mateos</p>
      <p style="color: #888; font-size: 12px; margin: 5px 0 0 0;">Groove Factory Studios SL</p>
    </div>
  </div>
  
  <div style="text-align: center; margin-top: 20px; padding: 20px;">
    <p style="color: #888; font-size: 12px; margin: 0;">
      ¿Tienes alguna pregunta? Escríbenos a <a href="mailto:info@tonimateos.com" style="color: #ea580c;">info@tonimateos.com</a>
    </p>
  </div>
</body>
</html>
    `;

    const emailResponse = await resend.emails.send({
      from: "Groove Factory Studios <info@tonimateos.com>",
      to: [customerEmail],
      subject: "Instrucciones para tu grabación de baterías - Groove Factory Studios",
      html: emailHtml,
    });

    logStep("Email sent successfully", { emailResponse });

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
