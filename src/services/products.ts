
import { api } from './api';
import { Product } from '@/types';

export interface WordPressProduct {
  id: number;
  title: { rendered: string };
  content: { rendered: string };
  featured_media: number;
  acf: {
    product_category: string;
    product_image: string;
    product_description: string;
    product_sizes: Array<{
      size_name: string;
      usd_price: number;
      zig_price: number;
    }>;
    in_stock: boolean;
  };
}

const transformWordPressProduct = (wpProduct: WordPressProduct): Product => {
  return {
    id: wpProduct.id.toString(),
    name: wpProduct.title.rendered,
    category: wpProduct.acf.product_category,
    image: wpProduct.acf.product_image,
    description: wpProduct.acf.product_description,
    sizes: wpProduct.acf.product_sizes.map(size => ({
      size: size.size_name,
      usdPrice: size.usd_price,
      zigPrice: size.zig_price
    })),
    inStock: wpProduct.acf.in_stock
  };
};

export const productsService = {
  async getProducts(): Promise<Product[]> {
    const response = await api.get('/wp/v2/products?_embed&per_page=100');
    return response.data.map(transformWordPressProduct);
  },

  async getProduct(id: string): Promise<Product> {
    const response = await api.get(`/wp/v2/products/${id}?_embed`);
    return transformWordPressProduct(response.data);
  },

  async getProductsByCategory(category: string): Promise<Product[]> {
    const response = await api.get(`/wp/v2/products?_embed&per_page=100&acf_product_category=${category}`);
    return response.data.map(transformWordPressProduct);
  }
};
