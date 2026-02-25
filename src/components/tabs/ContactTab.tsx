import { Card, CardContent } from "@/components/ui/card";
import { Mail, Phone, MapPin, Instagram, Youtube, ExternalLink } from "lucide-react";
import { useTranslation } from "react-i18next";

export const ContactTab = () => {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl space-y-12">
      {/* Heading */}
      <div className="text-center space-y-3">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          {t("contact.heading")}
        </h2>
        <p className="text-lg text-muted-foreground max-w-xl mx-auto">
          {t("contact.subheading")}
        </p>
      </div>

      {/* Main contact methods */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* WhatsApp — highlighted */}
        <a
          href="https://wa.me/34670605604"
          target="_blank"
          rel="noopener noreferrer"
          className="group col-span-1 sm:col-span-2 lg:col-span-1 lg:row-span-2"
        >
          <Card className="h-full bg-[#25D366]/10 border-[#25D366]/30 hover:border-[#25D366]/60 transition-all duration-300 hover:shadow-lg hover:shadow-[#25D366]/10 hover:-translate-y-1">
            <CardContent className="flex flex-col items-center justify-center text-center gap-4 p-8 h-full">
              <div className="h-16 w-16 rounded-full bg-[#25D366] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Phone className="h-8 w-8 text-white" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-semibold">WhatsApp</h3>
                <p className="text-sm text-muted-foreground">+34 670 605 604</p>
              </div>
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#25D366] opacity-0 group-hover:opacity-100 transition-opacity">
                {t("contact.sendMessage")} <ExternalLink className="h-3 w-3" />
              </span>
            </CardContent>
          </Card>
        </a>

        {/* Email */}
        <a href="mailto:info@tonimateos.com" className="group">
          <Card className="h-full bg-gradient-to-br from-card to-muted hover:border-primary/40 transition-all duration-300 hover:shadow-md hover:-translate-y-1">
            <CardContent className="flex flex-col items-center text-center gap-4 p-8">
              <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Mail className="h-7 w-7 text-primary" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-semibold">{t("contact.email")}</h3>
                <p className="text-sm text-muted-foreground">info@tonimateos.com</p>
              </div>
            </CardContent>
          </Card>
        </a>

        {/* Location */}
        <Card className="h-full bg-gradient-to-br from-card to-muted">
          <CardContent className="flex flex-col items-center text-center gap-4 p-8">
            <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center">
              <MapPin className="h-7 w-7 text-primary" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-semibold">{t("contact.location")}</h3>
              <p className="text-sm text-muted-foreground">{t("contact.locationValue")}</p>
            </div>
          </CardContent>
        </Card>

        {/* Instagram */}
        <a
          href="https://www.instagram.com/tonimateosdrummer"
          target="_blank"
          rel="noopener noreferrer"
          className="group"
        >
          <Card className="h-full bg-gradient-to-br from-card to-muted hover:border-pink-500/40 transition-all duration-300 hover:shadow-md hover:-translate-y-1">
            <CardContent className="flex flex-col items-center text-center gap-4 p-8">
              <div className="h-14 w-14 rounded-full bg-gradient-to-br from-pink-500/10 to-purple-500/10 flex items-center justify-center group-hover:from-pink-500/20 group-hover:to-purple-500/20 transition-colors">
                <Instagram className="h-7 w-7 text-pink-500" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-semibold">Instagram</h3>
                <p className="text-sm text-muted-foreground">@tonimateosdrummer</p>
              </div>
            </CardContent>
          </Card>
        </a>

        {/* YouTube */}
        <a
          href="https://www.youtube.com/tonimateos"
          target="_blank"
          rel="noopener noreferrer"
          className="group"
        >
          <Card className="h-full bg-gradient-to-br from-card to-muted hover:border-red-500/40 transition-all duration-300 hover:shadow-md hover:-translate-y-1">
            <CardContent className="flex flex-col items-center text-center gap-4 p-8">
              <div className="h-14 w-14 rounded-full bg-red-500/10 flex items-center justify-center group-hover:bg-red-500/20 transition-colors">
                <Youtube className="h-7 w-7 text-red-500" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-semibold">YouTube</h3>
                <p className="text-sm text-muted-foreground">Toni Mateos</p>
              </div>
            </CardContent>
          </Card>
        </a>
      </div>

      {/* Response time badge */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary/5 border border-primary/10">
          <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
          <span className="text-sm font-medium text-muted-foreground">
            {t("contact.responseTime")} — {t("contact.responseTimeDesc")}
          </span>
        </div>
      </div>
    </div>
  );
};
