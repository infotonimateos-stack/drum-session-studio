import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CAPTURE-PAYPAL-ORDER] ${step}${detailsStr}`);
};

// Production PayPal API
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
  // Handle CORS preflight requests
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

    if (!orderId) {
      throw new Error("Order ID is required");
    }

    // Get PayPal access token
    const accessToken = await getPayPalAccessToken(clientId, clientSecret);
    logStep("PayPal access token obtained");

    // First, get the order details to check status
    const orderDetailsResponse = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders/${orderId}`, {
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

    // If already captured, just return success with payer info
    if (orderDetails.status === "COMPLETED") {
      logStep("Order already captured");
      
      const payerEmail = orderDetails.payer?.email_address;
      const payerName = orderDetails.payer?.name?.given_name;

      // Send confirmation email
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

    // Capture the order if not yet captured
    const captureResponse = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders/${orderId}/capture`, {
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

    // Get payer information
    const payerEmail = captureData.payer?.email_address;
    const payerName = captureData.payer?.name?.given_name;

    logStep("Payer info", { payerEmail, payerName });

    // Send confirmation email if capture was successful
    if (captureData.status === "COMPLETED" && payerEmail) {
      await sendConfirmationEmail(payerEmail, payerName, orderId);
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
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");

    if (!supabaseUrl || !supabaseAnonKey) {
      logStep("Missing Supabase configuration for email sending");
      return;
    }

    const emailResponse = await fetch(`${supabaseUrl}/functions/v1/send-order-email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${supabaseAnonKey}`,
      },
      body: JSON.stringify({
        customerEmail: email,
        customerName: name,
        paymentMethod: "paypal",
        orderId,
      }),
    });

    const emailResult = await emailResponse.json();
    logStep("Email function response", emailResult);
  } catch (error) {
    logStep("Failed to send confirmation email", { error: error.message });
  }
}
