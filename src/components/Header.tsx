import { Button } from "@/components/ui/button";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import microphoneIcon from "@/assets/microphone-icon.png";
import { LanguageSelector } from "@/components/LanguageSelector";
import { useTranslation } from "react-i18next";

interface HeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

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
        <div className="flex items-center justify-between py-4 border-b border-border/30">
          <div className="flex items-center gap-3">
            <img src={microphoneIcon} alt="Studio Icon" className="h-8 w-8" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {t("header.brand")}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <LanguageSelector />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              className="h-8 w-8 px-0"
            >
              {theme === "light" ? (
                <Moon className="h-4 w-4" />
              ) : (
                <Sun className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
        
        {/* Navigation Tabs */}
        <nav className="py-4">
          <div className="flex flex-wrap justify-center gap-2">
            {tabs.map((tab) => (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? "default" : "ghost"}
                onClick={() => onTabChange(tab.id)}
                className={`text-sm font-medium transition-all duration-200 ${
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