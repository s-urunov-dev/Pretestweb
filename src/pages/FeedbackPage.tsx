import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { DashboardLayout } from './DashboardLayout';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Upload, Video, Play, Clock, CheckCircle2, AlertCircle, X, FileText, Edit, Download, Mic } from 'lucide-react';
import { feedbackService, VideoFeedbackOption, VideoFeedbackRequest } from '../services/feedback.service';
import { paymentService } from '../services/payment.service';
import { bookingService, Booking } from '../services/booking.service';
import { ComingSoonModal } from '../components/ComingSoonModal';

export function FeedbackPage() {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showComingSoonModal, setShowComingSoonModal] = useState(false);
  const [feedbackOptions, setFeedbackOptions] = useState<VideoFeedbackOption[]>([]);
  const [feedbackRequests, setFeedbackRequests] = useState<VideoFeedbackRequest[]>([]);
  const [selectedOption, setSelectedOption] = useState<VideoFeedbackOption | null>(null);
  const [submissionMethod, setSubmissionMethod] = useState<'text' | 'file' | 'test' | null>(null);
  const [writingText, setWritingText] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [selectedTest, setSelectedTest] = useState<number | null>(null);
  const [availableTests, setAvailableTests] = useState<Booking[]>([]);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<VideoFeedbackRequest | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statistics, setStatistics] = useState({
    total_submissions: 0,
    completed_feedback: 0,
    average_score: '0.0',
  });

  // Load feedback options and requests on mount
  useEffect(() => {
    loadData();
    loadPastTests();
    loadStatistics();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [options, requests] = await Promise.all([
        feedbackService.getFeedbackOptions(),
        feedbackService.getFeedbackRequests(),
      ]);
      setFeedbackOptions(options);
      setFeedbackRequests(requests);
      if (options.length > 0) {
        setSelectedOption(options[0]);
      }
    } catch (error) {
      console.error('Failed to load feedback data:', error);
      alert('Failed to load feedback data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Load past paid tests for linking to feedback
  const loadPastTests = async () => {
    try {
      // Backend now returns only paid tests for type=past
      const bookings = await bookingService.getBookings('past');
      setAvailableTests(bookings);
    } catch (error) {
      console.error('Failed to load past tests:', error);
    }
  };

  // Load statistics from backend
  const loadStatistics = async () => {
    try {
      const stats = await feedbackService.getFeedbackStatistics();
      setStatistics(stats);
    } catch (error) {
      console.error('Failed to load feedback statistics:', error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFile(e.target.files[0]);
      setSubmissionMethod('file');
      setWritingText('');
      setSelectedTest(null);
    }
  };

  const handleSubmit = async () => {
    if (!selectedOption) {
      alert('Please select a feedback type');
      return;
    }

    // For speaking, no validation needed - just feedback_type
    const isSpeakingType = selectedOption.name.toLowerCase().includes('speaking');

    // Validation for writing only
    if (!isSpeakingType) {
      if (!submissionMethod) {
        alert('Please write your text or upload a file');
        return;
      }

      if (submissionMethod === 'text' && !writingText.trim()) {
        alert('Please write your text');
        return;
      }

      if (submissionMethod === 'file' && !uploadedFile) {
        alert('Please upload a file');
        return;
      }

      if (submissionMethod === 'test' && !selectedTest) {
        alert('Please select a test');
        return;
      }
    }

    setIsSubmitting(true);

    try {
      // Step 1: Create feedback request
      const feedbackData: any = {
        feedback_type: selectedOption.id,
      };

      // Only add writing/file for non-speaking types
      if (!isSpeakingType) {
        if (submissionMethod === 'text') {
          feedbackData.writing = writingText;
        } else if (submissionMethod === 'file') {
          feedbackData.uploaded_file = uploadedFile;
        } else if (submissionMethod === 'test' && selectedTest) {
          feedbackData.related_booking = selectedTest;
        }
      }

      const feedbackResponse = await feedbackService.createFeedbackRequest(feedbackData);
      console.log('Feedback created:', feedbackResponse);

      // Step 2: Create payment
      const paymentData = {
        feedback_request_id: feedbackResponse.id,
        payment_method: 'click' as const,
      };

      const paymentResponse = await paymentService.createPayment(paymentData);
      console.log('Payment created:', paymentResponse);

      // Step 3: Redirect to payment
      if (paymentResponse.redirect_url) {
        window.location.href = paymentResponse.redirect_url;
      } else {
        alert('Payment URL not received. Please contact support.');
      }

      // Close modal and reset
      setShowUploadModal(false);
      resetForm();
      
      // Reload data and statistics
      loadData();
      loadStatistics();
    } catch (error: any) {
      console.error('Submission error:', error);
      alert(error.message || 'Failed to submit feedback request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    if (feedbackOptions.length > 0) {
      setSelectedOption(feedbackOptions[0]);
    }
    setSubmissionMethod(null);
    setWritingText('');
    setUploadedFile(null);
    setSelectedTest(null);
  };

  // Handle payment for pending feedback requests
  const handlePayForPending = async (feedbackRequestId: number) => {
    // Show confirmation dialog
    const confirmed = confirm(
      'You will be redirected to Click payment gateway to complete payment for this feedback request. Continue?'
    );
    
    if (!confirmed) return;

    setIsSubmitting(true);
    try {
      const paymentData = {
        feedback_request_id: feedbackRequestId,
        payment_method: 'click' as const,
      };

      // ✅ Use getOrCreatePayment to avoid duplicate payments
      const paymentResponse = await paymentService.getOrCreatePayment(paymentData);
      
      if (paymentResponse.is_existing) {
        console.log('Reusing existing payment URL');
      } else {
        console.log('Created new payment');
      }

      // Redirect to payment
      if (paymentResponse.redirect_url) {
        window.location.href = paymentResponse.redirect_url;
      } else {
        alert('Payment URL not received. Please contact support.');
        setIsSubmitting(false);
      }
    } catch (error: any) {
      console.error('Payment error:', error);
      alert(error.message || 'Failed to process payment. Please try again.');
      setIsSubmitting(false);
    }
  };

  const handleWatchVideo = (item: VideoFeedbackRequest) => {
    setSelectedVideo(item);
    setShowVideoModal(true);
  };

  const handleDownloadVideo = (videoUrl: string) => {
    window.open(videoUrl, '_blank');
  };

  const getStatusDisplay = (request: VideoFeedbackRequest) => {
    // Cancelled payment
    if (request.payment_status === 'cancelled') {
      return {
        text: 'Cancelled',
        color: 'text-red-600',
        bgColor: 'bg-red-50',
        icon: X,
      };
    }

    // Completed feedback
    if (request.is_completed && request.admin_video_response) {
      return {
        text: 'Completed',
        color: 'text-green-600',
        bgColor: 'bg-green-50',
        icon: CheckCircle2,
      };
    }

    // Processing (paid but not completed)
    if (request.payment_status === 'paid' || request.payment_status === 'completed') {
      return {
        text: 'Processing',
        color: 'text-blue-600',
        bgColor: 'bg-blue-50',
        icon: Clock,
      };
    }

    // Payment pending
    return {
      text: 'Payment Pending',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      icon: AlertCircle,
    };
  };

  const getFeedbackTypeName = (typeId: number) => {
    const option = feedbackOptions.find(opt => opt.id === typeId);
    return option ? option.name : 'Feedback';
  };

  const isSpeaking = selectedOption?.name.toLowerCase().includes('speaking') || false;

  return (
    <DashboardLayout currentPage="feedback">
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        >
          <div>
            <h1 className="text-2xl sm:text-3xl mb-2 text-[#182966]">Video Feedback</h1>
            <p className="text-sm sm:text-base text-gray-600">Submit your writing or book a speaking session for expert feedback</p>
          </div>
          <Button
            onClick={() => {
              // Show Coming Soon modal instead of opening upload modal
              setShowComingSoonModal(true);
              // Old logic kept for future use:
              // setShowUploadModal(true);
            }}
            className="bg-[#182966] hover:bg-[#182966]/90 w-full sm:w-auto"
            disabled={isLoading}
          >
            <Upload className="h-5 w-5 mr-2" />
            Request Feedback
          </Button>
        </motion.div>

        {/* Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          {[
            { label: 'Total Submissions', value: statistics.total_submissions.toString(), icon: Upload },
            { label: 'Completed Feedback', value: statistics.completed_feedback.toString(), icon: Video },
            { label: 'Average Score', value: statistics.average_score, icon: CheckCircle2 },
          ].map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="p-4 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                      <p className="text-3xl text-[#182966]">{stat.value}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-[#182966]/10">
                      <Icon className="h-6 w-6 text-[#182966]" />
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Feedback List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="space-y-4"
        >
          {isLoading ? (
            <Card className="p-8 text-center text-gray-600">
              <Clock className="h-12 w-12 mx-auto mb-4 animate-spin text-[#182966]" />
              <p>Loading your feedback requests...</p>
            </Card>
          ) : feedbackRequests.length === 0 ? (
            <Card className="p-8 text-center text-gray-600">
              <Video className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p>No feedback requests yet. Click "Request Feedback" to get started!</p>
            </Card>
          ) : (
            feedbackRequests.map((item) => {
              const statusDisplay = getStatusDisplay(item);
              const StatusIcon = statusDisplay.icon;
              const typeName = getFeedbackTypeName(item.feedback_type);
              const isSpeakingType = typeName.toLowerCase().includes('speaking');
              
              return (
                <Card key={item.id} className="p-4 sm:p-5 hover:shadow-md transition-shadow border border-gray-200">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                    {/* Icon - Left Side */}
                    <div className={`p-3 rounded-lg flex-shrink-0 ${
                      item.payment_status === 'cancelled' 
                        ? 'bg-red-50' 
                        : item.is_completed 
                        ? 'bg-gray-100' 
                        : item.payment_status === 'pending' || !item.payment_status
                        ? 'bg-orange-50'
                        : 'bg-blue-50'
                    }`}>
                      <StatusIcon className={`h-5 w-5 ${
                        item.payment_status === 'cancelled'
                          ? 'text-red-600'
                          : item.is_completed
                          ? 'text-gray-600'
                          : item.payment_status === 'pending' || !item.payment_status
                          ? 'text-orange-600'
                          : 'text-blue-600'
                      }`} />
                    </div>

                    {/* Content - Center */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base text-gray-900 mb-1">{typeName}</h3>
                      <p className="text-sm text-gray-600 mb-0.5">
                        Submitted: {new Date(item.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                      {item.examiner_name && (
                        <p className="text-sm text-gray-600">
                          Examiner: {item.examiner_name}
                        </p>
                      )}
                      {item.is_completed && item.feedback_description && (
                        <p className="text-sm text-gray-600 italic mt-2 line-clamp-1">
                          "{item.feedback_description}"
                        </p>
                      )}
                      {!item.is_completed && item.payment_status === 'paid' && (
                        <p className="text-sm text-gray-600 mt-2">
                          Your feedback is being prepared. Expected within 24 hours.
                        </p>
                      )}
                      {(item.payment_status === 'pending' || !item.payment_status) && (
                        <p className="text-sm text-gray-600 mt-2">
                          Complete payment to receive video feedback
                        </p>
                      )}
                    </div>

                    {/* Action - Right Side */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto sm:flex-shrink-0">
                      {item.is_completed && item.admin_video_response ? (
                        <div className="flex items-center justify-between sm:justify-start gap-3">
                          {/* Score */}
                          {item.score && (
                            <div className="flex flex-col items-center justify-center px-3 py-2 bg-gray-50 rounded-lg">
                              <p className="text-xs text-gray-500 mb-0.5">Band Score</p>
                              <p className="text-3xl sm:text-4xl text-[#182966]">{item.score}</p>
                            </div>
                          )}
                          {/* Watch Button */}
                          <Button 
                            className="bg-[#182966] hover:bg-[#182966]/90 flex-1 sm:flex-initial"
                            onClick={() => handleWatchVideo(item)}
                          >
                            <Play className="h-4 w-4 mr-2" />
                            Watch Video
                          </Button>
                        </div>
                      ) : item.payment_status === 'cancelled' ? (
                        <div className="px-4 py-2 bg-red-50 rounded-lg text-center sm:text-left">
                          <p className="text-sm text-red-600">Cancelled</p>
                        </div>
                      ) : item.payment_status === 'pending' || !item.payment_status ? (
                        <Button 
                          className="bg-[#182966] hover:bg-[#182966]/90 w-full sm:w-auto"
                          onClick={() => handlePayForPending(item.id)}
                          disabled={isSubmitting}
                        >
                          Pay for Feedback
                        </Button>
                      ) : (
                        <div className="flex items-center justify-center sm:justify-start gap-2 px-4 py-2 bg-gray-50 rounded-lg">
                          <Clock className="h-4 w-4 text-gray-600" />
                          <p className="text-sm text-gray-600">Processing</p>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })
          )}
        </motion.div>

        {/* Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="p-4 sm:p-6 bg-[#182966]/5">
            <h3 className="text-base sm:text-lg mb-3 sm:mb-2 text-[#182966]">How Video Feedback Works</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <h4 className="text-base mb-2 text-[#182966]">Writing Feedback</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 mt-0.5 flex-shrink-0 text-[#182966]" />
                    <span>Write directly or upload a file</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 mt-0.5 flex-shrink-0 text-[#182966]" />
                    <span>Complete payment via Click</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 mt-0.5 flex-shrink-0 text-[#182966]" />
                    <span>Receive video feedback within 24 hours</span>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-base mb-2 text-[#182966]">Speaking Feedback</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 mt-0.5 flex-shrink-0 text-[#182966]" />
                    <span>Make payment to request speaking session</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 mt-0.5 flex-shrink-0 text-[#182966]" />
                    <span>We'll schedule with examiner (Zoom/Offline)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 mt-0.5 flex-shrink-0 text-[#182966]" />
                    <span>Receive video feedback after session</span>
                  </li>
                </ul>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl text-[#182966]">
                {isSpeaking ? 'Request Speaking Session' : 'Submit Writing for Feedback'}
              </h2>
              <button
                onClick={() => {
                  setShowUploadModal(false);
                  resetForm();
                }}
                className="text-gray-500 hover:text-gray-700"
                disabled={isSubmitting}
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-5 mb-6">
              {/* Feedback Type Selection */}
              <div>
                <Label htmlFor="feedbackType">Feedback Type *</Label>
                <select
                  id="feedbackType"
                  className="w-full p-3 border border-gray-300 rounded-lg mt-2"
                  value={selectedOption?.id || ''}
                  onChange={(e) => {
                    const option = feedbackOptions.find(opt => opt.id === Number(e.target.value));
                    setSelectedOption(option || null);
                    setSubmissionMethod(null);
                    setWritingText('');
                    setUploadedFile(null);
                  }}
                  disabled={isSubmitting}
                >
                  {feedbackOptions.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.name} - ${option.price}
                    </option>
                  ))}
                </select>
              </div>

              {isSpeaking ? (
                <div className="space-y-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <Mic className="h-6 w-6 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm text-blue-900 mb-2">
                          <strong>Speaking Session Process:</strong>
                        </p>
                        <ol className="text-sm text-blue-900 space-y-1 list-decimal list-inside">
                          <li>Complete payment for speaking session</li>
                          <li>Our team will contact you to schedule with an examiner</li>
                          <li>Session will be conducted via Zoom or in-person</li>
                          <li>Receive detailed video feedback after completion</li>
                        </ol>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <h4 className="text-sm text-gray-900 mb-2">What's included:</h4>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>✓ Live speaking practice with certified examiner</li>
                      <li>✓ Comprehensive video feedback</li>
                      <li>✓ Detailed band score breakdown</li>
                      <li>✓ Personalized improvement tips</li>
                    </ul>
                  </div>
                </div>
              ) : (
                <>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-sm text-yellow-800">
                      <strong>Choose ONE submission method:</strong> Write your text or upload a file
                    </p>
                  </div>

                  {/* Write Text Option */}
                  <div>
                    <Label className="flex items-center gap-2 mb-2">
                      <Edit className="h-5 w-5 text-[#182966]" />
                      Option 1: Write Your Text Here
                    </Label>
                    <Textarea
                      placeholder="Type or paste your IELTS writing here..."
                      className="min-h-[200px]"
                      value={writingText}
                      onChange={(e) => {
                        setWritingText(e.target.value);
                        if (e.target.value) {
                          setSubmissionMethod('text');
                          setUploadedFile(null);
                          setSelectedTest(null);
                        } else {
                          setSubmissionMethod(null);
                        }
                      }}
                      disabled={submissionMethod === 'file' || submissionMethod === 'test' || isSubmitting}
                    />
                  </div>

                  {/* Upload File Option */}
                  <div>
                    <Label className="flex items-center gap-2 mb-2">
                      <Upload className="h-5 w-5 text-[#182966]" />
                      Option 2: Upload File or Image
                    </Label>
                    <div className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                      submissionMethod === 'text' || submissionMethod === 'test'
                        ? 'border-gray-200 bg-gray-50 opacity-50'
                        : 'border-gray-300 hover:border-blue-400'
                    }`}>
                      {uploadedFile ? (
                        <div className="space-y-3">
                          <CheckCircle2 className="h-12 w-12 mx-auto text-green-500" />
                          <p className="text-gray-700">{uploadedFile.name}</p>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setUploadedFile(null);
                              setSubmissionMethod(null);
                            }}
                            disabled={submissionMethod === 'text' || submissionMethod === 'test' || isSubmitting}
                          >
                            Remove File
                          </Button>
                        </div>
                      ) : (
                        <>
                          <Upload className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                          <p className="text-gray-600 mb-2">Drop your file or image here or click to browse</p>
                          <p className="text-xs text-gray-500 mb-3">Supports: PDF, DOC, DOCX, TXT, JPG, PNG</p>
                          <input
                            type="file"
                            id="fileUpload"
                            className="hidden"
                            accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
                            onChange={handleFileChange}
                            disabled={submissionMethod === 'text' || submissionMethod === 'test' || isSubmitting}
                          />
                          <label htmlFor="fileUpload">
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => document.getElementById('fileUpload')?.click()}
                              disabled={submissionMethod === 'text' || submissionMethod === 'test' || isSubmitting}
                            >
                              Choose File
                            </Button>
                          </label>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Link to Test Option */}
                  {availableTests.length > 0 && (
                    <div>
                      <Label className="flex items-center gap-2 mb-2">
                        <FileText className="h-5 w-5 text-[#182966]" />
                        Option 3: Link to Past Test
                      </Label>
                      <div className={`border-2 border-dashed rounded-lg p-4 transition-colors ${
                        submissionMethod === 'text' || submissionMethod === 'file'
                          ? 'border-gray-200 bg-gray-50 opacity-50'
                          : 'border-gray-300'
                      }`}>
                        <select
                          className="w-full p-3 border border-gray-300 rounded-lg"
                          value={selectedTest || ''}
                          onChange={(e) => {
                            const testId = Number(e.target.value);
                            setSelectedTest(testId || null);
                            if (testId) {
                              setSubmissionMethod('test');
                              setWritingText('');
                              setUploadedFile(null);
                            } else {
                              setSubmissionMethod(null);
                            }
                          }}
                          disabled={submissionMethod === 'text' || submissionMethod === 'file' || isSubmitting}
                        >
                          <option value="">Select a past test...</option>
                          {availableTests.map((booking) => (
                            <option key={booking.id} value={booking.id}>
                              {booking.session.product.name} - {new Date(booking.session.session_date).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </option>
                          ))}
                        </select>
                        {selectedTest && (
                          <p className="text-sm text-gray-600 mt-2">
                            ✓ Test selected. We'll review your writing from this test session.
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Price Display */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Total Amount:</span>
                  <span className="text-2xl text-[#182966]">${selectedOption?.price || '0'}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setShowUploadModal(false);
                  resetForm();
                }}
                className="flex-1"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                className="flex-1 bg-[#182966] hover:bg-[#182966]/90"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Clock className="h-4 w-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    {isSpeaking ? `Request & Pay $${selectedOption?.price}` : `Submit & Pay $${selectedOption?.price}`}
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Video Modal */}
      {showVideoModal && selectedVideo && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl text-[#182966]">
                Video Feedback: {getFeedbackTypeName(selectedVideo.feedback_type)}
              </h2>
              <button
                onClick={() => setShowVideoModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-5 mb-6">
              {/* Video Player */}
              <div className="bg-black rounded-lg overflow-hidden">
                <video
                  controls
                  className="w-full max-h-[400px]"
                  src={selectedVideo.admin_video_response || undefined}
                >
                  Your browser does not support the video tag.
                </video>
              </div>

              {/* Score and Examiner */}
              {selectedVideo.score && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <h4 className="text-sm mb-1 text-gray-900">Your Score</h4>
                    <p className="text-3xl text-green-600">{selectedVideo.score}</p>
                    <p className="text-xs text-gray-600 mt-1">IELTS Band Score</p>
                  </div>
                  {selectedVideo.examiner_name && (
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <h4 className="text-sm mb-1 text-gray-900">Examiner</h4>
                      <p className="text-lg text-[#182966]">{selectedVideo.examiner_name}</p>
                      <p className="text-xs text-gray-600 mt-1">Certified IELTS Expert</p>
                    </div>
                  )}
                </div>
              )}

              {/* Feedback Description */}
              {selectedVideo.feedback_description && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="text-sm mb-2 text-gray-900">Feedback Summary:</h4>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {selectedVideo.feedback_description}
                  </p>
                </div>
              )}

              {/* Submitted Date */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="text-sm mb-1 text-gray-900">Submitted:</h4>
                <p className="text-sm text-gray-700">
                  {new Date(selectedVideo.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => selectedVideo.admin_video_response && handleDownloadVideo(selectedVideo.admin_video_response)}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Video
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowVideoModal(false)}
                >
                  Close
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Coming Soon Modal */}
      <ComingSoonModal
        isOpen={showComingSoonModal}
        onClose={() => setShowComingSoonModal(false)}
        title="Video Feedback Coming Soon"
        message="We're working hard to bring you expert video feedback. This feature will be available very soon!"
      />
    </DashboardLayout>
  );
}