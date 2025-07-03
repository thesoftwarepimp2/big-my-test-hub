
import { bglApi } from './api';
import { CartItem } from '@/types';

export const cartService = {
  async getCart(): Promise<CartItem[]> {
    try {
      const response = await bglApi.get('/cart');
      return response.data || [];
    } catch (error) {
      console.error('Failed to fetch cart:', error);
      return [];
    }
  },

  async updateCart(cartItems: CartItem[]): Promise<void> {
    try {
      await bglApi.post('/cart', cartItems);
    } catch (error) {
      console.error('Failed to update cart:', error);
      throw error;
    }
  },

  async clearCart(): Promise<void> {
    try {
      await bglApi.post('/cart', []);
    } catch (error) {
      console.error('Failed to clear cart:', error);
      throw error;
    }
  }
};
