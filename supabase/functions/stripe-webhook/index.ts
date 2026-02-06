import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0?target=deno";

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[STRIPE-WEBHOOK] ${step}${detailsStr}`);
};

serve(async (req) => {
  try {
    logStep("Webhook received");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) {
      throw new Error("STRIPE_SECRET_KEY is not configured");
    }

    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });

    // Get the webhook signature
    const signature = req.headers.get("stripe-signature");
    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");

    const body = await req.text();

    let event: Stripe.Event;

    // Verify signature if webhook secret is configured
    if (webhookSecret && signature) {
      try {
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
        logStep("Webhook signature verified");
      } catch (err) {
        logStep("Webhook signature verification failed", { error: err.message });
        return new Response(JSON.stringify({ error: "Invalid signature" }), { status: 400 });
      }
    } else {
      // For development/testing without signature verification
      event = JSON.parse(body);
      logStep("Processing webhook without signature verification");
    }

    logStep("Event received", { type: event.type, id: event.id });

    // Handle checkout.session.completed event
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      
      logStep("Checkout session completed", { 
        sessionId: session.id,
        customerEmail: session.customer_email || session.customer_details?.email,
        paymentStatus: session.payment_status
      });

      // Only send email if payment was successful
      if (session.payment_status === "paid") {
        const customerEmail = session.customer_email || session.customer_details?.email;
        const customerName = session.customer_details?.name;

        if (customerEmail) {
          // Call the send-order-email function
          const supabaseUrl = Deno.env.get("SUPABASE_URL");
          const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");

          if (supabaseUrl && supabaseAnonKey) {
            const emailResponse = await fetch(`${supabaseUrl}/functions/v1/send-order-email`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${supabaseAnonKey}`,
              },
              body: JSON.stringify({
                customerEmail,
                customerName,
                paymentMethod: "stripe",
                orderId: session.id,
              }),
            });

            const emailResult = await emailResponse.json();
            logStep("Email function response", emailResult);
          } else {
            logStep("Missing Supabase configuration for email sending");
          }
        } else {
          logStep("No customer email found in session");
        }
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    logStep("ERROR", { message: error.message });
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
