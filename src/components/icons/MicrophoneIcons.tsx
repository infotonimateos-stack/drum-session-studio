import { cn } from "@/lib/utils";

interface MicrophoneIconProps {
  className?: string;
  size?: number;
}

// Shure SM57 - Micrófono dinámico clásico
export const SM57Icon = ({ className, size = 120 }: MicrophoneIconProps) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 120 120" 
    className={cn("drop-shadow-lg transition-transform duration-300 hover:scale-110", className)}
  >
    {/* Cuerpo principal */}
    <rect x="45" y="30" width="30" height="60" rx="15" fill="hsl(var(--muted-foreground))" />
    
    {/* Rejilla característica del SM57 */}
    <rect x="50" y="20" width="20" height="25" rx="10" fill="hsl(var(--foreground))" />
    <g fill="hsl(var(--muted))">
      <circle cx="55" cy="27" r="1" />
      <circle cx="60" cy="27" r="1" />
      <circle cx="65" cy="27" r="1" />
      <circle cx="55" cy="32" r="1" />
      <circle cx="60" cy="32" r="1" />
      <circle cx="65" cy="32" r="1" />
      <circle cx="55" cy="37" r="1" />
      <circle cx="60" cy="37" r="1" />
      <circle cx="65" cy="37" r="1" />
    </g>
    
    {/* Conector XLR */}
    <circle cx="60" cy="95" r="8" fill="hsl(var(--accent))" />
    <circle cx="60" cy="95" r="6" fill="hsl(var(--muted))" />
  </svg>
);

// Shure Beta 52A - Micrófono para bombo
export const Beta52Icon = ({ className, size = 120 }: MicrophoneIconProps) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 120 120" 
    className={cn("drop-shadow-lg transition-transform duration-300 hover:scale-110", className)}
  >
    {/* Cuerpo robusto */}
    <rect x="40" y="35" width="40" height="50" rx="20" fill="hsl(var(--muted-foreground))" />
    
    {/* Rejilla frontal robusta */}
    <ellipse cx="60" cy="25" rx="18" ry="12" fill="hsl(var(--foreground))" />
    <g stroke="hsl(var(--muted))" strokeWidth="2" fill="none">
      <ellipse cx="60" cy="25" rx="14" ry="8" />
      <ellipse cx="60" cy="25" rx="10" ry="6" />
      <ellipse cx="60" cy="25" rx="6" ry="4" />
    </g>
    
    {/* Conector XLR */}
    <circle cx="60" cy="95" r="8" fill="hsl(var(--accent))" />
    <circle cx="60" cy="95" r="6" fill="hsl(var(--muted))" />
  </svg>
);

// Neumann KM184 - Micrófono de condensador pequeño
export const KM184Icon = ({ className, size = 120 }: MicrophoneIconProps) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 120 120" 
    className={cn("drop-shadow-lg transition-transform duration-300 hover:scale-110", className)}
  >
    {/* Cuerpo delgado */}
    <rect x="52" y="25" width="16" height="65" rx="8" fill="hsl(var(--muted-foreground))" />
    
    {/* Cápsula superior */}
    <circle cx="60" cy="20" r="8" fill="hsl(var(--accent))" />
    <circle cx="60" cy="20" r="6" fill="hsl(var(--primary))" />
    <circle cx="60" cy="20" r="3" fill="hsl(var(--foreground))" />
    
    {/* Conector XLR */}
    <circle cx="60" cy="95" r="6" fill="hsl(var(--accent))" />
    <circle cx="60" cy="95" r="4" fill="hsl(var(--muted))" />
  </svg>
);

// Sennheiser 421 - Micrófono dinámico
export const Sen421Icon = ({ className, size = 120 }: MicrophoneIconProps) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 120 120" 
    className={cn("drop-shadow-lg transition-transform duration-300 hover:scale-110", className)}
  >
    {/* Cuerpo cilíndrico */}
    <rect x="46" y="30" width="28" height="55" rx="14" fill="hsl(var(--muted-foreground))" />
    
    {/* Rejilla frontal distintiva */}
    <rect x="50" y="20" width="20" height="20" rx="10" fill="hsl(var(--foreground))" />
    <g fill="hsl(var(--muted))">
      <rect x="53" y="24" width="14" height="2" rx="1" />
      <rect x="53" y="28" width="14" height="2" rx="1" />
      <rect x="53" y="32" width="14" height="2" rx="1" />
    </g>
    
    {/* Conector XLR */}
    <circle cx="60" cy="95" r="8" fill="hsl(var(--accent))" />
    <circle cx="60" cy="95" r="6" fill="hsl(var(--muted))" />
  </svg>
);

