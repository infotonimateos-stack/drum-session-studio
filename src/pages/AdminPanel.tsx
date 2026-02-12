import { useState, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Lock, LogOut, Trash2, Download, RefreshCw, AlertTriangle, FileText, Filter, Archive, FileSpreadsheet, FileDown, CalendarIcon } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import html2pdf from "html2pdf.js";

const ADMIN_ROUTE = true; // marker

interface Order {
  id: string;
  created_at: string;
  invoice_number: string | null;
  invoice_series: string | null;
  is_professional_invoice: boolean;
  business_name: string | null;
  vat_number: string | null;
  full_address: string | null;
  city: string | null;
  state_province: string | null;
  billing_email: string | null;
  billing_phone: string | null;
  total: number;
  subtotal: number;
  tax_amount: number;
  tax_rate: number;
  paypal_fee: number;
  payment_method: string;
  payment_status: string;
  country_code: string;
  client_type: string;
  items: any[];
  base_price: number;
  tax_rule: string;
}

const statusColors: Record<string, string> = {
  pending: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  completed: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  cancelled: "bg-red-500/20 text-red-400 border-red-500/30",
  awaiting_transfer: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  refunded: "bg-purple-500/20 text-purple-400 border-purple-500/30",
};

const statusLabels: Record<string, string> = {
  pending: "Pendiente",
  completed: "Completado",
  cancelled: "Cancelado",
  awaiting_transfer: "Esperando transferencia",
  refunded: "Reembolsado",
};

