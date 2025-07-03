
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
    const response = await bglApi.post('/auth', credentials);
    return response.data;
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
