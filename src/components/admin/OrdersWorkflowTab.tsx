import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Play, CheckCircle2, ChevronDown, ChevronRight, Mail, Package, Music, Phone, MapPin, User, History, Paperclip, Clock } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface Order {
  id: string;
  created_at: string;
  first_name: string | null;
  last_name: string | null;
  contact_email: string | null;
  country_code: string;
  items: any[];
  song_count: number;
  total: number;
  payment_method: string;
  payment_status: string;
  invoice_number: string | null;
  work_status: string;
  deadline: string | null;
  work_notes: string | null;
  paypal_payer_info: any | null;
  billing_phone: string | null;
  full_address: string | null;
  city: string | null;
  state_province: string | null;
  postal_code: string | null;
  billing_email: string | null;
  business_name: string | null;
  vat_number: string | null;
  is_professional_invoice: boolean;
  files_status: string;
  files_detected_at: string | null;
  files_detection_method: string | null;
  files_last_checked_at: string | null;
}

interface Props {
  orders: Order[];
  onRefresh: () => void;
  apiCall: (action: string, method: string, body?: any) => Promise<any>;
}

function countryFlag(code: string): string {
  if (!code || code.length !== 2) return "";
  const offset = 0x1F1E6;
  const a = code.toUpperCase().charCodeAt(0) - 65 + offset;
  const b = code.toUpperCase().charCodeAt(1) - 65 + offset;
  return String.fromCodePoint(a, b);
}

function parseConfig(items: any[]) {
  if (!Array.isArray(items)) return { microphones: [], preamps: [], interfaces: [], extras: [] };
  const microphones: string[] = [];
  const preamps: string[] = [];
  const interfaces: string[] = [];
  const extras: string[] = [];

  items.forEach((item: any) => {
    const name = item.name || item.id || "";
    const cat = (item.category || "").toLowerCase();
    if (cat.includes("micro") || cat.includes("mic")) microphones.push(name);
    else if (cat.includes("preamp") || cat.includes("previo")) preamps.push(name);
    else if (cat.includes("interface") || cat.includes("interfaz")) interfaces.push(name);
    else extras.push(name);
  });

  return { microphones, preamps, interfaces, extras };
}

