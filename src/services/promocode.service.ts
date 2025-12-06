import axios from 'axios';

const API_BASE_URL = 'https://api.pre-test.uz/api';

export interface PromocodeValidationRequest {
  code: string;
  session_id: number;
}

export interface PromocodeValidationResponse {
  code: string;
  discount_type: string;
  discount_value: string;
  original_price: string;
  discount_amount: string;
  final_price: string;
  is_valid: boolean;
}

export const promocodeService = {
  async validatePromocode(data: PromocodeValidationRequest): Promise<PromocodeValidationResponse> {
    const token = localStorage.getItem('accessToken');
    
    const response = await axios.post(
      `${API_BASE_URL}/v1/promocode/validate/`,
      data,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    
    return response.data;
  },
};