// AKG C414 - Micrófono de condensador de lujo
export const C414Icon = ({ className, size = 120 }: MicrophoneIconProps) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 120 120" 
    className={cn("drop-shadow-lg transition-transform duration-300 hover:scale-110", className)}
  >
    {/* Cuerpo elegante */}
    <rect x="48" y="25" width="24" height="65" rx="12" fill="hsl(var(--primary))" />
    
    {/* Rejilla superior sofisticada */}
    <ellipse cx="60" cy="20" rx="12" ry="8" fill="hsl(var(--accent))" />
    <g stroke="hsl(var(--primary-foreground))" strokeWidth="1" fill="none">
      <ellipse cx="60" cy="20" rx="10" ry="6" />
      <ellipse cx="60" cy="20" rx="7" ry="4" />
    </g>
    
    {/* Indicadores LED característicos */}
    <circle cx="56" cy="45" r="2" fill="hsl(var(--accent))" />
    <circle cx="64" cy="45" r="2" fill="hsl(var(--accent))" />
    
    {/* Conector XLR */}
    <circle cx="60" cy="95" r="8" fill="hsl(var(--accent))" />
    <circle cx="60" cy="95" r="6" fill="hsl(var(--muted))" />
  </svg>
);

// Neumann U87 - Micrófono de condensador icónico
export const U87Icon = ({ className, size = 120 }: MicrophoneIconProps) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 120 120" 
    className={cn("drop-shadow-lg transition-transform duration-300 hover:scale-110", className)}
  >
    {/* Cuerpo icónico plateado */}
    <rect x="46" y="25" width="28" height="65" rx="14" fill="hsl(var(--accent))" />
    
    {/* Rejilla distintiva del U87 */}
    <ellipse cx="60" cy="18" rx="14" ry="10" fill="hsl(var(--primary))" />
    <g stroke="hsl(var(--primary-foreground))" strokeWidth="1.5" fill="none">
      <path d="M 50 18 Q 60 12 70 18" />
      <path d="M 50 21 Q 60 15 70 21" />
      <path d="M 50 24 Q 60 18 70 24" />
    </g>
    
    {/* Logo Neumann */}
    <circle cx="60" cy="50" r="4" fill="hsl(var(--primary))" />
    <text x="60" y="53" textAnchor="middle" fontSize="6" fill="hsl(var(--primary-foreground))">N</text>
    
    {/* Conector XLR */}
    <circle cx="60" cy="95" r="8" fill="hsl(var(--accent))" />
    <circle cx="60" cy="95" r="6" fill="hsl(var(--muted))" />
  </svg>
);

// Audix D6 - Micrófono especializado para bombo
export const D6Icon = ({ className, size = 120 }: MicrophoneIconProps) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 120 120" 
    className={cn("drop-shadow-lg transition-transform duration-300 hover:scale-110", className)}
  >
    {/* Cuerpo compacto */}
    <rect x="42" y="30" width="36" height="55" rx="18" fill="hsl(var(--muted-foreground))" />
    
    {/* Rejilla especializada para graves */}
    <ellipse cx="60" cy="22" rx="16" ry="10" fill="hsl(var(--accent))" />
    <g fill="hsl(var(--muted))">
      <ellipse cx="60" cy="22" rx="12" ry="6" />
      <ellipse cx="60" cy="22" rx="8" ry="4" />
      <ellipse cx="60" cy="22" rx="4" ry="2" />
    </g>
    
    {/* Conector XLR */}
    <circle cx="60" cy="95" r="8" fill="hsl(var(--accent))" />
    <circle cx="60" cy="95" r="6" fill="hsl(var(--muted))" />
  </svg>
);

// Shure Boundary Mic - Micrófono de superficie
export const BoundaryIcon = ({ className, size = 120 }: MicrophoneIconProps) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 120 120" 
    className={cn("drop-shadow-lg transition-transform duration-300 hover:scale-110", className)}
  >
    {/* Base plana */}
    <ellipse cx="60" cy="70" rx="35" ry="8" fill="hsl(var(--muted-foreground))" />
    
    {/* Cápsula central */}
    <circle cx="60" cy="60" r="12" fill="hsl(var(--accent))" />
    <circle cx="60" cy="60" r="8" fill="hsl(var(--primary))" />
    <circle cx="60" cy="60" r="4" fill="hsl(var(--foreground))" />
    
    {/* Cable */}
    <rect x="58" y="78" width="4" height="15" fill="hsl(var(--muted))" />
    
    {/* Conector */}
    <circle cx="60" cy="95" r="6" fill="hsl(var(--accent))" />
  </svg>
);

