
import { api } from './api';
import { Product } from '@/types';

export interface WooCommerceProduct {
  id: number;
  name: string;
  description: string;
  short_description: string;
  images: Array<{
    src: string;
    alt: string;
  }>;
  categories: Array<{
    id: number;
    name: string;
    slug: string;
  }>;
  attributes: Array<{
    id: number;
    name: string;
    options: string[];
  }>;
  variations: number[];
  price: string;
  regular_price: string;
  stock_status: 'instock' | 'outofstock';
  meta_data: Array<{
    key: string;
    value: any;
  }>;
}

const transformWooCommerceProduct = (wcProduct: WooCommerceProduct): Product => {
  // Extract sizes from product variations or attributes
  const sizeAttribute = wcProduct.attributes.find(attr => 
    attr.name.toLowerCase().includes('size') || attr.name.toLowerCase().includes('weight')
  );
  
  const sizes = sizeAttribute?.options.map(size => ({
    size: size,
    usdPrice: parseFloat(wcProduct.price) || 0,
    zigPrice: parseFloat(wcProduct.price) * 500 // Convert USD to ZIG (example rate)
  })) || [{
    size: 'Standard',
    usdPrice: parseFloat(wcProduct.price) || 0,
    zigPrice: parseFloat(wcProduct.price) * 500
  }];

  return {
    id: wcProduct.id.toString(),
    name: wcProduct.name,
    category: wcProduct.categories[0]?.name || 'General',
    image: wcProduct.images[0]?.src || '',
    description: wcProduct.short_description || wcProduct.description,
    sizes: sizes,
    inStock: wcProduct.stock_status === 'instock'
  };
};

export const productsService = {
  async getProducts(): Promise<Product[]> {
    const response = await api.get('/wc/v3/products?per_page=100&consumer_key=your_key&consumer_secret=your_secret');
    return response.data.map(transformWooCommerceProduct);
  },

  async getProduct(id: string): Promise<Product> {
    const response = await api.get(`/wc/v3/products/${id}?consumer_key=your_key&consumer_secret=your_secret`);
    return transformWooCommerceProduct(response.data);
  },

  async getProductsByCategory(category: string): Promise<Product[]> {
    const response = await api.get(`/wc/v3/products?category=${category}&per_page=100&consumer_key=your_key&consumer_secret=your_secret`);
    return response.data.map(transformWooCommerceProduct);
  }
};
