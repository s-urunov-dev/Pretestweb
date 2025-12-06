import { apiService } from './api.service';
import { ENDPOINTS } from '../config/api.config';

export interface VideoFeedbackOption {
  id: number;
  name: string;
  price: string;
}

export interface VideoFeedbackRequest {
  id: number;
  feedback_type: number;
  related_booking: number | null;
  payment: string | null;
  payment_status: string | null; // 'pending' | 'paid' | 'cancelled' | 'completed' | null
  payment_method: string | null;
  uploaded_file: string | null;
  writing: string | null;
  admin_video_response: string | null;
  created_at: string;
  is_completed: boolean;
  score: number | null;
  examiner_name: string | null;
  feedback_description: string | null;
  user: string;
}

export interface FeedbackStatistics {
  total_submissions: number;
  completed_feedback: number;
  average_score: string;
}

export interface CreateFeedbackData {
  feedback_type: number;
  related_booking?: number;
  writing?: string;
  uploaded_file?: File;
}

class FeedbackService {
  // Get feedback options
  async getFeedbackOptions(): Promise<VideoFeedbackOption[]> {
    try {
      const response = await apiService.get<VideoFeedbackOption[]>(ENDPOINTS.FEEDBACK.OPTIONS);
      return response;
    } catch (error) {
      console.error('FeedbackService.getFeedbackOptions error:', error);
      throw error;
    }
  }

  // Get all feedback requests for current user
  async getFeedbackRequests(): Promise<VideoFeedbackRequest[]> {
    try {
      const response = await apiService.get<VideoFeedbackRequest[]>(ENDPOINTS.FEEDBACK.LIST);
      return response;
    } catch (error) {
      console.error('FeedbackService.getFeedbackRequests error:', error);
      throw error;
    }
  }

  // Create new feedback request
  async createFeedbackRequest(data: CreateFeedbackData): Promise<VideoFeedbackRequest> {
    try {
      // If there's a file, use FormData
      if (data.uploaded_file) {
        const formData = new FormData();
        formData.append('feedback_type', data.feedback_type.toString());
        if (data.related_booking) {
          formData.append('related_booking', data.related_booking.toString());
        }
        if (data.writing) {
          formData.append('writing', data.writing);
        }
        formData.append('uploaded_file', data.uploaded_file);
        
        const response = await apiService.upload<VideoFeedbackRequest>(
          ENDPOINTS.FEEDBACK.CREATE,
          formData
        );
        return response;
      } else {
        // Otherwise use JSON
        const response = await apiService.post<VideoFeedbackRequest>(
          ENDPOINTS.FEEDBACK.CREATE,
          data
        );
        return response;
      }
    } catch (error) {
      console.error('FeedbackService.createFeedbackRequest error:', error);
      throw error;
    }
  }

  // Get feedback statistics
  async getFeedbackStatistics(): Promise<FeedbackStatistics> {
    try {
      const response = await apiService.get<FeedbackStatistics>(ENDPOINTS.FEEDBACK.STATISTICS);
      return response;
    } catch (error) {
      console.error('FeedbackService.getFeedbackStatistics error:', error);
      // Return default stats on error
      return {
        total_submissions: 0,
        completed_feedback: 0,
        average_score: '0.0',
      };
    }
  }

  // Download feedback video
  async downloadVideo(feedbackId: number): Promise<void> {
    try {
      const downloadUrl = `${apiService['baseURL']}${ENDPOINTS.FEEDBACK.DOWNLOAD(feedbackId)}`;
      const token = localStorage.getItem('access_token');
      
      // Open download URL in new window with auth header
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `feedback_${feedbackId}.mp4`;
      link.target = '_blank';
      
      // For API that requires auth header, we need to fetch and download
      const response = await fetch(downloadUrl, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Download failed');
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      link.href = url;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('FeedbackService.downloadVideo error:', error);
      throw error;
    }
  }
}

export const feedbackService = new FeedbackService();