// Sennheiser 441 - Micrófono dinámico premium
export const Sen441Icon = ({ className, size = 120 }: MicrophoneIconProps) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 120 120" 
    className={cn("drop-shadow-lg transition-transform duration-300 hover:scale-110", className)}
  >
    {/* Cuerpo robusto */}
    <rect x="45" y="28" width="30" height="60" rx="15" fill="hsl(var(--primary))" />
    
    {/* Rejilla frontal única */}
    <rect x="48" y="18" width="24" height="20" rx="12" fill="hsl(var(--accent))" />
    <g stroke="hsl(var(--primary-foreground))" strokeWidth="2" fill="none">
      <line x1="52" y1="24" x2="68" y2="24" />
      <line x1="52" y1="28" x2="68" y2="28" />
      <line x1="52" y1="32" x2="68" y2="32" />
    </g>
    
    {/* Conector XLR */}
    <circle cx="60" cy="95" r="8" fill="hsl(var(--accent))" />
    <circle cx="60" cy="95" r="6" fill="hsl(var(--muted))" />
  </svg>
);

// Beyerdynamic M160 - Micrófono ribbon
export const M160Icon = ({ className, size = 120 }: MicrophoneIconProps) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 120 120" 
    className={cn("drop-shadow-lg transition-transform duration-300 hover:scale-110", className)}
  >
    {/* Cuerpo vintage */}
    <rect x="48" y="25" width="24" height="65" rx="12" fill="hsl(var(--accent))" />
    
    {/* Rejilla ribbon característica */}
    <rect x="50" y="15" width="20" height="25" rx="10" fill="hsl(var(--primary))" />
    <g stroke="hsl(var(--primary-foreground))" strokeWidth="1" fill="none">
      <line x1="54" y1="20" x2="66" y2="20" />
      <line x1="54" y1="24" x2="66" y2="24" />
      <line x1="54" y1="28" x2="66" y2="28" />
      <line x1="54" y1="32" x2="66" y2="32" />
    </g>
    
    {/* Conector XLR */}
    <circle cx="60" cy="95" r="8" fill="hsl(var(--accent))" />
    <circle cx="60" cy="95" r="6" fill="hsl(var(--muted))" />
  </svg>
);

// Coles 4038 - Micrófono ribbon clásico
export const Coles4038Icon = ({ className, size = 120 }: MicrophoneIconProps) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 120 120" 
    className={cn("drop-shadow-lg transition-transform duration-300 hover:scale-110", className)}
  >
    {/* Cuerpo clásico redondeado */}
    <ellipse cx="60" cy="50" rx="20" ry="35" fill="hsl(var(--primary))" />
    
    {/* Rejilla frontal vintage */}
    <ellipse cx="60" cy="35" rx="15" ry="20" fill="hsl(var(--accent))" />
    <g stroke="hsl(var(--primary-foreground))" strokeWidth="1.5" fill="none">
      <ellipse cx="60" cy="35" rx="12" ry="16" />
      <ellipse cx="60" cy="35" rx="9" ry="12" />
      <ellipse cx="60" cy="35" rx="6" ry="8" />
    </g>
    
    {/* Soporte característico */}
    <rect x="58" y="85" width="4" height="8" fill="hsl(var(--muted-foreground))" />
    
    {/* Conector XLR */}
    <circle cx="60" cy="95" r="6" fill="hsl(var(--accent))" />
  </svg>
);

// Telefunken C12 - Micrófono vintage
export const C12Icon = ({ className, size = 120 }: MicrophoneIconProps) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 120 120" 
    className={cn("drop-shadow-lg transition-transform duration-300 hover:scale-110", className)}
  >
    {/* Cuerpo vintage dorado */}
    <rect x="46" y="20" width="28" height="70" rx="14" fill="hsl(var(--accent))" />
    
    {/* Rejilla vintage superior */}
    <ellipse cx="60" cy="15" rx="16" ry="12" fill="hsl(var(--primary))" />
    <g stroke="hsl(var(--primary-foreground))" strokeWidth="1" fill="none">
      <path d="M 48 15 Q 60 8 72 15" />
      <path d="M 48 18 Q 60 11 72 18" />
      <path d="M 48 21 Q 60 14 72 21" />
    </g>
    
    {/* Logo vintage */}
    <circle cx="60" cy="55" r="6" fill="hsl(var(--primary))" />
    <text x="60" y="58" textAnchor="middle" fontSize="8" fill="hsl(var(--primary-foreground))">C12</text>
    
    {/* Conector XLR */}
    <circle cx="60" cy="95" r="8" fill="hsl(var(--accent))" />
    <circle cx="60" cy="95" r="6" fill="hsl(var(--muted))" />
  </svg>
);

// Mapa de iconos para facilitar el acceso
export const microphoneIcons = {
  'sm57': SM57Icon,
  'beta52': Beta52Icon,
  'km184': KM184Icon,
  'sen421': Sen421Icon,
  'c414': C414Icon,
  'u87': U87Icon,
  'd6': D6Icon,
  'boundary': BoundaryIcon,
  'sen441': Sen441Icon,
  'm160': M160Icon,
  'coles4038': Coles4038Icon,
  'c12': C12Icon,
} as const;

export type MicrophoneIconType = keyof typeof microphoneIcons;