
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
    const response = await api.get('/wp/v2/orders?_embed&per_page=100');
    return response.data.map((wpOrder: any) => ({
      id: `ORD-${wpOrder.id.toString().padStart(3, '0')}`,
      clientName: wpOrder.acf.client_name,
      clientEmail: wpOrder.acf.client_email,
      items: wpOrder.acf.order_items || [],
      total: wpOrder.acf.order_total,
      status: wpOrder.acf.order_status,
      date: wpOrder.acf.order_date,
      paymentStatus: wpOrder.acf.payment_status
    }));
  },

  async updateOrderStatus(orderId: string, status: 'pending' | 'processing' | 'delivered'): Promise<void> {
    const id = orderId.replace('ORD-', '');
    await api.post(`/wp/v2/orders/${id}`, {
      acf: {
        order_status: status
      }
    });
  },

  async updatePaymentStatus(orderId: string, paymentStatus: 'paid' | 'unpaid'): Promise<void> {
    const id = orderId.replace('ORD-', '');
    await api.post(`/wp/v2/orders/${id}`, {
      acf: {
        payment_status: paymentStatus
      }
    });
  }
};
