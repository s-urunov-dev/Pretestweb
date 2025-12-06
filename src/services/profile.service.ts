import { apiService } from './api.service';
import { ENDPOINTS } from '../config/api.config';
import { User } from './auth.service';

export interface UpdateProfileData {
  fullName?: string;
  email?: string;
  dateOfBirth?: string;
  targetScore?: number;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

class ProfileService {
  async getProfile(): Promise<User> {
    const response = await apiService.get<{ success: boolean; data: User }>(
      ENDPOINTS.PROFILE.GET
    );
    
    // Update localStorage with latest user data
    localStorage.setItem('user', JSON.stringify(response.data));
    
    return response.data;
  }

  async updateProfile(data: UpdateProfileData): Promise<User> {
    const response = await apiService.put<{
      success: boolean;
      message: string;
      data: User;
    }>(ENDPOINTS.PROFILE.UPDATE, data);
    
    // Update localStorage with latest user data
    localStorage.setItem('user', JSON.stringify(response.data));
    
    return response.data;
  }

  async changePassword(data: ChangePasswordData): Promise<void> {
    await apiService.put(ENDPOINTS.PROFILE.CHANGE_PASSWORD, data);
  }
}

export const profileService = new ProfileService();
