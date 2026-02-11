import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0?target=deno";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CREATE-PAYMENT] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");

    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });

    const {
      items, basePrice, subtotal, total,
      taxRate, taxAmount, taxRule, taxLabel,
      billingCountry, billingPostalCode, clientType,
      vatNumber, viesValid, customerEmail,
    } = await req.json();

    logStep("Received data", { itemCount: items?.length, subtotal, taxRate, taxAmount, total });

    // Input validation
    if (!total || typeof total !== "number" || total <= 0 || total > 15000) throw new Error("Invalid total amount");
    if (!basePrice || typeof basePrice !== "number" || basePrice <= 0 || basePrice > 10000) throw new Error("Invalid base price");
    if (items && (!Array.isArray(items) || items.length > 50)) throw new Error("Invalid items");

    // Build line items
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

    lineItems.push({
      price_data: {
        currency: "eur",
        product_data: {
          name: "Paquete Básico - Grabación de Batería",
          description: "Grabación profesional de batería, configuración básica de micrófonos, entrega estándar (10 días), 1 toma básica incluida",
        },
        unit_amount: Math.round(basePrice * 100),
      },
      quantity: 1,
    });

    if (items && items.length > 0) {
      for (const item of items) {
        if (!item.name || typeof item.price !== "number" || item.price < 0 || item.price > 10000) throw new Error("Invalid item data");
        lineItems.push({
          price_data: {
            currency: "eur",
            product_data: {
              name: String(item.name).substring(0, 200),
              description: String(item.description || item.category || "").substring(0, 500),
            },
            unit_amount: Math.round(item.price * 100),
          },
          quantity: 1,
        });
      }
    }

    // Add tax line item if applicable
    if (taxAmount && typeof taxAmount === "number" && taxAmount > 0) {
      lineItems.push({
        price_data: {
          currency: "eur",
          product_data: {
            name: taxLabel || `Impuestos (${taxRate}%)`,
            description: `Impuestos aplicables según la normativa fiscal`,
          },
          unit_amount: Math.round(taxAmount * 100),
        },
        quantity: 1,
      });
    }

    logStep("Line items created", { count: lineItems.length });

    const origin = req.headers.get("origin") || "https://drum-session-studio.lovable.app";

    const sessionConfig: Stripe.Checkout.SessionCreateParams = {
      line_items: lineItems,
      mode: "payment",
      success_url: `${origin}/success`,
      cancel_url: `${origin}/`,
      locale: "es",
      payment_method_types: ["card"],
      invoice_creation: { enabled: false },
    };

    if (customerEmail) sessionConfig.customer_email = customerEmail;

    const session = await stripe.checkout.sessions.create(sessionConfig);
    logStep("Checkout session created", { sessionId: session.id });

    // Save order to DB
    try {
      const supabaseUrl = Deno.env.get("SUPABASE_URL");
      const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
      if (supabaseUrl && supabaseServiceKey) {
        const supabase = createClient(supabaseUrl, supabaseServiceKey);
        await supabase.from("orders").insert({
          payment_method: "stripe",
          payment_id: session.id,
          payment_status: "pending",
          items: items || [],
          base_price: basePrice,
          subtotal: subtotal || basePrice + (items || []).reduce((s: number, i: any) => s + (i.price || 0), 0),
          tax_amount: taxAmount || 0,
          tax_rate: taxRate || 0,
          paypal_fee: 0,
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

    return new Response(JSON.stringify({ url: session.url }), {
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
