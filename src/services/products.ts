
import { bglApi } from './api';
import { Product } from '@/types';

// Demo products storage
const getStoredProducts = (): Product[] => {
  const stored = localStorage.getItem('bgl_products');
  if (stored) {
    return JSON.parse(stored);
  }
  
  // Initial demo products
  const demoProducts: Product[] = [
    {
      id: '1',
      name: 'MEGA ROLLER FLOUR 10KG',
      category: 'flour',
      image: '/lovable-uploads/a482987a-a345-4e6b-9eab-cb6d18176549.png',
      description: 'Premium quality all-purpose flour perfect for baking bread, cakes, and pastries',
      sizes: [
        { size: '2KG', usdPrice: 4.50, zigPrice: 2250 },
        { size: '5KG', usdPrice: 10.25, zigPrice: 5125 },
        { size: '10KG', usdPrice: 18.50, zigPrice: 9250 }
      ],
      inStock: true
    },
    {
      id: '2',
      name: 'MEGA SELF RAISING FLOUR 5KG',
      category: 'flour',
      image: '/lovable-uploads/87a386fc-72ae-45da-bce8-173bc5498a72.png',
      description: 'Self-raising flour with baking powder already mixed in for convenient baking',
      sizes: [
        { size: '2KG', usdPrice: 5.00, zigPrice: 2500 },
        { size: '5KG', usdPrice: 11.75, zigPrice: 5875 }
      ],
      inStock: true
    },
    {
      id: '3',
      name: 'BUTTERCUP MARGARINE',
      category: 'margarine',
      image: '/lovable-uploads/9fef6675-5097-40ac-9110-e5b7968e0f84.png',
      description: 'Premium margarine for baking and cooking',
      sizes: [
        { size: '500G', usdPrice: 3.25, zigPrice: 1625 },
        { size: '1KG', usdPrice: 6.50, zigPrice: 3250 }
      ],
      inStock: true
    },
    {
      id: '4',
      name: 'CHIMOMBE FULL CREAM MILK 1L',
      category: 'milk',
      image: '/lovable-uploads/012ea675-7eaa-4ff1-a9e7-b57d4ef0a5e3.png',
      description: 'Fresh full cream milk, long life',
      sizes: [
        { size: '500ML', usdPrice: 2.25, zigPrice: 1125 },
        { size: '1L', usdPrice: 4.25, zigPrice: 2125 }
      ],
      inStock: true
    },
    {
      id: '5',
      name: 'MEGA SUGAR BEANS 2KG',
      category: 'beans',
      image: '/lovable-uploads/2ed906fe-a9f4-46ed-a5cb-0e7a98fb0654.png',
      description: 'High quality sugar beans, rich in protein and perfect for traditional meals',
      sizes: [
        { size: '1KG', usdPrice: 4.75, zigPrice: 2375 },
        { size: '2KG', usdPrice: 8.75, zigPrice: 4375 }
      ],
      inStock: false
    },
    {
      id: '6',
      name: 'KOO BAKED BEANS 410G',
      category: 'beans',
      image: '/lovable-uploads/d6d51239-dfcb-456c-a486-332108a7d290.png',
      description: 'Baked beans in tomato sauce, ready to eat',
      sizes: [
        { size: '410G', usdPrice: 2.85, zigPrice: 1425 }
      ],
      inStock: true
    },
    {
      id: '7',
      name: 'POTATOES 10KG',
      category: 'potatoes',
      image: '/lovable-uploads/36576d91-5be2-451a-8fbb-287796a51139.png',
      description: 'Fresh potatoes, perfect for cooking and frying',
      sizes: [
        { size: '5KG', usdPrice: 3.50, zigPrice: 1750 },
        { size: '10KG', usdPrice: 6.75, zigPrice: 3375 }
      ],
      inStock: true
    },
    {
      id: '8',
      name: 'WILLARDS NIKNAKS',
      category: 'noodles',
      image: '/lovable-uploads/6b48b696-f25e-4f4d-83fb-416e5751eb90.png',
      description: 'Crispy corn snacks with spicy flavor',
      sizes: [
        { size: '150G', usdPrice: 1.85, zigPrice: 925 }
      ],
      inStock: true
    }
  ];
  
  localStorage.setItem('bgl_products', JSON.stringify(demoProducts));
  return demoProducts;
};

const storeProducts = (products: Product[]): void => {
  localStorage.setItem('bgl_products', JSON.stringify(products));
};

export const productsService = {
  async getProducts(): Promise<Product[]> {
    try {
      const response = await bglApi.get('/products');
      return response.data || [];
    } catch (error) {
      console.error('Failed to fetch products from backend, using demo data:', error);
      return getStoredProducts();
    }
  },

  async getProduct(id: string): Promise<Product | null> {
    try {
      const response = await bglApi.get(`/products/${id}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch product from backend, using demo data:', error);
      const products = getStoredProducts();
      return products.find(p => p.id === id) || null;
    }
  },

  async createProduct(product: Omit<Product, 'id'>): Promise<Product> {
    try {
      const response = await bglApi.post('/products', product);
      return response.data;
    } catch (error) {
      console.error('Failed to create product on backend, using demo mode:', error);
      
      // Demo product creation
      const products = getStoredProducts();
      const newProduct: Product = {
        ...product,
        id: Date.now().toString()
      };
      
      products.push(newProduct);
      storeProducts(products);
      
      return newProduct;
    }
  },

  async updateProduct(id: string, product: Partial<Product>): Promise<Product> {
    try {
      const response = await bglApi.put(`/products/${id}`, product);
      return response.data;
    } catch (error) {
      console.error('Failed to update product on backend, using demo mode:', error);
      
      // Demo product update
      const products = getStoredProducts();
      const productIndex = products.findIndex(p => p.id === id);
      
      if (productIndex !== -1) {
        products[productIndex] = { ...products[productIndex], ...product };
        storeProducts(products);
        return products[productIndex];
      }
      
      throw new Error('Product not found');
    }
  },

  async deleteProduct(id: string): Promise<void> {
    try {
      await bglApi.delete(`/products/${id}`);
    } catch (error) {
      console.error('Failed to delete product on backend, using demo mode:', error);
      
      // Demo product deletion
      const products = getStoredProducts();
      const filteredProducts = products.filter(p => p.id !== id);
      storeProducts(filteredProducts);
    }
  }
};
