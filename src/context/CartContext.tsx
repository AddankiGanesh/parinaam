'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';

interface CartContextType {
  cartItemIds: string[];
  confirmedEventIds: string[];
  addToCart: (eventId: string) => void;
  removeFromCart: (eventId: string) => void;
  toggleCartItem: (eventId: string) => void;
  clearCart: () => void;
  isInCart: (eventId: string) => boolean;
  isConfirmed: (eventId: string) => boolean;
  refreshRegistrations: () => Promise<void>;
  cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'parinaam_registration_cart';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [cartItemIds, setCartItemIds] = useState<string[]>([]);
  const [confirmedEventIds, setConfirmedEventIds] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Key storage per user or guest
  const storageKey = user?.id ? `${CART_STORAGE_KEY}_${user.id}` : CART_STORAGE_KEY;

  // Fetch student confirmed registrations from RDS
  const refreshRegistrations = useCallback(async () => {
    if (!user || user.role !== 'student') {
      setConfirmedEventIds([]);
      return;
    }
    try {
      const res = await fetch('/api/registrations');
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.data.registrations)) {
          const confirmed = data.data.registrations
            .filter((r: any) => r.status === 'CONFIRMED')
            .map((r: any) => (r.event_id || r.eventId) as string);
          setConfirmedEventIds(confirmed);
        }
      }
    } catch (e) {
      console.error('Failed to fetch student registrations:', e);
    }
  }, [user]);

  // Load cart and registrations whenever user changes
  useEffect(() => {
    if (user && user.role !== 'student') {
      setCartItemIds([]);
      setConfirmedEventIds([]);
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

    refreshRegistrations();
  }, [storageKey, user, refreshRegistrations]);

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

  const isConfirmed = (eventId: string): boolean => {
    return confirmedEventIds.includes(eventId);
  };

  return (
    <CartContext.Provider
      value={{
        cartItemIds,
        confirmedEventIds,
        addToCart,
        removeFromCart,
        toggleCartItem,
        clearCart,
        isInCart,
        isConfirmed,
        refreshRegistrations,
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
