import { Button } from "@/components/ui/button";
import { Check, Plus } from "lucide-react";
import { ReactNode } from "react";

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
}: ProductCardProps) => {
  return (
    <div
      className={`relative flex flex-col h-full rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-2xl transform hover:scale-[1.03] ${
        isSelected
          ? "ring-2 ring-primary shadow-2xl scale-[1.03]"
          : "hover:ring-1 hover:ring-card-dark-price/40"
      }`}
      style={{ background: "hsl(var(--card-dark))" }}
      onClick={onToggle}
    >
      {/* Top row: category + price */}
      <div className="flex items-center justify-between px-5 pt-4 pb-1">
        <span className="text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full bg-card-dark-muted/20 text-card-dark-muted">
          {category}
        </span>
        <span className="text-xl font-bold text-card-dark-price">
          {price.toFixed(2)} €
        </span>
      </div>

      {/* Image or Icon */}
      <div className="flex items-center justify-center px-5 py-3">
        {image ? (
          <div className="w-full h-36 flex items-center justify-center bg-white rounded-xl">
            <img
              src={image}
              alt={name}
              className="max-h-32 max-w-full object-contain p-2"
            />
          </div>
        ) : icon ? (
          <div className="w-20 h-20 flex items-center justify-center rounded-xl bg-card-dark-muted/15 text-card-dark-foreground">
            {icon}
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
      </div>
    </div>
  );
};
