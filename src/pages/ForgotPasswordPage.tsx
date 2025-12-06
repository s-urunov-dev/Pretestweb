import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { motion } from "motion/react";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner@2.0.3";
import { authService } from "../services/auth.service";
import {useLanguage} from "../contexts/LanguageContext";
import { PretestLogo } from "../components/PretestLogo";

export function ForgotPasswordPage() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    
    // Agar foydalanuvchi hammasi o'chirib tashlasa, bo'sh qiymati qo'yish
    if (value === '' || value === '+' || value === '+9' || value === '+99') {
      setPhoneNumber('');
      return;
    }
    
    // Faqat raqamlarni olish
    const numbers = value.replace(/\D/g, '');
    
    // +998 dan keyingi raqamlarni olish
    const phoneNumbers = numbers.startsWith('998') ? numbers.slice(3) : numbers;
    
    // Maksimal 9 ta raqam
    const limitedNumbers = phoneNumbers.slice(0, 9);
    
    // Agar raqam yo'q bo'lsa, bo'sh qiymati qo'yish
    if (limitedNumbers.length === 0) {
      setPhoneNumber('');
      return;
    }
    
    // Formatni qo'llash: 90 900 90 90
    let formatted = '+998';
    if (limitedNumbers.length > 0) {
      formatted += ' ' + limitedNumbers.slice(0, 2);
    }
    if (limitedNumbers.length > 2) {
      formatted += ' ' + limitedNumbers.slice(2, 5);
    }
    if (limitedNumbers.length > 5) {
      formatted += ' ' + limitedNumbers.slice(5, 7);
    }
    if (limitedNumbers.length > 7) {
      formatted += ' ' + limitedNumbers.slice(7, 9);
    }
    
    setPhoneNumber(formatted);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!phoneNumber) {
      toast.error(t.auth.verifyError);
      return;
    }
    
    // Phone number to'liq kiritilganligini tekshirish (9 ta raqam)
    const phoneDigits = phoneNumber.replace(/\D/g, '').slice(3);
    if (phoneDigits.length !== 9) {
      toast.error(t.auth.verifyError2);
      return;
    }
    
    // Remove spaces from phone number for API
    let cleanPhoneNumber = phoneNumber.replace(/\s/g, '');
    
    // Ensure phone number starts with +
    if (!cleanPhoneNumber.startsWith('+')) {
      cleanPhoneNumber = '+' + cleanPhoneNumber;
    }
    
    setIsLoading(true);
    
    try {
      const response = await authService.resetPasswordSms(cleanPhoneNumber);
      
      if (response.success) {
        toast.success(response.message || 'Verification code sent!');
        // Navigate to reset password page with phone number
        navigate('/reset-password', { state: { phoneNumber: cleanPhoneNumber } });
      }
    } catch (error: any) {
      const errorMessage = error?.response?.data?.error?.message || 'Failed to send verification code. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <button
          onClick={() => navigate('/login')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
            {t.auth.backToLogin}
        </button>

        <div className="flex justify-center mb-8">
          <button onClick={() => navigate('/')} className="hover:opacity-70 transition-opacity">
            <PretestLogo className="h-24 sm:h-28 lg:h-32 w-auto" />
          </button>
        </div>

        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-2xl text-center text-[#182966]">{t.auth.forgotPassword}</CardTitle>
            <CardDescription className="text-center">
                {t.auth.forgetPasswordDesc}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone_number">{t.auth.phoneNumber} <span className="text-red-500">*</span></Label>
                <Input
                  id="phone_number"
                  type="tel"
                  placeholder="+998 12 345 67 89"
                  value={phoneNumber || '+998'}
                  onChange={handlePhoneChange}
                  required
                />
              </div>

              <Button type="submit" className="w-full bg-[#182966] hover:bg-[#182966]/90" disabled={isLoading}>
                {isLoading ? 'Sending...' : t.auth.verifyButton}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}