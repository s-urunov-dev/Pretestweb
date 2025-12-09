/**
 * Google Analytics tracking utilities
 * Use these functions to track custom events throughout the application
 */

// Track custom events
export const trackEvent = (
  eventName: string,
  eventParams?: Record<string, any>
) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, eventParams);
  }
};

// Track page views (automatically handled by App.tsx, but can be used manually)
export const trackPageView = (pagePath: string, pageTitle?: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', 'G-0WZFE3PSMS', {
      page_path: pagePath,
      page_title: pageTitle,
    });
  }
};

// Track user login
export const trackLogin = (method: string = 'email') => {
  trackEvent('login', {
    method,
  });
};

// Track user registration
export const trackSignUp = (method: string = 'email') => {
  trackEvent('sign_up', {
    method,
  });
};

// Track test booking
export const trackBookTest = (testType: string, price: number) => {
  trackEvent('book_test', {
    test_type: testType,
    value: price,
    currency: 'USD',
  });
};

// Track payment initiation
export const trackBeginCheckout = (testType: string, price: number) => {
  trackEvent('begin_checkout', {
    test_type: testType,
    value: price,
    currency: 'USD',
  });
};

// Track successful purchase
export const trackPurchase = (
  transactionId: string,
  testType: string,
  price: number
) => {
  trackEvent('purchase', {
    transaction_id: transactionId,
    value: price,
    currency: 'USD',
    items: [
      {
        item_name: testType,
        item_category: 'IELTS Test',
        price: price,
        quantity: 1,
      },
    ],
  });
};

// Track video feedback submission
export const trackFeedbackSubmission = (essayType: string) => {
  trackEvent('feedback_submission', {
    essay_type: essayType,
  });
};

// Track test result view
export const trackViewTestResult = (resultId: string, overallScore?: number) => {
  trackEvent('view_test_result', {
    result_id: resultId,
    overall_score: overallScore,
  });
};

// Track button clicks
export const trackButtonClick = (buttonName: string, location: string) => {
  trackEvent('button_click', {
    button_name: buttonName,
    location: location,
  });
};

// Track form submissions
export const trackFormSubmit = (formName: string, success: boolean) => {
  trackEvent('form_submit', {
    form_name: formName,
    success: success,
  });
};

// Track errors
export const trackError = (errorMessage: string, errorLocation: string) => {
  trackEvent('error', {
    error_message: errorMessage,
    error_location: errorLocation,
  });
};
