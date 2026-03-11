import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calculator, Plus, Download, Trash2, RefreshCw, ArrowRightLeft, Mail, Eye } from "lucide-react";
import { toast } from "sonner";
import html2pdf from "html2pdf.js";
import QuoteConfigFlow, { QuoteSaveData } from "./QuoteConfigFlow";
import { generateQuoteHtml } from "./QuotePreview";
import { QuoteClientData } from "./QuoteClientForm";
import { calculateTax } from "@/utils/taxCalculation";

interface Quote {
  id: string;
  created_at: string;
  quote_number: string;
  first_name: string | null;
  last_name: string | null;
  contact_email: string | null;
  phone: string | null;
  business_name: string | null;
  vat_number: string | null;
  full_address: string | null;
  city: string | null;
  state_province: string | null;
  postal_code: string | null;
  country_code: string;
  client_type: string;
  items: any[];
  base_price: number;
  subtotal: number;
  song_count: number;
  tax_rate: number;
  tax_amount: number;
  tax_rule: string;
  total: number;
  validity_days: number;
  valid_until: string | null;
  status: string;
  converted_order_id: string | null;
  notes: string | null;
  payment_terms: string | null;
}

interface Order {
  id: string;
  first_name: string | null;
  last_name: string | null;
  contact_email: string | null;
  billing_email: string | null;
  billing_phone: string | null;
  business_name: string | null;
  vat_number: string | null;
  full_address: string | null;
  city: string | null;
  state_province: string | null;
  postal_code: string | null;
  country_code: string;
  client_type: string;
}

interface Props {
  orders: Order[];
  storedPassword: string;
  apiCall: (action: string, method?: string, body?: any, params?: Record<string, string>) => Promise<any>;
}

const statusColors: Record<string, string> = {
  draft: "bg-slate-500/20 text-slate-400 border-slate-500/30",
  sent: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  accepted: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  expired: "bg-red-500/20 text-red-400 border-red-500/30",
  converted: "bg-purple-500/20 text-purple-400 border-purple-500/30",
};

const statusLabels: Record<string, string> = {
  draft: "Borrador",
  sent: "Enviado",
  accepted: "Aceptado",
  expired: "Expirado",
  converted: "Convertido",
};

