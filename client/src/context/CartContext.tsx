import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem } from '../types';
import { fetchApi } from '../services/api';
import { useAuth } from './AuthContext';

interface CartContextType {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  addToCart: (productId: string, quantity?: number) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);

  const refreshCart = async () => {
    if (!user) {
      setItems([]);
      return;
    }
    try {
      const res = await fetchApi('/cart');
      setItems(res.cart?.items || []);
    } catch (err) {
      console.error('Error fetching cart:', err);
    }
  };

  useEffect(() => {
    refreshCart();
  }, [user]);

  const addToCart = async (productId: string, quantity = 1) => {
    if (!user) {
      alert('Please log in to add items to your cart.');
      return;
    }
    await fetchApi('/cart/items', {
      method: 'POST',
      body: JSON.stringify({ productId, quantity })
    });
    await refreshCart();
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    await fetchApi(`/cart/items/${itemId}`, {
      method: 'PATCH',
      body: JSON.stringify({ quantity })
    });
    await refreshCart();
  };

  const removeFromCart = async (itemId: string) => {
    await fetchApi(`/cart/items/${itemId}`, {
      method: 'DELETE'
    });
    await refreshCart();
  };

  const clearCart = async () => {
    await fetchApi('/cart', {
      method: 'DELETE'
    });
    setItems([]);
  };

  const itemCount = items.reduce((acc, i) => acc + i.quantity, 0);
  const subtotal = items.reduce((acc, i) => acc + (i.product?.sellingPrice || 0) * i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, itemCount, subtotal, addToCart, updateQuantity, removeFromCart, clearCart, refreshCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};
