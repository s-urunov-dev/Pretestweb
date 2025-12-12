import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { ArrowRight, CheckCircle } from "lucide-react";
import { authService } from "../services/auth.service";
import { useState } from "react";
import { ComingSoonModal } from "./ComingSoonModal";
import { useLanguage } from "../contexts/LanguageContext";

export function Hero() {
    const navigate = useNavigate();
    const [showComingSoonModal, setShowComingSoonModal] = useState(false);
    const { t, language } = useLanguage();

    // Use direct path from public folder (no import needed)
    const heroImage = "/images/hero-image.png";

    const handleBookTestClick = () => {
        if (authService.isAuthenticated()) {
            navigate('/dashboard');
        } else {
            navigate('/register');
        }
    };

    const handleGetFeedbackClick = () => {
        // Navigate to register page
        if (authService.isAuthenticated()) {
            navigate('/dashboard');
        } else {
            navigate('/register');
        }
    };

    // Helper function to render title with IELTS in dark red
    const renderTitle = (title: string) => {
        // For snowy effect, all text should be white - no special color for IELTS
        return title;
    };

    return (
        <section className="relative pt-24 pb-20 md:pt-32 md:pb-28 lg:pt-40 overflow-hidden min-h-screen flex items-end md:items-center">
            {/* Full-width background image */}
            <motion.div
                initial={{ scale: 1.1, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1.4, ease: [0.25, 0.1, 0.25, 1.0] }}
                className="absolute inset-0 z-0"
            >
                {/* Use direct image import */}
                <img
                    src={heroImage}
                    alt="IELTS Hero Background"
                    className="w-full h-full object-cover"
                    style={{
                        objectPosition: 'center 35%',
                        imageRendering: 'crisp-edges',
                    }}
                />
                {/* Gradient overlay for readability */}
                <div
                    className="absolute inset-0"
                    style={{
                        background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 30%, rgba(0,0,0,0) 60%)',
                    }}
                />
            </motion.div>

            <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10 w-full pb-12 md:pb-16">
                <div className="flex flex-col items-center justify-center text-center">
                    <div className="w-full max-w-4xl px-2 sm:px-0">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                        >
                            <motion.h1
                                initial={{ opacity: 0, y: 40 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 1, delay: 0.5, ease: [0.25, 0.1, 0.25, 1.0] }}
                                className="mb-6 md:mb-7 lg:mb-8 text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl"
                                style={{
                                    fontFamily: "'Oswald', sans-serif",
                                    fontWeight: "900",
                                    color: '#ffffff',
                                    letterSpacing: '-0.03em',
                                    lineHeight: '1.1',
                                    textShadow: `
                          0 4px 12px rgba(0, 0, 0, 0.4),
                          0 8px 24px rgba(0, 0, 0, 0.3),
                          0 16px 48px rgba(0, 0, 0, 0.2)
                        `,
                                    maxWidth: '1000px',
                                    marginLeft: 'auto',
                                    marginRight: 'auto',
                                }}
                            >
                                {language === 'uz' ? (
                                    <>
                                        Ota-onang faxrlanadigan <br />natijaga erish
                                    </>
                                ) : (
                                    t.hero.title
                                )}
                            </motion.h1>

                            {/* Subtitle (H2 for SEO) */}
                            <motion.h2
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.6, ease: [0.25, 0.1, 0.25, 1.0] }}
                                className="mb-10 md:mb-11 lg:mb-12 text-lg sm:text-xl md:text-2xl"
                                style={{
                                    fontFamily: "'Montserrat', sans-serif",
                                    fontWeight: "600",
                                    color: '#ffffff',
                                    letterSpacing: '0.01em',
                                    lineHeight: '1.4',
                                    textShadow: `
                    0 2px 8px rgba(0, 0, 0, 0.4),
                    0 4px 16px rgba(0, 0, 0, 0.3)
                  `,
                                    maxWidth: '900px',
                                    marginLeft: 'auto',
                                    marginRight: 'auto',
                                }}
                            >
                                {t.hero.subtitle}
                            </motion.h2>

                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.8, ease: [0.25, 0.1, 0.25, 1.0] }}
                                className="flex flex-col sm:flex-row gap-8 md:gap-12 justify-center items-center mb-16 md:mb-20 lg:mb-24"
                            >
                                {/* Blue button with checkmark below */}
                                <div className="flex flex-col items-center gap-3">
                                    <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.98 }} transition={{ duration: 0.3 }}>
                                        <Button size="lg" className="rounded-full text-base px-8 h-12 bg-[#182966]/50 hover:bg-[#182966]/40 text-white backdrop-blur-md" onClick={handleBookTestClick}>
                                            {t.hero.cta}
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </Button>
                                    </motion.div>
                                    <div className="flex items-center gap-2 text-sm text-white">
                                        <CheckCircle className="h-4 w-4 text-white" />
                                        <span>{t.hero.realExamConditions}</span>
                                    </div>
                                </div>

                                {/* White button with checkmark below */}
                                <div className="flex flex-col items-center gap-3">
                                    <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.98 }} transition={{ duration: 0.3 }}>
                                        <Button size="lg" className="rounded-full text-base px-8 h-12 bg-white/50 hover:bg-white/40 text-[#182966] backdrop-blur-md" onClick={handleGetFeedbackClick}>
                                            {t.hero.learnMore}
                                        </Button>
                                    </motion.div>
                                    <div className="flex items-center gap-2 text-sm text-white">
                                        <CheckCircle className="h-4 w-4 text-white" />
                                        <span>{t.hero.expertExaminers}</span>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Trust Badge */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 1.3, ease: [0.25, 0.1, 0.25, 1.0] }}
                                className="text-center mt-12 md:mt-16"
                            >
                                <p
                                    className="text-sm sm:text-base"
                                    style={{
                                        fontFamily: "'Montserrat', sans-serif",
                                        fontWeight: "600",
                                        color: '#ffffff',
                                        textShadow: `
                      0 2px 6px rgba(0, 0, 0, 0.4),
                      0 4px 12px rgba(0, 0, 0, 0.3)
                    `,
                                    }}
                                >
                                    {t.hero.trustBadge}
                                </p>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </div>
            <ComingSoonModal isOpen={showComingSoonModal} onClose={() => setShowComingSoonModal(false)} />
        </section>
    );
}