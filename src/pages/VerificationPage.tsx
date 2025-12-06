import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "motion/react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../components/ui/input-otp";
import { Smartphone, ArrowLeft } from "lucide-react";
import { toast } from "sonner@2.0.3";
import { useAuth } from "../contexts/AuthContext";
import { authService } from "../services/auth.service";

export function VerificationPage() {
  const [verificationCode, setVerificationCode] = useState("");
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const { verify } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get phone number from navigation state
  const phoneNumber = (location.state as any)?.phoneNumber || '';

  // If no phone number, redirect to register
  useEffect(() => {
    if (!phoneNumber) {
      navigate('/register');
    }
  }, [phoneNumber, navigate]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else {
      setCanResend(true);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (verificationCode.length !== 6) {
      toast.error("Please enter 6-digit code");
      return;
    }

    setIsVerifying(true);
    
    // Ensure phone number starts with +
    let cleanPhoneNumber = phoneNumber;
    if (!cleanPhoneNumber.startsWith('+')) {
      cleanPhoneNumber = '+' + cleanPhoneNumber;
    }
    
    try {
      // AuthContext'dagi verify function ishlatish - bu avtomatik token va userni saqlaydi
      await verify(cleanPhoneNumber, verificationCode);
      toast.success("Phone number verified successfully!");
      
      // Dashboard'ga o'tish
      setTimeout(() => {
        navigate('/dashboard');
      }, 500);
    } catch (error: any) {
      const errorMessage = error?.response?.data?.error?.message || 'Verification failed. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    try {
      // Ensure phone number starts with +
      let cleanPhoneNumber = phoneNumber;
      if (!cleanPhoneNumber.startsWith('+')) {
        cleanPhoneNumber = '+' + cleanPhoneNumber;
      }
      
      await authService.resendOtp(cleanPhoneNumber);
      setCountdown(60);
      setCanResend(false);
      setVerificationCode("");
      toast.success("Verification code resent!");
    } catch (error) {
      toast.error("Failed to resend code. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <button
          onClick={() => navigate('/register')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          Back to registration
        </button>

        <Card className="p-8">
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, type: "spring" }}
              className="inline-flex p-4 rounded-full mb-4 bg-[#182966]/10"
            >
              <Smartphone className="h-12 w-12 text-[#182966]" />
            </motion.div>

            <h1 className="text-3xl mb-2 text-[#182966]">
              Verify Your Phone
            </h1>
            <p className="text-gray-600">We've sent a 6-digit code to</p>
            <p className="text-gray-900 mt-1">{phoneNumber}</p>
          </div>

          <form onSubmit={handleVerification} className="space-y-6">
            <div>
              <label className="block text-sm mb-3 text-center text-gray-600">
                Enter verification code
              </label>
              <div className="flex justify-center">
                <InputOTP 
                  maxLength={6} 
                  value={verificationCode} 
                  onChange={setVerificationCode}
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </div>
            </div>

            <Button
              type="submit"
              disabled={verificationCode.length !== 6 || isVerifying}
              className="w-full h-12 bg-[#182966] hover:bg-[#182966]/90"
            >
              {isVerifying ? "Verifying..." : "Verify and Continue"}
            </Button>

            <div className="text-center">
              {!canResend ? (
                <p className="text-sm text-gray-600">
                  Resend code in <span className="text-[#182966]">{countdown}s</span>
                </p>
              ) : (
                <button
                  type="button"
                  onClick={handleResend}
                  className="text-sm text-[#182966] hover:underline"
                >
                  Resend verification code
                </button>
              )}
            </div>
          </form>
        </Card>

        <div className="mt-6 text-center text-sm text-gray-600">
          <p>Didn't receive the code? Check your SMS or try again</p>
        </div>
      </motion.div>
    </div>
  );
}