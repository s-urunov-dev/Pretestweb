import { apiService } from './api.service';
import { ENDPOINTS } from '../config/api.config';
import { 
  MOCK_PRODUCTS, 
  MOCK_SESSIONS, 
  MOCK_FEEDBACK_OPTIONS,
  MOCK_ABOUT_CARDS,
  MOCK_TEAM_MEMBERS,
  MOCK_INSTITUTIONS,
  MOCK_TESTIMONIALS,
  MOCK_FOOTER_INFO
} from '../data/mock-data';

// Product (Test Package) interface matching backend
export interface Product {
  id: number;
  name: string;
  product_type: 'daily' | 'full' | 'video';
  price: string;
  has_reading: boolean;
  has_listening: boolean;
  has_writing: boolean;
  has_speaking: boolean;
  has_invigilator: boolean;
}

// Test Session interface matching backend
export interface TestSession {
  id: number;
  product: Product;
  session_date: string;
  session_time: string;
  max_participants: number;
  available_slots: number;
  location?: string;
  location_url?: string;
  is_booked?: boolean; // Indicates if current user already booked this session
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  useMock?: boolean;
}

class PublicService {
  // Get all test packages (products)
  async getTestPackages(): Promise<ApiResponse<Product[]>> {
    try {
      const response = await apiService.get<Product[]>(ENDPOINTS.TESTS.LIST);
      return { success: true, data: response };
    } catch (error) {
      // Backend not available, use mock data
      return { success: true, data: MOCK_PRODUCTS, useMock: true };
    }
  }

  // Get test sessions with optional product filter
  async getTestSessions(productType?: string, productId?: number): Promise<ApiResponse<TestSession[]>> {
    try {
      let url = ENDPOINTS.SESSIONS.LIST;
      const params = new URLSearchParams();
      
      if (productId) {
        params.append('product_id', productId.toString());
      }
      
      if (params.toString()) {
        url = `${url}?${params.toString()}`;
      }
      
      const response = await apiService.get<TestSession[]>(url);
      
      // Filter by product type if specified (fallback if backend doesn't support product_id filter)
      let filteredData = response;
      if (productId && !params.toString().includes('product_id')) {
        // Client-side filter if backend doesn't support it
        filteredData = response.filter(session => session.product.id === productId);
      } else if (productType && productType !== 'all') {
        filteredData = response.filter(session => {
          if (productType === 'full-simulation') {
            return session.product.product_type === 'full';
          } else if (productType === 'daily-practice') {
            return session.product.product_type === 'daily';
          }
          return true;
        });
      }
      
      return { success: true, data: filteredData };
    } catch (error) {
      // Backend not available, use mock data
      let filteredData = MOCK_SESSIONS;
      if (productId) {
        filteredData = MOCK_SESSIONS.filter(session => session.product.id === productId);
      } else if (productType && productType !== 'all') {
        filteredData = MOCK_SESSIONS.filter(session => {
          if (productType === 'full-simulation') {
            return session.product.product_type === 'full';
          } else if (productType === 'daily-practice') {
            return session.product.product_type === 'daily';
          }
          return true;
        });
      }
      
      return { success: true, data: filteredData, useMock: true };
    }
  }

  // Get feedback options
  async getFeedbackOptions(): Promise<ApiResponse<any[]>> {
    try {
      const response = await apiService.get<any[]>(ENDPOINTS.FEEDBACK.OPTIONS);
      return { success: true, data: response };
    } catch (error) {
      // Backend not available, use mock data
      return { success: true, data: MOCK_FEEDBACK_OPTIONS, useMock: true };
    }
  }

  // Get about cards
  async getAboutCards(): Promise<ApiResponse<any[]>> {
    return { success: true, data: MOCK_ABOUT_CARDS, useMock: true };
  }

  // Get team members
  async getTeamMembers(): Promise<ApiResponse<any[]>> {
    return { success: true, data: MOCK_TEAM_MEMBERS, useMock: true };
  }

  // Get institutions
  async getInstitutions(): Promise<ApiResponse<any[]>> {
    return { success: true, data: MOCK_INSTITUTIONS, useMock: true };
  }

  // Get testimonials
  async getTestimonials(): Promise<ApiResponse<any[]>> {
    return { success: true, data: MOCK_TESTIMONIALS, useMock: true };
  }

  // Get footer info
  async getFooterInfo(): Promise<ApiResponse<any>> {
    return { 
      success: true, 
      data: MOCK_FOOTER_INFO,
      useMock: true
    };
  }
}

export const publicService = new PublicService();