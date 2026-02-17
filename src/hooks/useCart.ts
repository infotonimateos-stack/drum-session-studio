import { useState, useCallback } from 'react';
import { CartItem, CartState } from '@/types/cart';

const BASE_PRICE = 0;

export const useCart = () => {
  const [cartState, setCartState] = useState<CartState>({
    items: [],
    total: BASE_PRICE,
    basePrice: BASE_PRICE
  });

  const addItem = useCallback((item: CartItem) => {
    setCartState(prev => {
      const existingItem = prev.items.find(i => i.id === item.id);
      if (existingItem) return prev;

      const newItems = [...prev.items, item];
      const newTotal = prev.basePrice + newItems.reduce((sum, i) => sum + i.price, 0);
      
      return {
        ...prev,
        items: newItems,
        total: newTotal
      };
    });
  }, []);

  const removeItem = useCallback((itemId: string) => {
    setCartState(prev => {
      const newItems = prev.items.filter(i => i.id !== itemId);
      const newTotal = prev.basePrice + newItems.reduce((sum, i) => sum + i.price, 0);
      
      return {
        ...prev,
        items: newItems,
        total: newTotal
      };
    });
  }, []);

  const clearCart = useCallback(() => {
    setCartState({
      items: [],
      total: BASE_PRICE,
      basePrice: BASE_PRICE
    });
  }, []);

  const hasItem = useCallback((itemId: string) => {
    return cartState.items.some(item => item.id === itemId);
  }, [cartState.items]);

  return {
    cartState,
    addItem,
    removeItem,
    clearCart,
    hasItem
  };
};