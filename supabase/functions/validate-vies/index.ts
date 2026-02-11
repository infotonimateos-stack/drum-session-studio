import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[VALIDATE-VIES] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const { countryCode, vatNumber } = await req.json();

    if (!countryCode || typeof countryCode !== "string" || countryCode.length !== 2) {
      throw new Error("Invalid country code");
    }
    if (!vatNumber || typeof vatNumber !== "string" || vatNumber.length < 4 || vatNumber.length > 20) {
      throw new Error("Invalid VAT number");
    }

    // Clean VAT number - remove spaces, dashes, and country prefix if present
    let cleanVat = vatNumber.replace(/[\s\-\.]/g, "").toUpperCase();
    if (cleanVat.startsWith(countryCode.toUpperCase())) {
      cleanVat = cleanVat.substring(2);
    }

    logStep("Validating VAT", { countryCode, cleanVat });

    // Call EU VIES SOAP API
    const soapBody = `<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:ec.europa.eu:taxud:vies:services:checkVat:types">
  <soapenv:Body>
    <urn:checkVat>
      <urn:countryCode>${countryCode.toUpperCase()}</urn:countryCode>
      <urn:vatNumber>${cleanVat}</urn:vatNumber>
    </urn:checkVat>
  </soapenv:Body>
</soapenv:Envelope>`;

    const response = await fetch("https://ec.europa.eu/taxation_customs/vies/services/checkVatService", {
      method: "POST",
      headers: {
        "Content-Type": "text/xml;charset=UTF-8",
        "SOAPAction": "",
      },
      body: soapBody,
    });

    if (!response.ok) {
      logStep("VIES API error", { status: response.status });
      // VIES might be down — return unavailable rather than erroring
      return new Response(JSON.stringify({
        valid: false,
        error: "VIES_UNAVAILABLE",
        message: "El servicio VIES no está disponible. Inténtalo de nuevo.",
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    const responseText = await response.text();
    logStep("VIES response received", { length: responseText.length });

    // Parse the SOAP response
    const validMatch = responseText.match(/<ns2:valid>(true|false)<\/ns2:valid>/);
    const nameMatch = responseText.match(/<ns2:name>([^<]*)<\/ns2:name>/);
    const addressMatch = responseText.match(/<ns2:address>([^<]*)<\/ns2:address>/);

    const isValid = validMatch ? validMatch[1] === "true" : false;
    const companyName = nameMatch ? nameMatch[1].trim() : null;
    const companyAddress = addressMatch ? addressMatch[1].trim() : null;

    logStep("Validation result", { isValid, companyName });

    return new Response(JSON.stringify({
      valid: isValid,
      countryCode: countryCode.toUpperCase(),
      vatNumber: cleanVat,
      companyName: companyName || null,
      companyAddress: companyAddress || null,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    return new Response(JSON.stringify({ valid: false, error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
