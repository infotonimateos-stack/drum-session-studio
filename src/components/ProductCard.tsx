import { Button } from "@/components/ui/button";
import { Check, Plus } from "lucide-react";
import { ReactNode, cloneElement, isValidElement } from "react";

interface ProductCardProps {
  category: string;
  price: number;
  name: string;
  subtitle?: string;
  description?: string;
  descriptionList?: { emoji: string; text: string }[];
  image?: string;
  imageAlt?: string;
  imageContain?: boolean;
  icon?: ReactNode;
  isSelected: boolean;
  onToggle: () => void;
  addLabel?: string;
  addedLabel?: string;
  /** When true, renders a non-interactive "✓ YA INCLUIDO" green button */
  included?: boolean;
  includedLabel?: string;
  /** When true, the card is visually dimmed and the button is disabled */
  disabled?: boolean;
  /** If provided, renders a vintage-style badge next to the category label */
  vintageBadge?: string;
}

export const ProductCard = ({
  category,
  price,
  name,
  subtitle,
  description,
  descriptionList,
  image,
  imageAlt,
  imageContain = true,
  icon,
  isSelected,
  onToggle,
  addLabel = "Añadir por",
  addedLabel = "Añadido",
  included = false,
  includedLabel = "YA INCLUIDO",
  disabled = false,
  vintageBadge,
}: ProductCardProps) => {
  return (
    <div
      className={`relative flex flex-col h-full rounded-2xl overflow-hidden transition-all duration-300 ${
        included
          ? "ring-1 ring-[hsl(var(--card-dark-included))]/40"
          : disabled
          ? "opacity-50 cursor-not-allowed"
          : `cursor-pointer hover:shadow-2xl transform hover:scale-[1.03] ${
              isSelected
                ? "ring-2 ring-primary shadow-[0_4px_24px_-4px_hsl(var(--primary)/0.35)] scale-[1.03]"
                : "hover:ring-1 hover:ring-card-dark-price/40"
            }`
      }`}
      style={{
        background: included
          ? "hsl(145 25% 18%)"
          : isSelected
          ? "hsl(var(--primary) / 0.08)"
          : "hsl(var(--card-dark))",
      }}
      onClick={included ? undefined : onToggle}
    >
      {/* Selection checkmark badge */}
      {isSelected && !included && (
        <div className="absolute top-3 left-3 z-10 w-7 h-7 rounded-full bg-primary flex items-center justify-center shadow-md transition-transform duration-300 animate-in zoom-in-50">
          <Check className="h-4 w-4 text-primary-foreground" strokeWidth={3} />
        </div>
      )}
      {/* Top row: category + vintage badge + price */}
      <div className="flex items-center justify-between gap-2 px-5 pt-4 pb-1">
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full bg-card-dark-muted/20 text-card-dark-muted truncate min-w-0">
            {category}
          </span>
          {vintageBadge && (
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-700 text-amber-100 border border-amber-500/50 whitespace-nowrap shrink-0">
              {vintageBadge}
            </span>
          )}
        </div>
        {!included && (
          <span className="text-xl font-bold text-card-dark-price whitespace-nowrap shrink-0">
            {price.toFixed(2)} €
          </span>
        )}
        {included && (
          <span className="text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full bg-[hsl(var(--card-dark-included))]/20 text-success whitespace-nowrap shrink-0">
            0.00 €
          </span>
        )}
      </div>

      {/* Image or Icon */}
      <div className="flex items-center justify-center px-5 py-3">
      {image ? (
          <div className="w-full aspect-video flex items-center justify-center rounded-xl overflow-hidden bg-white border border-white/20">
            <img
              src={image}
              alt={imageAlt || name}
              className="w-full h-full object-contain p-2"
            />
          </div>
        ) : icon ? (
          <div className="w-20 h-20 flex items-center justify-center rounded-xl bg-card-dark-muted/15">
            {isValidElement(icon)
              ? cloneElement(icon as React.ReactElement<any>, {
                  className: `h-10 w-10 ${included ? "text-success" : "text-[hsl(var(--card-dark-btn-from))]"}`,
                })
              : icon}
          </div>
        ) : null}
      </div>

      {/* Title */}
      <div className="px-5 pb-1">
        <h3 className="text-base md:text-lg font-bold text-card-dark-foreground text-center break-words leading-tight">
          {name}
        </h3>
        {subtitle && (
          <p className="text-xs text-card-dark-muted text-center mt-1 leading-snug">
            {subtitle}
          </p>
        )}
      </div>

      {/* Description — grows to fill remaining space */}
      <div className="px-5 pb-3 flex-1">
        {descriptionList ? (
          <ul className="text-card-dark-muted text-sm space-y-1.5 list-none">
            {descriptionList.map((item, i) => (
              <li key={i}>
                {item.emoji} {item.text}
              </li>
            ))}
          </ul>
        ) : description ? (
          <p className="text-card-dark-muted text-sm text-center leading-relaxed">
            {description}
          </p>
        ) : null}
      </div>

      {/* Button — always pinned to the bottom */}
      <div className="px-5 pb-4 mt-auto">
        {included ? (
          <div className="w-full h-12 flex items-center justify-center rounded-xl bg-[hsl(var(--card-dark-included))]">
            <Check className="h-5 w-5 mr-2 text-success" />
            <span className="text-success font-bold text-base">Incluido</span>
          </div>
        ) : (
          <Button
            className={`w-full h-12 text-sm font-bold rounded-xl transition-all duration-200 px-4 whitespace-nowrap box-border ${
              isSelected
                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                : disabled
                ? "bg-muted text-muted-foreground cursor-not-allowed opacity-60"
                : "bg-gradient-to-r from-[hsl(var(--card-dark-btn-from))] to-[hsl(var(--card-dark-btn-to))] text-white hover:shadow-lg"
            }`}
            onClick={(e) => {
              e.stopPropagation();
              onToggle();
            }}
          >
            {isSelected ? (
              <>
                <Check className="h-4 w-4 shrink-0" />
                <span className="whitespace-nowrap">{addedLabel}</span>
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 shrink-0" />
                <span className="whitespace-nowrap">{addLabel} {price.toFixed(2)} €</span>
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
};
