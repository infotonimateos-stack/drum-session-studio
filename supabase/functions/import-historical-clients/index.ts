import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Auth check with admin password
    const authHeader = req.headers.get("x-admin-password");
    const adminPassword = Deno.env.get("ADMIN_PASSWORD");
    if (!authHeader || authHeader !== adminPassword) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data: any[] = await req.json();
    if (!Array.isArray(data)) {
      return new Response(JSON.stringify({ error: "Body must be a JSON array" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Parse dates DD/MM/YYYY -> YYYY-MM-DD
    function parseDate(d: string | null | undefined): string | null {
      if (!d || !d.trim()) return null;
      const parts = d.trim().split("/");
      if (parts.length !== 3) return null;
      const [day, month, year] = parts;
      return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    }

    function normalizePhone(p: string | null | undefined): string | null {
      if (!p) return null;
      const clean = p.replace(/\s/g, "").trim();
      return clean || null;
    }

    const rows = data.map((entry: any) => ({
      name: entry.name,
      alt_names: entry.alt_names || [],
      roles: entry.role || [],
      emails: (entry.emails || []).filter((e: string) => e?.trim()).map((e: string) => e.toLowerCase().trim()),
      phones: (entry.phones || []).map(normalizePhone).filter(Boolean),
      organization: entry.organization?.trim() || null,
      nif: entry.nif?.trim() || null,
      city: entry.city?.trim() || null,
      country: entry.country?.trim() || null,
      address: entry.address?.trim() || null,
      sessions: entry.sessions || 0,
      total_revenue: entry.total_revenue || 0,
      bands: entry.bands || [],
      first_session: parseDate(entry.first_session),
      last_session: parseDate(entry.last_session),
      sources: entry.sources || [],
      notes: entry.notes || [],
    }));

    // Insert in batches of 100
    const BATCH = 100;
    let inserted = 0;
    for (let i = 0; i < rows.length; i += BATCH) {
      const batch = rows.slice(i, i + BATCH);
      const { error } = await supabase.from("historical_clients").insert(batch);
      if (error) {
        return new Response(JSON.stringify({ error: error.message, inserted }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      inserted += batch.length;
    }

    return new Response(JSON.stringify({ success: true, inserted }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
