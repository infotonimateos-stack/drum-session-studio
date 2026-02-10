import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

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
    
    if (!clientId || !clientSecret) {
      throw new Error("PayPal credentials are not configured");
    }
    logStep("PayPal credentials verified");

    const { items, basePrice, total, paypalFee, totalWithFee } = await req.json();
    logStep("Received cart data", { itemCount: items?.length, basePrice, total, paypalFee, totalWithFee });

    // Input validation
    const finalTotal = totalWithFee || total;
    if (!finalTotal || typeof finalTotal !== "number" || finalTotal <= 0 || finalTotal > 10000) {
      throw new Error("Invalid total amount");
    }
    if (!basePrice || typeof basePrice !== "number" || basePrice <= 0 || basePrice > 10000) {
      throw new Error("Invalid base price");
    }
    if (items && (!Array.isArray(items) || items.length > 50)) {
      throw new Error("Invalid items");
    }

    const accessToken = await getPayPalAccessToken(clientId, clientSecret);
    logStep("PayPal access token obtained");

    const paypalItems = [];
    
    paypalItems.push({
      name: "Paquete Básico - Grabación de Batería",
      description: "Grabación profesional de batería",
      unit_amount: {
        currency_code: "EUR",
        value: basePrice.toFixed(2),
      },
      quantity: "1",
    });

    if (items && items.length > 0) {
      for (const item of items) {
        if (!item.name || typeof item.price !== "number" || item.price < 0 || item.price > 10000) {
          throw new Error("Invalid item data");
        }
        paypalItems.push({
          name: String(item.name).substring(0, 127),
          description: String(item.description || item.category || "").substring(0, 127),
          unit_amount: {
            currency_code: "EUR",
            value: item.price.toFixed(2),
          },
          quantity: "1",
        });
      }
    }

    if (paypalFee && typeof paypalFee === "number" && paypalFee > 0 && paypalFee < 1000) {
      paypalItems.push({
        name: "Gastos de gestión PayPal",
        description: "Recargo del 5% por uso de PayPal",
        unit_amount: {
          currency_code: "EUR",
          value: paypalFee.toFixed(2),
        },
        quantity: "1",
      });
    }

    logStep("PayPal items created", { count: paypalItems.length });

    const origin = req.headers.get("origin") || "https://drum-session-studio.lovable.app";

    const orderResponse = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [{
          amount: {
            currency_code: "EUR",
            value: finalTotal.toFixed(2),
            breakdown: {
              item_total: {
                currency_code: "EUR",
                value: finalTotal.toFixed(2),
              },
            },
          },
          items: paypalItems,
        }],
        application_context: {
          brand_name: "Drum Session Studio",
          locale: "es-ES",
          landing_page: "NO_PREFERENCE",
          shipping_preference: "NO_SHIPPING",
          user_action: "PAY_NOW",
          return_url: `${origin}/success?method=paypal`,
          cancel_url: `${origin}/`,
        },
      }),
    });

    if (!orderResponse.ok) {
      const error = await orderResponse.text();
      logStep("PayPal order creation failed", { error });
      throw new Error(`Failed to create PayPal order: ${error}`);
    }

    const orderData = await orderResponse.json();
    logStep("PayPal order created", { orderId: orderData.id });

    const approvalLink = orderData.links.find((link: any) => link.rel === "approve");
    
    if (!approvalLink) {
      throw new Error("No approval URL found in PayPal response");
    }

    return new Response(JSON.stringify({ 
      url: approvalLink.href,
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
