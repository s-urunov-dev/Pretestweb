import { apiService } from './api.service';
import { ENDPOINTS } from '../config/api.config';

export interface TestResult {
  id: number;
  booking: number;
  test_date: string;
  test_type: string;
  reading?: number | null;
  listening?: number | null;
  writing?: number | null;
  speaking?: number | null;
  overall: number;
  created_at: string;
}

export interface PaymentHistory {
  id: number;
  description: string;
  amount: string;
  payment_method: 'click' | 'cash';
  status: 'pending' | 'completed' | 'failed';
  created_at: string;
}

export interface DashboardStats {
  total_tests: number;
  average_score: number;
  upcoming_tests: number;
  best_score: number;
}

class DashboardService {
  // Get test results
  async getTestResults(): Promise<TestResult[]> {
    try {
      const response = await apiService.get<TestResult[]>(ENDPOINTS.TEST_RESULTS.LIST);
      return response;
    } catch (error) {
      console.error('DashboardService.getTestResults error:', error);
      // Return empty array on error
      return [];
    }
  }

  // Get payment history
  async getPaymentHistory(): Promise<PaymentHistory[]> {
    try {
      const response = await apiService.get<PaymentHistory[]>(ENDPOINTS.PAYMENTS.HISTORY);
      return response;
    } catch (error) {
      console.error('DashboardService.getPaymentHistory error:', error);
      // Return empty array on error
      return [];
    }
  }

  // Get dashboard stats
  async getDashboardStats(): Promise<DashboardStats | null> {
    try {
      const response = await apiService.get<DashboardStats>(ENDPOINTS.DASHBOARD.STATS);
      return response;
    } catch (error) {
      console.error('DashboardService.getDashboardStats error:', error);
      // Return null, will calculate on frontend
      return null;
    }
  }

  // Calculate stats from test results and bookings (fallback - DEPRECATED: backend now handles this)
  calculateStats(testResults: TestResult[], upcomingTestsCount: number): DashboardStats {
    const totalTests = testResults.length;
    const scores = testResults.map(r => r.overall).filter(s => s != null);
    const averageScore = scores.length > 0 
      ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length * 10) / 10
      : 0;
    const bestScore = scores.length > 0 ? Math.max(...scores) : 0;

    return {
      total_tests: totalTests,
      average_score: averageScore,
      upcoming_tests: upcomingTestsCount,
      best_score: bestScore,
    };
  }
}

export const dashboardService = new DashboardService();
