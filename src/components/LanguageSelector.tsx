import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";

const languages = [
  { code: "es-ES", label: "Español", flag: "🇪🇸" },
  { code: "en-GB", label: "English", flag: "🇬🇧" }
];

export const LanguageSelector = () => {
  const { i18n, t } = useTranslation();
  const current = languages.find((l) => l.code === i18n.language) || languages[0];

  const change = async (lng: string) => {
    await i18n.changeLanguage(lng);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 px-2 gap-2">
          <Globe className="h-4 w-4" />
          <span className="hidden sm:inline-block text-sm">{current.flag} {current.label}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>{t("language.title")}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {languages.map((lang) => (
          <DropdownMenuItem 
            key={lang.code} 
            onClick={() => change(lang.code)}
            className={i18n.language === lang.code ? "bg-accent" : ""}
          >
            <span className="mr-2">{lang.flag}</span>
            <span>{lang.label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSelector;
