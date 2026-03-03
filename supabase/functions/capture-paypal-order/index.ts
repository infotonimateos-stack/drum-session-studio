import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CAPTURE-PAYPAL-ORDER] ${step}${detailsStr}`);
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

    const { orderId } = await req.json();
    logStep("Received order ID", { orderId });

    // Validate orderId format and length
    if (!orderId || typeof orderId !== "string" || orderId.length > 100 || !/^[A-Za-z0-9]+$/.test(orderId)) {
      throw new Error("Invalid order ID");
    }

    const accessToken = await getPayPalAccessToken(clientId, clientSecret);
    logStep("PayPal access token obtained");

    const orderDetailsResponse = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders/${encodeURIComponent(orderId)}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!orderDetailsResponse.ok) {
      const error = await orderDetailsResponse.text();
      logStep("Failed to get order details", { error });
      throw new Error(`Failed to get order details: ${error}`);
    }

    const orderDetails = await orderDetailsResponse.json();
    logStep("Order details retrieved", { status: orderDetails.status });

    if (orderDetails.status === "COMPLETED") {
      logStep("Order already captured");
      
      const payerEmail = orderDetails.payer?.email_address;
      const payerName = orderDetails.payer?.name?.given_name;

      if (payerEmail) {
        await sendConfirmationEmail(payerEmail, payerName, orderId);
      }

      return new Response(JSON.stringify({ 
        success: true, 
        status: "COMPLETED",
        alreadyCaptured: true,
        payerEmail,
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    const captureResponse = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders/${encodeURIComponent(orderId)}/capture`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!captureResponse.ok) {
      const error = await captureResponse.text();
      logStep("PayPal capture failed", { error });
      throw new Error(`Failed to capture PayPal order: ${error}`);
    }

    const captureData = await captureResponse.json();
    logStep("PayPal order captured", { status: captureData.status });

    const payerEmail = captureData.payer?.email_address;
    const payerName = captureData.payer?.name?.given_name;

    logStep("Payer info", { payerEmail, payerName });

    if (captureData.status === "COMPLETED") {
      // Assign invoice number NOW that payment is confirmed
      try {
        const { createClient } = await import("https://esm.sh/@supabase/supabase-js@2.49.2");
        const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
        const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
        const supabase = createClient(supabaseUrl, serviceRoleKey);

        const { data: invoiceNumber } = await supabase.rpc('get_next_invoice_number', { p_series: 'W' });
        logStep("Invoice number assigned after payment", { invoiceNumber });

        await supabase
          .from("orders")
          .update({ 
            payment_status: "completed",
            invoice_number: invoiceNumber,
            invoice_series: 'W',
          })
          .eq("payment_id", orderId);

        logStep("Order updated with invoice number and completed status");
      } catch (dbErr) {
        logStep("ERROR updating order after capture", { error: (dbErr as Error).message });
      }

      if (payerEmail) {
        await sendConfirmationEmail(payerEmail, payerName, orderId);
      }
    }

    return new Response(JSON.stringify({ 
      success: true, 
      status: captureData.status,
      payerEmail,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    return new Response(JSON.stringify({ success: false, error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});

async function sendConfirmationEmail(email: string, name: string | undefined, orderId: string) {
  const logStep = (step: string, details?: any) => {
    const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
    console.log(`[CAPTURE-PAYPAL-ORDER] ${step}${detailsStr}`);
  };

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !serviceRoleKey) {
      logStep("Missing configuration for email sending");
      return;
    }

    // First, find the DB order by payment_id or use orderId to look up
    // The orderId here is the PayPal order ID, we need to find the DB order
    const { createClient } = await import("https://esm.sh/@supabase/supabase-js@2.49.2");
    const supabase = createClient(supabaseUrl, serviceRoleKey);
    
    // Look up the DB order that matches this PayPal orderId
    const { data: dbOrder } = await supabase
      .from("orders")
      .select("id")
      .eq("payment_id", orderId)
      .single();

    const dbOrderId = dbOrder?.id;
    if (!dbOrderId) {
      logStep("Could not find DB order for PayPal orderId", { orderId });
      return;
    }

    const emailResponse = await fetch(`${supabaseUrl}/functions/v1/send-order-email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${serviceRoleKey}`,
      },
      body: JSON.stringify({
        orderId: dbOrderId,
        customerEmail: email,
        customerName: name,
      }),
    });

    const emailResult = await emailResponse.json();
    logStep("Email function response", emailResult);
  } catch (error) {
    logStep("Failed to send confirmation email", { error: (error as Error).message });
  }
}
