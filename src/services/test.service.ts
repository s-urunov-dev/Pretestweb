import { apiService } from './api.service';
import { ENDPOINTS } from '../config/api.config';

export interface BookTestData {
  testPackageId: string;
  sessionId: string;
  time: string;
  paymentMethod: 'click' | 'cash';
}

export interface BookTestResponse {
  bookingId: string;
  paymentUrl?: string;
  expiresAt?: string;
}

export interface RescheduleTestData {
  sessionId: string;
  time: string;
}

export interface RescheduleTestResponse {
  bookingId: string;
  newDate: string;
  newTime: string;
}

class TestService {
  async bookTest(data: BookTestData): Promise<BookTestResponse> {
    const response = await apiService.post<{
      success: boolean;
      message: string;
      data: BookTestResponse;
    }>(ENDPOINTS.TESTS.BOOK, data);
    return response.data;
  }

  async rescheduleTest(bookingId: string, data: RescheduleTestData): Promise<RescheduleTestResponse> {
    const response = await apiService.put<{
      success: boolean;
      message: string;
      data: RescheduleTestResponse;
    }>(ENDPOINTS.TESTS.RESCHEDULE(bookingId), data);
    return response.data;
  }

  async cancelTest(bookingId: string): Promise<void> {
    await apiService.delete(ENDPOINTS.TESTS.CANCEL(bookingId));
  }
}

export const testService = new TestService();
