import { apiService } from './api.service';
import { ENDPOINTS } from '../config/api.config';
import { Product, TestSession } from './public.service';

export interface BookingSession {
  id: number;
  product: Product;
  session_date: string;
  session_time: string;
  max_participants: number;
  available_slots: number;
}

export interface Booking {
  id: number;
  session: BookingSession; // Always populated by backend
  payment_method: 'click' | 'cash';
  payment_status: 'pending' | 'paid' | 'cancelled';
  created_at: string;
  user: string;
  // New fields from backend
  has_result?: boolean;
  expires_at: string; // ISO timestamp for expiration
  is_expired: boolean;
  original_price?: string;
  discount_amount?: string;
  final_price?: string;
  promo_code_applied?: string | null;
  payment_id?: string; // UUID from Click payment
}

export interface CreateBookingRequest {
  session_id: number;
  payment_method: 'click' | 'cash';
  promo_code_str?: string;
}

export interface CreateBookingResponse {
  id: number;
  session: number;
  payment_method: string;
  payment_status: string;
  created_at: string;
  redirect_url?: string; // For Click payment
  original_price?: string;
  discount_amount?: string;
  final_price?: string;
  promo_code_applied?: string | null;
}

class BookingService {
  // Get all bookings for current user
  async getBookings(type?: 'future' | 'past'): Promise<Booking[]> {
    try {
      const url = type ? `${ENDPOINTS.BOOKINGS.LIST}?type=${type}` : ENDPOINTS.BOOKINGS.LIST;
      const response = await apiService.get<Booking[]>(url);
      return response;
    } catch (error) {
      console.error('BookingService.getBookings error:', error);
      return [];
    }
  }

  // Create new booking
  async createBooking(data: CreateBookingRequest): Promise<CreateBookingResponse> {
    try {
      const response = await apiService.post<CreateBookingResponse>(
        ENDPOINTS.BOOKINGS.CREATE,
        data
      );
      return response;
    } catch (error) {
      console.error('BookingService.createBooking error:', error);
      throw error;
    }
  }
}

export const bookingService = new BookingService();