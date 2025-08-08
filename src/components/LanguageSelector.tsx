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
  { code: "es-ES", label: "Español (España)" },
  { code: "en-GB", label: "English (UK)" },
  { code: "de-DE", label: "Deutsch (Deutschland)" },
  { code: "de-AT", label: "Deutsch (Österreich)" },
  { code: "de-CH", label: "Deutsch (Schweiz)" },
  { code: "fr-FR", label: "Français (France)" },
  { code: "fr-CH", label: "Français (Suisse)" },
  { code: "fr-BE", label: "Français (Belgique)" },
  { code: "fr-CA", label: "Français (Québec)" },
  { code: "ja-JP", label: "日本語" },
  { code: "zh-CN", label: "简体中文" },
  { code: "zh-TW", label: "繁體中文" },
  { code: "zh-SG", label: "中文 (新加坡)" },
  { code: "ko-KR", label: "한국어" },
  { code: "ar-AE", label: "العربية (الإمارات)" },
  { code: "ar-QA", label: "العربية (قطر)" },
  { code: "ar-SA", label: "العربية (السعودية)" },
  { code: "ar-KW", label: "العربية (الكويت)" },
  { code: "it-IT", label: "Italiano (Italia)" },
  { code: "it-CH", label: "Italiano (Svizzera)" },
  { code: "nl-NL", label: "Nederlands (Nederland)" },
  { code: "nl-BE", label: "Nederlands (België)" },
  { code: "sv-SE", label: "Svenska (Sverige)" },
  { code: "sv-FI", label: "Svenska (Finland)" },
  { code: "nb-NO", label: "Norsk (Norge)" },
  { code: "da-DK", label: "Dansk (Danmark)" },
  { code: "fi-FI", label: "Suomi (Suomi)" },
  { code: "pt-PT", label: "Português (Portugal)" },
  { code: "ru-RU", label: "Русский" },
  { code: "he-IL", label: "עברית" },
  { code: "cs-CZ", label: "Čeština" },
  { code: "pl-PL", label: "Polski" },
  { code: "tr-TR", label: "Türkçe" }
];

export const LanguageSelector = () => {
  const { i18n } = useTranslation();
  const current = languages.find((l) => l.code === i18n.language) || languages[0];

  const change = async (lng: string) => {
    await i18n.changeLanguage(lng);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 px-2 gap-2">
          <Globe className="h-4 w-4" />
          <span className="hidden sm:inline-block text-sm">{current.label}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel>Idioma / Language</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {languages.map((lang) => (
          <DropdownMenuItem key={lang.code} onClick={() => change(lang.code)}>
            <span className="truncate">{lang.label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSelector;
