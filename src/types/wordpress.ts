
export interface WordPressUser {
  id: number;
  username: string;
  email: string;
  name: string;
  roles: string[];
  meta: {
    business_name: string;
    phone: string;
    user_role_bgl: 'wholesaler' | 'retailer' | 'admin';
  };
}

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

export interface WordPressOrder {
  id: number;
  title: { rendered: string };
  author: number;
  date: string;
  acf: {
    client_name: string;
    client_email: string;
    order_items: Array<{
      item_name: string;
      item_quantity: number;
      item_price: number;
    }>;
    order_total: number;
    order_status: 'pending' | 'processing' | 'delivered';
    payment_status: 'paid' | 'unpaid';
    order_date: string;
  };
}

export interface ApiResponse<T> {
  data: T;
  status: number;
  statusText: string;
}
