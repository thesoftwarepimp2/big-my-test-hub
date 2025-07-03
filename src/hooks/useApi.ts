
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productsService } from '@/services/products';
import { ordersService } from '@/services/orders';
import { cartService } from '@/services/cart';
import { toast } from '@/hooks/use-toast';

export const useProducts = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: productsService.getProducts,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useProduct = (id: string) => {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => productsService.getProduct(id),
    enabled: !!id,
  });
};

export const useOrders = () => {
  return useQuery({
    queryKey: ['orders'],
    queryFn: ordersService.getOrders,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ordersService.createOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast({
        title: "Order created successfully!",
        description: "Your order has been submitted and is being processed."
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to create order",
        description: "Please try again later.",
        variant: "destructive"
      });
      console.error('Order creation failed:', error);
    }
  });
};

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ orderId, status }: { orderId: string; status: 'pending' | 'processing' | 'delivered' }) =>
      ordersService.updateOrderStatus(orderId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast({
        title: "Order status updated",
        description: "The order status has been successfully updated."
      });
    },
    onError: () => {
      toast({
        title: "Failed to update order status",
        description: "Please try again later.",
        variant: "destructive"
      });
    }
  });
};

export const useCart = () => {
  return useQuery({
    queryKey: ['cart'],
    queryFn: cartService.getCart,
    staleTime: 30 * 1000, // 30 seconds
  });
};

export const useUpdateCart = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: cartService.updateCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
    onError: (error) => {
      console.error('Failed to update cart:', error);
    }
  });
};
