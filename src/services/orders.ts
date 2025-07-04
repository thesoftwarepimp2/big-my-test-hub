
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

// Demo orders storage
const getStoredOrders = (): Order[] => {
  const stored = localStorage.getItem('bgl_orders');
  return stored ? JSON.parse(stored) : [];
};

const storeOrders = (orders: Order[]): void => {
  localStorage.setItem('bgl_orders', JSON.stringify(orders));
};

export const ordersService = {
  async createOrder(orderData: CreateOrderData): Promise<{ success: boolean; order_id: number }> {
    try {
      const response = await bglApi.post('/orders', orderData);
      return response.data;
    } catch (error) {
      console.error('Backend order creation failed, using demo mode:', error);
      
      // Demo order creation
      const orders = getStoredOrders();
      const newOrder: Order = {
        id: `ORD-${Date.now()}`,
        clientName: orderData.client_name,
        clientEmail: orderData.client_email,
        items: orderData.items.map(item => ({
          name: item.productName,
          quantity: item.quantity,
          price: item.unitPrice
        })),
        total: orderData.total,
        status: 'pending',
        date: new Date().toISOString().split('T')[0],
        paymentStatus: 'unpaid'
      };
      
      orders.unshift(newOrder);
      storeOrders(orders);
      
      return { success: true, order_id: parseInt(newOrder.id.split('-')[1]) };
    }
  },

  async getOrders(): Promise<Order[]> {
    try {
      const response = await bglApi.get('/orders');
      return response.data || [];
    } catch (error) {
      console.error('Failed to fetch orders from backend, using demo data:', error);
      return getStoredOrders();
    }
  },

  async updateOrderStatus(orderId: string, status: 'pending' | 'processing' | 'delivered'): Promise<void> {
    try {
      await bglApi.put(`/orders/${orderId}/status`, { status });
    } catch (error) {
      console.error('Failed to update order status on backend, updating demo data:', error);
      const orders = getStoredOrders();
      const orderIndex = orders.findIndex(o => o.id === orderId);
      if (orderIndex !== -1) {
        orders[orderIndex].status = status;
        storeOrders(orders);
      }
    }
  },

  async updatePaymentStatus(orderId: string, paymentStatus: 'paid' | 'unpaid'): Promise<void> {
    try {
      await bglApi.put(`/orders/${orderId}/payment`, { paymentStatus });
    } catch (error) {
      console.error('Failed to update payment status on backend, updating demo data:', error);
      const orders = getStoredOrders();
      const orderIndex = orders.findIndex(o => o.id === orderId);
      if (orderIndex !== -1) {
        orders[orderIndex].paymentStatus = paymentStatus;
        storeOrders(orders);
      }
    }
  }
};
