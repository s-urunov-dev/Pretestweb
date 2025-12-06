import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { motion } from "motion/react";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner@2.0.3";
import { authService } from "../services/auth.service";
import { useLanguage } from "../contexts/LanguageContext";
import { PretestLogo } from "../components/PretestLogo";

export function ResetPasswordPage() {
    const [verificationCode, setVerificationCode] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { t } = useLanguage();

    const phoneNumber = (location.state as any)?.phoneNumber || '';

    useEffect(() => {
        if (!phoneNumber) {
            navigate('/forgot-password');
        }
    }, [phoneNumber, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!verificationCode) {
            toast.error(t.auth.enterVerificationCode || 'Please enter verification code');
            return;
        }

        if (!newPassword) {
            toast.error(t.auth.enterNewPassword || 'Please enter new password');
            return;
        }

        if (newPassword.length < 6) {
            toast.error(t.auth.passwordMinLength || 'Password must be at least 6 characters');
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.error(t.auth.passwordsDoNotMatch || 'Passwords do not match');
            return;
        }

        setIsLoading(true);

        try {
            const response = await authService.resetPassword({
                phone_number: phoneNumber,
                new_password: newPassword,
                verification_code: verificationCode,
            });

            if (response.success) {
                toast.success(response.message || t.auth.passwordUpdated || 'Password updated successfully!');
                setTimeout(() => {
                    navigate('/login');
                }, 1500);
            }
        } catch (error: any) {
            const errorMessage = error?.response?.data?.error?.message || t.auth.resetFailed || 'Failed to reset password. Please try again.';
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
                    onClick={() => navigate('/forgot-password')}
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
                        <CardTitle className="text-2xl text-center text-[#182966]">{t.auth.resetPasswordTitle || 'Reset Password'}</CardTitle>
                        <CardDescription className="text-center">
                            {t.auth.enterVerificationCodeDesc?.replace('{phoneNumber}', phoneNumber) || `Enter the verification code sent to ${phoneNumber}`}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="verification_code">
                                    {t.auth.verificationCode || 'Verification Code'} <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="verification_code"
                                    type="text"
                                    placeholder={t.auth.verificationCodePlaceholder || 'Enter 6-digit code'}
                                    value={verificationCode}
                                    onChange={(e) => setVerificationCode(e.target.value)}
                                    maxLength={6}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="new_password">
                                    {t.auth.newPassword || 'New Password'} <span className="text-red-500">*</span>
                                </Label>
                                <div className="relative">
                                    <Input
                                        id="new_password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder={t.auth.newPasswordPlaceholder || 'Enter new password'}
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        required
                                        className="pr-10"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                    >
                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="confirm_password">
                                    {t.auth.confirmPassword || 'Confirm Password'} <span className="text-red-500">*</span>
                                </Label>
                                <div className="relative">
                                    <Input
                                        id="confirm_password"
                                        type={showConfirmPassword ? "text" : "password"}
                                        placeholder={t.auth.confirmPasswordPlaceholder || 'Confirm new password'}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                        className="pr-10"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                    >
                                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                            </div>

                            <Button type="submit" className="w-full bg-[#182966] hover:bg-[#182966]/90" disabled={isLoading}>
                                {isLoading ? t.auth.resetting || 'Resetting...' : t.auth.resetPasswordButton || 'Reset Password'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}