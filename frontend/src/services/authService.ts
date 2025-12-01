import axios from 'axios';

export interface User {
  email: string;
  name: string;
  picture?: string;
}

const AUTH_STORAGE_KEY = 'auth_user';
const API_BASE_URL = `http://${window.location.hostname}:8800`;

export const authService = {
  // Store user in localStorage
  setUser: (user: User) => {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
  },

  // Get user from localStorage
  getUser: (): User | null => {
    const userStr = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },

  // Clear user from localStorage
  clearUser: () => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    return !!authService.getUser();
  },

  // Verify token with backend (optional - for server-side validation)
  verifyToken: async (token: string): Promise<boolean> => {
    try {
      // You can add backend endpoint to verify token if needed
      // const response = await axios.post(`${API_BASE_URL}/auth/verify`, { token });
      // return response.data.valid;
      return true; // For now, just check localStorage
    } catch {
      return false;
    }
  }
};

