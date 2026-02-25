import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-admin-password, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

async function getAccessToken(serviceAccountJson: string): Promise<string> {
  const sa = JSON.parse(serviceAccountJson);
  const now = Math.floor(Date.now() / 1000);
  const header = btoa(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const payload = btoa(JSON.stringify({
    iss: sa.client_email,
    scope: "https://www.googleapis.com/auth/analytics.readonly",
    aud: "https://oauth2.googleapis.com/token",
    iat: now,
    exp: now + 3600,
  }));

  const pemContent = sa.private_key
    .replace("-----BEGIN PRIVATE KEY-----", "")
    .replace("-----END PRIVATE KEY-----", "")
    .replace(/\n/g, "");

  const binaryKey = Uint8Array.from(atob(pemContent), c => c.charCodeAt(0));
  const cryptoKey = await crypto.subtle.importKey(
    "pkcs8", binaryKey,
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false, ["sign"]
  );

  const signatureInput = new TextEncoder().encode(`${header}.${payload}`);
  const signature = await crypto.subtle.sign("RSASSA-PKCS1-v1_5", cryptoKey, signatureInput);
  const sig = btoa(String.fromCharCode(...new Uint8Array(signature)))
    .replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");

  const jwt = `${header}.${payload}.${sig}`;
  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`,
  });

  const tokenData = await tokenRes.json();
  if (!tokenData.access_token) throw new Error(`Token error: ${JSON.stringify(tokenData)}`);
  return tokenData.access_token;
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const adminPassword = Deno.env.get("ADMIN_PASSWORD");
    const providedPassword = req.headers.get("x-admin-password");
    if (!providedPassword || providedPassword !== adminPassword) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const serviceAccountJson = Deno.env.get("GA_SERVICE_ACCOUNT_JSON");
    const propertyId = Deno.env.get("GA_PROPERTY_ID");
    if (!serviceAccountJson || !propertyId) {
      return new Response(JSON.stringify({ configured: false }), {
        status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const accessToken = await getAccessToken(serviceAccountJson);
    const url = new URL(req.url);
    const period = url.searchParams.get("period") || "30";

    // Query step_view events grouped by step_number
    const reportRes = await fetch(
      `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          dateRanges: [{ startDate: `${period}daysAgo`, endDate: "today" }],
          dimensions: [{ name: "customEvent:step_name" }],
          metrics: [{ name: "eventCount" }, { name: "totalUsers" }],
          dimensionFilter: {
            filter: {
              fieldName: "eventName",
              stringFilter: { value: "step_view", matchType: "EXACT" },
            },
          },
          orderBys: [{ metric: { metricName: "eventCount" }, desc: true }],
          limit: 20,
        }),
      }
    );

    const reportData = await reportRes.json();
    
    const stepOrder = [
      "drum_kit", "microphones", "preamps", "interface",
      "production", "video", "takes", "delivery", "extras"
    ];
    
    const stepLabels: Record<string, string> = {
      drum_kit: "Batería",
      microphones: "Micrófonos",
      preamps: "Previos",
      interface: "Interfaz",
      production: "Producción",
      video: "Vídeo",
      takes: "Tomas",
      delivery: "Entrega",
      extras: "Extras",
    };

    // Parse rows
    const rawSteps: Record<string, { events: number; users: number }> = {};
    for (const row of reportData.rows || []) {
      const stepName = row.dimensionValues[0].value;
      rawSteps[stepName] = {
        events: parseInt(row.metricValues[0].value),
        users: parseInt(row.metricValues[1].value),
      };
    }

    // Build ordered funnel
    const funnel = stepOrder.map((name, idx) => {
      const data = rawSteps[name] || { events: 0, users: 0 };
      return {
        step_number: idx + 1,
        step_name: name,
        step_label: stepLabels[name] || name,
        users: data.users,
        events: data.events,
      };
    });

    // Calculate drop-off between steps
    const funnelWithDropoff = funnel.map((step, idx) => {
      const prevUsers = idx === 0 ? step.users : funnel[idx - 1].users;
      const dropoff = prevUsers > 0 ? ((prevUsers - step.users) / prevUsers) * 100 : 0;
      return { ...step, dropoff_pct: Math.round(dropoff * 10) / 10 };
    });

    return new Response(JSON.stringify({
      configured: true,
      funnel: funnelWithDropoff,
      period: parseInt(period),
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Funnel error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
