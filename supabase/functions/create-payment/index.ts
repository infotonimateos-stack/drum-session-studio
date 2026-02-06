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

    // Get the request body with cart data including country for tax calculation
    const { items, basePrice, total, customerEmail, customerCountry } = await req.json();
    logStep("Received cart data", { itemCount: items?.length, basePrice, total, customerEmail, customerCountry });

    if (!total || total <= 0) {
      throw new Error("Invalid total amount");
    }

    // Build line items for Stripe
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

    // Add base package with tax_behavior for automatic tax calculation
    lineItems.push({
      price_data: {
        currency: "eur",
        product_data: {
          name: "Paquete Básico - Grabación de Batería",
          description: "Grabación profesional de batería, configuración básica de micrófonos, entrega estándar (10 días), 1 toma básica incluida",
        },
        unit_amount: Math.round(basePrice * 100), // Convert to cents
        tax_behavior: "exclusive", // Tax will be added on top of this price
      },
      quantity: 1,
    });

    // Add each cart item as a line item with tax_behavior
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
            tax_behavior: "exclusive", // Tax will be added on top of this price
          },
          quantity: 1,
        });
      }
    }

    logStep("Line items created", { count: lineItems.length });

    // Get origin with fallback
    const origin = req.headers.get("origin") || "https://drum-session-studio.lovable.app";
    logStep("Origin determined", { origin });

    // Create a Stripe customer with country pre-set for tax calculation
    let customerId: string | undefined;
    if (customerCountry || customerEmail) {
      const customerData: Stripe.CustomerCreateParams = {};
      
      if (customerEmail) {
        customerData.email = customerEmail;
      }
      
      if (customerCountry) {
        customerData.address = {
          country: customerCountry,
        };
        // Also set tax location hint
        customerData.tax = {
          validate_location: "deferred",
        };
      }
      
      const customer = await stripe.customers.create(customerData);
      customerId = customer.id;
      logStep("Customer created with country", { customerId, country: customerCountry });
    }

    // EU countries for shipping address collection (forces country selection early)
    const euCountries: Stripe.Checkout.SessionCreateParams.ShippingAddressCollection.AllowedCountry[] = [
      "AT", "BE", "BG", "HR", "CY", "CZ", "DK", "EE", "FI", "FR", 
      "DE", "GR", "HU", "IE", "IT", "LV", "LT", "LU", "MT", "NL", 
      "PL", "PT", "RO", "SK", "SI", "ES", "SE", "GB", "CH", "NO", "IS"
    ];

    // Create checkout session configuration with automatic tax calculation
    const sessionConfig: Stripe.Checkout.SessionCreateParams = {
      line_items: lineItems,
      mode: "payment",
      success_url: `${origin}/payment-success`,
      cancel_url: `${origin}/`,
      locale: "es",
      payment_method_types: ["card"],
      // REQUIRED: Collect billing address to determine tax location
      billing_address_collection: "required",
      // Force country selection early in the checkout flow
      shipping_address_collection: {
        allowed_countries: euCountries,
      },
      // Enable automatic tax calculation based on customer location
      automatic_tax: { enabled: true },
      // Enable tax ID collection for B2B customers (VAT/ROI)
      tax_id_collection: { enabled: true },
    };

    // If we created a customer, attach them and allow address updates
    if (customerId) {
      sessionConfig.customer = customerId;
      sessionConfig.customer_update = {
        address: "auto",
        name: "auto",
        shipping: "auto", // Required when using shipping_address_collection with automatic_tax
      };
    } else if (customerEmail) {
      // Fallback: just set email if no customer created
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
