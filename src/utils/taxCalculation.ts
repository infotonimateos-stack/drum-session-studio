// EU VAT rates for OSS (One Stop Shop) - B2C rates by country
export const EU_VAT_RATES: Record<string, number> = {
  AT: 20, BE: 21, BG: 20, HR: 25, CY: 19,
  CZ: 21, DK: 25, EE: 22, FI: 25.5, FR: 20,
  DE: 19, GR: 24, HU: 27, IE: 23, IT: 22,
  LV: 21, LT: 21, LU: 17, MT: 18, NL: 21,
  PL: 23, PT: 23, RO: 19, SK: 20, SI: 22,
  SE: 25, ES: 21,
};

export const EU_COUNTRIES = Object.keys(EU_VAT_RATES);

// Canary Islands, Ceuta, Melilla postal code prefixes
const CANARY_ISLANDS_PREFIXES = ['35', '38'];
const CEUTA_PREFIX = '51';
const MELILLA_PREFIX = '52';

export type TaxRule = 'spain_peninsula' | 'spain_islands' | 'eu_b2c' | 'eu_b2b_valid' | 'eu_b2b_invalid' | 'non_eu';

export interface TaxResult {
  taxRate: number;       // percentage (0-27)
  taxRule: TaxRule;
  taxLabel: string;      // display label
}

export function calculateTax(
  countryCode: string,
  postalCode: string,
  clientType: 'particular' | 'empresa',
  viesValid?: boolean,
): TaxResult {
  const cc = countryCode.toUpperCase();

  // Spain
  if (cc === 'ES') {
    const prefix = postalCode?.substring(0, 2) || '';
    if (
      CANARY_ISLANDS_PREFIXES.includes(prefix) ||
      prefix === CEUTA_PREFIX ||
      prefix === MELILLA_PREFIX
    ) {
      return { taxRate: 0, taxRule: 'spain_islands', taxLabel: 'IVA 0% (Canarias/Ceuta/Melilla)' };
    }
    return { taxRate: 21, taxRule: 'spain_peninsula', taxLabel: 'IVA 21%' };
  }

  // EU
  if (EU_COUNTRIES.includes(cc)) {
    if (clientType === 'empresa') {
      if (viesValid === true) {
        return { taxRate: 0, taxRule: 'eu_b2b_valid', taxLabel: 'IVA 0% (Inversión Sujeto Pasivo)' };
      }
      // Invalid or not validated yet → apply local VAT
      return { taxRate: EU_VAT_RATES[cc], taxRule: 'eu_b2b_invalid', taxLabel: `IVA ${EU_VAT_RATES[cc]}% (VAT inválido)` };
    }
    // B2C
    return { taxRate: EU_VAT_RATES[cc], taxRule: 'eu_b2c', taxLabel: `IVA ${EU_VAT_RATES[cc]}% (OSS)` };
  }

  // Rest of the world
  return { taxRate: 0, taxRule: 'non_eu', taxLabel: 'IVA 0% (Exportación)' };
}

// Country names for the dropdown
export const COUNTRIES: { code: string; name: string }[] = [
  { code: 'ES', name: 'España' },
  { code: 'DE', name: 'Alemania' },
  { code: 'AT', name: 'Austria' },
  { code: 'BE', name: 'Bélgica' },
  { code: 'BG', name: 'Bulgaria' },
  { code: 'HR', name: 'Croacia' },
  { code: 'CY', name: 'Chipre' },
  { code: 'CZ', name: 'Chequia' },
  { code: 'DK', name: 'Dinamarca' },
  { code: 'EE', name: 'Estonia' },
  { code: 'FI', name: 'Finlandia' },
  { code: 'FR', name: 'Francia' },
  { code: 'GR', name: 'Grecia' },
  { code: 'HU', name: 'Hungría' },
  { code: 'IE', name: 'Irlanda' },
  { code: 'IT', name: 'Italia' },
  { code: 'LV', name: 'Letonia' },
  { code: 'LT', name: 'Lituania' },
  { code: 'LU', name: 'Luxemburgo' },
  { code: 'MT', name: 'Malta' },
  { code: 'NL', name: 'Países Bajos' },
  { code: 'PL', name: 'Polonia' },
  { code: 'PT', name: 'Portugal' },
  { code: 'RO', name: 'Rumanía' },
  { code: 'SK', name: 'Eslovaquia' },
  { code: 'SI', name: 'Eslovenia' },
  { code: 'SE', name: 'Suecia' },
  // Non-EU popular countries
  { code: 'US', name: 'Estados Unidos' },
  { code: 'GB', name: 'Reino Unido' },
  { code: 'MX', name: 'México' },
  { code: 'AR', name: 'Argentina' },
  { code: 'CO', name: 'Colombia' },
  { code: 'CL', name: 'Chile' },
  { code: 'PE', name: 'Perú' },
  { code: 'BR', name: 'Brasil' },
  { code: 'JP', name: 'Japón' },
  { code: 'KR', name: 'Corea del Sur' },
  { code: 'CN', name: 'China' },
  { code: 'AU', name: 'Australia' },
  { code: 'CA', name: 'Canadá' },
  { code: 'CH', name: 'Suiza' },
  { code: 'NO', name: 'Noruega' },
  { code: 'OTHER', name: 'Otro país' },
];
