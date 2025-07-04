
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productsService } from '@/services/products';
import { Product } from '@/types';
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

export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: productsService.createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast({
        title: "Product created successfully",
        description: "The new product has been added to the catalog.",
      });
    },
    onError: () => {
      toast({
        title: "Failed to create product",
        description: "Please try again.",
        variant: "destructive"
      });
    }
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, product }: { id: string; product: Partial<Product> }) => 
      productsService.updateProduct(id, product),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast({
        title: "Product updated successfully",
        description: "The product has been updated.",
      });
    },
    onError: () => {
      toast({
        title: "Failed to update product",
        description: "Please try again.",
        variant: "destructive"
      });
    }
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: productsService.deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast({
        title: "Product deleted successfully",
        description: "The product has been removed from the catalog.",
      });
    },
    onError: () => {
      toast({
        title: "Failed to delete product",
        description: "Please try again.",
        variant: "destructive"
      });
    }
  });
};
