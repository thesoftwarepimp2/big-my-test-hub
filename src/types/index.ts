
export interface Product {
  id: string;
  name: string;
  category: string;
  sizes: ProductSize[];
  image?: string;
  description?: string;
  inStock: boolean;
}

export interface ProductSize {
  size: string;
  usdPrice: number;
  zigPrice: number;
  discountPrice?: number;
}

export interface CartItem {
  productId: string;
  productName: string;
  size: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface User {
  id: string;
  username: string;
  role: 'wholesaler' | 'retailer' | 'admin';
  businessName?: string;
  email?: string;
  phone?: string;
  address?: string;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  totalAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  orderDate: string;
  deliveryDate?: string;
}

export interface SpecialOffer {
  id: string;
  productId: string;
  productName: string;
  originalPrice: number;
  discountPrice: number;
  discountPercent: number;
  expiryDate: string;
  image?: string;
}
