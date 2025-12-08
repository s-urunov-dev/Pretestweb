// API Configuration
export const API_CONFIG = {
  BASE_URL: 'https://api.pre-test.uz/api/v1',
  TIMEOUT: 30000,
};

export const ENDPOINTS = {
  // Auth
  AUTH: {
    REGISTER: '/register/',
    VERIFY: '/verify/',
    RESEND_OTP: '/resend-sms/',
    LOGIN: '/login/',
    LOGOUT: '/logout/',
    REFRESH: '/token/refresh/',
    ME: '/me/',
    FORGET_PASSWORD: '/forget-password/',
    RESET_PASSWORD_SMS: '/reset-password-sms/',
    UPDATE_PROFILE: '/user/update/',
    UPDATE_PASSWORD: '/user/password-update/',
  },
  
  // Tests (Products)
  TESTS: {
    LIST: '/tests/',
    DETAIL: (id: number) => `/tests/${id}/`,
  },
  
  // Sessions
  SESSIONS: {
    LIST: '/sessions/',
    DETAIL: (id: number) => `/sessions/${id}/`,
  },
  
  // Bookings
  BOOKINGS: {
    LIST: '/bookings/list/',
    CREATE: '/bookings/create/',
    DETAIL: (id: number) => `/bookings/${id}/`,
    DELETE: (id: number) => `/bookings/${id}/`,
  },
  
  // Feedback
  FEEDBACK: {
    OPTIONS: '/feedback-options/',
    CREATE: '/feedbacks/create/',
    LIST: '/feedbacks/list/',
    STATISTICS: '/feedback/statistics/',
    ADMIN_UPLOAD: (id: string) => `/feedbacks/${id}/admin-upload/`,
    DOWNLOAD: (id: number) => `/video-feedback/${id}/download/`,
  },
  
  // Test Results
  TEST_RESULTS: {
    LIST: '/test/result/',
    DETAIL: (id: string) => `/test/result/${id}/`,
  },
  
  // Payments
  PAYMENTS: {
    CREATE: '/payments/create/',
    GET_OR_CREATE: '/payments/get-or-create/',
    HISTORY: '/payments/history/',
    CLICK_PREPARE: '/payments/click/prepare/',
    CLICK_COMPLETE: '/payments/click/complete/',
    GET_URL: '/payments/url/', // ✅ Get payment URL endpoint
  },
  
  // Dashboard
  DASHBOARD: {
    STATS: '/dashboard/stats/',
  },
  
  // Landing Page
  LANDING: {
    TEAM_MEMBERS: '/team/members/',
    PARTNERS: '/partners/',
    REELS: '/reels/',
    SITE_INFO: '/site/info/',
  },
};