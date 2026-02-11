import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Landmark, Copy, Mail, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

interface BankTransferConfirmationProps {
  orderId: string;
  total: number;
  onBackHome: () => void;
}

export const BankTransferConfirmation = ({ orderId, total, onBackHome }: BankTransferConfirmationProps) => {
  const { t } = useTranslation();
  const iban = "ES84 2100 0125 7602 0068 6553";

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} ${t("transfer.copied")}`);
  };

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
            <Landmark className="h-10 w-10 text-primary" />
          </div>
        </div>
        <h2 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          {t("transfer.title")}
        </h2>
        <p className="text-muted-foreground text-lg">{t("transfer.subtitle")}</p>
      </div>

      {/* Bank Details Card */}
      <Card className="border-primary/30 shadow-xl" style={{ background: "hsl(var(--card-dark))" }}>
        <CardHeader>
          <CardTitle className="text-card-dark-foreground flex items-center gap-2">
            <Landmark className="h-5 w-5" />
            {t("transfer.bankDetails")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* Beneficiary */}
          <div className="space-y-1">
            <p className="text-xs text-card-dark-muted uppercase tracking-wider">{t("transfer.beneficiary")}</p>
            <p className="text-card-dark-foreground font-semibold text-lg">Groove Factory Studios SL</p>
          </div>

          <Separator className="bg-card-dark-muted/20" />

          {/* IBAN */}
          <div className="space-y-1">
            <p className="text-xs text-card-dark-muted uppercase tracking-wider">IBAN</p>
            <div className="flex items-center gap-3">
              <p className="text-card-dark-foreground font-mono text-lg tracking-wider">{iban}</p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(iban.replace(/\s/g, ''), 'IBAN')}
                className="text-card-dark-muted hover:text-card-dark-foreground"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Separator className="bg-card-dark-muted/20" />

          {/* Concept / Order ID */}
          <div className="space-y-1">
            <p className="text-xs text-card-dark-muted uppercase tracking-wider">{t("transfer.concept")}</p>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="text-card-dark-price border-card-dark-price/30 font-mono text-base px-4 py-2">
                {orderId}
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(orderId, t("transfer.concept"))}
                className="text-card-dark-muted hover:text-card-dark-foreground"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Separator className="bg-card-dark-muted/20" />

          {/* Amount */}
          <div className="space-y-1">
            <p className="text-xs text-card-dark-muted uppercase tracking-wider">{t("transfer.amount")}</p>
            <p className="text-card-dark-price font-bold text-2xl">{total.toFixed(2)} €</p>
          </div>
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card className="border-accent/20 shadow-lg" style={{ background: "hsl(var(--card-dark))" }}>
        <CardContent className="pt-6 space-y-4">
          <div className="flex items-start gap-3">
            <Mail className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
            <p className="text-card-dark-foreground leading-relaxed">
              {t("transfer.sendProof")}{" "}
              <a href="mailto:info@tonimateos.com" className="text-primary font-semibold hover:underline">
                info@tonimateos.com
              </a>.{" "}
              {t("transfer.confirmationMsg")}
            </p>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-green-400 mt-1 flex-shrink-0" />
            <p className="text-card-dark-muted text-sm">{t("transfer.orderRegistered")}</p>
          </div>
        </CardContent>
      </Card>

      {/* Materials needed - same as success page */}
      <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20 shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg">{t("success.materialsTitle")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <p>• <strong>{t("success.material1Title")}</strong> {t("success.material1Desc")} <Badge variant="destructive" className="ml-1">{t("success.material1Highlight")}</Badge></p>
          <p>• <strong>{t("success.material2Title")}</strong> {t("success.material2Desc")} <Badge className="ml-1 bg-amber-600">{t("success.material2Highlight")}</Badge> <span className="text-muted-foreground">{t("success.material2Note")}</span></p>
          <p>• {t("success.material3")}</p>
          <p>• {t("success.material4")}</p>
          <p>• {t("success.material5")}</p>
          <Separator className="my-4" />
          <p className="font-medium">{t("success.sendTo")} <a href="mailto:info@tonimateos.com" className="text-primary font-semibold hover:underline">info@tonimateos.com</a></p>
        </CardContent>
      </Card>

      <div className="text-center">
        <Button size="lg" className="h-14 px-8" onClick={() => window.location.href = '/'}>{t("success.backHome")}</Button>
      </div>
    </div>
  );
};
