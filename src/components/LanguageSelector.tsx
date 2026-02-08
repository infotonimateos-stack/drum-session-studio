import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Globe, Loader2 } from "lucide-react";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { languageConfig, changeLanguage } from "@/i18n";

export const LanguageSelector = () => {
  const { i18n, t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const current = languageConfig.find((l) => l.code === i18n.language) || languageConfig[0];

  const handleChange = async (lng: string) => {
    if (lng === i18n.language) return;
    
    // Show loading for non-cached languages
    if (lng !== "es-ES" && lng !== "en-GB") {
      setIsLoading(true);
    }
    
    try {
      await changeLanguage(lng);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 px-2 gap-2">
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Globe className="h-4 w-4" />
          )}
          <span className="hidden sm:inline-block text-sm">{current.flag} {current.name}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52 max-h-80 overflow-y-auto">
        <DropdownMenuLabel>{t("language.title", "Seleccionar idioma")}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {[...languageConfig].sort((a, b) => a.name.localeCompare(b.name)).map((lang) => (
          <DropdownMenuItem 
            key={lang.code} 
            onClick={() => handleChange(lang.code)}
            className={i18n.language === lang.code ? "bg-accent" : ""}
            disabled={isLoading}
          >
            <span className="mr-2">{lang.flag}</span>
            <span>{lang.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSelector;
