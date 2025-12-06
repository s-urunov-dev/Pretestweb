import { apiService } from './api.service';
import { ENDPOINTS } from '../config/api.config';

export interface TeamMember {
  id: number;
  full_name: string;
  job: string;
  experience: string;
  image: string;
}

export interface Partner {
  id: number;
  title: string;
  url: string;
  logo: string; // Partner logo URL
}

export interface Reel {
  id: number;
  title: string;
  description: string;
  url: string | null;
  video: string;
  thumbnail: string;
  score: string;
}

export interface SiteInfo {
  id: number;
  email: string;
  phone: string;
  address: string;
  location: string;
  telegram: string;
  instagram: string;
  facebook: string;
  youtube: string;
  linkedin: string;
  description: string;
}

class LandingService {
  // Get Team Members
  async getTeamMembers(): Promise<TeamMember[]> {
    try {
      const response = await apiService.get<TeamMember[]>(ENDPOINTS.LANDING.TEAM_MEMBERS);
      return response;
    } catch (error) {
      // Silently fail and return empty array - using mock data in components
      return [];
    }
  }

  // Get Partners
  async getPartners(): Promise<Partner[]> {
    try {
      const response = await apiService.get<Partner[]>(ENDPOINTS.LANDING.PARTNERS);
      return response;
    } catch (error) {
      // Silently fail and return empty array - using mock data in components
      return [];
    }
  }

  // Get Reels (Student Success Stories)
  async getReels(): Promise<Reel[]> {
    try {
      const response = await apiService.get<Reel[]>(ENDPOINTS.LANDING.REELS);
      return response;
    } catch (error) {
      // Silently fail and return empty array - using mock data in components
      return [];
    }
  }

  // Get Site Info
  async getSiteInfo(): Promise<SiteInfo | null> {
    try {
      const response = await apiService.get<SiteInfo[]>(ENDPOINTS.LANDING.SITE_INFO);
      // API returns array, we take first item
      return response && response.length > 0 ? response[0] : null;
    } catch (error) {
      // Silently fail and return null - using mock data in components
      return null;
    }
  }
}

export const landingService = new LandingService();