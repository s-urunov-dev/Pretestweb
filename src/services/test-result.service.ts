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
}

export const testResultService = new TestResultService();
