import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Headphones, Sun, Moon } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import microphoneIcon from "@/assets/microphone-icon.png";

interface HeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const Header = ({ activeTab, onTabChange }: HeaderProps) => {
  const { theme, setTheme } = useTheme()
  
  const tabs = [
    { id: "configure", label: "Configura tu Sesión" },
    { id: "about", label: "Quién Soy" },
    { id: "studio", label: "El Estudio" },
    { id: "samples", label: "Descarga una Muestra" },
    { id: "tutorials", label: "Tutoriales" },
    { id: "faq", label: "Preguntas Frecuentes" },
    { id: "contact", label: "Contacto" }
  ];

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-background via-card to-background border-b border-border/50 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        {/* Logo and Title */}
        <div className="flex items-center justify-between py-4 border-b border-border/30">
          <div className="flex items-center gap-3">
            <img src={microphoneIcon} alt="Studio Icon" className="h-8 w-8" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Toni Mateos Online Drums Recording
            </h1>
          </div>
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