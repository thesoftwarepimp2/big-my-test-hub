
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productsService } from '@/services/products';
import { toast } from '@/hooks/use-toast';

export const useWordPressProducts = () => {
  return useQuery({
    queryKey: ['wordpress-products'],
    queryFn: productsService.getProducts,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
    onError: (error) => {
      console.error('Failed to fetch products from WordPress:', error);
      toast({
        title: "Failed to load products",
        description: "Could not connect to WordPress backend",
        variant: "destructive"
      });
    }
  });
};

export const useWordPressProduct = (id: string) => {
  return useQuery({
    queryKey: ['wordpress-product', id],
    queryFn: () => productsService.getProduct(id),
    enabled: !!id,
    retry: 2,
  });
};
