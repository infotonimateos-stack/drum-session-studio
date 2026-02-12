import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sun, Moon, MessageCircle, Menu, X } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { LanguageSelector } from "@/components/LanguageSelector";
import { useTranslation } from "react-i18next";

const logoUrl = "/lovable-uploads/890c7bbc-79ba-4df4-8441-4cbf232e9b5c.png";
const WHATSAPP_URL = "https://wa.me/34670605604";

interface HeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const handleTabClick = (tab: string, onTabChange: (tab: string) => void, closeMobile?: () => void) => {
  onTabChange(tab);
  closeMobile?.();
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

export const Header = ({ activeTab, onTabChange }: HeaderProps) => {
  const { theme, setTheme } = useTheme();
  const { t } = useTranslation();
  const [mobileOpen, setMobileOpen] = useState(false);

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
    <>
      <header className="sticky top-0 z-50 bg-background/80 border-b border-border backdrop-blur-xl">
        <div className="container mx-auto px-3 sm:px-4">
          {/* Logo row */}
          <div className="flex items-center justify-between py-3 sm:py-4">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
              <img src={logoUrl} alt="Toni Mateos Logo" className="h-6 w-6 sm:h-8 sm:w-8 flex-shrink-0" />
              <h1 className="text-base sm:text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent truncate">
                {t("header.brand")}
              </h1>
            </div>
            <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
              <LanguageSelector />
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Contactar por WhatsApp"
                title="Contactar por WhatsApp"
                className="inline-flex items-center justify-center h-8 sm:h-8 px-2 sm:px-3 gap-1.5 text-accent hover:text-accent/80 hover:bg-accent/10 rounded-md text-sm font-medium transition-colors"
              >
                <MessageCircle className="h-4 w-4 fill-current" />
                <span className="hidden sm:inline text-xs font-medium">WhatsApp</span>
              </a>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                className="h-8 w-8 px-0"
              >
                {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
              </Button>
              {/* Hamburger — visible only on mobile */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMobileOpen(true)}
                className="h-8 w-8 px-0 md:hidden"
                aria-label="Abrir menú"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:block py-2">
            <div className="flex flex-wrap justify-center gap-1">
              {tabs.map((tab) => (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? "default" : "ghost"}
                  onClick={() => handleTabClick(tab.id, onTabChange)}
                  size="sm"
                  className={`text-sm font-medium transition-all duration-200 px-4 ${
                    activeTab === tab.id ? "shadow-lg" : "hover:bg-accent/20"
                  }`}
                >
                  {tab.label}
                </Button>
              ))}
            </div>
          </nav>
        </div>
      </header>

      {/* Mobile slide-out panel */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[100] md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          {/* Panel */}
          <div className="absolute right-0 top-0 bottom-0 w-72 max-w-[85vw] bg-background border-l border-border shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border/50">
              <span className="font-bold text-lg bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Menú
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMobileOpen(false)}
                className="h-10 w-10 px-0"
                aria-label="Cerrar menú"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            <nav className="flex-1 overflow-y-auto py-4 px-3">
              <div className="flex flex-col gap-1">
                {tabs.map((tab) => (
                  <Button
                    key={tab.id}
                    variant={activeTab === tab.id ? "default" : "ghost"}
                    onClick={() => handleTabClick(tab.id, onTabChange, () => setMobileOpen(false))}
                    className={`w-full justify-start h-12 text-base font-medium ${
                      activeTab === tab.id ? "shadow-lg" : "hover:bg-accent/20"
                    }`}
                  >
                    {tab.label}
                  </Button>
                ))}
              </div>
            </nav>
          </div>
        </div>
      )}
    </>
  );
};
