
import { api, bglApi } from './api';
import { CartItem } from '@/types';

export interface CreateOrderData {
  client_name: string;
  client_email: string;
  items: CartItem[];
  total: number;
}

export interface Order {
  id: string;
  clientName: string;
  clientEmail: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  status: 'pending' | 'processing' | 'delivered';
  date: string;
  paymentStatus: 'paid' | 'unpaid';
}

export const ordersService = {
  async createOrder(orderData: CreateOrderData): Promise<{ success: boolean; order_id: number }> {
    const response = await bglApi.post('/orders', orderData);
    return response.data;
  },

  async getOrders(): Promise<Order[]> {
    try {
      const response = await bglApi.get('/orders');
      return response.data || [];
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      return [];
    }
  },

  async updateOrderStatus(orderId: string, status: 'pending' | 'processing' | 'delivered'): Promise<void> {
    await bglApi.put(`/orders/${orderId}/status`, { status });
  },

  async updatePaymentStatus(orderId: string, paymentStatus: 'paid' | 'unpaid'): Promise<void> {
    await bglApi.put(`/orders/${orderId}/payment`, { paymentStatus });
  }
};
