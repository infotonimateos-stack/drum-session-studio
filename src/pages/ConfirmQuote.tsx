import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { CartState } from "@/types/cart";
import { BillingData } from "@/components/BillingStep";
import { CheckoutSummary } from "@/components/CheckoutSummary";
import { calculateTax } from "@/utils/taxCalculation";
import { AlertCircle, FileText, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type QuoteStatus = "loading" | "ready" | "expired" | "converted" | "not_found" | "error";

export default function ConfirmQuote() {
  const { quoteId } = useParams<{ quoteId: string }>();
  const navigate = useNavigate();
  const [status, setStatus] = useState<QuoteStatus>("loading");
  const [quote, setQuote] = useState<any>(null);

  useEffect(() => {
    if (!quoteId) { setStatus("not_found"); return; }

    const fetchQuote = async () => {
      const { data, error } = await supabase
        .from("quotes")
        .select("*")
        .eq("id", quoteId)
        .single();

      if (error || !data) { setStatus("not_found"); return; }

      if (data.status === "converted") { setStatus("converted"); setQuote(data); return; }

      if (data.valid_until && new Date(data.valid_until) < new Date()) {
        setStatus("expired"); setQuote(data); return;
      }

      setQuote(data);
      setStatus("ready");
    };

    fetchQuote();
  }, [quoteId]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (status === "not_found") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-8 pb-6 text-center space-y-4">
            <AlertCircle className="h-12 w-12 mx-auto text-destructive" />
            <h2 className="text-xl font-bold">Presupuesto no encontrado</h2>
            <p className="text-muted-foreground">El enlace no es válido o el presupuesto ha sido eliminado.</p>
            <Button onClick={() => navigate("/")} variant="outline">Ir a la web</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (status === "expired") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-8 pb-6 text-center space-y-4">
            <AlertCircle className="h-12 w-12 mx-auto text-amber-500" />
            <h2 className="text-xl font-bold">Presupuesto expirado</h2>
            <p className="text-muted-foreground">
              Este presupuesto venció el {new Date(quote.valid_until).toLocaleDateString("es-ES")}.
              Contacta con nosotros para solicitar uno nuevo.
            </p>
            <Button onClick={() => window.location.href = "mailto:info@tonimateos.com"} variant="outline">Contactar</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (status === "converted") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-8 pb-6 text-center space-y-4">
            <FileText className="h-12 w-12 mx-auto text-emerald-500" />
            <h2 className="text-xl font-bold">Presupuesto ya procesado</h2>
            <p className="text-muted-foreground">Este presupuesto ya fue confirmado y convertido en pedido.</p>
            <Button onClick={() => navigate("/")} variant="outline">Ir a la web</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // status === "ready" — build cart and billing data from quote
  const items = (quote.items || []).map((item: any) => ({
    id: item.id || "unknown",
    name: item.name || "Servicio",
    price: typeof item.price === "number" ? item.price : 0,
    category: item.category || "Otros",
    description: item.description,
  }));

  const cartState: CartState = {
    items,
    total: items.reduce((sum: number, i: any) => sum + i.price, 0),
    basePrice: 0,
  };

  const taxResult = calculateTax(
    quote.country_code || "ES",
    quote.postal_code || "",
    (quote.client_type as "particular" | "empresa") || "particular"
  );

  const billingData: BillingData = {
    country: quote.country_code || "ES",
    postalCode: quote.postal_code || "",
    clientType: (quote.client_type as "particular" | "empresa") || "particular",
    vatNumber: quote.vat_number || "",
    taxResult,
    songCount: quote.song_count || 1,
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-6">
          <p className="text-sm text-muted-foreground">
            Presupuesto nº <strong>{quote.quote_number}</strong>
          </p>
        </div>
        <CheckoutSummary
          cartState={cartState}
          billingData={billingData}
          onConfirmOrder={() => navigate("/success")}
          onBack={() => navigate("/")}
          initialFirstName={quote.first_name || ""}
          initialLastName={quote.last_name || ""}
          initialContactEmail={quote.contact_email || ""}
          quoteId={quote.id}
        />
      </div>
    </div>
  );
}
