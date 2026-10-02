'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

interface CartContextType {
  cartItemIds: string[];
  addToCart: (eventId: string) => void;
  removeFromCart: (eventId: string) => void;
  toggleCartItem: (eventId: string) => void;
  clearCart: () => void;
  isInCart: (eventId: string) => boolean;
  cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'parinaam_registration_cart';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [cartItemIds, setCartItemIds] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const isStudent = user ? user.role === 'student' : true;
  // Key storage per user or guest
  const storageKey = user?.id ? `${CART_STORAGE_KEY}_${user.id}` : CART_STORAGE_KEY;

  // Load from localStorage on mount / user change
  useEffect(() => {
    if (user && user.role !== 'student') {
      setCartItemIds([]);
      setIsLoaded(true);
      return;
    }
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        setCartItemIds(JSON.parse(stored));
      } else {
        setCartItemIds([]);
      }
    } catch (e) {
      console.error('Failed to load cart from localStorage:', e);
    } finally {
      setIsLoaded(true);
    }
  }, [storageKey, user]);


  // Sync to localStorage
  const saveCart = (newIds: string[]) => {
    setCartItemIds(newIds);
    try {
      localStorage.setItem(storageKey, JSON.stringify(newIds));
    } catch (e) {
      console.error('Failed to save cart to localStorage:', e);
    }
  };

  const addToCart = (eventId: string) => {
    if (!eventId || cartItemIds.includes(eventId)) return;
    saveCart([...cartItemIds, eventId]);
  };

  const removeFromCart = (eventId: string) => {
    saveCart(cartItemIds.filter(id => id !== eventId));
  };

  const toggleCartItem = (eventId: string) => {
    if (cartItemIds.includes(eventId)) {
      removeFromCart(eventId);
    } else {
      addToCart(eventId);
    }
  };

  const clearCart = () => {
    saveCart([]);
  };

  const isInCart = (eventId: string): boolean => {
    return cartItemIds.includes(eventId);
  };

  return (
    <CartContext.Provider
      value={{
        cartItemIds,
        addToCart,
        removeFromCart,
        toggleCartItem,
        clearCart,
        isInCart,
        cartCount: cartItemIds.length,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
