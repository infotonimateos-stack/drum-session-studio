import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CREATE-PAYMENT] ${step}${detailsStr}`);
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");
    logStep("Stripe key verified");

    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });

    // Get the request body with cart data
    const { items, basePrice, total, customerEmail } = await req.json();
    logStep("Received cart data", { itemCount: items?.length, basePrice, total, customerEmail });

    if (!total || total <= 0) {
      throw new Error("Invalid total amount");
    }

    // Build line items for Stripe
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

    // Add base package
    lineItems.push({
      price_data: {
        currency: "eur",
        product_data: {
          name: "Paquete Básico - Grabación de Batería",
          description: "Grabación profesional de batería, configuración básica de micrófonos, entrega estándar (10 días), 1 toma básica incluida",
        },
        unit_amount: Math.round(basePrice * 100), // Convert to cents
      },
      quantity: 1,
    });

    // Add each cart item as a line item
    if (items && items.length > 0) {
      for (const item of items) {
        lineItems.push({
          price_data: {
            currency: "eur",
            product_data: {
              name: item.name,
              description: item.description || `${item.category}`,
            },
            unit_amount: Math.round(item.price * 100), // Convert to cents
          },
          quantity: 1,
        });
      }
    }

    logStep("Line items created", { count: lineItems.length });

    // Get origin with fallback
    const origin = req.headers.get("origin") || "https://drum-session-studio.lovable.app";
    logStep("Origin determined", { origin });

    // Create checkout session configuration
    const sessionConfig: Stripe.Checkout.SessionCreateParams = {
      line_items: lineItems,
      mode: "payment",
      success_url: `${origin}/payment-success`,
      cancel_url: `${origin}/`,
      locale: "es",
      payment_method_types: ["card"],
    };

    // Add customer email if provided
    if (customerEmail) {
      sessionConfig.customer_email = customerEmail;
    }

    // Create the checkout session
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