const workStatusConfig = {
  new: { label: "Nuevos", color: "bg-amber-500/20 text-amber-400 border-amber-500/30", dotColor: "bg-amber-400" },
  in_progress: { label: "En proceso", color: "bg-blue-500/20 text-blue-400 border-blue-500/30", dotColor: "bg-blue-400" },
  delivered: { label: "Entregados", color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30", dotColor: "bg-emerald-400" },
};

export default function OrdersWorkflowTab({ orders, onRefresh, apiCall }: Props) {
  const [showDelivered, setShowDelivered] = useState(false);
  const [editingNotes, setEditingNotes] = useState<Record<string, string>>({});
  const [savingField, setSavingField] = useState<string | null>(null);

  const completedOrders = useMemo(
    () => orders.filter(o => o.payment_status === "completed"),
    [orders]
  );

  const grouped = useMemo(() => ({
    new: completedOrders.filter(o => (o.work_status || "new") === "new"),
    in_progress: completedOrders.filter(o => o.work_status === "in_progress"),
    delivered: completedOrders.filter(o => o.work_status === "delivered"),
  }), [completedOrders]);

  const handleUpdateWorkStatus = async (orderId: string, workStatus: string) => {
    try {
      setSavingField(`status-${orderId}`);
      await apiCall("update-work-status", "POST", { orderId, workStatus });
      toast.success(`Estado actualizado: ${workStatusConfig[workStatus as keyof typeof workStatusConfig]?.label}`);
      onRefresh();
    } catch {
      toast.error("Error actualizando estado");
    } finally {
      setSavingField(null);
    }
  };

  const handleUpdateDeadline = async (orderId: string, date: Date | undefined) => {
    try {
      setSavingField(`deadline-${orderId}`);
      const deadline = date ? format(date, "yyyy-MM-dd") : null;
      await apiCall("update-deadline", "POST", { orderId, deadline });
      toast.success(date ? `Fecha limite: ${format(date, "dd/MM/yyyy")}` : "Fecha limite eliminada");
      onRefresh();
    } catch {
      toast.error("Error actualizando fecha");
    } finally {
      setSavingField(null);
    }
  };

  const handleUpdateFilesStatus = async (orderId: string, filesStatus: string) => {
    try {
      setSavingField(`files-${orderId}`);
      await apiCall("update-files-status", "POST", { orderId, filesStatus });
      toast.success(filesStatus === "received" ? "Archivos marcados como recibidos" : "Marcado como pendiente");
      onRefresh();
    } catch {
      toast.error("Error actualizando estado de archivos");
    } finally {
      setSavingField(null);
    }
  };

  const handleSaveNotes = async (orderId: string) => {
    const notes = editingNotes[orderId];
    if (notes === undefined) return;
    try {
      setSavingField(`notes-${orderId}`);
      await apiCall("update-work-notes", "POST", { orderId, notes: notes || null });
      setEditingNotes(prev => { const n = { ...prev }; delete n[orderId]; return n; });
      toast.success("Notas guardadas");
      onRefresh();
    } catch {
      toast.error("Error guardando notas");
    } finally {
      setSavingField(null);
    }
  };

  const renderOrderCard = (order: Order) => {
    const config = parseConfig(order.items || []);
    const flag = countryFlag(order.country_code);
    const isEditingNotes = editingNotes[order.id] !== undefined;
    const currentNotes = isEditingNotes ? editingNotes[order.id] : (order.work_notes || "");
    const deadlineDate = order.deadline ? new Date(order.deadline + "T00:00:00") : undefined;
    const status = (order.work_status || "new") as keyof typeof workStatusConfig;

    // Detect recurring client by email
    const email = order.contact_email || order.billing_email;
    const previousOrders = email
      ? completedOrders.filter(o => o.id !== order.id && (o.contact_email === email || o.billing_email === email))
      : [];

    // Build client info from PayPal payer data + form data
    const pp = order.paypal_payer_info || {};
    const clientPhone = order.billing_phone || pp.phone || null;
    const clientAddress = order.full_address || (pp.address ? [pp.address.line1, pp.address.line2].filter(Boolean).join(", ") : null);
    const clientCity = order.city || pp.address?.city || null;
    const clientState = order.state_province || pp.address?.state || null;
    const clientPostal = order.postal_code || pp.address?.postal_code || null;
    const paypalEmail = pp.email && pp.email !== order.contact_email ? pp.email : null;
    const paypalName = pp.first_name && pp.last_name ? `${pp.first_name} ${pp.last_name}` : null;
    const paypalPayerId = pp.payer_id || null;

    return (
      <Card key={order.id} className="hover:border-primary/30 transition-colors">
        <CardContent className="pt-4 pb-4 space-y-3">
          {/* Recurring client badge */}
          {previousOrders.length > 0 && (
            <Badge variant="outline" className="bg-purple-500/10 text-purple-400 border-purple-500/30 gap-1 text-xs">
              <History className="h-3 w-3" />
              Cliente recurrente - {previousOrders.length} pedido{previousOrders.length > 1 ? "s" : ""} anterior{previousOrders.length > 1 ? "es" : ""}
            </Badge>
          )}

          {/* Header: name + country + date */}
          <div className="flex items-start justify-between">
            <div>
              <p className="font-semibold text-sm">
                {flag} {order.first_name || ""} {order.last_name || ""}
              </p>
              {order.contact_email && (
                <a href={`mailto:${order.contact_email}`} className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1 mt-0.5">
                  <Mail className="h-3 w-3" />
                  {order.contact_email}
                </a>
              )}
              {paypalEmail && (
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                  <User className="h-3 w-3" />
                  PayPal: {paypalEmail}
                </p>
              )}
              {clientPhone && (
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                  <Phone className="h-3 w-3" />
                  {clientPhone}
                </p>
              )}
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">
                {new Date(order.created_at).toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "numeric" })}
              </p>
              {order.invoice_number && (
                <p className="text-xs font-mono text-muted-foreground">{order.invoice_number}</p>
              )}
              {order.is_professional_invoice && order.business_name && (
                <p className="text-xs text-muted-foreground">{order.business_name}</p>
              )}
            </div>
          </div>

          {/* Address if available */}
          {(clientAddress || clientCity) && (
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <MapPin className="h-3 w-3 flex-shrink-0" />
              {[clientAddress, clientCity, clientState, clientPostal].filter(Boolean).join(", ")}
            </p>
          )}

          {/* Summary: songs + total + method */}
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="outline" className="gap-1 text-xs">
              <Music className="h-3 w-3" />
              {order.song_count} {order.song_count === 1 ? "cancion" : "canciones"}
            </Badge>
            <Badge variant="outline" className="text-xs font-mono font-bold">
              {order.total.toFixed(2)} EUR
            </Badge>
            <Badge variant="outline" className="text-xs capitalize">
              {order.payment_method}
            </Badge>
          </div>

          {/* Files status */}
          {status !== "delivered" && (
            <div className="flex items-center gap-2">
              {(order.files_status || "pending") === "received" ? (
                <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 gap-1 text-xs">
                  <Paperclip className="h-3 w-3" />
                  Archivos recibidos
                  {order.files_detection_method && order.files_detection_method !== "manual" && (
                    <span className="text-[10px] opacity-70 ml-1">
                      ({order.files_detection_method === "attachment" ? "adjunto" :
                        order.files_detection_method === "wetransfer_link" ? "WeTransfer" :
                        order.files_detection_method === "drive_link" ? "Drive" :
                        order.files_detection_method === "dropbox_link" ? "Dropbox" : ""})
                    </span>
                  )}
                </Badge>
              ) : (
                <Badge variant="outline" className="bg-amber-500/10 text-amber-400 border-amber-500/30 gap-1 text-xs">
                  <Clock className="h-3 w-3" />
                  Esperando archivos
                </Badge>
              )}
              <Button
                variant="ghost"
                size="sm"
                className="h-6 text-[10px] px-2"
                onClick={() => handleUpdateFilesStatus(order.id, (order.files_status || "pending") === "received" ? "pending" : "received")}
                disabled={savingField === `files-${order.id}`}
              >
                {(order.files_status || "pending") === "received" ? "Desmarcar" : "Marcar recibido"}
              </Button>
            </div>
          )}

          {/* Items grouped by category */}
          {(config.microphones.length > 0 || config.preamps.length > 0 || config.interfaces.length > 0 || config.extras.length > 0) && (
            <div className="space-y-1 text-xs">
              {config.microphones.length > 0 && (
                <div className="flex items-start gap-2">
                  <span className="text-muted-foreground whitespace-nowrap">Micros:</span>
                  <span>{config.microphones.join(", ")}</span>
                </div>
              )}
              {config.preamps.length > 0 && (
                <div className="flex items-start gap-2">
                  <span className="text-muted-foreground whitespace-nowrap">Previos:</span>
                  <span>{config.preamps.join(", ")}</span>
                </div>
              )}
              {config.interfaces.length > 0 && (
                <div className="flex items-start gap-2">
                  <span className="text-muted-foreground whitespace-nowrap">Interfaz:</span>
                  <span>{config.interfaces.join(", ")}</span>
                </div>
              )}
              {config.extras.length > 0 && (
                <div className="flex items-start gap-2">
                  <span className="text-muted-foreground whitespace-nowrap">Extras:</span>
                  <span>{config.extras.join(", ")}</span>
                </div>
              )}
            </div>
          )}

          {/* Deadline */}
          <div className="flex items-center gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className={cn(
                    "h-7 text-xs justify-start gap-1",
                    !deadlineDate && "text-muted-foreground"
                  )}
                  disabled={savingField === `deadline-${order.id}`}
                >
                  <CalendarIcon className="h-3 w-3" />
                  {deadlineDate ? format(deadlineDate, "dd/MM/yyyy") : "Fecha limite"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={deadlineDate}
                  onSelect={(d) => handleUpdateDeadline(order.id, d)}
                  locale={es}
                  initialFocus
                  className="pointer-events-auto"
                />
                {deadlineDate && (
                  <div className="p-2 border-t">
                    <Button variant="ghost" size="sm" className="w-full text-xs" onClick={() => handleUpdateDeadline(order.id, undefined)}>
                      Quitar fecha
                    </Button>
                  </div>
                )}
              </PopoverContent>
            </Popover>
            {deadlineDate && (
              <DeadlineIndicator deadline={deadlineDate} />
            )}
          </div>

          {/* Notes */}
          <div>
            <Textarea
              placeholder="Notas de trabajo..."
              value={currentNotes}
              onChange={(e) => setEditingNotes(prev => ({ ...prev, [order.id]: e.target.value }))}
              onBlur={() => { if (isEditingNotes) handleSaveNotes(order.id); }}
              className="text-xs min-h-[40px] h-10 resize-none"
              disabled={savingField === `notes-${order.id}`}
            />
          </div>

          {/* Action buttons */}
          <div className="flex gap-2">
            {status === "new" && (
              <Button
                size="sm"
                className="gap-1 text-xs"
                onClick={() => handleUpdateWorkStatus(order.id, "in_progress")}
                disabled={savingField === `status-${order.id}`}
              >
                <Play className="h-3 w-3" /> Empezar
              </Button>
            )}
            {status === "in_progress" && (
              <Button
                size="sm"
                variant="default"
                className="gap-1 text-xs bg-emerald-600 hover:bg-emerald-700"
                onClick={() => handleUpdateWorkStatus(order.id, "delivered")}
                disabled={savingField === `status-${order.id}`}
              >
                <CheckCircle2 className="h-3 w-3" /> Marcar entregado
              </Button>
            )}
            {status === "delivered" && (
              <Button
                size="sm"
                variant="outline"
                className="gap-1 text-xs"
                onClick={() => handleUpdateWorkStatus(order.id, "in_progress")}
                disabled={savingField === `status-${order.id}`}
              >
                Volver a en proceso
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Summary stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4 pb-3 text-center">
            <div className="flex items-center justify-center gap-2">
              <div className={cn("w-2 h-2 rounded-full", workStatusConfig.new.dotColor)} />
              <p className="text-2xl font-bold text-amber-400">{grouped.new.length}</p>
            </div>
            <p className="text-xs text-muted-foreground">Nuevos</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-3 text-center">
            <div className="flex items-center justify-center gap-2">
              <div className={cn("w-2 h-2 rounded-full", workStatusConfig.in_progress.dotColor)} />
              <p className="text-2xl font-bold text-blue-400">{grouped.in_progress.length}</p>
            </div>
            <p className="text-xs text-muted-foreground">En proceso</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-3 text-center">
            <p className="text-2xl font-bold text-amber-400">
              {completedOrders.filter(o => (o.files_status || "pending") === "pending" && (o.work_status || "new") !== "delivered").length}
            </p>
            <p className="text-xs text-muted-foreground">Esperando archivos</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-3 text-center">
            <div className="flex items-center justify-center gap-2">
              <div className={cn("w-2 h-2 rounded-full", workStatusConfig.delivered.dotColor)} />
              <p className="text-2xl font-bold text-emerald-400">{grouped.delivered.length}</p>
            </div>
            <p className="text-xs text-muted-foreground">Entregados</p>
          </CardContent>
        </Card>
      </div>

      {/* New orders */}
      {grouped.new.length > 0 && (
        <section>
          <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <div className={cn("w-2 h-2 rounded-full", workStatusConfig.new.dotColor)} />
            Nuevos ({grouped.new.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {grouped.new.map(renderOrderCard)}
          </div>
        </section>
      )}

      {/* In progress */}
      {grouped.in_progress.length > 0 && (
        <section>
          <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <div className={cn("w-2 h-2 rounded-full", workStatusConfig.in_progress.dotColor)} />
            En proceso ({grouped.in_progress.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {grouped.in_progress.map(renderOrderCard)}
          </div>
        </section>
      )}

      {/* Delivered - collapsed by default */}
      <section>
        <button
          onClick={() => setShowDelivered(!showDelivered)}
          className="text-sm font-semibold mb-3 flex items-center gap-2 hover:text-primary transition-colors"
        >
          {showDelivered ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          <div className={cn("w-2 h-2 rounded-full", workStatusConfig.delivered.dotColor)} />
          Entregados ({grouped.delivered.length})
        </button>
        {showDelivered && grouped.delivered.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {grouped.delivered.map(renderOrderCard)}
          </div>
        )}
        {showDelivered && grouped.delivered.length === 0 && (
          <p className="text-xs text-muted-foreground ml-6">No hay pedidos entregados</p>
        )}
      </section>

      {/* Empty state */}
      {completedOrders.length === 0 && (
        <div className="text-center py-12">
          <Package className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
          <p className="text-muted-foreground">No hay pedidos completados</p>
        </div>
      )}
    </div>
  );
}

function DeadlineIndicator({ deadline }: { deadline: Date }) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diff = Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  if (diff < 0) {
    return <span className="text-xs text-red-400 font-medium">Vencido hace {Math.abs(diff)}d</span>;
  }
  if (diff === 0) {
    return <span className="text-xs text-amber-400 font-medium">Hoy</span>;
  }
  if (diff <= 3) {
    return <span className="text-xs text-amber-400 font-medium">{diff}d restantes</span>;
  }
  return <span className="text-xs text-muted-foreground">{diff}d restantes</span>;
}
