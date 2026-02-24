import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sun, Moon, Menu, X } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { LanguageSelector } from "@/components/LanguageSelector";
import { useTranslation } from "react-i18next";

const logoUrl = "/lovable-uploads/890c7bbc-79ba-4df4-8441-4cbf232e9b5c.png";

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
        <div className="container mx-auto px-3 sm:px-6">
          <div className="flex items-center h-14 sm:h-16 gap-6">
            {/* Logo */}
            <div className="flex items-center gap-2.5 flex-shrink-0">
              <img src={logoUrl} alt={t("header.logoAlt")} className="h-7 w-7" />
              <span className="text-base sm:text-lg font-bold text-foreground tracking-tight hidden sm:block">
                Toni Mateos
              </span>
            </div>

            {/* Desktop Navigation — inline tabs */}
            <nav className="hidden md:flex items-center gap-1 flex-1 justify-center">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(tab.id, onTabChange)}
                  className={`relative px-3 py-2 text-base font-semibold rounded-md transition-colors duration-150 ${
                    activeTab === tab.id
                      ? "text-primary bg-primary/10"
                      : "text-foreground hover:text-primary hover:bg-primary/5"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-1.5 flex-shrink-0 ml-auto md:ml-0">
              <LanguageSelector />
              <button
                onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                className="inline-flex items-center justify-center h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted/60 rounded-md transition-colors"
              >
                {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
              </button>
              {/* Hamburger — mobile only */}
              <button
                onClick={() => setMobileOpen(true)}
                className="inline-flex items-center justify-center h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted/60 rounded-md transition-colors md:hidden"
                aria-label="Abrir menú"
              >
                <Menu className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile slide-out panel */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[100] md:hidden">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute right-0 top-0 bottom-0 w-72 max-w-[85vw] bg-background border-l border-border flex flex-col animate-in slide-in-from-right duration-200">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <span className="font-semibold text-sm text-foreground tracking-tight">
                Menú
              </span>
              <button
                onClick={() => setMobileOpen(false)}
                className="h-8 w-8 inline-flex items-center justify-center text-muted-foreground hover:text-foreground rounded-md"
                aria-label="Cerrar menú"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto py-2 px-3">
              <div className="flex flex-col gap-0.5">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => handleTabClick(tab.id, onTabChange, () => setMobileOpen(false))}
                    className={`w-full text-left px-3 py-3 rounded-md text-lg font-semibold transition-colors ${
                      activeTab === tab.id
                        ? "text-primary bg-primary/10"
                        : "text-foreground hover:text-primary hover:bg-primary/5"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </nav>
          </div>
        </div>
      )}
    </>
  );
};
