import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-admin-password",
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

  // Import the private key
  const pemContent = sa.private_key
    .replace("-----BEGIN PRIVATE KEY-----", "")
    .replace("-----END PRIVATE KEY-----", "")
    .replace(/\n/g, "");

  const binaryKey = Uint8Array.from(atob(pemContent), c => c.charCodeAt(0));
  const cryptoKey = await crypto.subtle.importKey(
    "pkcs8",
    binaryKey,
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["sign"]
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
  if (!tokenData.access_token) {
    throw new Error(`Token error: ${JSON.stringify(tokenData)}`);
  }
  return tokenData.access_token;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Verify admin password
    const adminPassword = Deno.env.get("ADMIN_PASSWORD");
    const providedPassword = req.headers.get("x-admin-password");
    if (!providedPassword || providedPassword !== adminPassword) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const serviceAccountJson = Deno.env.get("GA_SERVICE_ACCOUNT_JSON");
    const propertyId = Deno.env.get("GA_PROPERTY_ID");

    if (!serviceAccountJson || !propertyId) {
      return new Response(JSON.stringify({
        error: "Google Analytics not configured",
        configured: false,
      }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const accessToken = await getAccessToken(serviceAccountJson);
    const url = new URL(req.url);
    const period = url.searchParams.get("period") || "30"; // days

    const gaReport = (body: any) =>
      fetch(`https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`, {
        method: "POST",
        headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

    const dateRanges = [{ startDate: `${period}daysAgo`, endDate: "today" }];

    // Run all reports in parallel
    const [overviewRes, sourcesRes, topPagesRes, referralsRes] = await Promise.all([
      gaReport({
        dateRanges,
        metrics: [
          { name: "totalUsers" }, { name: "sessions" }, { name: "averageSessionDuration" },
          { name: "screenPageViews" }, { name: "bounceRate" }, { name: "newUsers" },
        ],
      }),
      gaReport({
        dateRanges,
        dimensions: [{ name: "sessionDefaultChannelGroup" }],
        metrics: [{ name: "sessions" }],
        orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
        limit: 10,
      }),
      // Top 10 pages
      gaReport({
        dateRanges,
        dimensions: [{ name: "pagePath" }],
        metrics: [{ name: "screenPageViews" }],
        orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }],
        limit: 10,
      }),
      // Referral sources
      gaReport({
        dateRanges,
        dimensions: [{ name: "sessionSource" }],
        metrics: [{ name: "sessions" }],
        orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
        limit: 10,
      }),
    ]);

    const [overviewData, sourcesData, topPagesData, referralsData] = await Promise.all([
      overviewRes.json(), sourcesRes.json(), topPagesRes.json(), referralsRes.json(),
    ]);

    // Parse overview
    const metrics = overviewData.rows?.[0]?.metricValues || [];
    const overview = {
      totalUsers: parseInt(metrics[0]?.value || "0"),
      sessions: parseInt(metrics[1]?.value || "0"),
      avgSessionDuration: parseFloat(metrics[2]?.value || "0"),
      pageViews: parseInt(metrics[3]?.value || "0"),
      bounceRate: parseFloat(metrics[4]?.value || "0"),
      newUsers: parseInt(metrics[5]?.value || "0"),
    };

    const sources = (sourcesData.rows || []).map((row: any) => ({
      channel: row.dimensionValues[0].value,
      sessions: parseInt(row.metricValues[0].value),
    }));

    const topPages = (topPagesData.rows || []).map((row: any) => ({
      path: row.dimensionValues[0].value,
      views: parseInt(row.metricValues[0].value),
    }));

    const referrals = (referralsData.rows || []).map((row: any) => ({
      source: row.dimensionValues[0].value,
      sessions: parseInt(row.metricValues[0].value),
    }));

    return new Response(JSON.stringify({
      configured: true,
      overview,
      sources,
      topPages,
      referrals,
      period: parseInt(period),
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("GA Analytics error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
