import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-admin-password",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[ADMIN-API] ${step}${detailsStr}`);
};

function validateAdmin(req: Request): boolean {
  const password = req.headers.get("x-admin-password");
  const adminPassword = Deno.env.get("ADMIN_PASSWORD");
  if (!adminPassword || !password) return false;
  return password === adminPassword;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!validateAdmin(req)) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 401,
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    const url = new URL(req.url);
    const action = url.searchParams.get("action");

    // GET: list orders
    if (req.method === "GET" && action === "list") {
      logStep("Listing orders");
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return new Response(JSON.stringify({ orders: data }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // POST: update order status
    if (req.method === "POST" && action === "update-status") {
      const { orderId, status } = await req.json();
      if (!orderId || !status) throw new Error("Missing orderId or status");
      
      const validStatuses = ["pending", "completed", "cancelled", "awaiting_transfer", "refunded"];
      if (!validStatuses.includes(status)) throw new Error("Invalid status");

      logStep("Updating order status", { orderId, status });
      const { error } = await supabase
        .from("orders")
        .update({ payment_status: status })
        .eq("id", orderId);

      if (error) throw error;
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // POST: delete order
    if (req.method === "POST" && action === "delete") {
      const { orderId } = await req.json();
      if (!orderId) throw new Error("Missing orderId");

      logStep("Deleting order", { orderId });
      const { error } = await supabase
        .from("orders")
        .delete()
        .eq("id", orderId);

      if (error) throw error;
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // POST: reset invoice counter
    if (req.method === "POST" && action === "reset-counter") {
      logStep("Resetting invoice counter");
      const { error } = await supabase
        .from("invoice_counters")
        .update({ last_number: 0 })
        .eq("series", "W");

      if (error) throw error;
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // POST: delete all orders
    if (req.method === "POST" && action === "delete-all") {
      logStep("Deleting all orders");
      const { error } = await supabase
        .from("orders")
        .delete()
        .neq("id", "00000000-0000-0000-0000-000000000000"); // delete all

      if (error) throw error;

      // Reset counter
      await supabase
        .from("invoice_counters")
        .update({ last_number: 0 })
        .eq("series", "W");

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // GET: generate invoice HTML
    if (req.method === "GET" && action === "invoice") {
      const orderId = url.searchParams.get("orderId");
      if (!orderId) throw new Error("Missing orderId");

      logStep("Generating invoice", { orderId });
      const { data: order, error } = await supabase
        .from("orders")
        .select("*")
        .eq("id", orderId)
        .single();

      if (error || !order) throw new Error("Order not found");

      // Call generate-invoice function internally
      const invoiceResponse = await fetch(`${supabaseUrl}/functions/v1/generate-invoice`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${serviceRoleKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ orderId }),
      });

      const invoiceData = await invoiceResponse.json();
      return new Response(JSON.stringify(invoiceData), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Unknown action" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: msg });
    return new Response(JSON.stringify({ error: msg }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
