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

    // Query step_view events — use activeUsers metric matching GA response schema
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
          metrics: [{ name: "activeUsers" }],
          dimensionFilter: {
            filter: {
              fieldName: "eventName",
              stringFilter: { value: "step_view", matchType: "EXACT" },
            },
          },
          limit: 20,
        }),
      }
    );

    const reportData = await reportRes.json();
    
    const stepOrder = [
      "inicio_registro", "detalles_proyecto", "configuracion_presupuesto", "confirmacion_final",
      "production", "video", "takes", "delivery", "extras"
    ];
    
    const stepLabels: Record<string, string> = {
      inicio_registro: "Inicio / Registro",
      detalles_proyecto: "Detalles del proyecto",
      configuracion_presupuesto: "Configuración / Presupuesto",
      confirmacion_final: "Confirmación final",
      production: "Producción",
      video: "Vídeo",
      takes: "Tomas",
      delivery: "Entrega",
      extras: "Extras",
    };

    // Parse rows from GA response: dimensionValues[0] = step_name, metricValues[0] = activeUsers
    const rawSteps: Record<string, number> = {};
    for (const row of reportData.rows || []) {
      const stepName = row.dimensionValues[0].value;
      const users = parseInt(row.metricValues[0].value);
      rawSteps[stepName] = users;
    }

    // Build ordered funnel with retention and dropoff calculations
    const funnel = stepOrder.map((name, idx) => {
      const users = rawSteps[name] || 0;
      const prevUsers = idx === 0 ? users : (rawSteps[stepOrder[idx - 1]] || 0);
      const dropoff_pct = idx === 0 ? 0 : (prevUsers > 0 ? Math.round(((prevUsers - users) / prevUsers) * 1000) / 10 : 0);
      const retention_pct = idx === 0 ? 100 : (prevUsers > 0 ? Math.round((users / prevUsers) * 1000) / 10 : 0);
      // Cumulative dropoff from step 1
      const firstUsers = rawSteps[stepOrder[0]] || 0;
      const cumulative_dropoff_pct = firstUsers > 0 ? Math.round(((firstUsers - users) / firstUsers) * 1000) / 10 : 0;

      return {
        step_number: idx + 1,
        step_name: name,
        step_label: stepLabels[name] || name,
        users,
        dropoff_pct,
        retention_pct,
        cumulative_dropoff_pct,
      };
    });

    return new Response(JSON.stringify({
      configured: true,
      funnel,
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
