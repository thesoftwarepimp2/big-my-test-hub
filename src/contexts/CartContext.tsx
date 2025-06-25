
import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem } from '@/types';

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'totalPrice'>) => void;
  removeItem: (productId: string, size: string) => void;
  updateQuantity: (productId: string, size: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalAmount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const storedCart = localStorage.getItem('bgl_cart');
    if (storedCart) {
      setItems(JSON.parse(storedCart));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('bgl_cart', JSON.stringify(items));
  }, [items]);

  const addItem = (newItem: Omit<CartItem, 'totalPrice'>) => {
    setItems(currentItems => {
      const existingItemIndex = currentItems.findIndex(
        item => item.productId === newItem.productId && item.size === newItem.size
      );

      if (existingItemIndex >= 0) {
        const updatedItems = [...currentItems];
        updatedItems[existingItemIndex].quantity += newItem.quantity;
        updatedItems[existingItemIndex].totalPrice = 
          updatedItems[existingItemIndex].quantity * updatedItems[existingItemIndex].unitPrice;
        return updatedItems;
      } else {
        return [...currentItems, {
          ...newItem,
          totalPrice: newItem.quantity * newItem.unitPrice
        }];
      }
    });
  };

  const removeItem = (productId: string, size: string) => {
    setItems(currentItems => 
      currentItems.filter(item => !(item.productId === productId && item.size === size))
    );
  };

  const updateQuantity = (productId: string, size: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId, size);
      return;
    }

    setItems(currentItems =>
      currentItems.map(item => {
        if (item.productId === productId && item.size === size) {
          return {
            ...item,
            quantity,
            totalPrice: quantity * item.unitPrice
          };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = items.reduce((sum, item) => sum + item.totalPrice, 0);

  return (
    <CartContext.Provider value={{
      items,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      totalItems,
      totalAmount
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
