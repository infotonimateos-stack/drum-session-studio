import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Globe } from "lucide-react";

interface CountrySelectorProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const countries = [
  { code: "ES", name: "España" },
  { code: "PT", name: "Portugal" },
  { code: "FR", name: "Francia" },
  { code: "DE", name: "Alemania" },
  { code: "IT", name: "Italia" },
  { code: "GB", name: "Reino Unido" },
  { code: "NL", name: "Países Bajos" },
  { code: "BE", name: "Bélgica" },
  { code: "AT", name: "Austria" },
  { code: "CH", name: "Suiza" },
  { code: "IE", name: "Irlanda" },
  { code: "PL", name: "Polonia" },
  { code: "SE", name: "Suecia" },
  { code: "DK", name: "Dinamarca" },
  { code: "NO", name: "Noruega" },
  { code: "FI", name: "Finlandia" },
  { code: "GR", name: "Grecia" },
  { code: "CZ", name: "República Checa" },
  { code: "HU", name: "Hungría" },
  { code: "RO", name: "Rumanía" },
  { code: "BG", name: "Bulgaria" },
  { code: "HR", name: "Croacia" },
  { code: "SK", name: "Eslovaquia" },
  { code: "SI", name: "Eslovenia" },
  { code: "LT", name: "Lituania" },
  { code: "LV", name: "Letonia" },
  { code: "EE", name: "Estonia" },
  { code: "LU", name: "Luxemburgo" },
  { code: "MT", name: "Malta" },
  { code: "CY", name: "Chipre" },
  { code: "IS", name: "Islandia" },
];

export const CountrySelector = ({ value, onChange, disabled }: CountrySelectorProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="country" className="flex items-center gap-2 text-sm font-medium">
        <Globe className="h-4 w-4" />
        País de residencia fiscal
      </Label>
      <Select value={value} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger id="country" className="w-full">
          <SelectValue placeholder="Selecciona tu país..." />
        </SelectTrigger>
        <SelectContent>
          {countries.map((country) => (
            <SelectItem key={country.code} value={country.code}>
              {country.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <p className="text-xs text-muted-foreground">
        Necesitamos tu país para calcular los impuestos aplicables correctamente.
      </p>
    </div>
  );
};
