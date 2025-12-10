import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { fadeInLeft, fadeInRight, staggerItem } from "../utils/animations";

export function CTASection() {
    const navigate = useNavigate();
    const { t } = useLanguage();

    const benefits = [
        t.cta.reason1,
        t.cta.reason2,
        t.cta.reason3,
        t.cta.reason4,
        t.cta.reason5,
        t.cta.reason6,
    ];

    return (
        <section className="py-24 bg-gradient-to-br from-[#182966] to-[#182966]/90 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
                        backgroundSize: "40px 40px",
                    }}
                />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                    {/* Left Side - Content */}
                    <motion.div
                        {...fadeInLeft}
                    >
                        <h2 className="mb-6 text-white">{t.cta.title}</h2>
                        <p className="text-white/80 mb-8 text-lg">{t.cta.joinThousands}</p>

                        <div className="flex flex-col sm:flex-row gap-4 mb-12">
                            <Button
                                size="lg"
                                className="bg-white text-[#182966] hover:bg-white/90 px-8 group"
                                onClick={() => navigate("/login")}
                            >
                                {t.cta.button}
                                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </Button>
                            <Button
                                size="lg"
                                variant="outline"
                                className="border-2 border-white text-white hover:bg-white hover:text-[#182966] px-8"
                            >
                                {t.cta.scheduleCall}
                            </Button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-white/90">
                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                                <div className="mb-1">{t.cta.avgScoreIncrease}</div>
                                <div className="text-white">+1.5 {t.cta.bands}</div>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                                <div className="mb-1">{t.cta.studentSatisfaction}</div>
                                <div className="text-white">98%</div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right Side - Benefits */}
                    <motion.div
                        {...fadeInRight}
                        className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 shadow-2xl"
                    >
                        <h3 className="mb-6 text-[#182966]">{t.cta.whyChoose}</h3>
                        <div className="space-y-4">
                            {benefits.map((benefit, index) => (
                                <motion.div
                                    key={index}
                                    {...staggerItem(index, 0.05)}
                                    className="flex items-start gap-3"
                                >
                                    <div className="flex-shrink-0 w-6 h-6 bg-[#182966]/10 rounded-full flex items-center justify-center mt-0.5">
                                        <Sparkles className="h-4 w-4 text-[#182966]" />
                                    </div>
                                    <span className="text-[#182966]/80">{benefit}</span>
                                </motion.div>
                            ))}
                        </div>

                        <div className="mt-8 pt-8 border-t border-gray-200">
                            <p className="text-[#182966]/60 text-sm text-center">
                                {t.cta.specialOffer}
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Decorative Elements - keep static, no animation */}
            <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute -top-20 -right-20 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        </section>
    );
}