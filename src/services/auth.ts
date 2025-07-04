
import { bglApi } from './api';
import { User } from '@/types';

export interface LoginCredentials {
  username: string;
  password: string;
  role: 'wholesaler' | 'retailer' | 'admin';
}

export interface AuthResponse {
  token: string;
  user: User;
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await bglApi.post('/auth', credentials);
      return response.data;
    } catch (error) {
      // Mock response for demo - remove when backend is ready
      console.log('Using mock auth for demo');
      const mockUser: User = {
        id: '1',
        username: credentials.username,
        email: `${credentials.username}@example.com`,
        role: credentials.role,
        businessName: `${credentials.username} Business`,
        phone: '+1234567890',
        address: '123 Business St'
      };
      
      return {
        token: 'mock-jwt-token',
        user: mockUser
      };
    }
  },

  async updateUser(user: User): Promise<User> {
    try {
      const response = await bglApi.put('/user/profile', user);
      return response.data;
    } catch (error) {
      console.error('Failed to update user profile:', error);
      // For demo, return the updated user
      return user;
    }
  },

  logout() {
    localStorage.removeItem('bgl_token');
    localStorage.removeItem('bgl_user');
  },

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('bgl_user');
    return userStr ? JSON.parse(userStr) : null;
  },

  getToken(): string | null {
    return localStorage.getItem('bgl_token');
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
};