export default function AdminPanel() {
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterMethod, setFilterMethod] = useState<string>("all");
  const [filterInvoice, setFilterInvoice] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [storedPassword, setStoredPassword] = useState("");
  const [bulkDownloading, setBulkDownloading] = useState(false);
  const [selectedOrders, setSelectedOrders] = useState<Set<string>>(new Set());
  const [dateFrom, setDateFrom] = useState<Date | undefined>();
  const [dateTo, setDateTo] = useState<Date | undefined>();

  const apiCall = useCallback(async (action: string, method: string = "GET", body?: any, params?: Record<string, string>) => {
    const url = new URL(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-api`);
    url.searchParams.set("action", action);
    if (params) Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));

    const options: RequestInit = {
      method,
      headers: {
        "Content-Type": "application/json",
        "x-admin-password": storedPassword,
        "apikey": import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
      },
    };
    if (body) options.body = JSON.stringify(body);

    const res = await fetch(url.toString(), options);
    if (res.status === 401) {
      setAuthenticated(false);
      setStoredPassword("");
      toast.error("Sesión expirada");
      throw new Error("Unauthorized");
    }
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Error desconocido");
    }
    return res.json();
  }, [storedPassword]);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiCall("list");
      setOrders(data.orders || []);
    } catch (e: any) {
      if (e.message !== "Unauthorized") toast.error("Error cargando pedidos");
    }
    setLoading(false);
  }, [apiCall]);

  useEffect(() => {
    if (authenticated) fetchOrders();
  }, [authenticated, fetchOrders]);

  const handleLogin = async () => {
    if (!password.trim()) return;
    setStoredPassword(password);
    try {
      const url = new URL(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-api`);
      url.searchParams.set("action", "list");
      const res = await fetch(url.toString(), {
        headers: {
          "x-admin-password": password,
          "apikey": import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
        },
      });
      if (res.status === 401) {
        toast.error("Contraseña incorrecta");
        setStoredPassword("");
        return;
      }
      const data = await res.json();
      setOrders(data.orders || []);
      setAuthenticated(true);
      sessionStorage.setItem("admin_auth", "true");
    } catch {
      toast.error("Error de conexión");
      setStoredPassword("");
    }
  };

  const handleUpdateStatus = async (orderId: string, status: string) => {
    try {
      await apiCall("update-status", "POST", { orderId, status });
      toast.success(`Estado actualizado a: ${statusLabels[status]}`);
      fetchOrders();
    } catch {
      toast.error("Error actualizando estado");
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (!confirm("¿Eliminar este pedido permanentemente?")) return;
    try {
      await apiCall("delete", "POST", { orderId });
      toast.success("Pedido eliminado");
      fetchOrders();
    } catch {
      toast.error("Error eliminando pedido");
    }
  };

  const handleDeleteAll = async () => {
    if (!confirm("⚠️ ¿Eliminar TODOS los pedidos y reiniciar contador de facturas? Esta acción es irreversible.")) return;
    if (!confirm("¿Estás COMPLETAMENTE seguro? Se borrarán todos los datos.")) return;
    try {
      await apiCall("delete-all", "POST");
      toast.success("Todos los pedidos eliminados y contador reiniciado a W-0001");
      fetchOrders();
    } catch {
      toast.error("Error eliminando pedidos");
    }
  };

  const handleDownloadInvoice = async (orderId: string, invoiceNumber: string | null) => {
    try {
      const data = await apiCall("invoice", "GET", undefined, { orderId });
      if (!data.html) { toast.error("No se pudo generar la factura"); return; }
      const blob = new Blob([data.html], { type: "text/html" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `factura-${invoiceNumber || orderId.slice(0, 8)}.html`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("Factura descargada");
    } catch {
      toast.error("Error descargando factura");
    }
  };

  const filteredOrders = orders.filter((o) => {
    if (filterStatus !== "all" && o.payment_status !== filterStatus) return false;
    if (filterMethod !== "all" && o.payment_method !== filterMethod) return false;
    if (filterInvoice === "professional" && !o.is_professional_invoice) return false;
    if (filterInvoice === "simplified" && o.is_professional_invoice) return false;
    if (dateFrom) {
      const orderDate = new Date(o.created_at);
      if (orderDate < dateFrom) return false;
    }
    if (dateTo) {
      const orderDate = new Date(o.created_at);
      const endOfDay = new Date(dateTo);
      endOfDay.setHours(23, 59, 59, 999);
      if (orderDate > endOfDay) return false;
    }
    if (searchTerm) {
      const s = searchTerm.toLowerCase();
      return (
        (o.invoice_number || "").toLowerCase().includes(s) ||
        (o.business_name || "").toLowerCase().includes(s) ||
        (o.billing_email || "").toLowerCase().includes(s) ||
        o.id.toLowerCase().includes(s)
      );
    }
    return true;
  });

  const totalRevenue = filteredOrders.reduce((s, o) => s + o.total, 0);
  const totalTax = filteredOrders.reduce((s, o) => s + o.tax_amount, 0);
  const completedOrders = filteredOrders.filter((o) => o.payment_status === "completed").length;

  const getTargetOrders = () => {
    if (selectedOrders.size > 0) return filteredOrders.filter(o => selectedOrders.has(o.id));
    return filteredOrders;
  };

  const toggleSelectAll = () => {
    if (selectedOrders.size === filteredOrders.length) {
      setSelectedOrders(new Set());
    } else {
      setSelectedOrders(new Set(filteredOrders.map(o => o.id)));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedOrders(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const handleBulkDownloadZip = async () => {
    const targets = getTargetOrders();
    if (targets.length === 0) { toast.error("No hay facturas para descargar"); return; }
    setBulkDownloading(true);
    const zip = new JSZip();
    let count = 0;
    try {
      for (const order of targets) {
        try {
          const data = await apiCall("invoice", "GET", undefined, { orderId: order.id });
          if (data.html) {
            zip.file(`factura-${order.invoice_number || order.id.slice(0, 8)}.html`, data.html);
            count++;
          }
        } catch { /* skip */ }
      }
      if (count === 0) { toast.error("No se pudo generar ninguna factura"); setBulkDownloading(false); return; }
      const blob = await zip.generateAsync({ type: "blob" });
      saveAs(blob, `facturas-${new Date().toISOString().slice(0, 10)}.zip`);
      toast.success(`${count} facturas descargadas en ZIP`);
    } catch {
      toast.error("Error generando ZIP");
    }
    setBulkDownloading(false);
  };

  const handleBulkDownloadPdf = async () => {
    const targets = getTargetOrders();
    if (targets.length === 0) { toast.error("No hay facturas para descargar"); return; }
    setBulkDownloading(true);
    const zip = new JSZip();
    let count = 0;
    try {
      for (const order of targets) {
        try {
          const data = await apiCall("invoice", "GET", undefined, { orderId: order.id });
          if (data.html) {
            // Use an iframe to isolate from page CSS/dark theme
            const iframe = document.createElement("iframe");
            iframe.style.cssText = "position:absolute;left:-9999px;top:0;width:800px;height:1200px;border:none;";
            document.body.appendChild(iframe);
            const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
            if (!iframeDoc) { document.body.removeChild(iframe); continue; }
            iframeDoc.open();
            iframeDoc.write(data.html);
            iframeDoc.close();
            await new Promise(r => setTimeout(r, 500));
            const pdfBlob = await html2pdf().from(iframeDoc.body).set({
              margin: [15, 10, 15, 10],
              filename: `factura-${order.invoice_number || order.id.slice(0, 8)}.pdf`,
              html2canvas: { scale: 2, useCORS: true, backgroundColor: "#ffffff", logging: false },
              jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
              pagebreak: { mode: ["avoid-all", "css", "legacy"] },
            }).outputPdf("blob");
            document.body.removeChild(iframe);
            zip.file(`factura-${order.invoice_number || order.id.slice(0, 8)}.pdf`, pdfBlob);
            count++;
          }
        } catch { /* skip */ }
      }
      if (count === 0) { toast.error("No se pudo generar ningún PDF"); setBulkDownloading(false); return; }
      if (count === 1) {
        const files = Object.values(zip.files);
        const file = files[0];
        const blob = await file.async("blob");
        saveAs(blob, file.name);
      } else {
        const blob = await zip.generateAsync({ type: "blob" });
        saveAs(blob, `facturas-pdf-${new Date().toISOString().slice(0, 10)}.zip`);
      }
      toast.success(`${count} factura(s) descargada(s) en PDF`);
    } catch {
      toast.error("Error generando PDFs");
    }
    setBulkDownloading(false);
  };

  const handleExportCSV = () => {
    if (filteredOrders.length === 0) { toast.error("No hay datos para exportar"); return; }
    const headers = ["Fecha", "Nº Factura", "Serie", "Tipo", "Razón Social", "NIF/VAT", "Email", "Teléfono", "Dirección", "Ciudad", "Provincia", "País", "Tipo Cliente", "Base Imponible", "Subtotal", "IVA (%)", "IVA (€)", "Comisión PayPal", "Total", "Método Pago", "Estado", "Regla Fiscal"];
    const rows = filteredOrders.map((o) => [
      new Date(o.created_at).toLocaleDateString("es-ES"),
      o.invoice_number || "",
      o.invoice_series || "",
      o.is_professional_invoice ? "Profesional" : "Simplificada",
      o.business_name || "",
      o.vat_number || "",
      o.billing_email || "",
      o.billing_phone || "",
      o.full_address || "",
      o.city || "",
      o.state_province || "",
      o.country_code || "",
      o.client_type || "",
      o.base_price.toFixed(2),
      o.subtotal.toFixed(2),
      o.tax_rate.toFixed(2),
      o.tax_amount.toFixed(2),
      o.paypal_fee.toFixed(2),
      o.total.toFixed(2),
      o.payment_method,
      statusLabels[o.payment_status] || o.payment_status,
      o.tax_rule || "",
    ]);
    const csvContent = [headers, ...rows].map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(";")).join("\n");
    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8" });
    saveAs(blob, `pedidos-${new Date().toISOString().slice(0, 10)}.csv`);
    toast.success(`${filteredOrders.length} pedidos exportados a CSV`);
  };

  // --- LOGIN SCREEN ---
  if (!authenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-sm">
          <CardHeader className="text-center">
            <Lock className="h-10 w-10 mx-auto text-primary mb-2" />
            <CardTitle>Panel de Administración</CardTitle>
            <p className="text-sm text-muted-foreground">Groove Factory Studios SL</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              type="password"
              placeholder="Contraseña de administrador"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            />
            <Button onClick={handleLogin} className="w-full">Acceder</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // --- ADMIN PANEL ---
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FileText className="h-6 w-6 text-primary" />
            <div>
              <h1 className="font-bold text-lg">Admin — Groove Factory Studios</h1>
              <p className="text-xs text-muted-foreground">{orders.length} pedidos · {completedOrders} completados</p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {selectedOrders.size > 0 && (
              <span className="text-xs text-muted-foreground mr-1">{selectedOrders.size} seleccionados</span>
            )}
            <Button variant="outline" size="sm" onClick={handleExportCSV}>
              <FileSpreadsheet className="h-4 w-4 mr-1" /> CSV
            </Button>
            <Button variant="outline" size="sm" onClick={handleBulkDownloadZip} disabled={bulkDownloading}>
              <Archive className={`h-4 w-4 mr-1 ${bulkDownloading ? "animate-spin" : ""}`} /> {bulkDownloading ? "Generando..." : "ZIP HTML"}
            </Button>
            <Button variant="outline" size="sm" onClick={handleBulkDownloadPdf} disabled={bulkDownloading}>
              <FileDown className={`h-4 w-4 mr-1 ${bulkDownloading ? "animate-spin" : ""}`} /> {bulkDownloading ? "Generando..." : "PDF"}
            </Button>
            <Button variant="outline" size="sm" onClick={fetchOrders} disabled={loading}>
              <RefreshCw className={`h-4 w-4 mr-1 ${loading ? "animate-spin" : ""}`} /> Refrescar
            </Button>
            <Button variant="destructive" size="sm" onClick={handleDeleteAll}>
              <AlertTriangle className="h-4 w-4 mr-1" /> Borrar todo
            </Button>
            <Button variant="ghost" size="sm" onClick={() => { setAuthenticated(false); setStoredPassword(""); sessionStorage.removeItem("admin_auth"); }}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="pt-4 pb-3 text-center">
              <p className="text-2xl font-bold text-primary">{filteredOrders.length}</p>
              <p className="text-xs text-muted-foreground">Pedidos</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-3 text-center">
              <p className="text-2xl font-bold text-emerald-400">{totalRevenue.toFixed(2)} €</p>
              <p className="text-xs text-muted-foreground">Facturación total</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-3 text-center">
              <p className="text-2xl font-bold text-amber-400">{totalTax.toFixed(2)} €</p>
              <p className="text-xs text-muted-foreground">IVA total</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-3 text-center">
              <p className="text-2xl font-bold">{filteredOrders.filter(o => o.is_professional_invoice).length}</p>
              <p className="text-xs text-muted-foreground">Facturas profesionales</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-3 text-center">
              <p className="text-2xl font-bold">{completedOrders}</p>
              <p className="text-xs text-muted-foreground">Completados</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-4 pb-3">
            <div className="flex flex-wrap items-center gap-3">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nº factura, empresa, email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64"
              />
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className={cn("w-36 justify-start text-left font-normal", !dateFrom && "text-muted-foreground")}>
                    <CalendarIcon className="h-4 w-4 mr-1" />
                    {dateFrom ? format(dateFrom, "dd/MM/yy") : "Desde"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={dateFrom} onSelect={setDateFrom} locale={es} initialFocus className={cn("p-3 pointer-events-auto")} />
                </PopoverContent>
              </Popover>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className={cn("w-36 justify-start text-left font-normal", !dateTo && "text-muted-foreground")}>
                    <CalendarIcon className="h-4 w-4 mr-1" />
                    {dateTo ? format(dateTo, "dd/MM/yy") : "Hasta"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={dateTo} onSelect={setDateTo} locale={es} initialFocus className={cn("p-3 pointer-events-auto")} />
                </PopoverContent>
              </Popover>
              {(dateFrom || dateTo) && (
                <Button variant="ghost" size="sm" onClick={() => { setDateFrom(undefined); setDateTo(undefined); }}>
                  Limpiar fechas
                </Button>
              )}
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-44"><SelectValue placeholder="Estado" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value="pending">Pendiente</SelectItem>
                  <SelectItem value="completed">Completado</SelectItem>
                  <SelectItem value="awaiting_transfer">Esperando transferencia</SelectItem>
                  <SelectItem value="cancelled">Cancelado</SelectItem>
                  <SelectItem value="refunded">Reembolsado</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterMethod} onValueChange={setFilterMethod}>
                <SelectTrigger className="w-40"><SelectValue placeholder="Método" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los métodos</SelectItem>
                  <SelectItem value="paypal">PayPal</SelectItem>
                  <SelectItem value="transfer">Transferencia</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterInvoice} onValueChange={setFilterInvoice}>
                <SelectTrigger className="w-44"><SelectValue placeholder="Tipo factura" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las facturas</SelectItem>
                  <SelectItem value="professional">Profesional</SelectItem>
                  <SelectItem value="simplified">Simplificada</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Orders Table */}
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="px-3 py-3 w-10">
                    <Checkbox
                      checked={filteredOrders.length > 0 && selectedOrders.size === filteredOrders.length}
                      onCheckedChange={toggleSelectAll}
                    />
                  </th>
                  <th className="text-left px-4 py-3 font-medium">Fecha</th>
                  <th className="text-left px-4 py-3 font-medium">Nº Factura</th>
                  <th className="text-left px-4 py-3 font-medium">Tipo</th>
                  <th className="text-left px-4 py-3 font-medium">Cliente</th>
                  <th className="text-right px-4 py-3 font-medium">IVA</th>
                  <th className="text-right px-4 py-3 font-medium">Total</th>
                  <th className="text-left px-4 py-3 font-medium">Método</th>
                  <th className="text-left px-4 py-3 font-medium">Estado</th>
                  <th className="text-center px-4 py-3 font-medium">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.id} className={`border-b border-border/50 hover:bg-muted/20 transition-colors ${selectedOrders.has(order.id) ? "bg-muted/10" : ""}`}>
                    <td className="px-3 py-3">
                      <Checkbox
                        checked={selectedOrders.has(order.id)}
                        onCheckedChange={() => toggleSelect(order.id)}
                      />
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {new Date(order.created_at).toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit", year: "2-digit" })}
                      <span className="text-muted-foreground ml-1 text-xs">
                        {new Date(order.created_at).toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs">
                      {order.invoice_number || <span className="text-muted-foreground">—</span>}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="outline" className={order.is_professional_invoice ? "border-primary/50 text-primary" : "border-muted-foreground/30 text-muted-foreground"}>
                        {order.is_professional_invoice ? "Profesional" : "Simplificada"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 max-w-[200px] truncate">
                      {order.is_professional_invoice ? (
                        <div>
                          <p className="font-medium truncate">{order.business_name}</p>
                          <p className="text-xs text-muted-foreground truncate">{order.vat_number} · {order.billing_email}</p>
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-xs">{order.country_code} · {order.client_type}</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-xs">
                      <span className="text-muted-foreground">{order.tax_rate}%</span>
                      <br />
                      {order.tax_amount.toFixed(2)} €
                    </td>
                    <td className="px-4 py-3 text-right font-mono font-bold">{order.total.toFixed(2)} €</td>
                    <td className="px-4 py-3">
                      <Badge variant="outline" className="text-xs capitalize">{order.payment_method}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Select value={order.payment_status} onValueChange={(v) => handleUpdateStatus(order.id, v)}>
                        <SelectTrigger className={`h-7 text-xs border ${statusColors[order.payment_status] || ""}`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(statusLabels).map(([val, label]) => (
                            <SelectItem key={val} value={val}>{label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-1">
                        <Button variant="ghost" size="icon" className="h-7 w-7" title="Descargar factura" onClick={() => handleDownloadInvoice(order.id, order.invoice_number)}>
                          <Download className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" title="Eliminar" onClick={() => handleDeleteOrder(order.id)}>
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredOrders.length === 0 && (
                  <tr>
                    <td colSpan={10} className="px-4 py-12 text-center text-muted-foreground">
                      {loading ? "Cargando..." : "No se encontraron pedidos"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
