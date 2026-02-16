import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { languageConfig, changeLanguage } from "@/i18n";
import { getAlternateLanguagePath } from "@/hooks/useLanguagePrefix";

export const LanguageSelector = () => {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const current = languageConfig.find((l) => l.code === i18n.language) || languageConfig[0];
  const other = languageConfig.find((l) => l.code !== i18n.language) || languageConfig[1];

  const toggle = () => {
    const newPath = getAlternateLanguagePath(location.pathname, i18n.language);
    changeLanguage(other.code);
    navigate(newPath, { replace: true });
  };

  return (
    <Button variant="ghost" size="sm" className="h-8 px-2 gap-2" onClick={toggle}>
      <Globe className="h-4 w-4" />
      <span className="hidden sm:inline-block text-sm">{other.flag} {other.name}</span>
    </Button>
  );
};

export default LanguageSelector;
