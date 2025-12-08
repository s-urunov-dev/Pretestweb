import { apiService } from './api.service';
import { ENDPOINTS } from '../config/api.config';

export interface TestResult {
  id: number;
  booking: number;
  reading_score: number | null;
  listening_score: number | null;
  writing_score: number | null;
  speaking_score: number | null;
  overall: string | null;
  pdf_file: string | null;
  created_at: string;
}

export interface TestResultDetail {
  id: string;
  reading: number;
  listening: number;
  writing: number;
  speaking: number;
  overall: number;
  pdf_file: string | null;
  created_at: string;
  session: {
    id: number;
    date: string;
    time: string;
    location: string;
  };
  test_type: {
    id: number;
    name: string;
    product_type: string;
  };
  user: {
    full_name: string;
    phone_number: string;
  };
}

class TestResultService {
  // Get all test results for current user
  async getTestResults(): Promise<TestResult[]> {
    try {
      const response = await apiService.get<TestResult[]>(ENDPOINTS.TEST_RESULTS.LIST);
      return response;
    } catch (error) {
      console.error('TestResultService.getTestResults error:', error);
      throw error;
    }
  }

  // Get test result detail by ID
  async getTestResultDetail(resultId: string): Promise<TestResultDetail> {
    try {
      const response = await apiService.get<TestResultDetail>(ENDPOINTS.TEST_RESULTS.DETAIL(resultId));
      return response;
    } catch (error) {
      console.error('TestResultService.getTestResultDetail error:', error);
      throw error;
    }
  }
}

export const testResultService = new TestResultService();