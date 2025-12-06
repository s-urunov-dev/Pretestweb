import { apiService } from './api.service';
import { ENDPOINTS } from '../config/api.config';

export interface CreatePaymentRequest {
  booking_id?: number;
  feedback_request_id?: number;
  payment_method: 'click' | 'cash';
  promo_code_str?: string;
}

export interface CreatePaymentResponse {
  payment_id: string;
  booking_id: number | null;
  feedback_request_id: number | null;
  amount: string;
  payment_method: string;
  status: string;
  redirect_url?: string;
  created_at: string;
  is_existing?: boolean;  // ✅ Track if payment was reused
  original_amount?: string;
  discount_amount?: string;
  promo_code_applied?: string | null;
}

export interface GetPaymentUrlRequest {
  payment_id: string;
}

export interface GetPaymentUrlResponse {
  payment_id: string;
  payment_url: string;
  status: string;
  amount: string;
}

class PaymentService {
  // Create payment (for Click)
  async createPayment(data: CreatePaymentRequest): Promise<CreatePaymentResponse> {
    try {
      const response = await apiService.post<CreatePaymentResponse>(
        ENDPOINTS.PAYMENTS.CREATE,
        data
      );
      return response;
    } catch (error) {
      console.error('PaymentService.createPayment error:', error);
      throw error;
    }
  }

  // ✅ Get or Create Payment - prevents duplicate payments
  async getOrCreatePayment(data: CreatePaymentRequest): Promise<CreatePaymentResponse> {
    try {
      const response = await apiService.post<CreatePaymentResponse>(
        ENDPOINTS.PAYMENTS.GET_OR_CREATE,
        data
      );
      return response;
    } catch (error) {
      console.error('PaymentService.getOrCreatePayment error:', error);
      throw error;
    }
  }

  // ✅ Get payment URL for existing payment
  async getPaymentUrl(paymentId: string): Promise<GetPaymentUrlResponse> {
    try {
      const response = await apiService.post<GetPaymentUrlResponse>(
        ENDPOINTS.PAYMENTS.GET_URL,
        { payment_id: paymentId }
      );
      return response;
    } catch (error: any) {
      console.error('PaymentService.getPaymentUrl error:', error);
      
      // Handle 404 - endpoint not found, try alternative endpoints
      if (error.status === 404) {
        console.warn('⚠️ Payment URL endpoint not found (404). Trying alternative endpoints...');
        
        // Try alternative endpoints
        const alternatives = [
          '/payments/get-url/',
          '/payments/payment-url/',
          `/payments/${paymentId}/url/`,
          '/click/payment-url/',
        ];
        
        for (const altEndpoint of alternatives) {
          try {
            console.log('Trying alternative endpoint:', altEndpoint);
            const response = await apiService.post<GetPaymentUrlResponse>(
              altEndpoint,
              { payment_id: paymentId }
            );
            console.log('✅ Success with alternative endpoint:', altEndpoint);
            return response;
          } catch (altError) {
            // Continue to next alternative
            continue;
          }
        }
        
        console.error('❌ All alternative endpoints failed. Payment URL feature is not available.');
        throw new Error('Payment URL endpoint not available. Please contact support.');
      }
      
      throw error;
    }
  }
}

export const paymentService = new PaymentService();