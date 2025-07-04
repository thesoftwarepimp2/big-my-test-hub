
import { User } from '@/types';

export const demoUsers: User[] = [
  {
    id: '1',
    username: 'wholesaler_demo',
    role: 'wholesaler',
    businessName: 'Metro Wholesale Distributors',
    email: 'demo@metrowholesale.com',
    phone: '+263 123 456 789',
    address: '123 Business St, Harare, Zimbabwe'
  },
  {
    id: '2',
    username: 'retailer_demo',
    role: 'retailer',
    businessName: 'Corner Store Plus',
    email: 'demo@cornerstoreplus.com',
    phone: '+263 987 654 321',
    address: '456 Retail Ave, Bulawayo, Zimbabwe'
  },
  {
    id: '3',
    username: 'admin_demo',
    role: 'admin',
    businessName: 'Big Game Logistics',
    email: 'admin@biggamelogistics.com',
    phone: '+263 555 000 111',
    address: '789 Admin Blvd, Harare, Zimbabwe'
  }
];

export const authenticate = (username: string, password: string, role: string): User | null => {
  if (password !== 'biggame123') return null;
  
  const user = demoUsers.find(u => u.username === username && u.role === role);
  return user || null;
};
