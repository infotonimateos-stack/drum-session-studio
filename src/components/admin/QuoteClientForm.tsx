import React, { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, User, Building2, ArrowRight, X } from "lucide-react";
import { COUNTRIES } from "@/utils/taxCalculation";

export interface QuoteClientData {
  firstName: string;
  lastName: string;
  contactEmail: string;
  phone: string;
  businessName: string;
  vatNumber: string;
  fullAddress: string;
  city: string;
  stateProvince: string;
  postalCode: string;
  countryCode: string;
  clientType: "particular" | "empresa";
}

export const emptyClientData: QuoteClientData = {
  firstName: "",
  lastName: "",
  contactEmail: "",
  phone: "",
  businessName: "",
  vatNumber: "",
  fullAddress: "",
  city: "",
  stateProvince: "",
  postalCode: "",
  countryCode: "ES",
  clientType: "particular",
};

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

interface UniqueClient {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  businessName: string;
  vatNumber: string;
  fullAddress: string;
  city: string;
  stateProvince: string;
  postalCode: string;
  countryCode: string;
  clientType: "particular" | "empresa";
  orderCount: number;
}

interface Props {
  orders: Order[];
  clientData: QuoteClientData;
  onClientDataChange: (data: QuoteClientData) => void;
  onNext: () => void;
  onCancel: () => void;
}

