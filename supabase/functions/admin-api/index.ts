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

    // GET: list orders (enriched with historical client data)
    if (req.method === "GET" && action === "list") {
      logStep("Listing orders with historical enrichment");
      const { data: ordersData, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Collect unique emails and phones from all orders for batch matching
      const allEmails: string[] = [];
      const allPhones: string[] = [];
      for (const order of ordersData || []) {
        if (order.contact_email) allEmails.push(order.contact_email.toLowerCase());
        if (order.billing_email) allEmails.push(order.billing_email.toLowerCase());
        if (order.billing_phone) allPhones.push(order.billing_phone.replace(/\s/g, ""));
        // Also check PayPal payer email
        const pp = order.paypal_payer_info as Record<string, any> | null;
        if (pp?.email) allEmails.push((pp.email as string).toLowerCase());
      }

      // Batch match against historical clients via RPC
      let historicalMap: Record<string, any> = {};
      if (allEmails.length > 0 || allPhones.length > 0) {
        const { data: matches } = await supabase.rpc("match_historical_clients", {
          p_emails: [...new Set(allEmails)],
          p_phones: [...new Set(allPhones)],
        });

        if (matches) {
          for (const hc of matches) {
            for (const email of hc.emails || []) {
              historicalMap[email.toLowerCase()] = hc;
            }
            for (const phone of hc.phones || []) {
              historicalMap[phone.replace(/\s/g, "")] = hc;
            }
          }
        }
      }

      // Attach historical match to each order
      const enrichedOrders = (ordersData || []).map((order: any) => {
        const email = (order.contact_email || order.billing_email || "").toLowerCase();
        const billingEmail = (order.billing_email || "").toLowerCase();
        const phone = (order.billing_phone || "").replace(/\s/g, "");
        const ppEmail = ((order.paypal_payer_info as any)?.email || "").toLowerCase();
        const match = historicalMap[email] || historicalMap[billingEmail] || historicalMap[ppEmail] || historicalMap[phone] || null;
        return { ...order, historical_client: match };
      });

      return new Response(JSON.stringify({ orders: enrichedOrders }), {
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

    // ===== QUOTES =====

    // GET: list quotes
    if (req.method === "GET" && action === "list-quotes") {
      logStep("Listing quotes");
      const { data, error } = await supabase
        .from("quotes")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return new Response(JSON.stringify({ quotes: data }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // POST: create quote
    if (req.method === "POST" && action === "create-quote") {
      const body = await req.json();
      logStep("Creating quote", { email: body.contactEmail });

      // Generate quote number
      const { data: quoteNumber } = await supabase.rpc("get_next_invoice_number", { p_series: "P" });

      const { data, error } = await supabase.from("quotes").insert({
        quote_number: quoteNumber || "P-0000",
        first_name: body.firstName || null,
        last_name: body.lastName || null,
        contact_email: body.contactEmail || null,
        phone: body.phone || null,
        business_name: body.businessName || null,
        vat_number: body.vatNumber || null,
        full_address: body.fullAddress || null,
        city: body.city || null,
        state_province: body.stateProvince || null,
        postal_code: body.postalCode || null,
        country_code: body.countryCode || "ES",
        client_type: body.clientType || "particular",
        items: body.items || [],
        base_price: body.basePrice || 0,
        subtotal: body.subtotal || 0,
        song_count: body.songCount || 1,
        tax_rate: body.taxRate || 0,
        tax_amount: body.taxAmount || 0,
        tax_rule: body.taxRule || "spain_peninsula",
        total: body.total || 0,
        validity_days: body.validityDays || 30,
        valid_until: body.validUntil || null,
        notes: body.notes || null,
        payment_terms: body.paymentTerms || "PayPal o transferencia bancaria",
        status: "draft",
      }).select("id, quote_number").single();

      if (error) throw error;
      return new Response(JSON.stringify({ success: true, quote: data }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // POST: update quote status
    if (req.method === "POST" && action === "update-quote-status") {
      const { quoteId, status } = await req.json();
      if (!quoteId || !status) throw new Error("Missing quoteId or status");

      const validStatuses = ["draft", "sent", "accepted", "expired", "converted"];
      if (!validStatuses.includes(status)) throw new Error("Invalid quote status");

      logStep("Updating quote status", { quoteId, status });
      const { error } = await supabase
        .from("quotes")
        .update({ status })
        .eq("id", quoteId);

      if (error) throw error;
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // POST: delete quote
    if (req.method === "POST" && action === "delete-quote") {
      const { quoteId } = await req.json();
      if (!quoteId) throw new Error("Missing quoteId");

      logStep("Deleting quote", { quoteId });
      const { error } = await supabase
        .from("quotes")
        .delete()
        .eq("id", quoteId);

      if (error) throw error;
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // POST: convert quote to order
    if (req.method === "POST" && action === "convert-quote-to-order") {
      const { quoteId } = await req.json();
      if (!quoteId) throw new Error("Missing quoteId");

      logStep("Converting quote to order", { quoteId });

      // Fetch quote
      const { data: quote, error: fetchError } = await supabase
        .from("quotes")
        .select("*")
        .eq("id", quoteId)
        .single();

      if (fetchError || !quote) throw new Error("Quote not found");
      if (quote.status === "converted") throw new Error("Quote already converted");

      // Generate invoice number for the new order
      const { data: invoiceNumber } = await supabase.rpc("get_next_invoice_number", { p_series: "W" });

      // Create order from quote data
      const { data: order, error: insertError } = await supabase.from("orders").insert({
        invoice_number: invoiceNumber || null,
        invoice_series: "W",
        items: quote.items,
        base_price: quote.base_price,
        subtotal: quote.subtotal,
        song_count: quote.song_count,
        tax_rate: quote.tax_rate,
        tax_amount: quote.tax_amount,
        tax_rule: quote.tax_rule,
        total: quote.total,
        paypal_fee: 0,
        country_code: quote.country_code,
        postal_code: quote.postal_code,
        client_type: quote.client_type,
        vat_number: quote.vat_number,
        payment_method: "transfer",
        payment_status: "awaiting_transfer",
        is_professional_invoice: !!quote.business_name,
        business_name: quote.business_name,
        full_address: quote.full_address,
        city: quote.city,
        state_province: quote.state_province,
        billing_email: quote.contact_email,
        billing_phone: quote.phone,
        first_name: quote.first_name,
        last_name: quote.last_name,
        contact_email: quote.contact_email,
      }).select("id").single();

      if (insertError) throw insertError;

      // Mark quote as converted
      await supabase
        .from("quotes")
        .update({ status: "converted", converted_order_id: order.id })
        .eq("id", quoteId);

      return new Response(JSON.stringify({ success: true, orderId: order.id }), {
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
