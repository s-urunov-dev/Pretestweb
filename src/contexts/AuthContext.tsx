import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/auth.service';

interface User {
  id: string;
  fullName: string;
  phoneNumber: string;
  email?: string;
  passportSerial: string;
  passportNumber: string;
  isVerified: boolean;
}

export interface RegisterData {
  fullName: string;
  phoneNumber: string;
  passportSerial: string;
  passportNumber: string;
  password: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (phoneNumber: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  verify: (phoneNumber: string, code: string) => Promise<void>;
  setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on mount
    const token = localStorage.getItem('accessToken');
    const savedUser = localStorage.getItem('user');
    
    if (token && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        localStorage.removeItem('user');
      }
    }
    
    setIsLoading(false);
  }, []);

  const register = async (data: RegisterData) => {
    try {
      // Convert to backend format
      const backendData = {
        full_name: data.fullName,
        phone_number: data.phoneNumber,
        passport_serial: data.passportSerial,
        passport_serial_number: data.passportNumber,
        password: data.password,
      };
      
      await authService.register(backendData);
    } catch (error) {
      throw error;
    }
  };

  const verify = async (phoneNumber: string, code: string) => {
    try {
      const response = await authService.verify({
        phone_number: phoneNumber,
        verification_code: code,
      });
      
      // Backend returns: { user: {...}, access: "...", refresh: "..." }
      if (response.access && response.refresh) {
        localStorage.setItem('accessToken', response.access);
        localStorage.setItem('refreshToken', response.refresh);
      }
      
      // Use user data from verify response
      if (response.user) {
        const formattedUser: User = {
          id: response.user.id,
          fullName: response.user.full_name,
          phoneNumber: response.user.phone_number,
          passportSerial: response.user.passport_serial || '',
          passportNumber: response.user.passport_serial_number || '',
          isVerified: true,
        };
        setUser(formattedUser);
        localStorage.setItem('user', JSON.stringify(formattedUser));
      }
    } catch (error) {
      throw error;
    }
  };

  const login = async (phoneNumber: string, password: string) => {
    try {
      const response = await authService.login(phoneNumber, password);
      
      // Get user info from localStorage (already fetched in authService.login)
      const userInfo = authService.getCurrentUser();
      if (userInfo) {
        // Convert backend format to frontend format
        const formattedUser: User = {
          id: userInfo.id,
          fullName: userInfo.full_name,
          phoneNumber: userInfo.phone_number,
          passportSerial: userInfo.passport_serial,
          passportNumber: userInfo.passport_serial_number,
          isVerified: userInfo.is_verified || true,
        };
        setUser(formattedUser);
        localStorage.setItem('user', JSON.stringify(formattedUser));
      }
      
      return response;
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } finally {
      // Clear local storage and state regardless of API call success
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      setUser(null);
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    register,
    verify,
    setUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}