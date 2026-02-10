import { useState, useEffect, useCallback } from "react";

const CART_KEY = "gentlemen-cart";

export interface CartItem {
  id: string;
  quantity: number;
}

export function useCart() {
  const [cart, setCart] = useState<Record<string, number>>(() => {
    try {
      const saved = localStorage.getItem(CART_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart]);

  const addItem = useCallback((id: string) => {
    setCart((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  }, []);

  const removeItem = useCallback((id: string) => {
    setCart((prev) => {
      const next = { ...prev };
      if (next[id] > 1) {
        next[id] -= 1;
      } else {
        delete next[id];
      }
      return next;
    });
  }, []);

  const getQuantity = useCallback((id: string) => cart[id] || 0, [cart]);

  const totalItems = Object.values(cart).reduce((a, b) => a + b, 0);

  const clearCart = useCallback(() => setCart({}), []);

  return { cart, addItem, removeItem, getQuantity, totalItems, clearCart };
}
