
import { bglApi } from './api';
import { CartItem } from '@/types';

export const cartService = {
  async getCart(): Promise<CartItem[]> {
    try {
      const response = await bglApi.get('/cart');
      return response.data || [];
    } catch (error) {
      console.error('Failed to fetch cart from backend, using localStorage:', error);
      // For demo, return from localStorage based on current user
      const currentUser = JSON.parse(localStorage.getItem('bgl_user') || '{}');
      const cartKey = currentUser.id ? `bgl_cart_${currentUser.id}` : 'bgl_cart_guest';
      const storedCart = localStorage.getItem(cartKey);
      return storedCart ? JSON.parse(storedCart) : [];
    }
  },

  async updateCart(cartItems: CartItem[]): Promise<void> {
    try {
      await bglApi.post('/cart', cartItems);
    } catch (error) {
      console.error('Failed to update cart on backend, using localStorage:', error);
      // For demo, store in localStorage based on current user
      const currentUser = JSON.parse(localStorage.getItem('bgl_user') || '{}');
      const cartKey = currentUser.id ? `bgl_cart_${currentUser.id}` : 'bgl_cart_guest';
      localStorage.setItem(cartKey, JSON.stringify(cartItems));
    }
  },

  async clearCart(): Promise<void> {
    try {
      await bglApi.post('/cart', []);
    } catch (error) {
      console.error('Failed to clear cart on backend, clearing localStorage:', error);
      // For demo, clear localStorage based on current user
      const currentUser = JSON.parse(localStorage.getItem('bgl_user') || '{}');
      const cartKey = currentUser.id ? `bgl_cart_${currentUser.id}` : 'bgl_cart_guest';
      localStorage.removeItem(cartKey);
    }
  }
};
