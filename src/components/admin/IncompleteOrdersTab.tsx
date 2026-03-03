import React, { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, AlertCircle, Trash2 } from "lucide-react";

interface Order {
  id: string;
  created_at: string;
  invoice_number: string | null;
  is_professional_invoice: boolean;
  business_name: string | null;
  billing_email: string | null;
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
  onDeleteOrder: (orderId: string) => void;
}

const statusLabels: Record<string, string> = {
  pending: "Pendiente",
  cancelled: "Cancelado",
  awaiting_transfer: "Esperando transferencia",
  refunded: "Reembolsado",
};

const statusColors: Record<string, string> = {
  pending: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  cancelled: "bg-red-500/20 text-red-400 border-red-500/30",
  awaiting_transfer: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  refunded: "bg-purple-500/20 text-purple-400 border-purple-500/30",
};

export default function IncompleteOrdersTab({ orders, onDeleteOrder }: Props) {
  const [search, setSearch] = useState("");

  const incompleteOrders = useMemo(() => {
    let result = orders.filter(o => o.payment_status !== "completed");
    if (search.trim()) {
      const s = search.toLowerCase();
      result = result.filter(o =>
        (o.first_name || "").toLowerCase().includes(s) ||
        (o.last_name || "").toLowerCase().includes(s) ||
        (o.contact_email || "").toLowerCase().includes(s) ||
        (o.billing_email || "").toLowerCase().includes(s) ||
        (o.business_name || "").toLowerCase().includes(s)
      );
    }
    return result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }, [orders, search]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <AlertCircle className="h-5 w-5 text-amber-400" />
        <h2 className="font-semibold text-lg">Pedidos No Completados</h2>
        <Badge variant="outline" className="ml-2">{incompleteOrders.length}</Badge>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-4 pb-3 text-center">
            <p className="text-2xl font-bold text-amber-400">{incompleteOrders.filter(o => o.payment_status === "pending").length}</p>
            <p className="text-xs text-muted-foreground">Pendientes de pago</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-3 text-center">
            <p className="text-2xl font-bold text-blue-400">{incompleteOrders.filter(o => o.payment_status === "awaiting_transfer").length}</p>
            <p className="text-xs text-muted-foreground">Esperando transferencia</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-3 text-center">
            <p className="text-2xl font-bold text-muted-foreground">
              {incompleteOrders.reduce((s, o) => s + o.total, 0).toFixed(2)} €
            </p>
            <p className="text-xs text-muted-foreground">Valor potencial</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="pt-4 pb-3">
          <div className="flex items-center gap-3">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nombre, email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-md"
            />
            {search && <Button variant="ghost" size="sm" onClick={() => setSearch("")}>Limpiar</Button>}
          </div>
        </CardContent>
      </Card>

      <Card>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead>Fecha</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Apellidos</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Método</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-center">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {incompleteOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="whitespace-nowrap">
                    {new Date(order.created_at).toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit", year: "2-digit" })}
                    <span className="text-muted-foreground ml-1 text-xs">
                      {new Date(order.created_at).toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </TableCell>
                  <TableCell>{order.first_name || <span className="text-muted-foreground">—</span>}</TableCell>
                  <TableCell>{order.last_name || <span className="text-muted-foreground">—</span>}</TableCell>
                  <TableCell className="text-xs">{order.contact_email || order.billing_email || <span className="text-muted-foreground">—</span>}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs capitalize">{order.payment_method}</Badge>
                  </TableCell>
                  <TableCell className="text-right font-mono font-bold">{order.total.toFixed(2)} €</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`text-xs ${statusColors[order.payment_status] || ""}`}>
                      {statusLabels[order.payment_status] || order.payment_status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-destructive hover:text-destructive"
                      title="Eliminar"
                      onClick={() => onDeleteOrder(order.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {incompleteOrders.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-12 text-muted-foreground">
                    No hay pedidos pendientes
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
