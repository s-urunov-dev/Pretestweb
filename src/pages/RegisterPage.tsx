import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { motion } from "motion/react";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "sonner@2.0.3";
import { useLanguage } from "../contexts/LanguageContext";
import { PretestLogo } from "../components/PretestLogo";

export function RegisterPage() {
    const [fullName, setFullName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [passportSerial, setPassportSerial] = useState("");
    const [passportNumber, setPassportNumber] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();
    const { register } = useAuth();
    const { t } = useLanguage();

    const handleFullNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const lettersOnly = value.replace(/[^a-zA-Z\s]/g, '');
        setFullName(lettersOnly);
    };

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

    const handlePassportSerialChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.toUpperCase();
        const lettersOnly = value.replace(/[^A-Z]/g, '').slice(0, 2);
        setPassportSerial(lettersOnly);
    };

    const handlePassportNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const numbersOnly = value.replace(/\D/g, '').slice(0, 7);
        setPassportNumber(numbersOnly);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!fullName.trim()) {
            toast.error(t.auth.firstName);
            return;
        }

        if (!phoneNumber || phoneNumber === '+998') {
            toast.error(t.auth.phoneNumber);
            return;
        }

        const phoneDigits = phoneNumber.replace(/\D/g, '').slice(3);
        if (phoneDigits.length !== 9) {
            toast.error(t.auth.phoneNumber);
            return;
        }

        if (passportSerial.length !== 2) {
            toast.error(t.auth.passportNumber);
            return;
        }

        if (passportNumber.length !== 7) {
            toast.error(t.auth.passportNumber);
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
            await register({
                fullName: fullName,
                phoneNumber: cleanPhoneNumber,
                passportSerial: passportSerial,
                passportNumber: passportNumber,
                password: password,
            });

            toast.success(t.auth.registerSubtitle);

            navigate('/verification', { state: { phoneNumber: cleanPhoneNumber } });

        } catch (error: any) {
            console.error('Registration error:', error);
            console.error('Error response:', error?.response);
            console.error('Error data:', error?.response?.data);
            
            // Check for specific error messages from backend
            let errorMessage = t.auth.registrationFailed;
            
            if (error?.response?.data?.error?.message) {
                const backendMessage = error.response.data.error.message.toLowerCase();
                
                // Check if error is about phone already registered
                if (backendMessage.includes('phone') && 
                    (backendMessage.includes('already') || backendMessage.includes('exist') || backendMessage.includes('registered'))) {
                    errorMessage = t.auth.phoneAlreadyRegistered;
                } else {
                    // Use backend message if it's meaningful
                    errorMessage = error.response.data.error.message;
                }
            } else if (error?.response?.data?.message) {
                // Some backends return error in 'message' field directly
                const backendMessage = error.response.data.message.toLowerCase();
                
                if (backendMessage.includes('phone') && 
                    (backendMessage.includes('already') || backendMessage.includes('exist') || backendMessage.includes('registered'))) {
                    errorMessage = t.auth.phoneAlreadyRegistered;
                } else {
                    errorMessage = error.response.data.message;
                }
            } else if (error?.response?.data?.detail) {
                // Django-style error response
                errorMessage = error.response.data.detail;
            }

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
                <div className="flex justify-center mb-8">
                    <button onClick={() => navigate('/')} className="hover:opacity-70 transition-opacity">
                        <PretestLogo className="h-24 sm:h-28 lg:h-32 w-auto" />
                    </button>
                </div>

                <Card className="w-full">
                    <CardHeader>
                        <CardTitle className="text-2xl text-center text-[#182966]">
                            {t.auth.registerTitle}
                        </CardTitle>
                        <CardDescription className="text-center">
                            {t.auth.registerSubtitle}
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">

                            <div className="space-y-2">
                                <Label htmlFor="full_name">
                                    {t.auth.firstName} <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="full_name"
                                    placeholder={t.auth.firstName}
                                    value={fullName}
                                    onChange={handleFullNameChange}
                                    required
                                />
                            </div>

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

                            <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-2 col-span-1">
                                    <Label htmlFor="passport_serial">
                                        {t.auth.passportSerial} <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="passport_serial"
                                        placeholder="AA"
                                        maxLength={2}
                                        className="uppercase"
                                        value={passportSerial}
                                        onChange={handlePassportSerialChange}
                                        required
                                    />
                                </div>

                                <div className="space-y-2 col-span-2">
                                    <Label htmlFor="passport_serial_number">
                                        {t.auth.passportNumber} <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="passport_serial_number"
                                        placeholder="1234567"
                                        maxLength={7}
                                        value={passportNumber}
                                        onChange={handlePassportNumberChange}
                                        required
                                    />
                                </div>
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
                                            : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full bg-[#182966] hover:bg-[#182966]/90"
                                disabled={isLoading}
                            >
                                {isLoading ? t.auth.registering : t.auth.registerButton}
                            </Button>

                        </form>
                    </CardContent>

                    <CardFooter className="flex justify-center">
                        <p className="text-sm text-gray-600">
                            {t.auth.haveAccount}{" "}
                            <button
                                onClick={() => navigate('/login')}
                                className="text-[#182966] hover:underline font-medium"
                            >
                                {t.auth.signIn}
                            </button>
                        </p>
                    </CardFooter>

                </Card>
            </motion.div>
        </div>
    );
}