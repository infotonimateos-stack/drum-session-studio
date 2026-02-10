import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0?target=deno";

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
    logStep("Stripe key verified");

    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });

    const { items, basePrice, total, customerEmail } = await req.json();
    logStep("Received cart data", { itemCount: items?.length, basePrice, total, customerEmail });

    // Input validation
    if (!total || typeof total !== "number" || total <= 0 || total > 10000) {
      throw new Error("Invalid total amount");
    }
    if (!basePrice || typeof basePrice !== "number" || basePrice <= 0 || basePrice > 10000) {
      throw new Error("Invalid base price");
    }
    if (items && (!Array.isArray(items) || items.length > 50)) {
      throw new Error("Invalid items");
    }
    if (customerEmail && (typeof customerEmail !== "string" || customerEmail.length > 255)) {
      throw new Error("Invalid email");
    }

    // Build line items for Stripe
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
        if (!item.name || typeof item.price !== "number" || item.price < 0 || item.price > 10000) {
          throw new Error("Invalid item data");
        }
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

    logStep("Line items created", { count: lineItems.length });

    const origin = req.headers.get("origin") || "https://drum-session-studio.lovable.app";
    logStep("Origin determined", { origin });

    const sessionConfig: Stripe.Checkout.SessionCreateParams = {
      line_items: lineItems,
      mode: "payment",
      success_url: `${origin}/success`,
      cancel_url: `${origin}/`,
      locale: "es",
      payment_method_types: ["card"],
      invoice_creation: { enabled: false },
    };

    if (customerEmail) {
      sessionConfig.customer_email = customerEmail;
    }

    const session = await stripe.checkout.sessions.create(sessionConfig);
    logStep("Checkout session created", { sessionId: session.id, url: session.url });

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
