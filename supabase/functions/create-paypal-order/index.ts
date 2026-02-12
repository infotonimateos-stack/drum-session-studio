import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CREATE-PAYPAL-ORDER] ${step}${detailsStr}`);
};

const PAYPAL_API_BASE = "https://api-m.paypal.com";

const getPayPalAccessToken = async (clientId: string, clientSecret: string): Promise<string> => {
  const auth = btoa(`${clientId}:${clientSecret}`);
  const response = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      "Authorization": `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to get PayPal access token: ${error}`);
  }
  const data = await response.json();
  return data.access_token;
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const clientId = Deno.env.get("PAYPAL_CLIENT_ID");
    const clientSecret = Deno.env.get("PAYPAL_CLIENT_SECRET");
    if (!clientId || !clientSecret) throw new Error("PayPal credentials are not configured");

    const requestBody = await req.json();
    const {
      items, basePrice, subtotal, total,
      taxRate, taxAmount, taxRule, taxLabel,
      paypalFee,
      billingCountry, billingPostalCode, clientType,
      vatNumber, viesValid,
    } = requestBody;

    logStep("Received data", { itemCount: items?.length, subtotal, taxAmount, paypalFee, total });

    // Input validation
    if (!total || typeof total !== "number" || total <= 0 || total > 15000) throw new Error("Invalid total amount");
    if (typeof basePrice !== "number" || basePrice < 0 || basePrice > 10000) throw new Error("Invalid base price");
    if (items && (!Array.isArray(items) || items.length > 50)) throw new Error("Invalid items");

    const accessToken = await getPayPalAccessToken(clientId, clientSecret);
    logStep("PayPal access token obtained");

    // Build PayPal items
    const paypalItems = [];
    if (basePrice > 0) {
      paypalItems.push({
        name: "Paquete Básico - Grabación de Batería",
        description: "Grabación profesional de batería",
        unit_amount: { currency_code: "EUR", value: basePrice.toFixed(2) },
        quantity: "1",
      });
    }

    if (items && items.length > 0) {
      for (const item of items) {
        if (!item.name || typeof item.price !== "number" || item.price < 0 || item.price > 10000) throw new Error("Invalid item data");
        paypalItems.push({
          name: String(item.name).substring(0, 127),
          description: String(item.description || item.category || "").substring(0, 127),
          unit_amount: { currency_code: "EUR", value: item.price.toFixed(2) },
          quantity: "1",
        });
      }
    }

    // Calculate item_total (base + addons)
    const itemTotal = basePrice + (items || []).reduce((s: number, i: any) => s + (i.price || 0), 0);
    const safeTaxAmount = typeof taxAmount === "number" ? taxAmount : 0;
    const safePaypalFee = typeof paypalFee === "number" && paypalFee > 0 ? paypalFee : 0;

    logStep("Breakdown", { itemTotal, safeTaxAmount, safePaypalFee, total });

    const origin = req.headers.get("origin") || "https://drum-session-studio.lovable.app";

    // Check if this is an SDK-based request (no redirect needed)
    const sdkMode = Boolean(requestBody.sdkMode);

    const orderBody: any = {
      intent: "CAPTURE",
      purchase_units: [{
        amount: {
          currency_code: "EUR",
          value: total.toFixed(2),
          breakdown: {
            item_total: { currency_code: "EUR", value: itemTotal.toFixed(2) },
            tax_total: { currency_code: "EUR", value: safeTaxAmount.toFixed(2) },
            handling: { currency_code: "EUR", value: safePaypalFee.toFixed(2) },
          },
        },
        items: paypalItems,
      }],
    };

    // Only add application_context with return/cancel URLs for redirect flow
    if (!sdkMode) {
      orderBody.application_context = {
        brand_name: "Drum Session Studio",
        locale: "es-ES",
        landing_page: "NO_PREFERENCE",
        shipping_preference: "NO_SHIPPING",
        user_action: "PAY_NOW",
        return_url: `${origin}/success?method=paypal`,
        cancel_url: `${origin}/`,
      };
    } else {
      orderBody.payment_source = {
        card: {
          experience_context: {
            shipping_preference: "NO_SHIPPING",
          },
        },
      };
    }

    const orderResponse = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderBody),
    });

    if (!orderResponse.ok) {
      const error = await orderResponse.text();
      logStep("PayPal order creation failed", { error });
      throw new Error(`Failed to create PayPal order: ${error}`);
    }

    const orderData = await orderResponse.json();
    logStep("PayPal order created", { orderId: orderData.id });

    // For SDK mode, approval link is not needed
    const approvalLink = orderData.links?.find((link: any) => link.rel === "approve");
    if (!sdkMode && !approvalLink) throw new Error("No approval URL found in PayPal response");

    // Save order to DB
    try {
      const supabaseUrl = Deno.env.get("SUPABASE_URL");
      const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
      if (supabaseUrl && supabaseServiceKey) {
        const supabase = createClient(supabaseUrl, supabaseServiceKey);
        await supabase.from("orders").insert({
          payment_method: "paypal",
          payment_id: orderData.id,
          payment_status: "pending",
          items: items || [],
          base_price: basePrice,
          subtotal: subtotal || itemTotal,
          tax_amount: safeTaxAmount,
          tax_rate: taxRate || 0,
          paypal_fee: safePaypalFee,
          total: total,
          country_code: billingCountry || 'ES',
          postal_code: billingPostalCode || null,
          client_type: clientType || 'particular',
          vat_number: vatNumber || null,
          vies_valid: viesValid ?? null,
          tax_rule: taxRule || 'spain_peninsula',
        });
        logStep("Order saved to DB");
      }
    } catch (dbErr) {
      logStep("DB save error (non-fatal)", { message: String(dbErr) });
    }

    return new Response(JSON.stringify({
      url: approvalLink?.href || null,
      orderId: orderData.id,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
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