export default function QuoteClientForm({ orders, clientData, onClientDataChange, onNext, onCancel }: Props) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const uniqueClients = useMemo(() => {
    const clientMap = new Map<string, UniqueClient>();
    orders.forEach((order) => {
      const key = (order.contact_email || order.billing_email || "").toLowerCase();
      if (!key) return;
      if (!clientMap.has(key)) {
        clientMap.set(key, {
          firstName: order.first_name || "",
          lastName: order.last_name || "",
          email: key,
          phone: order.billing_phone || "",
          businessName: order.business_name || "",
          vatNumber: order.vat_number || "",
          fullAddress: order.full_address || "",
          city: order.city || "",
          stateProvince: order.state_province || "",
          postalCode: order.postal_code || "",
          countryCode: order.country_code || "ES",
          clientType: (order.client_type as "particular" | "empresa") || "particular",
          orderCount: 1,
        });
      } else {
        clientMap.get(key)!.orderCount++;
      }
    });
    return Array.from(clientMap.values());
  }, [orders]);

  const filteredClients = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const s = searchQuery.toLowerCase();
    return uniqueClients
      .filter(
        (c) =>
          c.firstName.toLowerCase().includes(s) ||
          c.lastName.toLowerCase().includes(s) ||
          c.email.toLowerCase().includes(s) ||
          c.businessName.toLowerCase().includes(s) ||
          c.vatNumber.toLowerCase().includes(s) ||
          c.phone.includes(s)
      )
      .slice(0, 8);
  }, [searchQuery, uniqueClients]);

  const handleSelectClient = (client: UniqueClient) => {
    onClientDataChange({
      firstName: client.firstName,
      lastName: client.lastName,
      contactEmail: client.email,
      phone: client.phone,
      businessName: client.businessName,
      vatNumber: client.vatNumber,
      fullAddress: client.fullAddress,
      city: client.city,
      stateProvince: client.stateProvince,
      postalCode: client.postalCode,
      countryCode: client.countryCode,
      clientType: client.clientType,
    });
    setSearchQuery("");
    setShowSuggestions(false);
  };

  const updateField = (field: keyof QuoteClientData, value: string) => {
    onClientDataChange({ ...clientData, [field]: value });
  };

  const isValid =
    clientData.firstName.trim().length >= 2 &&
    clientData.lastName.trim().length >= 2 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clientData.contactEmail) &&
    clientData.countryCode.length > 0;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-foreground mb-1">Datos del cliente</h2>
        <p className="text-sm text-muted-foreground">Busca un cliente existente o introduce los datos de uno nuevo.</p>
      </div>

      {/* Search existing clients */}
      <Card>
        <CardContent className="pt-4 pb-3">
          <Label className="text-sm font-medium mb-2 block">Buscar cliente existente</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Nombre, email, teléfono, empresa o NIF..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              className="pl-10"
            />
            {searchQuery && (
              <button
                onClick={() => { setSearchQuery(""); setShowSuggestions(false); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          {showSuggestions && filteredClients.length > 0 && (
            <div className="mt-2 border rounded-lg overflow-hidden divide-y divide-border">
              {filteredClients.map((client, i) => (
                <button
                  key={i}
                  onClick={() => handleSelectClient(client)}
                  className="w-full px-4 py-3 text-left hover:bg-accent transition-colors flex items-center gap-3"
                >
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    {client.businessName ? (
                      <Building2 className="h-4 w-4 text-primary" />
                    ) : (
                      <User className="h-4 w-4 text-primary" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {client.firstName} {client.lastName}
                      {client.businessName && <span className="text-muted-foreground"> — {client.businessName}</span>}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {client.email} {client.phone && `· ${client.phone}`} · {client.orderCount} pedido{client.orderCount !== 1 ? "s" : ""}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
          {showSuggestions && searchQuery.trim() && filteredClients.length === 0 && (
            <p className="mt-2 text-sm text-muted-foreground">No se encontraron clientes. Introduce los datos manualmente.</p>
          )}
        </CardContent>
      </Card>

      {/* Client data form */}
      <Card>
        <CardContent className="pt-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="q-firstName">Nombre *</Label>
              <Input id="q-firstName" value={clientData.firstName} onChange={(e) => updateField("firstName", e.target.value)} placeholder="Nombre" />
            </div>
            <div>
              <Label htmlFor="q-lastName">Apellidos *</Label>
              <Input id="q-lastName" value={clientData.lastName} onChange={(e) => updateField("lastName", e.target.value)} placeholder="Apellidos" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="q-email">Email *</Label>
              <Input id="q-email" type="email" value={clientData.contactEmail} onChange={(e) => updateField("contactEmail", e.target.value)} placeholder="email@ejemplo.com" />
            </div>
            <div>
              <Label htmlFor="q-phone">Teléfono</Label>
              <Input id="q-phone" value={clientData.phone} onChange={(e) => updateField("phone", e.target.value)} placeholder="+34 600 000 000" />
            </div>
          </div>

          <div className="border-t pt-4 mt-4">
            <Label className="text-sm font-medium mb-3 block">Tipo de cliente</Label>
            <div className="flex gap-3">
              <Button
                type="button"
                variant={clientData.clientType === "particular" ? "default" : "outline"}
                size="sm"
                onClick={() => updateField("clientType", "particular")}
              >
                <User className="h-4 w-4 mr-1" /> Particular
              </Button>
              <Button
                type="button"
                variant={clientData.clientType === "empresa" ? "default" : "outline"}
                size="sm"
                onClick={() => updateField("clientType", "empresa")}
              >
                <Building2 className="h-4 w-4 mr-1" /> Empresa
              </Button>
            </div>
          </div>

          {clientData.clientType === "empresa" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="q-businessName">Razón social</Label>
                <Input id="q-businessName" value={clientData.businessName} onChange={(e) => updateField("businessName", e.target.value)} placeholder="Nombre de la empresa" />
              </div>
              <div>
                <Label htmlFor="q-vatNumber">NIF / VAT</Label>
                <Input id="q-vatNumber" value={clientData.vatNumber} onChange={(e) => updateField("vatNumber", e.target.value)} placeholder="B12345678" />
              </div>
            </div>
          )}

          <div>
            <Label htmlFor="q-address">Dirección</Label>
            <Input id="q-address" value={clientData.fullAddress} onChange={(e) => updateField("fullAddress", e.target.value)} placeholder="Calle, número, piso..." />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="q-city">Ciudad</Label>
              <Input id="q-city" value={clientData.city} onChange={(e) => updateField("city", e.target.value)} placeholder="Ciudad" />
            </div>
            <div>
              <Label htmlFor="q-postalCode">Código postal</Label>
              <Input id="q-postalCode" value={clientData.postalCode} onChange={(e) => updateField("postalCode", e.target.value)} placeholder="08001" />
            </div>
            <div>
              <Label htmlFor="q-country">País *</Label>
              <Select value={clientData.countryCode} onValueChange={(v) => updateField("countryCode", v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar país" />
                </SelectTrigger>
                <SelectContent>
                  {COUNTRIES.map((c) => (
                    <SelectItem key={c.code} value={c.code}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={onCancel}>Cancelar</Button>
        <Button onClick={onNext} disabled={!isValid}>
          Siguiente: Configurar servicios <ArrowRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}
