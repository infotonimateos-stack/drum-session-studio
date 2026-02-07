import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import protoolsImage from "@/assets/protools-studio.png";
import { useTranslation } from "react-i18next";

export const SamplesTab = () => {
  const { t } = useTranslation();
  const downloadUrl = "https://we.tl/t-j7ZNfBPKex";
  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">{t("samples.heading")}</h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">{t("samples.subheading")}</p>
      </div>

      <div className="max-w-4xl mx-auto">
        <img src={protoolsImage} alt={t("samples.imageAlt")} className="w-full rounded-xl shadow-xl" loading="lazy" />
      </div>

      {/* Download All */}
      <div className="text-center">
        <Card className="bg-gradient-to-br from-card to-muted max-w-md mx-auto">
          <CardContent className="p-6 space-y-4">
            <h3 className="text-lg font-semibold">{t("samples.cardTitle")}</h3>
            <p className="text-sm text-muted-foreground">{t("samples.cardDesc")}</p>
            <Button variant="upgrade" className="w-full" asChild>
              <a href={downloadUrl} target="_blank" rel="noopener noreferrer">
                <Download className="h-4 w-4 mr-2" />
                {t("samples.button")}
              </a>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};