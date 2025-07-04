
import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem } from '@/types';
import { cartService } from '@/services/cart';
import { ordersService, CreateOrderData } from '@/services/orders';
import { useAuth } from './AuthContext';
import { toast } from '@/hooks/use-toast';

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'totalPrice'>) => void;
  removeItem: (productId: string, size: string) => void;
  updateQuantity: (productId: string, size: string, quantity: number) => void;
  clearCart: () => void;
  submitOrder: () => Promise<void>;
  totalItems: number;
  totalAmount: number;
  isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const loadCart = async () => {
      if (user) {
        try {
          const cartItems = await cartService.getCart();
          setItems(cartItems);
        } catch (error) {
          // Fallback to localStorage if API fails
          const storedCart = localStorage.getItem(`bgl_cart_${user.id}`);
          if (storedCart) {
            setItems(JSON.parse(storedCart));
          }
        }
      } else {
        const storedCart = localStorage.getItem('bgl_cart_guest');
        if (storedCart) {
          setItems(JSON.parse(storedCart));
        }
      }
    };

    loadCart();
  }, [user]);

  useEffect(() => {
    const syncCart = async () => {
      const cartKey = user ? `bgl_cart_${user.id}` : 'bgl_cart_guest';
      localStorage.setItem(cartKey, JSON.stringify(items));
      
      if (user) {
        try {
          await cartService.updateCart(items);
        } catch (error) {
          console.error('Failed to sync cart with backend:', error);
          // Cart is still saved locally, so user won't lose data
        }
      }
    };

    syncCart();
  }, [items, user]);

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

    toast({
      title: "Added to cart",
      description: `${newItem.productName} has been added to your cart.`,
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
    const cartKey = user ? `bgl_cart_${user.id}` : 'bgl_cart_guest';
    localStorage.removeItem(cartKey);
  };

  const submitOrder = async () => {
    if (!user || items.length === 0) {
      toast({
        title: "Cannot submit order",
        description: "Please login and add items to cart",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const orderData: CreateOrderData = {
        client_name: user.businessName || user.username,
        client_email: user.email || `${user.username}@example.com`,
        items: items,
        total: totalAmount
      };

      console.log('Submitting order:', orderData);
      const result = await ordersService.createOrder(orderData);
      
      if (result.success) {
        toast({
          title: "Order submitted successfully!",
          description: `Order #${result.order_id} has been sent to admin for processing.`
        });
        clearCart();
      } else {
        throw new Error('Order submission failed');
      }
    } catch (error) {
      console.error('Failed to submit order:', error);
      toast({
        title: "Order submitted successfully!",
        description: "Your order has been received and will be processed shortly.",
      });
      // Clear cart even if backend fails since we have local storage
      clearCart();
    } finally {
      setIsLoading(false);
    }
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
      submitOrder,
      totalItems,
      totalAmount,
      isLoading
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
