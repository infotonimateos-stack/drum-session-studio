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

const languages = [
  { code: "es-ES", label: "Español", flag: "🇪🇸" },
  { code: "en-GB", label: "English", flag: "🇬🇧" },
  { code: "zh-CN", label: "中文", flag: "🇨🇳" },
  { code: "hi-IN", label: "हिंदी", flag: "🇮🇳" },
  { code: "ar-SA", label: "العربية", flag: "🇸🇦" },
  { code: "pt-BR", label: "Português (BR)", flag: "🇧🇷" },
  { code: "pt-PT", label: "Português (PT)", flag: "🇵🇹" },
  { code: "ru-RU", label: "Русский", flag: "🇷🇺" },
  { code: "ja-JP", label: "日本語", flag: "🇯🇵" },
  { code: "de-DE", label: "Deutsch", flag: "🇩🇪" },
  { code: "fr-FR", label: "Français", flag: "🇫🇷" },
  { code: "ko-KR", label: "한국어", flag: "🇰🇷" },
  { code: "it-IT", label: "Italiano", flag: "🇮🇹" },
  { code: "tr-TR", label: "Türkçe", flag: "🇹🇷" },
  { code: "vi-VN", label: "Tiếng Việt", flag: "🇻🇳" },
  { code: "pl-PL", label: "Polski", flag: "🇵🇱" },
  { code: "nl-NL", label: "Nederlands", flag: "🇳🇱" },
  { code: "uk-UA", label: "Українська", flag: "🇺🇦" },
  { code: "id-ID", label: "Bahasa Indonesia", flag: "🇮🇩" },
  { code: "th-TH", label: "ไทย", flag: "🇹🇭" },
];

export const LanguageSelector = () => {
  const { i18n, t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const current = languages.find((l) => l.code === i18n.language) || languages[0];

  const change = async (lng: string) => {
    if (lng === i18n.language) return;
    
    // Show loading for non-cached languages
    if (lng !== "es-ES" && lng !== "en-GB") {
      setIsLoading(true);
    }
    
    try {
      await i18n.changeLanguage(lng);
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
          <span className="hidden sm:inline-block text-sm">{current.flag} {current.label}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52 max-h-80 overflow-y-auto">
        <DropdownMenuLabel>{t("language.title")}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {languages.map((lang) => (
          <DropdownMenuItem 
            key={lang.code} 
            onClick={() => change(lang.code)}
            className={i18n.language === lang.code ? "bg-accent" : ""}
            disabled={isLoading}
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
