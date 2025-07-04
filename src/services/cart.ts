
import { bglApi } from './api';
import { CartItem } from '@/types';

export const cartService = {
  async getCart(): Promise<CartItem[]> {
    try {
      const response = await bglApi.get('/cart');
      return response.data || [];
    } catch (error) {
      console.error('Failed to fetch cart:', error);
      // For demo, return from localStorage
      const storedCart = localStorage.getItem('bgl_cart');
      return storedCart ? JSON.parse(storedCart) : [];
    }
  },

  async updateCart(cartItems: CartItem[]): Promise<void> {
    try {
      await bglApi.post('/cart', cartItems);
    } catch (error) {
      console.error('Failed to update cart:', error);
      // For demo, store in localStorage
      localStorage.setItem('bgl_cart', JSON.stringify(cartItems));
    }
  },

  async clearCart(): Promise<void> {
    try {
      await bglApi.post('/cart', []);
    } catch (error) {
      console.error('Failed to clear cart:', error);
      // For demo, clear localStorage
      localStorage.removeItem('bgl_cart');
    }
  }
};
