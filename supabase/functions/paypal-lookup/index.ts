import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const PAYPAL_API_BASE = "https://api-m.paypal.com";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const clientId = Deno.env.get("PAYPAL_CLIENT_ID")!;
  const clientSecret = Deno.env.get("PAYPAL_CLIENT_SECRET")!;
  const auth = btoa(`${clientId}:${clientSecret}`);

  const tokenRes = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
    method: "POST",
    headers: { "Authorization": `Basic ${auth}`, "Content-Type": "application/x-www-form-urlencoded" },
    body: "grant_type=client_credentials",
  });
  const { access_token } = await tokenRes.json();

  const { orderIds } = await req.json();
  const results: any[] = [];

  for (const orderId of orderIds) {
    try {
      const res = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders/${encodeURIComponent(orderId)}`, {
        headers: { "Authorization": `Bearer ${access_token}`, "Content-Type": "application/json" },
      });
      if (res.ok) {
        const data = await res.json();
        results.push({
          orderId,
          email: data.payer?.email_address,
          firstName: data.payer?.name?.given_name,
          lastName: data.payer?.name?.surname,
          status: data.status,
        });
      } else {
        results.push({ orderId, error: await res.text() });
      }
    } catch (e) {
      results.push({ orderId, error: String(e) });
    }
  }

  return new Response(JSON.stringify(results), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
