import { createContext, useContext, ReactNode, useState, useCallback } from "react";
import { useCart } from "@/hooks/useCart";
import { CartItem, CartState } from "@/types/cart";

export type AdvisorProfile = "professional" | "selfproduced" | "demo" | null;

interface CartContextType {
  cartState: CartState;
  addItem: (item: CartItem) => void;
  removeItem: (itemId: string) => void;
  clearCart: () => void;
  hasItem: (itemId: string) => boolean;
  advisorProfile: AdvisorProfile;
  setAdvisorProfile: (profile: AdvisorProfile) => void;
}

const CartContext = createContext<CartContextType | null>(null);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const cart = useCart();
  const [advisorProfile, setAdvisorProfile] = useState<AdvisorProfile>(null);

  return (
    <CartContext.Provider value={{ ...cart, advisorProfile, setAdvisorProfile }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCartContext = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCartContext must be used within a CartProvider");
  }
  return context;
};
