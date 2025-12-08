import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from './DashboardLayout';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Calendar, Clock, TrendingUp, Award, CheckCircle2, BookOpen, MapPin, X, AlertCircle, Tag, ExternalLink } from 'lucide-react';
import { publicService, Product, TestSession } from '../services/public.service';
import { bookingService, Booking, BookingSession } from '../services/booking.service';
import { dashboardService, TestResult, PaymentHistory, DashboardStats } from '../services/dashboard.service';
import { paymentService } from '../services/payment.service';
import { promocodeService, PromocodeValidationResponse } from '../services/promocode.service';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';
import clickLogo from '../assets/click-logo.svg';
import { useLanguage } from '../contexts/LanguageContext';
import { Input } from '../components/ui/input';
import { AdaptiveImage } from '../components/AdaptiveImage';
import { resolveImageSrc } from '../utils/imageResolver';

interface BookingData {
  productId?: number;
  productName?: string;
  productPrice?: number;
  sessionId?: number;
  step?: 'test' | 'session' | 'payment';
}

export function DashboardPage() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingStep, setBookingStep] = useState<'test' | 'session' | 'payment'>('test');
  const [selectedTest, setSelectedTest] = useState<Product | null>(null);
  const [selectedSession, setSelectedSession] = useState<TestSession | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedTestDetails, setSelectedTestDetails] = useState<any | null>(null);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [rescheduleTest, setRescheduleTest] = useState<any | null>(null);
  
  // API states
  const [products, setProducts] = useState<Product[]>([]);
  const [sessions, setSessions] = useState<TestSession[]>([]);
  const [futureBookings, setFutureBookings] = useState<Booking[]>([]);
  const [pastBookings, setPastBookings] = useState<Booking[]>([]);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [paymentHistory, setPaymentHistory] = useState<PaymentHistory[]>([]);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [isLoadingSessions, setIsLoadingSessions] = useState(false);
  const [isLoadingBookings, setIsLoadingBookings] = useState(true);
  const [isLoadingTestResults, setIsLoadingTestResults] = useState(true);
  const [isLoadingPayments, setIsLoadingPayments] = useState(true);
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [isCreatingBooking, setIsCreatingBooking] = useState(false);
  
  // Promocode states
  const [promoCode, setPromoCode] = useState('');
  const [promoValidation, setPromoValidation] = useState<PromocodeValidationResponse | null>(null);
  const [isValidatingPromo, setIsValidatingPromo] = useState(false);
  const [promoError, setPromoError] = useState('');
  
  // Countdown timers for pending bookings
  const [countdowns, setCountdowns] = useState<Record<number, { hours: number; minutes: number; seconds: number }>>({});

  // Load bookings on component mount
  useEffect(() => {
    loadBookings();
    loadTestResults();
    loadPaymentHistory();
    loadDashboardStats();
  }, []);

  const loadProducts = async () => {
    try {
      setIsLoadingProducts(true);
      const response = await publicService.getTestPackages();
      if (response.success && response.data) {
        setProducts(response.data);
      }
    } catch (error) {
      console.error('Failed to load products:', error);
      toast.error('Failed to load test packages');
    } finally {
      setIsLoadingProducts(false);
    }
  };

  const loadSessions = async (productId: number) => {
    try {
      setIsLoadingSessions(true);
      const response = await publicService.getTestSessions(undefined, productId);
      if (response.success && response.data) {
        setSessions(response.data);
      }
    } catch (error) {
      console.error('Failed to load sessions:', error);
      toast.error('Failed to load available sessions');
    } finally {
      setIsLoadingSessions(false);
    }
  };

  const loadBookings = async () => {
    try {
      setIsLoadingBookings(true);
      // Load future and past bookings separately
      const [futureData, pastData] = await Promise.all([
        bookingService.getBookings('future'),
        bookingService.getBookings('past'),
      ]);
      
      setFutureBookings(futureData);
      setPastBookings(pastData);
    } catch (error) {
      console.error('Failed to load bookings:', error);
    } finally {
      setIsLoadingBookings(false);
    }
  };

  const loadTestResults = async () => {
    try {
      setIsLoadingTestResults(true);
      const data = await dashboardService.getTestResults();
      setTestResults(data);
    } catch (error) {
      console.error('Failed to load test results:', error);
      toast.error('Failed to load test results. Please try again.');
    } finally {
      setIsLoadingTestResults(false);
    }
  };

  const loadPaymentHistory = async () => {
    try {
      setIsLoadingPayments(true);
      const data = await dashboardService.getPaymentHistory();
      setPaymentHistory(data);
    } catch (error) {
      console.error('Failed to load payment history:', error);
    } finally {
      setIsLoadingPayments(false);
    }
  };

  const loadDashboardStats = async () => {
    try {
      setIsLoadingStats(true);
      const stats = await dashboardService.getDashboardStats();
      
      if (stats) {
        setDashboardStats(stats);
      }
    } catch (error) {
      console.error('Failed to load dashboard stats:', error);
    } finally {
      setIsLoadingStats(false);
    }
  };

  // Load products when modal opens at test step
  useEffect(() => {
    if (showBookingModal && bookingStep === 'test') {
      loadProducts();
    }
  }, [showBookingModal, bookingStep]);

  // Load sessions when moving to session step
  useEffect(() => {
    if (showBookingModal && bookingStep === 'session' && selectedTest) {
      loadSessions(selectedTest.id);
    }
  }, [showBookingModal, bookingStep, selectedTest]);

  const handleTestSelect = (type: Product) => {
    setSelectedTest(type);
  };

  const handleContinueToSchedule = () => {
    if (selectedTest) {
      setBookingStep('session');
    }
  };

  const handleSessionSelect = (sessionId: number, time: string) => {
    setSelectedSession({ id: sessionId, time });
  };

  const handleContinueToPayment = () => {
    if (selectedSession) {
      setBookingStep('payment');
    }
  };

  const handleValidatePromocode = async () => {
    if (!promoCode.trim()) {
      setPromoError('Please enter a promo code');
      return;
    }
    
    if (!selectedSession) {
      setPromoError('Please select a session first');
      return;
    }

    try {
      setIsValidatingPromo(true);
      setPromoError('');
      
      const validation = await promocodeService.validatePromocode({
        code: promoCode,
        session_id: selectedSession.id,
      });

      setPromoValidation(validation);
      toast.success(t.dashboard.promoApplied);
    } catch (error: any) {
      const errorMessage = error?.response?.data?.code?.[0];
      
      // Map backend errors to translation keys
      let translatedError = t.dashboard.promoInvalid;
      if (errorMessage) {
        if (errorMessage.includes('expired') || errorMessage.includes('Expired')) {
          translatedError = t.dashboard.promoExpired;
        } else if (errorMessage.includes('already used') || errorMessage.includes('Already used')) {
          translatedError = t.dashboard.promoAlreadyUsed;
        } else if (errorMessage.includes('maximum') || errorMessage.includes('limit')) {
          translatedError = t.dashboard.promoMaxUsed;
        }
      }
      
      setPromoError(translatedError);
      setPromoValidation(null);
      toast.error(translatedError);
    } finally {
      setIsValidatingPromo(false);
    }
  };

  const handleClearPromocode = () => {
    setPromoCode('');
    setPromoValidation(null);
    setPromoError('');
  };

  const handlePaymentMethod = async (method: 'click' | 'cash') => {
    if (!selectedSession || !selectedTest) return;

    try {
      setIsCreatingBooking(true);
      
      // Step 1: Create booking with promo code
      const booking = await bookingService.createBooking({
        session_id: selectedSession.id,
        payment_method: method,
        promo_code_str: promoValidation?.code, // Add promo code
      });

      toast.success(t.dashboard.bookingCreated);
      
      // Step 2: Create payment record
      try {
        const paymentResponse = await paymentService.createPayment({
          booking_id: booking.id,
          amount: selectedTest.price.toString(),
          payment_method: method,
        });

        console.log('Payment created:', paymentResponse);

        // Step 3: Handle payment method
        if (method === 'click' && paymentResponse.redirect_url) {
          toast.info(t.dashboard.redirectingToClick);
          // Redirect to Click payment page
          window.location.href = paymentResponse.redirect_url;
        } else if (method === 'click') {
          toast.error('Payment redirect URL not available. Please contact support.');
        } else {
          // Cash payment - show message
          toast.success(t.dashboard.bookingSaved);
        }
      } catch (paymentError) {
        console.error('Failed to create payment:', paymentError);
        toast.error('Booking created but payment initialization failed. Please contact support.');
      }

      // Reload bookings list and sessions
      await loadBookings();
      await loadPaymentHistory();
      if (selectedTest) {
        await loadSessions(selectedTest.id); // Refresh session list to update slots
      }

      setShowBookingModal(false);
      resetBooking();
    } catch (error: any) {
      console.error('Failed to create booking:', error);
      
      // Handle specific backend errors
      const errorMessage = error?.response?.data?.session_id?.[0] || 
                           error?.response?.data?.non_field_errors?.[0] ||
                           error?.response?.data?.detail ||
                           error?.message;
      
      if (errorMessage) {
        // Check for specific error messages from backend
        if (errorMessage.includes('already booked') || errorMessage.includes('You have already booked')) {
          toast.error(t.dashboard.alreadyBookedError);
          // Reload sessions to update is_booked status
          if (selectedTest) {
            await loadSessions(selectedTest.id);
          }
        } else if (errorMessage.includes('full') || errorMessage.includes('No slots available')) {
          toast.error(t.dashboard.sessionFullError);
          // Reload sessions to update available_slots
          if (selectedTest) {
            await loadSessions(selectedTest.id);
          }
        } else {
          toast.error(errorMessage);
        }
      } else {
        toast.error(t.dashboard.bookingFailed);
      }
    } finally {
      setIsCreatingBooking(false);
    }
  };

  const resetBooking = () => {
    setBookingStep('test');
    setSelectedTest(null);
    setSelectedSession(null);
    setPromoCode('');
    setPromoValidation(null);
    setPromoError('');
  };

  // Helper function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      weekday: 'long'
    };
    return date.toLocaleDateString('en-US', options);
  };

  // Helper function to format time
  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  // Compute upcoming tests from bookings - only paid bookings
  const upcomingTests = futureBookings
    .filter(b => b.payment_status === 'paid')
    .map(b => ({
      id: b.id,
      type: b.session.product.name,
      date: formatDate(b.session.session_date),
      time: formatTime(b.session.session_time),
      location: b.session.location || 'Test Center',
      locationUrl: b.session.location_url || 'https://maps.google.com',
      status: b.payment_status,
      originalPrice: b.original_price,
      discountAmount: b.discount_amount,
      finalPrice: b.final_price,
      promoCodeApplied: b.promo_code_applied,
    }));

  // Compute pending bookings (not paid yet) - Backend now handles expiration logic
  const pendingBookings = futureBookings
    .filter(b => b.payment_status === 'pending' && !b.is_expired)
    .map(b => ({
      id: b.id,
      type: b.session.product.name,
      date: formatDate(b.session.session_date),
      time: formatTime(b.session.session_time),
      location: b.session.location || 'Test Center',
      locationUrl: b.session.location_url || 'https://maps.google.com',
      status: b.payment_status,
      paymentMethod: b.payment_method,
      expiresAt: new Date(b.expires_at), // ✅ Calculate countdown from this timestamp
      originalPrice: b.original_price,
      discountAmount: b.discount_amount,
      finalPrice: b.final_price,
      promoCodeApplied: b.promo_code_applied,
    }));

  // Calculate countdown from expires_at timestamp
  const calculateTimeLeft = (expiresAt: Date) => {
    const now = new Date();
    const difference = expiresAt.getTime() - now.getTime();
    
    if (difference <= 0) {
      return { hours: 0, minutes: 0, seconds: 0 };
    }
    
    const totalSeconds = Math.floor(difference / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    return { hours, minutes, seconds };
  };

  // Update countdown timers every second
  useEffect(() => {
    // Initial calculation
    const updateCountdowns = () => {
      const newCountdowns: Record<number, { hours: number; minutes: number; seconds: number }> = {};
      pendingBookings.forEach(booking => {
        newCountdowns[booking.id] = calculateTimeLeft(booking.expiresAt);
      });
      setCountdowns(newCountdowns);
    };

    // Update immediately
    updateCountdowns();

    // Update every second
    const interval = setInterval(() => {
      updateCountdowns();
      
      // Check if any booking expired
      const anyExpired = Object.values(countdowns).some(
        c => c.hours === 0 && c.minutes === 0 && c.seconds === 0
      );
      if (anyExpired) {
        loadBookings();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [futureBookings]);

  // Compute stats values - Backend provides accurate stats
  const statsValues = {
    totalTests: dashboardStats?.total_tests ?? 0,
    averageScore: dashboardStats?.average_score ?? 0,
    upcomingTests: dashboardStats?.upcoming_tests ?? 0,
    bestScore: dashboardStats?.best_score ?? 0,
  };

  // Compute completed bookings (past sessions) that don't have results yet
  // Backend now provides has_result field
  const completedBookingsWithoutResults = pastBookings
    .filter(b => b.payment_status === 'paid' && !b.has_result)
    .map(b => ({
      id: b.id,
      test_type: b.session.product.name,
      test_date: b.session.session_date,
      booking: b.id,
      reading: null,
      listening: null,
      writing: null,
      speaking: null,
      overall: null as any,
      created_at: b.created_at,
    }));

  // Combine test results with completed bookings without results
  const allPreviousTests = [
    ...testResults,
    ...completedBookingsWithoutResults
  ].sort((a, b) => {
    // Sort by date descending (newest first)
    return new Date(b.test_date).getTime() - new Date(a.test_date).getTime();
  });

  return (
    <DashboardLayout currentPage="dashboard">
      <div className="space-y-6">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-2xl sm:text-3xl mb-2 text-[#182966]">
            {t.dashboard.welcomeBack}, {user?.fullName || 'User'}!
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            {t.dashboard.progressSubtitle}
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          {[
            { icon: BookOpen, label: t.dashboard.totalTests, value: statsValues.totalTests.toString(), color: '#182966' },
            { icon: TrendingUp, label: t.dashboard.averageScore, value: statsValues.averageScore.toFixed(1), color: '#182966' },
            { icon: Calendar, label: t.dashboard.upcomingTests, value: statsValues.upcomingTests.toString(), color: '#182966' },
            { icon: Award, label: t.dashboard.bestScore, value: statsValues.bestScore.toFixed(1), color: '#182966' },
          ].map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="p-3 sm:p-4 lg:p-6 hover:shadow-lg transition-shadow">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                    <div className="w-full">
                      <p className="text-xs sm:text-sm text-gray-600 mb-1">{stat.label}</p>
                      <p className="text-xl sm:text-2xl lg:text-3xl text-[#182966]">{stat.value}</p>
                    </div>
                    <div className="p-2 sm:p-3 rounded-lg sm:rounded-xl bg-[#182966]/10 self-end sm:self-auto">
                      <Icon className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-[#182966]" />
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Pending Bookings (Awaiting Payment) */}
        {pendingBookings.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
          >
            <h2 className="text-xl sm:text-2xl mb-4 text-[#182966]">{t.dashboard.pendingBookings}</h2>
            <div className="space-y-4">
              {pendingBookings.map((booking) => (
                <Card key={booking.id} className="p-4 sm:p-6 hover:shadow-lg transition-shadow border-l-4 border-yellow-500">
                  <div className="flex flex-col gap-3 sm:gap-4">
                    <div className="flex flex-col gap-3 sm:gap-4">
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 mb-2">
                          <AlertCircle className="h-5 w-5 text-yellow-500" />
                          <h3 className="text-base sm:text-lg text-[#182966]">{booking.type}</h3>
                          <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
                            {t.dashboard.paymentPending}
                          </span>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:gap-3 text-gray-600 mb-3">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="h-5 w-5 text-[#182966]" />
                            <span className="font-medium text-[#182966]">{booking.date}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Clock className="h-5 w-5 text-[#182966]" />
                            <span className="font-medium text-[#182966]">{booking.time}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <MapPin className="h-5 w-5 text-[#182966]" />
                            <span className="font-medium text-[#182966]">{booking.location}</span>
                          </div>
                        </div>
                        
                        {/* Price - Compact inline format */}
                        {booking.finalPrice && (
                          <div className="flex items-center gap-2 flex-wrap text-sm mb-3">
                            <span className="text-gray-600">{t.dashboard.total}:</span>
                            <span className="font-bold text-[#182966]">
                              {parseFloat(booking.finalPrice).toLocaleString()} so'm
                            </span>
                            {booking.discountAmount && parseFloat(booking.discountAmount) > 0 && (
                              <>
                                <span className="text-gray-400 line-through text-xs">
                                  {parseFloat(booking.originalPrice).toLocaleString()} so'm
                                </span>
                                {booking.promoCodeApplied && (
                                  <span className="px-1.5 py-0.5 text-xs rounded bg-green-100 text-green-700 uppercase font-medium">
                                    {booking.promoCodeApplied}
                                  </span>
                                )}
                              </>
                            )}
                          </div>
                        )}
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                          <p className="text-sm text-yellow-800 mb-1">
                            {booking.paymentMethod === 'cash' ? (
                              <>
                                <strong>Cash Payment:</strong> Please complete payment at our office within{' '}
                                <strong>
                                  {countdowns[booking.id] ? (
                                    countdowns[booking.id].hours > 0 || countdowns[booking.id].minutes > 0
                                      ? `${countdowns[booking.id].hours}h ${countdowns[booking.id].minutes}m ${countdowns[booking.id].seconds}s`
                                      : `${countdowns[booking.id].seconds}s`
                                  ) : 'Loading...'}
                                </strong>
                              </>
                            ) : (
                              <>
                                <strong>Online Payment:</strong> Complete payment within{' '}
                                <strong>
                                  {countdowns[booking.id] ? (
                                    countdowns[booking.id].hours > 0 || countdowns[booking.id].minutes > 0
                                      ? `${countdowns[booking.id].hours}h ${countdowns[booking.id].minutes}m ${countdowns[booking.id].seconds}s`
                                      : `${countdowns[booking.id].seconds}s`
                                  ) : 'Loading...'}
                                </strong>
                                {' '}or booking will expire
                              </>
                            )}
                          </p>
                          <p className="text-xs text-yellow-700">
                            Expires: {formatDate(booking.expiresAt.toISOString())} at {formatTime(booking.expiresAt.toTimeString().split(' ')[0])}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2">
                      {booking.paymentMethod === 'click' && (
                        <Button
                          className="bg-yellow-600 hover:bg-yellow-700 w-full sm:w-auto"
                          size="sm"
                          onClick={async () => {
                            if (!booking.id) {
                              toast.error('Booking ID not found');
                              return;
                            }

                            // Get payment_id from booking
                            const bookingData = futureBookings.find(b => b.id === booking.id);
                            const paymentId = bookingData?.payment_id;

                            if (!paymentId) {
                              toast.error('Payment ID not found. Please contact support.');
                              return;
                            }

                            try {
                              toast.loading('Getting payment URL...', { id: 'payment-url' });
                              
                              console.log('🔵 Requesting payment URL for payment_id:', paymentId);
                              
                              const paymentUrlResponse = await paymentService.getPaymentUrl(paymentId);
                              
                              console.log('✅ Payment URL response:', paymentUrlResponse);
                              console.log('🔗 Redirecting to:', paymentUrlResponse.payment_url);
                              
                              toast.success('Redirecting to Click payment...', { id: 'payment-url' });
                              
                              // Small delay to see the toast and logs
                              await new Promise(resolve => setTimeout(resolve, 1000));
                              
                              // Redirect to Click payment page
                              window.location.href = paymentUrlResponse.payment_url;
                            } catch (error: any) {
                              console.error('Failed to get payment URL:', error);
                              
                              // Show user-friendly error message
                              const errorMessage = error.message || 'Failed to get payment URL. Please try again.';
                              toast.error(errorMessage, { id: 'payment-url' });
                              
                              // If 404, suggest user to contact support
                              if (error.message?.includes('not available')) {
                                toast.error('Payment system is temporarily unavailable. Please contact support.', {
                                  duration: 5000,
                                });
                              }
                            }
                          }}
                        >
                          Complete Payment
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(booking.locationUrl, '_blank')}
                        className="flex items-center justify-center gap-1 w-full sm:w-auto"
                      >
                        <MapPin className="h-4 w-4" />
                        Show Location
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </motion.div>
        )}

        {/* Upcoming Tests */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 mb-4">
            <h2 className="text-xl sm:text-2xl text-[#182966]">Upcoming Tests</h2>
            <Button
              onClick={() => setShowBookingModal(true)}
              className="bg-[#182966] hover:bg-[#182966]/90 w-full sm:w-auto"
            >
              Book New Test
            </Button>
          </div>

          <div className="space-y-4">
            {isLoadingBookings ? (
              <Card className="p-6">
                <p className="text-center text-gray-500">Loading upcoming tests...</p>
              </Card>
            ) : upcomingTests.length === 0 ? (
              <Card className="p-6">
                <p className="text-center text-gray-500">No upcoming tests. Book a test to get started!</p>
              </Card>
            ) : (
              upcomingTests.map((test) => (
                <Card key={test.id} className="p-4 sm:p-6 hover:shadow-lg transition-shadow">
                  <div className="flex flex-col gap-3 sm:gap-4">
                    <div className="flex flex-col gap-3 sm:gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle2 className="h-5 w-5 text-green-500" />
                          <h3 className="text-base sm:text-lg text-[#182966]">{test.type}</h3>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:gap-3 text-gray-600 mb-2">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="h-5 w-5 text-[#182966]" />
                            <span className="font-medium text-[#182966]">{test.date}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Clock className="h-5 w-5 text-[#182966]" />
                            <span className="font-medium text-[#182966]">{test.time}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <MapPin className="h-5 w-5 text-[#182966]" />
                            <span className="font-medium text-[#182966]">{test.location}</span>
                          </div>
                        </div>
                        
                        {/* Price - Compact inline format */}
                        {test.finalPrice && (
                          <div className="flex items-center gap-2 flex-wrap text-sm">
                            <span className="text-gray-500 text-xs">{t.dashboard.totalPaid}:</span>
                            <span className="font-bold text-green-600">
                              {parseFloat(test.finalPrice).toLocaleString()} so'm
                            </span>
                            {test.discountAmount && parseFloat(test.discountAmount) > 0 && (
                              <>
                                <span className="text-gray-400 line-through text-xs">
                                  {parseFloat(test.originalPrice).toLocaleString()} so'm
                                </span>
                                {test.promoCodeApplied && (
                                  <span className="px-1.5 py-0.5 text-xs rounded bg-green-100 text-green-700 uppercase font-medium">
                                    {test.promoCodeApplied}
                                  </span>
                                )}
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(test.locationUrl, '_blank')}
                        className="flex items-center justify-center gap-1 w-full sm:w-auto"
                      >
                        <MapPin className="h-4 w-4" />
                        Show Location
                      </Button>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </motion.div>

        {/* Completed Tests */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <h2 className="text-xl sm:text-2xl mb-4 text-[#182966]">Previous Test Results</h2>
          <div className="space-y-4">
            {isLoadingTestResults ? (
              <Card className="p-6">
                <p className="text-center text-gray-500">Loading test results...</p>
              </Card>
            ) : allPreviousTests.length === 0 ? (
              <Card className="p-6">
                <p className="text-center text-gray-500">No test results yet. Complete a test to see your scores here.</p>
              </Card>
            ) : (
              allPreviousTests.map((test) => {
                // Safety checks
                const hasScores = test.reading || test.listening || test.writing || test.speaking || test.overall;
                
                return (
                  <Card 
                    key={test.id} 
                    className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => navigate(`/result/${test.result_id || test.id}`)}
                  >
                    <div className="flex flex-col lg:flex-row justify-between gap-4">
                      <div className="flex-shrink-0">
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg mb-1 text-[#182966]">{test.test_type || 'IELTS Test'}</h3>
                          <ExternalLink className="h-4 w-4 text-[#182966]/40" />
                        </div>
                        <p className="text-sm text-gray-600">{formatDate(test.test_date)}</p>
                      </div>
                      {hasScores ? (
                        <div className="flex flex-wrap items-center gap-6 lg:gap-8">
                          {(test.reading !== null && test.reading !== undefined) && (
                            <div className="text-center min-w-[70px]">
                              <div className="text-sm text-gray-600 mb-1">Reading</div>
                              <div className="text-2xl text-[#182966]">{Number(test.reading).toFixed(1)}</div>
                            </div>
                          )}
                          {(test.listening !== null && test.listening !== undefined) && (
                            <div className="text-center min-w-[70px]">
                              <div className="text-sm text-gray-600 mb-1">Listening</div>
                              <div className="text-2xl text-[#182966]">{Number(test.listening).toFixed(1)}</div>
                            </div>
                          )}
                          {(test.writing !== null && test.writing !== undefined) && (
                            <div className="text-center min-w-[70px]">
                              <div className="text-sm text-gray-600 mb-1">Writing</div>
                              <div className="text-2xl text-[#182966]">{Number(test.writing).toFixed(1)}</div>
                            </div>
                          )}
                          {(test.speaking !== null && test.speaking !== undefined) && (
                            <div className="text-center min-w-[70px]">
                              <div className="text-sm text-gray-600 mb-1">Speaking</div>
                              <div className="text-2xl text-[#182966]">{Number(test.speaking).toFixed(1)}</div>
                            </div>
                          )}
                          {(test.overall !== null && test.overall !== undefined) && (
                            <div className="text-center min-w-[70px] pl-4 lg:pl-6 border-l-2 border-gray-200">
                              <div className="text-sm text-gray-600 mb-1">Overall</div>
                              <div className="text-3xl text-[#182966]">{Number(test.overall).toFixed(1)}</div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="text-center text-gray-500">
                          <p className="text-sm">Scores not available yet</p>
                        </div>
                      )}
                    </div>
                  </Card>
                );
              })
            )}
          </div>
        </motion.div>

        {/* Payment History */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <h2 className="text-xl sm:text-2xl mb-4 text-[#182966]">Payment History</h2>
          <Card className="overflow-hidden">
            {isLoadingPayments ? (
              <div className="p-4 sm:p-6">
                <p className="text-center text-sm sm:text-base text-gray-500">Loading payment history...</p>
              </div>
            ) : paymentHistory.length === 0 ? (
              <div className="p-4 sm:p-6">
                <p className="text-center text-sm sm:text-base text-gray-500">No payment history yet.</p>
              </div>
            ) : (
              <>
                {/* Mobile View - Card Layout */}
                <div className="block sm:hidden divide-y divide-gray-200">
                  {paymentHistory.map((payment) => (
                    <div key={payment.id} className="p-4 hover:bg-gray-50">
                      <div className="space-y-2">
                        <div className="flex justify-between items-start">
                          <div className="text-sm text-gray-900 font-medium flex-1 pr-2">{payment.description}</div>
                          <span className={`px-2 py-1 text-xs rounded-full whitespace-nowrap ${
                            payment.status === 'completed' || payment.status === 'paid' ? 'bg-green-100 text-green-800' :
                            payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {payment.status}
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-600">{formatDate(payment.created_at)}</span>
                          <span className="text-[#182966] font-medium">{payment.amount} UZS</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Desktop View - Table Layout */}
                <div className="hidden sm:block overflow-x-auto">
                  <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">Description</th>
                      <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {paymentHistory.map((payment) => (
                      <tr key={payment.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{payment.description}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-600">{formatDate(payment.created_at)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-[#182966]">{payment.amount} UZS</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            payment.status === 'completed' || payment.status === 'paid' ? 'bg-green-100 text-green-800' :
                            payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {payment.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              </>
            )}
          </Card>
        </motion.div>
      </div>

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg p-4 sm:p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg sm:text-xl lg:text-2xl text-[#182966]">
                {bookingStep === 'test' && 'Select Test Type'}
                {bookingStep === 'session' && 'Choose Session'}
                {bookingStep === 'payment' && 'Payment Method'}
              </h2>
              <button
                onClick={() => {
                  setShowBookingModal(false);
                  resetBooking();
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {bookingStep === 'test' && (
              <>
                <p className="text-gray-600 mb-6">Select your preferred test type</p>
                <div className="space-y-4 mb-6">
                  {isLoadingProducts ? (
                    <p>Loading test packages...</p>
                  ) : (
                    products.map((product) => (
                      <Card
                        key={product.id}
                        className={`p-4 cursor-pointer hover:shadow-lg transition-all border-2 ${
                          selectedTest?.id === product.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200'
                        }`}
                        onClick={() => handleTestSelect(product)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              {selectedTest?.id === product.id && (
                                <CheckCircle2 className="h-5 w-5 text-blue-600" />
                              )}
                              <h3 className="text-lg text-[#182966]">{product.name}</h3>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">{product.description}</p>
                          </div>
                          <div className="text-xl text-[#182966]">{product.price} UZS</div>
                        </div>
                      </Card>
                    ))
                  )}
                </div>

                <Button
                  onClick={handleContinueToSchedule}
                  disabled={!selectedTest}
                  className="w-full bg-[#182966] hover:bg-[#182966]/90"
                >
                  Continue to Schedule
                </Button>
              </>
            )}

            {bookingStep === 'session' && (
              <>
                <p className="text-gray-600 mb-6">Select date and time for your test</p>
                <div className="space-y-4 mb-6">
                  {isLoadingSessions ? (
                    <p>Loading available sessions...</p>
                  ) : sessions.length === 0 ? (
                    <p className="text-center text-gray-500">No sessions available for this test type.</p>
                  ) : (
                    sessions.map((session) => {
                      // Use backend's is_booked field if available, otherwise fallback to client-side check
                      const isAlreadyBooked = session.is_booked ?? [...futureBookings, ...pastBookings].some(
                        b => b.session.id === session.id && b.payment_status !== 'cancelled'
                      );
                      
                      // Check if session is full
                      const isFull = session.available_slots === 0;
                      
                      // Determine if this session can be selected
                      const isDisabled = isAlreadyBooked || isFull;
                      
                      return (
                        <Card 
                          key={session.id} 
                          className={`p-3 sm:p-4 transition-all border-2 ${
                            isDisabled 
                              ? 'opacity-60 cursor-not-allowed' 
                              : 'cursor-pointer hover:shadow-lg'
                          } ${
                            isAlreadyBooked
                              ? 'border-yellow-500 bg-yellow-50'
                              : isFull
                              ? 'border-red-500 bg-red-50'
                              : selectedSession?.id === session.id
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200'
                          }`}
                          onClick={() => !isDisabled && handleSessionSelect(session.id, formatTime(session.session_time))}
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                  {selectedSession?.id === session.id && !isDisabled && (
                                    <CheckCircle2 className="h-5 w-5 text-blue-600 flex-shrink-0" />
                                  )}
                                  <h3 className="text-base sm:text-lg text-[#182966] break-words">
                                    {formatDate(session.session_date)}
                                  </h3>
                                </div>
                                <div className="flex gap-2 flex-wrap">
                                  {isAlreadyBooked && (
                                    <span className="px-2 py-0.5 sm:py-1 text-xs rounded-full bg-yellow-600 text-white whitespace-nowrap">
                                      {t.dashboard.alreadyBooked}
                                    </span>
                                  )}
                                  {isFull && !isAlreadyBooked && (
                                    <span className="px-2 py-0.5 sm:py-1 text-xs rounded-full bg-red-600 text-white whitespace-nowrap">
                                      {t.dashboard.full}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <p className="text-sm text-gray-600">
                                Time: {formatTime(session.session_time)}
                              </p>
                            </div>
                            <div className="flex-shrink-0 self-start sm:self-center">
                              <span className={`text-xs sm:text-sm whitespace-nowrap ${
                                isFull ? 'text-red-600 font-semibold' : 
                                session.available_slots <= 3 ? 'text-orange-600 font-semibold' : 
                                'text-gray-600'
                              }`}>
                                {session.available_slots} {t.dashboard.slotsLeft}
                              </span>
                            </div>
                          </div>
                        </Card>
                      );
                    })
                  )}
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setBookingStep('test')}
                    className="flex-1"
                  >
                    {t.dashboard.back}
                  </Button>
                  <Button
                    onClick={handleContinueToPayment}
                    disabled={!selectedSession}
                    className="flex-1 bg-[#182966] hover:bg-[#182966]/90"
                  >
                    {t.dashboard.continueToPayment}
                  </Button>
                </div>
              </>
            )}

            {bookingStep === 'payment' && (
              <>
                <div className="mb-6">
                  <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <h3 className="text-sm text-gray-600 mb-2">{t.dashboard.bookingSummary}</h3>
                    <div className="space-y-1">
                      <p className="text-lg text-[#182966]">{selectedTest?.name}</p>
                      {selectedSession && sessions.find((s) => s.id === selectedSession.id) && (
                        <p className="text-sm text-gray-600">
                          {formatDate(sessions.find((s) => s.id === selectedSession.id)!.session_date)} {t.common.at}{' '}
                          {selectedSession.time}
                        </p>
                      )}
                      {promoValidation ? (
                        <div className="mt-3 space-y-1">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">{t.dashboard.originalPrice}:</span>
                            <span className="line-through text-gray-500">{promoValidation.original_price} UZS</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">{t.dashboard.discount}:</span>
                            <span className="text-green-600">-{promoValidation.discount_amount} UZS</span>
                          </div>
                          <div className="flex justify-between items-center pt-2 border-t border-gray-300">
                            <span className="text-gray-900 font-medium">{t.dashboard.finalPrice}</span>
                            <span className="text-2xl text-[#182966] font-bold">{promoValidation.final_price} UZS</span>
                          </div>
                        </div>
                      ) : (
                        <p className="text-2xl mt-2 text-[#182966]">{selectedTest?.price} UZS</p>
                      )}
                    </div>
                  </div>

                  {/* Promocode Section */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Tag className="h-5 w-5 text-blue-600" />
                      <h3 className="text-sm font-medium text-blue-900">{t.dashboard.havePromoCode}</h3>
                    </div>
                    
                    {!promoValidation ? (
                      <div className="space-y-2">
                        <div className="flex gap-2">
                          <Input
                            value={promoCode}
                            onChange={(e) => {
                              setPromoCode(e.target.value.toUpperCase());
                              setPromoError('');
                            }}
                            placeholder={t.dashboard.enterPromoCode}
                            className="flex-1"
                            disabled={isValidatingPromo || isCreatingBooking}
                          />
                          <Button
                            onClick={handleValidatePromocode}
                            disabled={!promoCode.trim() || isValidatingPromo || isCreatingBooking}
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            {isValidatingPromo ? t.dashboard.validatingPromo : t.dashboard.apply}
                          </Button>
                        </div>
                        {promoError && (
                          <p className="text-xs text-red-600">{promoError}</p>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between bg-white rounded-lg p-3 border border-green-200">
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="h-5 w-5 text-green-600" />
                            <div>
                              <p className="text-sm font-medium text-gray-900">{promoValidation.code}</p>
                              <p className="text-xs text-gray-600">
                                {promoValidation.discount_type === 'percentage' 
                                  ? `${promoValidation.discount_value}% discount` 
                                  : `${promoValidation.discount_value} UZS discount`}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={handleClearPromocode}
                            disabled={isCreatingBooking}
                            className="text-red-600 hover:text-red-700 text-sm"
                          >
                            {t.dashboard.remove}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  <p className="text-gray-600 mb-4">{t.dashboard.choosePaymentMethod}</p>
                  
                  {isCreatingBooking ? (
                    <div className="flex flex-col items-center justify-center py-12 space-y-4">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-12 h-12 border-4 border-[#182966] border-t-transparent rounded-full"
                      />
                      <p className="text-[#182966]">{t.dashboard.processingBooking}</p>
                      <p className="text-sm text-gray-600">{t.dashboard.pleaseWait}</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <Button
                        onClick={() => handlePaymentMethod('click')}
                        disabled={isCreatingBooking}
                        className="w-full py-6 text-lg bg-[#0084FF] hover:bg-[#0084FF]/90 flex items-center justify-center gap-3"
                      >
                        <AdaptiveImage 
                          figmaAsset={clickLogo} 
                          fallback="/images/click-logo.png"
                          filename="click-logo.png"
                          alt="Click" 
                          className="h-6 w-auto" 
                        />
                        {t.dashboard.payWithClick}
                      </Button>
                      <Button
                        onClick={() => handlePaymentMethod('cash')}
                        disabled={isCreatingBooking}
                        variant="outline"
                        className="w-full py-6 text-lg border-[#182966] text-[#182966] hover:bg-[#182966]/10"
                      >
                        {t.dashboard.payWithCash}
                      </Button>
                      <p className="text-xs text-gray-500 text-center pt-2">
                        <strong>Note:</strong> Cash payment must be completed before expiration
                      </p>
                    </div>
                  )}
                </div>

                <Button
                  variant="outline"
                  onClick={() => setBookingStep('session')}
                  disabled={isCreatingBooking}
                  className="w-full"
                >
                  {t.dashboard.back}
                </Button>
              </>
            )}
          </motion.div>
        </div>
      )}

      {/* Test Details Modal */}
      {showDetailsModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl text-[#182966]">Test Details</h2>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {selectedTestDetails && (
              <div className="space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                      <h3 className="text-lg text-[#182966]">{selectedTestDetails.type}</h3>
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{selectedTestDetails.date}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{selectedTestDetails.time}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>{selectedTestDetails.location}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setRescheduleTest(selectedTestDetails);
                      setShowRescheduleModal(true);
                    }}
                  >
                    Reschedule
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(selectedTestDetails.locationUrl, '_blank')}
                    className="flex items-center gap-1"
                  >
                    <MapPin className="h-4 w-4" />
                    Show Location
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}

      {/* Reschedule Modal */}
      {showRescheduleModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl text-[#182966]">Reschedule Test</h2>
              <button
                onClick={() => setShowRescheduleModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {rescheduleTest && (
              <div className="space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                      <h3 className="text-lg text-[#182966]">{rescheduleTest.type}</h3>
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{rescheduleTest.date}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{rescheduleTest.time}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>{rescheduleTest.location}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-4 mb-6">
                  {isLoadingSessions ? (
                    <p>Loading available sessions...</p>
                  ) : sessions.length === 0 ? (
                    <p className="text-center text-gray-500">No sessions available for this test type.</p>
                  ) : (
                    sessions.map((session) => {
                      // Check if user already booked this session (excluding cancelled bookings)
                      const isAlreadyBooked = [...futureBookings, ...pastBookings].some(
                        b => b.session.id === session.id && b.payment_status !== 'cancelled'
                      );
                      
                      // Check if session is full
                      const isFull = session.available_slots === 0;
                      
                      // Determine if this session can be selected
                      const isDisabled = isAlreadyBooked || isFull;
                      
                      return (
                        <Card 
                          key={session.id} 
                          className={`p-4 transition-all border-2 ${
                            isDisabled 
                              ? 'opacity-60 cursor-not-allowed' 
                              : 'cursor-pointer hover:shadow-lg'
                          } ${
                            isAlreadyBooked
                              ? 'border-yellow-500 bg-yellow-50'
                              : isFull
                              ? 'border-red-500 bg-red-50'
                              : selectedSession?.id === session.id
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200'
                          }`}
                          onClick={() => !isDisabled && handleSessionSelect(session.id, formatTime(session.session_time))}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                {selectedSession?.id === session.id && !isDisabled && (
                                  <CheckCircle2 className="h-5 w-5 text-blue-600" />
                                )}
                                <h3 className="text-lg text-[#182966]">
                                  {formatDate(session.session_date)}
                                </h3>
                                {isAlreadyBooked && (
                                  <span className="px-2 py-1 text-xs rounded-full bg-yellow-600 text-white">
                                    Already Booked
                                  </span>
                                )}
                                {isFull && !isAlreadyBooked && (
                                  <span className="px-2 py-1 text-xs rounded-full bg-red-600 text-white">
                                    Full
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-gray-600 mt-1">
                                Time: {formatTime(session.session_time)}
                              </p>
                            </div>
                            <span className={`text-sm ${
                              isFull ? 'text-red-600 font-semibold' : 
                              session.available_slots <= 3 ? 'text-orange-600 font-semibold' : 
                              'text-gray-600'
                            }`}>
                              {session.available_slots} {session.available_slots === 1 ? 'slot' : 'slots'} available
                            </span>
                          </div>
                        </Card>
                      );
                    })
                  )}
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setShowRescheduleModal(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleContinueToPayment}
                    disabled={!selectedSession}
                    className="flex-1 bg-[#182966] hover:bg-[#182966]/90"
                  >
                    {t.dashboard.continueToPayment}
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </DashboardLayout>
  );
}