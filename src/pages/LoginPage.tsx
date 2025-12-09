import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { motion } from "motion/react";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "sonner";
import { useLanguage } from "../contexts/LanguageContext";
import { SEOHead } from "../components/SEOHead";
import { PretestLogo } from "../components/PretestLogo";
import { trackLogin } from "../utils/analytics";

export function LoginPage() {
    const [phoneNumber, setPhoneNumber] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const { t } = useLanguage();

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value;

        if (value === '' || value === '+' || value === '+9' || value === '+99') {
            setPhoneNumber('');
            return;
        }

        const numbers = value.replace(/\D/g, '');
        const phoneNumbers = numbers.startsWith('998') ? numbers.slice(3) : numbers;
        const limitedNumbers = phoneNumbers.slice(0, 9);

        if (limitedNumbers.length === 0) {
            setPhoneNumber('');
            return;
        }

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

        if (!phoneNumber || phoneNumber === '+998') {
            toast.error(t.auth.phoneNumber);
            return;
        }

        if (!password) {
            toast.error(t.auth.password);
            return;
        }

        let cleanPhoneNumber = phoneNumber.replace(/\s/g, '');

        if (!cleanPhoneNumber.startsWith('+')) {
            cleanPhoneNumber = '+' + cleanPhoneNumber;
        }

        setIsLoading(true);

        try {
            await login(cleanPhoneNumber, password);
            toast.success(t.auth.loginTitle);
            
            // Track successful login
            trackLogin('phone_number');

            const pendingBooking = localStorage.getItem('pendingBooking');

            if (pendingBooking) {
                navigate('/dashboard');
            } else {
                const from = (location.state as any)?.from?.pathname || '/dashboard';
                navigate(from);
            }

        } catch (error: any) {
            const errorData = error?.response?.data;
            let errorMessage = t.auth.loginSubtitle;

            if (errorData?.detail) {
                if (errorData.detail.includes('No active account')) {
                    errorMessage = t.auth.noAccount;
                } else {
                    errorMessage = errorData.detail;
                }
            } else if (errorData?.error?.message) {
                errorMessage = errorData.error.message;
            } else if (error?.response?.status === 401) {
                errorMessage = t.auth.loginSubtitle;
            }

            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <SEOHead
                title="Login - Pre-test.uz | IELTS Mock Test Platform"
                description="Login to your Pre-test.uz account to access IELTS practice tests, track your progress, and get expert feedback."
                noIndex={true}
                canonicalUrl="https://pre-test.uz/login"
            />
            <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-md"
                >
                    <div className="flex justify-center mb-8">
                        <button onClick={() => navigate('/')} className="hover:opacity-70 transition-opacity">
                            <PretestLogo className="h-24 sm:h-28 lg:h-32 w-auto" />
                        </button>
                    </div>

                    <Card className="w-full">
                        <CardHeader>
                            <CardTitle className="text-2xl text-center text-[#182966]">
                                {t.auth.loginTitle}
                            </CardTitle>
                            <CardDescription className="text-center">
                                {t.auth.loginSubtitle}
                            </CardDescription>
                        </CardHeader>

                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">

                                <div className="space-y-2">
                                    <Label htmlFor="phone_number">
                                        {t.auth.phoneNumber} <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="phone_number"
                                        type="tel"
                                        placeholder="+998 12 345 67 89"
                                        value={phoneNumber || '+998'}
                                        onChange={handlePhoneChange}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="password">
                                        {t.auth.password} <span className="text-red-500">*</span>
                                    </Label>

                                    <div className="relative">
                                        <Input
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            placeholder={t.auth.password}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                            className="pr-10"
                                        />

                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                        >
                                            {showPassword
                                                ? <EyeOff className="h-4 w-4" />
                                                : <Eye className="h-4 w-4" />
                                            }
                                        </button>
                                    </div>
                                </div>

                                <div className="flex justify-end">
                                    <button
                                        type="button"
                                        onClick={() => navigate('/forgot-password')}
                                        className="text-sm text-[#182966] hover:underline"
                                    >
                                        {t.auth.forgotPassword}
                                    </button>
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full bg-[#182966] hover:bg-[#182966]/90"
                                    disabled={isLoading}
                                >
                                    {isLoading ? t.auth.loggingIn : t.auth.loginButton}
                                </Button>

                            </form>
                        </CardContent>

                        <CardFooter className="flex justify-center">
                            <p className="text-sm text-gray-600">
                                {t.auth.noAccount}{" "}
                                <button
                                    onClick={() => navigate('/register')}
                                    className="text-[#182966] hover:underline font-medium"
                                >
                                    {t.auth.signUp}
                                </button>
                            </p>
                        </CardFooter>

                    </Card>
                </motion.div>
            </div>
        </>
    );
}