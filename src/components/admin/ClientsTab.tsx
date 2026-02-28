import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Mail, Copy, ChevronDown, ChevronUp, Users, FileDown, ArrowUpDown } from "lucide-react";
import { toast } from "sonner";
import html2pdf from "html2pdf.js";

interface Order {
  id: string;
  created_at: string;
  invoice_number: string | null;
  is_professional_invoice: boolean;
  business_name: string | null;
  vat_number: string | null;
  billing_email: string | null;
  billing_phone: string | null;
  total: number;
  subtotal: number;
  tax_amount: number;
  tax_rate: number;
  payment_method: string;
  payment_status: string;
  country_code: string;
  client_type: string;
  items: any[];
  base_price: number;
  song_count: number;
  first_name: string | null;
  last_name: string | null;
  contact_email: string | null;
}

interface Props {
  orders: Order[];
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

function parseConfig(items: any[]) {
  if (!Array.isArray(items)) return { microphones: [], preamps: [], interfaces: [], extras: [], other: [] };
  const microphones: string[] = [];
  const preamps: string[] = [];
  const interfaces: string[] = [];
  const extras: string[] = [];
  const other: string[] = [];

  items.forEach((item: any) => {
    const name = item.name || item.id || "—";
    const cat = (item.category || "").toLowerCase();
    if (cat.includes("micro") || cat.includes("mic")) microphones.push(name);
    else if (cat.includes("preamp") || cat.includes("previo")) preamps.push(name);
    else if (cat.includes("interface") || cat.includes("interfaz")) interfaces.push(name);
    else if (cat.includes("extra")) extras.push(name);
    else other.push(name);
  });

  return { microphones, preamps, interfaces, extras, other };
}

function openGmailCompose(order: Order) {
  const config = parseConfig(order.items);
  const date = new Date(order.created_at).toLocaleDateString("es-ES");
  const clientName = order.business_name || order.billing_email || "Cliente";
  const songs = order.song_count || 1;

  const configLines: string[] = [];
  if (config.microphones.length) configLines.push("Microfonos: " + config.microphones.join(", "));
  if (config.preamps.length) configLines.push("Previos: " + config.preamps.join(", "));
  if (config.interfaces.length) configLines.push("Interfaz: " + config.interfaces.join(", "));
  if (config.extras.length) configLines.push("Extras: " + config.extras.join(", "));
  if (config.other.length) configLines.push("Otros: " + config.other.join(", "));
  if (songs > 1) configLines.push("Canciones: " + songs);

  // PayPal link
  const paypalItemName = "Grabacion bateria online - " + clientName + " - " + date;
  const paypalLink = "https://www.paypal.com/cgi-bin/webscr?cmd=_xclick&business=info%40tonimateos.com&item_name=" + encodeURIComponent(paypalItemName) + "&amount=" + order.total.toFixed(2) + "&currency_code=EUR&no_shipping=1";

  // Build body text (plain ASCII-safe)
  const bodyParts = [
    "Hola " + clientName + ",",
    "",
    "Muchas gracias por tu confianza. Vamos a procesar tu grabacion utilizando la configuracion de la sesion anterior que detallamos a continuacion:",
    "",
    ...configLines,
    "",
    "---",
    "DESGLOSE ECONOMICO",
  ];

  if (songs > 1) {
    const pricePerSong = order.subtotal / songs;
    bodyParts.push("Precio por cancion: " + pricePerSong.toFixed(2) + " EUR x " + songs + " = " + order.subtotal.toFixed(2) + " EUR");
  } else {
    bodyParts.push("Base imponible: " + order.subtotal.toFixed(2) + " EUR");
  }

  const taxLabel = order.tax_rate > 0 ? "IVA (" + order.tax_rate + "%)" : "IVA (exento)";
  bodyParts.push(taxLabel + ": " + order.tax_amount.toFixed(2) + " EUR");
  bodyParts.push("TOTAL: " + order.total.toFixed(2) + " EUR");
  bodyParts.push("---");
  bodyParts.push("");
  bodyParts.push("Puedes realizar el pago correspondiente a " + (songs > 1 ? "las " + songs + " canciones" : "la sesion") + " en el siguiente enlace:");
  bodyParts.push("");
  bodyParts.push(paypalLink);
  bodyParts.push("");
  bodyParts.push("Si prefieres transferencia bancaria, contactame y te facilito los datos.");
  bodyParts.push("");
  bodyParts.push("Un saludo,");
  bodyParts.push("Toni Mateos");
  bodyParts.push("Groove Factory Studios - tonimateos.com");

  const subject = encodeURIComponent("Confirmacion de grabacion y detalles tecnicos - tonimateos.com");
  const body = encodeURIComponent(bodyParts.join("\n"));
  const to = encodeURIComponent(order.billing_email || "");

  const url = "https://mail.google.com/mail/?view=cm&fs=1&to=" + to + "&authuser=web@tonimateos.com&su=" + subject + "&body=" + body;

  // Use window.open inside the synchronous click handler to avoid popup blocker
  const win = window.open(url, "_blank", "noopener,noreferrer");
  if (!win) {
    // Fallback: create a temporary <a> and click it
    const a = document.createElement("a");
    a.href = url;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
}

function copyConfig(order: Order) {
  const config = parseConfig(order.items);
  const lines: string[] = [];
  if (config.microphones.length) lines.push(`Micrófonos: ${config.microphones.join(", ")}`);
  if (config.preamps.length) lines.push(`Previos: ${config.preamps.join(", ")}`);
  if (config.interfaces.length) lines.push(`Interfaz: ${config.interfaces.join(", ")}`);
  if (config.extras.length) lines.push(`Extras: ${config.extras.join(", ")}`);
  if (config.other.length) lines.push(`Otros: ${config.other.join(", ")}`);

  const text = `Configuración de ${order.business_name || order.billing_email || "cliente"} (${new Date(order.created_at).toLocaleDateString("es-ES")}):\n${lines.join("\n")}\nTotal: ${order.total.toFixed(2)} €`;
  navigator.clipboard.writeText(text);
  toast.success("Configuración copiada al portapapeles");
}

function generateTechSheetPdf(order: Order) {
  const config = parseConfig(order.items);
  const date = new Date(order.created_at).toLocaleDateString("es-ES", { day: "2-digit", month: "long", year: "numeric" });
  const clientName = order.business_name || order.billing_email || "Cliente";
  const statusLabel = statusLabels[order.payment_status] || order.payment_status;

  const configSection = (title: string, items: string[], icon: string) => {
    if (items.length === 0) return "";
    return `
      <div style="margin-bottom:14px;">
        <h3 style="font-size:13px;font-weight:700;color:#c8a45a;margin:0 0 6px 0;text-transform:uppercase;letter-spacing:1px;">${icon} ${title}</h3>
        <ul style="margin:0;padding:0 0 0 18px;list-style:disc;color:#333;">
          ${items.map(i => `<li style="font-size:12px;margin-bottom:3px;">${i}</li>`).join("")}
        </ul>
      </div>
    `;
  };

  const html = `
    <div style="font-family:'Helvetica Neue',Arial,sans-serif;max-width:600px;margin:0 auto;padding:30px;color:#222;">
      <!-- Header -->
      <div style="display:flex;align-items:center;justify-content:space-between;border-bottom:3px solid #c8a45a;padding-bottom:16px;margin-bottom:24px;">
        <div>
          <h1 style="font-size:20px;font-weight:800;margin:0;color:#1a1a2e;letter-spacing:-0.5px;">GROOVE FACTORY STUDIOS</h1>
          <p style="font-size:11px;color:#888;margin:4px 0 0 0;">Ficha Técnica de Sesión · tonimateos.com</p>
        </div>
        <div style="text-align:right;">
          <p style="font-size:11px;color:#888;margin:0;">Fecha</p>
          <p style="font-size:13px;font-weight:600;margin:2px 0 0 0;">${date}</p>
        </div>
      </div>

      <!-- Client Info -->
      <div style="background:#f8f7f4;border-radius:8px;padding:16px;margin-bottom:24px;">
        <div style="display:flex;justify-content:space-between;flex-wrap:wrap;gap:12px;">
          <div>
            <p style="font-size:10px;color:#888;margin:0;text-transform:uppercase;letter-spacing:1px;">Cliente</p>
            <p style="font-size:14px;font-weight:700;margin:3px 0 0 0;">${clientName}</p>
          </div>
          ${order.billing_email ? `<div><p style="font-size:10px;color:#888;margin:0;text-transform:uppercase;letter-spacing:1px;">Email</p><p style="font-size:12px;margin:3px 0 0 0;">${order.billing_email}</p></div>` : ""}
          ${order.billing_phone ? `<div><p style="font-size:10px;color:#888;margin:0;text-transform:uppercase;letter-spacing:1px;">Teléfono</p><p style="font-size:12px;margin:3px 0 0 0;">${order.billing_phone}</p></div>` : ""}
          <div>
            <p style="font-size:10px;color:#888;margin:0;text-transform:uppercase;letter-spacing:1px;">Estado</p>
            <p style="font-size:12px;font-weight:600;margin:3px 0 0 0;color:${order.payment_status === "completed" ? "#16a34a" : "#d97706"};">${statusLabel}</p>
          </div>
        </div>
      </div>

      <!-- Technical Config -->
      <h2 style="font-size:15px;font-weight:700;color:#1a1a2e;margin:0 0 16px 0;border-bottom:1px solid #e5e5e5;padding-bottom:8px;">Configuración Técnica</h2>
      ${configSection("Micrófonos", config.microphones, "🎙")}
      ${configSection("Previos / Preamplificadores", config.preamps, "🔊")}
      ${configSection("Interfaz de Audio", config.interfaces, "🎛")}
      ${configSection("Extras", config.extras, "✨")}
      ${configSection("Otros", config.other, "📦")}
      ${config.microphones.length === 0 && config.preamps.length === 0 && config.interfaces.length === 0 && config.extras.length === 0 && config.other.length === 0 ? '<p style="font-size:12px;color:#888;">Configuración base estándar</p>' : ""}

      <!-- Pricing -->
      <div style="margin-top:24px;border-top:1px solid #e5e5e5;padding-top:16px;">
        <h2 style="font-size:15px;font-weight:700;color:#1a1a2e;margin:0 0 12px 0;">Desglose Económico</h2>
        <table style="width:100%;font-size:12px;border-collapse:collapse;">
          ${(order.song_count || 1) > 1 ? `<tr><td style="padding:4px 0;color:#666;">Canciones</td><td style="text-align:right;padding:4px 0;">${order.song_count}</td></tr>
          <tr><td style="padding:4px 0;color:#666;">Precio por canción</td><td style="text-align:right;padding:4px 0;">${(order.subtotal / (order.song_count || 1)).toFixed(2)} €</td></tr>` : ''}
          <tr><td style="padding:4px 0;color:#666;">Subtotal</td><td style="text-align:right;padding:4px 0;">${order.subtotal.toFixed(2)} €</td></tr>
          <tr><td style="padding:4px 0;color:#666;">IVA (${order.tax_rate}%)</td><td style="text-align:right;padding:4px 0;">${order.tax_amount.toFixed(2)} €</td></tr>
          <tr style="border-top:2px solid #c8a45a;"><td style="padding:8px 0 0;font-weight:800;font-size:14px;">TOTAL</td><td style="text-align:right;padding:8px 0 0;font-weight:800;font-size:14px;">${order.total.toFixed(2)} €</td></tr>
        </table>
      </div>

      <!-- Footer -->
      <div style="margin-top:30px;border-top:1px solid #e5e5e5;padding-top:12px;text-align:center;">
        <p style="font-size:10px;color:#aaa;margin:0;">Groove Factory Studios SL · info@tonimateos.com · tonimateos.com</p>
        <p style="font-size:9px;color:#ccc;margin:4px 0 0 0;">Documento generado automáticamente · ${new Date().toLocaleDateString("es-ES")}</p>
      </div>
    </div>
  `;

  const iframe = document.createElement("iframe");
  iframe.style.cssText = "position:absolute;left:-9999px;top:0;width:800px;height:1200px;border:none;";
  document.body.appendChild(iframe);

  const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
  if (!iframeDoc) { document.body.removeChild(iframe); toast.error("Error generando PDF"); return; }

  iframeDoc.open();
  iframeDoc.write(`<!DOCTYPE html><html><head><meta charset="utf-8"></head><body style="margin:0;padding:0;background:#fff;color:#222;">${html}</body></html>`);
  iframeDoc.close();

  const safeName = clientName.replace(/[^a-zA-Z0-9áéíóúñÁÉÍÓÚÑ ]/g, "").replace(/\s+/g, "-").substring(0, 30);
  const safeDate = new Date(order.created_at).toISOString().slice(0, 10);

  setTimeout(() => {
    html2pdf().from(iframeDoc.body).set({
      margin: [15, 12, 15, 12],
      filename: `ficha-tecnica-${safeName}-${safeDate}.pdf`,
      html2canvas: { scale: 2, useCORS: true, backgroundColor: "#ffffff", logging: false },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    }).save().then(() => {
      document.body.removeChild(iframe);
      toast.success("Ficha técnica descargada");
    }).catch(() => {
      document.body.removeChild(iframe);
      toast.error("Error generando PDF");
    });
  }, 500);
}

export default function ClientsTab({ orders }: Props) {
  const [search, setSearch] = useState("");
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [sortByLastName, setSortByLastName] = useState<'asc' | 'desc' | null>(null);

  const filtered = useMemo(() => {
    let result = orders;
    if (search.trim()) {
      const s = search.toLowerCase();
      result = result.filter(o =>
        (o.business_name || "").toLowerCase().includes(s) ||
        (o.billing_email || "").toLowerCase().includes(s) ||
        (o.billing_phone || "").toLowerCase().includes(s) ||
        (o.vat_number || "").toLowerCase().includes(s) ||
        (o.first_name || "").toLowerCase().includes(s) ||
        (o.last_name || "").toLowerCase().includes(s) ||
        (o.contact_email || "").toLowerCase().includes(s)
      );
    }
    if (sortByLastName) {
      result = [...result].sort((a, b) => {
        const aName = (a.last_name || "").toLowerCase();
        const bName = (b.last_name || "").toLowerCase();
        return sortByLastName === 'asc' ? aName.localeCompare(bName) : bName.localeCompare(aName);
      });
    }
    return result;
  }, [orders, search, sortByLastName]);

  const uniqueClients = useMemo(() => {
    const emails = new Set(filtered.map(o => o.billing_email).filter(Boolean));
    return emails.size;
  }, [filtered]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Users className="h-5 w-5 text-primary" />
        <h2 className="font-semibold text-lg">Historial de Clientes y Configuraciones</h2>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-4 pb-3 text-center">
            <p className="text-2xl font-bold text-primary">{uniqueClients}</p>
            <p className="text-xs text-muted-foreground">Clientes únicos</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-3 text-center">
            <p className="text-2xl font-bold">{filtered.length}</p>
            <p className="text-xs text-muted-foreground">Sesiones totales</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-3 text-center">
            <p className="text-2xl font-bold text-emerald-400">
              {filtered.filter(o => o.payment_status === "completed").length}
            </p>
            <p className="text-xs text-muted-foreground">Sesiones completadas</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-4 pb-3">
          <div className="flex items-center gap-3">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nombre, email, teléfono o NIF..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-md"
            />
            {search && (
              <Button variant="ghost" size="sm" onClick={() => setSearch("")}>
                Limpiar
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead>Fecha</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>
                  <button
                    className="flex items-center gap-1 hover:text-foreground transition-colors"
                    onClick={(e) => { e.stopPropagation(); setSortByLastName(prev => prev === 'asc' ? 'desc' : 'asc'); }}
                  >
                    Apellidos
                    <ArrowUpDown className="h-3 w-3" />
                  </button>
                </TableHead>
                <TableHead className="min-w-[200px]">Email</TableHead>
                <TableHead>Configuración</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-center">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((order) => {
                const config = parseConfig(order.items);
                const isExpanded = expandedRow === order.id;
                const hasConfig = config.microphones.length > 0 || config.preamps.length > 0 || config.interfaces.length > 0;

                return (
                  <>
                    <TableRow
                      key={order.id}
                      className="cursor-pointer hover:bg-muted/20"
                      onClick={() => setExpandedRow(isExpanded ? null : order.id)}
                    >
                      <TableCell className="whitespace-nowrap text-xs">
                        {new Date(order.created_at).toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit", year: "2-digit" })}
                      </TableCell>
                      <TableCell>
                        <span className="text-sm font-medium">{order.first_name || "—"}</span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm font-medium">{order.last_name || "—"}</span>
                      </TableCell>
                      <TableCell className="min-w-[200px]">
                        <span className="text-sm text-muted-foreground break-all">{order.contact_email || order.billing_email || "—"}</span>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1 max-w-[250px]">
                          {config.microphones.slice(0, 2).map((m, i) => (
                            <Badge key={`m-${i}`} variant="outline" className="text-[10px] border-primary/30 text-primary">
                              🎙 {m}
                            </Badge>
                          ))}
                          {config.preamps.slice(0, 2).map((p, i) => (
                            <Badge key={`p-${i}`} variant="outline" className="text-[10px] border-amber-500/30 text-amber-400">
                              🔊 {p}
                            </Badge>
                          ))}
                          {(config.microphones.length > 2 || config.preamps.length > 2 || config.interfaces.length > 0 || config.extras.length > 0) && (
                            <Badge variant="outline" className="text-[10px]">
                              +{config.microphones.length + config.preamps.length + config.interfaces.length + config.extras.length + config.other.length - Math.min(config.microphones.length, 2) - Math.min(config.preamps.length, 2)}
                            </Badge>
                          )}
                          {!hasConfig && config.other.length === 0 && config.extras.length === 0 && (
                            <span className="text-xs text-muted-foreground">Base</span>
                          )}
                          {isExpanded ? (
                            <ChevronUp className="h-3 w-3 text-muted-foreground ml-1" />
                          ) : (
                            <ChevronDown className="h-3 w-3 text-muted-foreground ml-1" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-mono font-bold text-sm">
                        {order.total.toFixed(2)} €
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`text-xs ${statusColors[order.payment_status] || ""}`}>
                          {statusLabels[order.payment_status] || order.payment_status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-center gap-1" onClick={(e) => e.stopPropagation()}>
                          {order.billing_email ? (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              title="Enviar email via Gmail"
                              onClick={() => openGmailCompose(order)}
                            >
                              <Mail className="h-3.5 w-3.5" />
                            </Button>
                          ) : (
                            <span className="inline-flex items-center justify-center h-7 w-7 opacity-30" title="Sin email">
                              <Mail className="h-3.5 w-3.5" />
                            </span>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            title="Descargar ficha técnica"
                            onClick={() => generateTechSheetPdf(order)}
                          >
                            <FileDown className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            title="Duplicar configuración"
                            onClick={() => copyConfig(order)}
                          >
                            <Copy className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                    {isExpanded && (
                      <TableRow key={`${order.id}-detail`} className="bg-muted/10">
                        <TableCell colSpan={8}>
                          <div className="py-3 px-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {config.microphones.length > 0 && (
                              <div>
                                <p className="text-xs font-medium text-muted-foreground mb-1">🎙 Micrófonos</p>
                                <ul className="text-sm space-y-0.5">
                                  {config.microphones.map((m, i) => <li key={i}>{m}</li>)}
                                </ul>
                              </div>
                            )}
                            {config.preamps.length > 0 && (
                              <div>
                                <p className="text-xs font-medium text-muted-foreground mb-1">🔊 Previos</p>
                                <ul className="text-sm space-y-0.5">
                                  {config.preamps.map((p, i) => <li key={i}>{p}</li>)}
                                </ul>
                              </div>
                            )}
                            {config.interfaces.length > 0 && (
                              <div>
                                <p className="text-xs font-medium text-muted-foreground mb-1">🎛 Interfaz</p>
                                <ul className="text-sm space-y-0.5">
                                  {config.interfaces.map((inf, i) => <li key={i}>{inf}</li>)}
                                </ul>
                              </div>
                            )}
                            {config.extras.length > 0 && (
                              <div>
                                <p className="text-xs font-medium text-muted-foreground mb-1">✨ Extras</p>
                                <ul className="text-sm space-y-0.5">
                                  {config.extras.map((e, i) => <li key={i}>{e}</li>)}
                                </ul>
                              </div>
                            )}
                            {config.other.length > 0 && (
                              <div>
                                <p className="text-xs font-medium text-muted-foreground mb-1">📦 Otros</p>
                                <ul className="text-sm space-y-0.5">
                                  {config.other.map((o, i) => <li key={i}>{o}</li>)}
                                </ul>
                              </div>
                            )}
                            <div>
                              <p className="text-xs font-medium text-muted-foreground mb-1">💰 Desglose</p>
                              <ul className="text-sm space-y-0.5">
                                {(order.song_count || 1) > 1 && (
                                  <li>🎵 Canciones: {order.song_count} × {(order.subtotal / order.song_count).toFixed(2)} €</li>
                                )}
                                <li>Subtotal: {order.subtotal.toFixed(2)} €</li>
                                <li>IVA ({order.tax_rate}%): {order.tax_amount.toFixed(2)} €</li>
                                <li className="font-bold">Total: {order.total.toFixed(2)} €</li>
                              </ul>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </>
                );
              })}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-12 text-muted-foreground">
                    {search ? "No se encontraron clientes con esa búsqueda" : "No hay pedidos registrados"}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
