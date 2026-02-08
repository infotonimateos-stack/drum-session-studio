import { Button } from "@/components/ui/button";
import { Sun, Moon, MessageCircle } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
const logoUrl = "/lovable-uploads/890c7bbc-79ba-4df4-8441-4cbf232e9b5c.png";
import { LanguageSelector } from "@/components/LanguageSelector";
import { useTranslation } from "react-i18next";

const WHATSAPP_URL = "https://wa.me/34670605604";

interface HeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const handleTabClick = (tab: string, onTabChange: (tab: string) => void) => {
  onTabChange(tab);
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

export const Header = ({ activeTab, onTabChange }: HeaderProps) => {
  const { theme, setTheme } = useTheme()
  const { t } = useTranslation();
  
  const tabs = [
    { id: "configure", label: t("nav.configure") },
    { id: "about", label: t("nav.about") },
    { id: "studio", label: t("nav.studio") },
    { id: "samples", label: t("nav.samples") },
    { id: "tutorials", label: t("nav.tutorials") },
    { id: "faq", label: t("nav.faq") },
    { id: "contact", label: t("nav.contact") }
  ];

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-background via-card to-background border-b border-border/50 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        {/* Logo and Title */}
        <div className="flex items-center justify-between py-3 sm:py-4 border-b border-border/30">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
            <img src={logoUrl} alt="Toni Mateos Logo" className="h-6 w-6 sm:h-8 sm:w-8 flex-shrink-0" />
            <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent truncate">
              {t("header.brand")}
            </h1>
          </div>
          <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
            <LanguageSelector />
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="h-7 sm:h-8 px-2 sm:px-3 gap-1.5 text-accent hover:text-accent/80 hover:bg-accent/10"
            >
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Contactar por WhatsApp"
                title="Contactar por WhatsApp"
              >
                <MessageCircle className="h-4 w-4 fill-current" />
                <span className="hidden sm:inline text-xs font-medium">WhatsApp</span>
              </a>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              className="h-7 w-7 sm:h-8 sm:w-8 px-0"
            >
              {theme === "light" ? (
                <Moon className="h-3 w-3 sm:h-4 sm:w-4" />
              ) : (
                <Sun className="h-3 w-3 sm:h-4 sm:w-4" />
              )}
            </Button>
          </div>
        </div>
        
        {/* Navigation Tabs */}
        <nav className="py-2 sm:py-4">
          <div className="flex flex-wrap justify-center gap-1 sm:gap-2">
            {tabs.map((tab) => (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? "default" : "ghost"}
                onClick={() => handleTabClick(tab.id, onTabChange)}
                size="sm"
                className={`text-xs sm:text-sm font-medium transition-all duration-200 px-2 sm:px-4 ${
                  activeTab === tab.id 
                    ? "shadow-lg" 
                    : "hover:bg-accent/20"
                }`}
              >
                {tab.label}
              </Button>
            ))}
          </div>
        </nav>
      </div>
    </header>
  );
};