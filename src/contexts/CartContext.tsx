import { createContext, useContext, ReactNode } from "react";
import { useCart } from "@/hooks/useCart";
import { CartItem, CartState } from "@/types/cart";

interface CartContextType {
  cartState: CartState;
  addItem: (item: CartItem) => void;
  removeItem: (itemId: string) => void;
  clearCart: () => void;
  hasItem: (itemId: string) => boolean;
}

const CartContext = createContext<CartContextType | null>(null);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const cart = useCart();
  return <CartContext.Provider value={cart}>{children}</CartContext.Provider>;
};

export const useCartContext = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCartContext must be used within a CartProvider");
  }
  return context;
};
