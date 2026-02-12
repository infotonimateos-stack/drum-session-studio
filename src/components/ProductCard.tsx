import { Button } from "@/components/ui/button";
import { Check, Plus } from "lucide-react";
import { ReactNode, cloneElement, isValidElement } from "react";

interface ProductCardProps {
  category: string;
  price: number;
  name: string;
  description?: string;
  descriptionList?: { emoji: string; text: string }[];
  image?: string;
  icon?: ReactNode;
  isSelected: boolean;
  onToggle: () => void;
  addLabel?: string;
  addedLabel?: string;
  /** When true, renders a non-interactive "✓ YA INCLUIDO" green button */
  included?: boolean;
  includedLabel?: string;
}

export const ProductCard = ({
  category,
  price,
  name,
  description,
  descriptionList,
  image,
  icon,
  isSelected,
  onToggle,
  addLabel = "Añadir por",
  addedLabel = "Añadido",
  included = false,
  includedLabel = "YA INCLUIDO",
}: ProductCardProps) => {
  return (
    <div
      className={`relative flex flex-col h-full rounded-2xl overflow-hidden transition-all duration-300 ${
        included
          ? "ring-1 ring-[hsl(var(--card-dark-included))]/40"
          : `cursor-pointer hover:shadow-2xl transform hover:scale-[1.03] ${
              isSelected
                ? "ring-2 ring-primary shadow-2xl scale-[1.03]"
                : "hover:ring-1 hover:ring-card-dark-price/40"
            }`
      }`}
      style={{ background: included ? "hsl(145 25% 18%)" : "hsl(var(--card-dark))" }}
      onClick={included ? undefined : onToggle}
    >
      {/* Top row: category + price */}
      <div className="flex items-center justify-between px-5 pt-4 pb-1">
        <span className="text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full bg-card-dark-muted/20 text-card-dark-muted">
          {category}
        </span>
        {!included && (
          <span className="text-xl font-bold text-card-dark-price">
            {price.toFixed(2)} €
          </span>
        )}
        {included && (
          <span className="text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full bg-[hsl(var(--card-dark-included))]/20 text-success">
            0.00 €
          </span>
        )}
      </div>

      {/* Image or Icon */}
      <div className="flex items-center justify-center px-5 py-3">
        {image ? (
          <div className="w-full h-44 flex items-center justify-center bg-white rounded-xl">
            <img
              src={image}
              alt={name}
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
        <h3 className="text-lg font-bold text-card-dark-foreground text-center">
          {name}
        </h3>
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
            className={`w-full h-12 text-base font-bold rounded-xl transition-all duration-200 ${
              isSelected
                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                : "bg-gradient-to-r from-[hsl(var(--card-dark-btn-from))] to-[hsl(var(--card-dark-btn-to))] text-white hover:shadow-lg"
            }`}
            onClick={(e) => {
              e.stopPropagation();
              onToggle();
            }}
          >
            {isSelected ? (
              <>
                <Check className="h-5 w-5 mr-2" />
                {addedLabel}
              </>
            ) : (
              <>
                <Plus className="h-5 w-5 mr-2" />
                {addLabel} {price.toFixed(2)} €
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
};