export default function QuotesTab({ orders, storedPassword, apiCall }: Props) {
  const [view, setView] = useState<"list" | "creating">("list");
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchQuotes = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiCall("list-quotes");
      setQuotes(data.quotes || []);
    } catch (e: any) {
      if (e.message !== "Unauthorized") toast.error("Error cargando presupuestos");
    }
    setLoading(false);
  }, [apiCall]);

  useEffect(() => {
    fetchQuotes();
  }, [fetchQuotes]);

  const handleSaveQuote = async (data: QuoteSaveData) => {
    try {
      const validUntil = new Date();
      validUntil.setDate(validUntil.getDate() + data.validityDays);

      await apiCall("create-quote", "POST", {
        firstName: data.clientData.firstName,
        lastName: data.clientData.lastName,
        contactEmail: data.clientData.contactEmail,
        phone: data.clientData.phone,
        businessName: data.clientData.businessName,
        vatNumber: data.clientData.vatNumber,
        fullAddress: data.clientData.fullAddress,
        city: data.clientData.city,
        stateProvince: data.clientData.stateProvince,
        postalCode: data.clientData.postalCode,
        countryCode: data.clientData.countryCode,
        clientType: data.clientData.clientType,
        items: data.items,
        basePrice: data.basePrice,
        subtotal: data.subtotal,
        songCount: data.songCount,
        taxRate: data.taxRate,
        taxAmount: data.taxAmount,
        taxRule: data.taxRule,
        total: data.total,
        validityDays: data.validityDays,
        validUntil: validUntil.toISOString().split("T")[0],
        notes: data.notes || null,
        paymentTerms: data.paymentTerms,
      });
      toast.success("Presupuesto guardado correctamente");
      setView("list");
      fetchQuotes();
    } catch (e: any) {
      toast.error("Error guardando presupuesto: " + e.message);
    }
  };

  const handleDeleteQuote = async (quoteId: string) => {
    if (!confirm("¿Eliminar este presupuesto?")) return;
    try {
      await apiCall("delete-quote", "POST", { quoteId });
      toast.success("Presupuesto eliminado");
      fetchQuotes();
    } catch (e: any) {
      toast.error("Error: " + e.message);
    }
  };

  const handleUpdateStatus = async (quoteId: string, status: string) => {
    try {
      await apiCall("update-quote-status", "POST", { quoteId, status });
      toast.success("Estado actualizado");
      fetchQuotes();
    } catch (e: any) {
      toast.error("Error: " + e.message);
    }
  };

  const handleConvertToOrder = async (quoteId: string) => {
    if (!confirm("¿Convertir este presupuesto en pedido? Se creará un nuevo pedido con estado 'esperando transferencia'.")) return;
    try {
      await apiCall("convert-quote-to-order", "POST", { quoteId });
      toast.success("Presupuesto convertido en pedido");
      fetchQuotes();
    } catch (e: any) {
      toast.error("Error: " + e.message);
    }
  };

  const handleDownloadPdf = (quote: Quote) => {
    const clientData: QuoteClientData = {
      firstName: quote.first_name || "",
      lastName: quote.last_name || "",
      contactEmail: quote.contact_email || "",
      phone: quote.phone || "",
      businessName: quote.business_name || "",
      vatNumber: quote.vat_number || "",
      fullAddress: quote.full_address || "",
      city: quote.city || "",
      stateProvince: quote.state_province || "",
      postalCode: quote.postal_code || "",
      countryCode: quote.country_code,
      clientType: (quote.client_type as "particular" | "empresa") || "particular",
    };

    const taxResult = calculateTax(quote.country_code, quote.postal_code || "", quote.client_type as "particular" | "empresa");

    const cartState = {
      items: quote.items || [],
      total: (quote.items || []).reduce((sum: number, item: any) => sum + (item.price || 0), 0),
      basePrice: quote.base_price,
    };

    const html = generateQuoteHtml(clientData, cartState, {
      songCount: quote.song_count,
      taxResult,
      validityDays: quote.validity_days,
      notes: quote.notes || "",
      paymentTerms: quote.payment_terms || "PayPal o transferencia bancaria",
    }, quote.quote_number);

    const container = document.createElement("div");
    container.innerHTML = html;
    document.body.appendChild(container);

    html2pdf()
      .set({
        margin: 10,
        filename: `Presupuesto_${quote.quote_number}_${quote.last_name || "cliente"}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, backgroundColor: "#ffffff", logging: false },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      })
      .from(container)
      .save()
      .then(() => {
        document.body.removeChild(container);
        toast.success("PDF descargado");
      })
      .catch(() => {
        document.body.removeChild(container);
        toast.error("Error generando PDF");
      });
  };

  // ===== CREATING VIEW =====
  if (view === "creating") {
    return <QuoteConfigFlow orders={orders} onCancel={() => setView("list")} onSave={handleSaveQuote} />;
  }

  // ===== LIST VIEW =====
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Calculator className="h-5 w-5 text-primary" />
          <h2 className="font-semibold text-lg">Presupuestos</h2>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={fetchQuotes} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-1 ${loading ? "animate-spin" : ""}`} /> Refrescar
          </Button>
          <Button size="sm" onClick={() => setView("creating")}>
            <Plus className="h-4 w-4 mr-1" /> Nuevo presupuesto
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="pt-4 pb-3 text-center">
            <p className="text-2xl font-bold text-primary">{quotes.length}</p>
            <p className="text-xs text-muted-foreground">Total</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-3 text-center">
            <p className="text-2xl font-bold text-slate-400">{quotes.filter((q) => q.status === "draft").length}</p>
            <p className="text-xs text-muted-foreground">Borradores</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-3 text-center">
            <p className="text-2xl font-bold text-blue-400">{quotes.filter((q) => q.status === "sent").length}</p>
            <p className="text-xs text-muted-foreground">Enviados</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-3 text-center">
            <p className="text-2xl font-bold text-emerald-400">{quotes.filter((q) => q.status === "accepted").length}</p>
            <p className="text-xs text-muted-foreground">Aceptados</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-3 text-center">
            <p className="text-2xl font-bold text-purple-400">{quotes.filter((q) => q.status === "converted").length}</p>
            <p className="text-xs text-muted-foreground">Convertidos</p>
          </CardContent>
        </Card>
      </div>

      {/* Quotes table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fecha</TableHead>
                <TableHead>Nº</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Email</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead className="text-center">Estado</TableHead>
                <TableHead className="text-center">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {quotes.map((quote) => (
                <TableRow key={quote.id}>
                  <TableCell className="text-sm">
                    {new Date(quote.created_at).toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit", year: "2-digit" })}
                  </TableCell>
                  <TableCell className="font-mono text-sm">{quote.quote_number}</TableCell>
                  <TableCell className="text-sm">
                    {quote.first_name} {quote.last_name}
                    {quote.business_name && <span className="text-muted-foreground text-xs block">{quote.business_name}</span>}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{quote.contact_email}</TableCell>
                  <TableCell className="text-right font-semibold">{Number(quote.total).toFixed(2)} €</TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline" className={statusColors[quote.status] || ""}>
                      {statusLabels[quote.status] || quote.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        title="Descargar PDF"
                        onClick={() => handleDownloadPdf(quote)}
                      >
                        <Download className="h-3.5 w-3.5" />
                      </Button>
                      {quote.status === "draft" && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          title="Marcar como enviado"
                          onClick={() => handleUpdateStatus(quote.id, "sent")}
                        >
                          <Mail className="h-3.5 w-3.5" />
                        </Button>
                      )}
                      {quote.status === "sent" && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          title="Marcar como aceptado"
                          onClick={() => handleUpdateStatus(quote.id, "accepted")}
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </Button>
                      )}
                      {(quote.status === "accepted" || quote.status === "sent") && !quote.converted_order_id && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          title="Convertir a pedido"
                          onClick={() => handleConvertToOrder(quote.id)}
                        >
                          <ArrowRightLeft className="h-3.5 w-3.5" />
                        </Button>
                      )}
                      {quote.status !== "converted" && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-destructive hover:text-destructive"
                          title="Eliminar"
                          onClick={() => handleDeleteQuote(quote.id)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {quotes.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                    {loading ? "Cargando..." : "No hay presupuestos. Crea el primero."}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
