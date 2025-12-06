import { apiService } from './api.service';
import { ENDPOINTS } from '../config/api.config';
import { API_CONFIG } from '../config/api.config';

export interface RegisterData {
  full_name: string;
  phone_number: string;
  passport_serial: string;
  passport_serial_number: string;
  password: string;
}

export interface LoginData {
  phone_number: string;
  password: string;
}

export interface VerifyData {
  phone_number: string;
  verification_code: string;
}

export interface User {
  id: string;
  full_name: string;
  phone_number: string;
  passport_serial: string;
  passport_serial_number: string;
  is_verified?: boolean;
  created_at?: string;
}

export interface AuthResponse {
  access: string;
  refresh: string;
}

class AuthService {
  // Register
  async register(data: RegisterData) {
    try {
      const response = await apiService.post(ENDPOINTS.AUTH.REGISTER, data);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Verify OTP
  async verify(data: VerifyData) {
    try {
      const response = await apiService.post(ENDPOINTS.AUTH.VERIFY, data);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Resend OTP
  async resendOtp(phone_number: string) {
    try {
      const response = await apiService.post(ENDPOINTS.AUTH.RESEND_OTP, { phone_number });
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Login
  async login(phone_number: string, password: string): Promise<AuthResponse> {
    try {
      const response = await apiService.post<AuthResponse>(ENDPOINTS.AUTH.LOGIN, {
        phone_number,
        password,
      });
      
      // Store tokens
      if (response.access && response.refresh) {
        localStorage.setItem('accessToken', response.access);
        localStorage.setItem('refreshToken', response.refresh);
        
        // Get user info after login
        await this.fetchUserInfo();
      }
      
      return response;
    } catch (error) {
      throw error;
    }
  }
  
  // Get current user info
  async fetchUserInfo(): Promise<User | null> {
    try {
      const user = await apiService.get<User>(ENDPOINTS.AUTH.ME);
      localStorage.setItem('user', JSON.stringify(user));
      return user;
    } catch (error) {
      return null;
    }
  }

  // Logout
  async logout() {
    try {
      await apiService.post(ENDPOINTS.AUTH.LOGOUT);
    } finally {
      // Clear local storage regardless of API response
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    }
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    const token = localStorage.getItem('accessToken');
    return !!token;
  }

  // Get current user from localStorage
  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch {
        return null;
      }
    }
    return null;
  }

  // Get access token
  getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
  }
  
  // Update user profile
  async updateProfile(data: {
    full_name: string;
    passport_serial: string;
    passport_serial_number: string;
  }) {
    try {
      // Try PATCH first (some backends prefer PATCH over PUT)
      let response;
      try {
        response = await apiService.patch(ENDPOINTS.AUTH.UPDATE_PROFILE, data);
      } catch (patchError) {
        response = await apiService.put(ENDPOINTS.AUTH.UPDATE_PROFILE, data);
      }
      
      // Refresh user info after update
      await this.fetchUserInfo();
      
      return response;
    } catch (error) {
      throw error;
    }
  }
  
  // Update password
  async updatePassword(data: {
    old_password: string;
    new_password: string;
  }) {
    try {
      // Try PATCH first (some backends prefer PATCH over PUT)
      let response;
      try {
        response = await apiService.patch(ENDPOINTS.AUTH.UPDATE_PASSWORD, data);
      } catch (patchError) {
        response = await apiService.put(ENDPOINTS.AUTH.UPDATE_PASSWORD, data);
      }
      
      return response;
    } catch (error) {
      throw error;
    }
  }
  
  // Reset password SMS (send verification code)
  async resetPasswordSms(phone_number: string) {
    try {
      const response = await apiService.post(ENDPOINTS.AUTH.RESET_PASSWORD_SMS, { phone_number });
      return response;
    } catch (error) {
      throw error;
    }
  }
  
  // Reset password with verification code
  async resetPassword(data: {
    phone_number: string;
    new_password: string;
    verification_code: string;
  }) {
    try {
      const response = await apiService.post(ENDPOINTS.AUTH.FORGET_PASSWORD, data);
      return response;
    } catch (error) {
      throw error;
    }
  }
}

export const authService = new AuthService();