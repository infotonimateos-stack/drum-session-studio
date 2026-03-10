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

// --- Rate Limiting ---
const RATE_LIMIT_WINDOW_MS = 60_000; // 1 minute
const MAX_FAILED_ATTEMPTS = 5;
const failedAttempts = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = failedAttempts.get(ip);

  if (!record || now > record.resetAt) {
    return true; // allowed
  }

  return record.count < MAX_FAILED_ATTEMPTS;
}

function recordFailedAttempt(ip: string) {
  const now = Date.now();
  const record = failedAttempts.get(ip);

  if (!record || now > record.resetAt) {
    failedAttempts.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
  } else {
    record.count++;
  }
}

function clearFailedAttempts(ip: string) {
  failedAttempts.delete(ip);
}

// Periodic cleanup to prevent memory leak
setInterval(() => {
  const now = Date.now();
  for (const [ip, record] of failedAttempts) {
    if (now > record.resetAt) failedAttempts.delete(ip);
  }
}, 300_000); // every 5 min

function validateAdmin(req: Request): boolean {
  const password = req.headers.get("x-admin-password");
  const adminPassword = Deno.env.get("ADMIN_PASSWORD");
  if (!adminPassword || !password) return false;

  // Constant-time comparison to prevent timing attacks
  if (password.length !== adminPassword.length) return false;
  let result = 0;
  for (let i = 0; i < password.length; i++) {
    result |= password.charCodeAt(i) ^ adminPassword.charCodeAt(i);
  }
  return result === 0;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const clientIp = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

  try {
    // Check rate limit before auth
    if (!checkRateLimit(clientIp)) {
      logStep("RATE_LIMITED", { ip: clientIp });
      return new Response(JSON.stringify({ error: "Too many attempts. Try again later." }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 429,
      });
    }

    if (!validateAdmin(req)) {
      recordFailedAttempt(clientIp);
      logStep("AUTH_FAILED", { ip: clientIp });
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 401,
      });
    }

    // Successful auth — clear failed attempts
    clearFailedAttempts(clientIp);

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

    // POST: update work status
    if (req.method === "POST" && action === "update-work-status") {
      const { orderId, workStatus } = await req.json();
      if (!orderId || !workStatus) throw new Error("Missing orderId or workStatus");

      const validStatuses = ["new", "in_progress", "delivered"];
      if (!validStatuses.includes(workStatus)) throw new Error("Invalid work status");

      logStep("Updating work status", { orderId, workStatus });
      const { error } = await supabase
        .from("orders")
        .update({ work_status: workStatus })
        .eq("id", orderId);

      if (error) throw error;
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // POST: update deadline
    if (req.method === "POST" && action === "update-deadline") {
      const { orderId, deadline } = await req.json();
      if (!orderId) throw new Error("Missing orderId");

      logStep("Updating deadline", { orderId, deadline });
      const { error } = await supabase
        .from("orders")
        .update({ deadline: deadline || null })
        .eq("id", orderId);

      if (error) throw error;
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // POST: update work notes
    if (req.method === "POST" && action === "update-work-notes") {
      const { orderId, notes } = await req.json();
      if (!orderId) throw new Error("Missing orderId");

      logStep("Updating work notes", { orderId });
      const { error } = await supabase
        .from("orders")
        .update({ work_notes: notes || null })
        .eq("id", orderId);

      if (error) throw error;
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // POST: check files status via Gmail (Google Apps Script)
    if (req.method === "POST" && action === "check-files") {
      logStep("Checking files status via Gmail");

      const { data: pendingOrders, error: fetchError } = await supabase
        .from("orders")
        .select("id, contact_email, billing_email, paypal_payer_info, created_at")
        .eq("payment_status", "completed")
        .eq("files_status", "pending");

      if (fetchError) throw fetchError;
      if (!pendingOrders || pendingOrders.length === 0) {
        return new Response(JSON.stringify({ checked: 0, newlyReceived: 0 }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const checks = pendingOrders.map((order: any) => {
        const emails = new Set<string>();
        if (order.contact_email) emails.add(order.contact_email.toLowerCase());
        if (order.billing_email) emails.add(order.billing_email.toLowerCase());
        const pp = order.paypal_payer_info as Record<string, any> | null;
        if (pp?.email) emails.add((pp.email as string).toLowerCase());
        return {
          orderId: order.id,
          emails: Array.from(emails),
          afterDate: order.created_at.split("T")[0],
        };
      });

      const gmailCheckerUrl = Deno.env.get("GMAIL_CHECKER_URL");
      const gmailCheckerSecret = Deno.env.get("GMAIL_CHECKER_SECRET");
      if (!gmailCheckerUrl || !gmailCheckerSecret) {
        throw new Error("Gmail checker not configured");
      }

      const gmailResponse = await fetch(gmailCheckerUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ secret: gmailCheckerSecret, checks }),
      });

      if (!gmailResponse.ok) {
        const errText = await gmailResponse.text();
        logStep("Gmail checker error", { status: gmailResponse.status, error: errText });
        throw new Error(`Gmail checker error: ${gmailResponse.status}`);
      }

      const gmailData = await gmailResponse.json();
      const results = gmailData.results || [];

      let newlyReceived = 0;
      const now = new Date().toISOString();

      for (const result of results) {
        if (result.filesReceived) {
          await supabase
            .from("orders")
            .update({
              files_status: "received",
              files_detected_at: result.detectedAt || now,
              files_detection_method: result.method || "unknown",
              files_last_checked_at: now,
            })
            .eq("id", result.orderId);
          newlyReceived++;
        }
      }

      const allIds = pendingOrders.map((o: any) => o.id);
      await supabase
        .from("orders")
        .update({ files_last_checked_at: now })
        .in("id", allIds);

      logStep("Files check completed", { checked: pendingOrders.length, newlyReceived });

      return new Response(JSON.stringify({
        checked: pendingOrders.length,
        newlyReceived,
        results: results.filter((r: any) => r.filesReceived),
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // POST: update files status (manual override)
    if (req.method === "POST" && action === "update-files-status") {
      const { orderId, filesStatus } = await req.json();
      if (!orderId || !filesStatus) throw new Error("Missing orderId or filesStatus");

      const validStatuses = ["pending", "received"];
      if (!validStatuses.includes(filesStatus)) throw new Error("Invalid files status");

      logStep("Updating files status", { orderId, filesStatus });
      const updateData: Record<string, any> = { files_status: filesStatus };
      if (filesStatus === "received") {
        updateData.files_detected_at = new Date().toISOString();
        updateData.files_detection_method = "manual";
      } else {
        updateData.files_detected_at = null;
        updateData.files_detection_method = null;
      }

      const { error } = await supabase.from("orders").update(updateData).eq("id", orderId);
      if (error) throw error;

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
