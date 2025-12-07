import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { ArrowRight, CheckCircle } from "lucide-react";
import { authService } from "../services/auth.service";
import newHeroImage from "figma:asset/6303e8dcc4b52dc83bedb7876578abe30165231a.png";
import { useState } from "react";
import { ComingSoonModal } from "./ComingSoonModal";
import { useLanguage } from "../contexts/LanguageContext";
import { AdaptiveImage } from "./AdaptiveImage";
import { resolveImageSrc } from "../utils/imageResolver";

export function Hero() {
  const navigate = useNavigate();
  const [showComingSoonModal, setShowComingSoonModal] = useState(false);
  const { t, language } = useLanguage();
  
  // TEMPORARY: Fallback to Unsplash if local image not found
  const heroImageSrc = resolveImageSrc(newHeroImage, '/images/hero-image.png');
  const fallbackImage = 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1920&q=80';
  
  // Use fallback if local image fails
  const finalImageSrc = heroImageSrc.includes('figma:asset') ? fallbackImage : heroImageSrc;
  
  console.log('[Hero] newHeroImage:', newHeroImage);
  console.log('[Hero] heroImageSrc:', heroImageSrc);
  console.log('[Hero] finalImageSrc:', finalImageSrc);
  
  const handleBookTestClick = () => {
    if (authService.isAuthenticated()) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  const handleGetFeedbackClick = () => {
    // Navigate to login page
    if (authService.isAuthenticated()) {
      navigate('/dashboard');
    } else {
      navigate('/login');
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
        style={{
          backgroundImage: `url(${finalImageSrc})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center 35%',
          backgroundRepeat: 'no-repeat',
          imageRendering: 'crisp-edges',
        }}
      >
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
          <div className="w-full max-w-4xl">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
                <motion.h1
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.5, ease: [0.25, 0.1, 0.25, 1.0] }}
                    className="mb-4 text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl"
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
                        margin: '0 auto',
                    }}
                >
                    {language === 'uz' ? (
                      <>
                        Ularga bu yilgi <span style={{ fontSize: '1.3em', fontWeight: '900', display: 'inline-block', transform: 'translateY(-0.1em)' }}>*</span> sovg'ang IELTS g'alabang bo'lsin
                      </>
                    ) : (
                      t.hero.title
                    )}
                </motion.h1>
              
              {/* Tagline */}
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.7, ease: [0.25, 0.1, 0.25, 1.0] }}
                className="mb-12 text-base sm:text-lg md:text-xl lg:text-2xl"
                style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontWeight: "600",
                  color: '#ffffff',
                  letterSpacing: '0.02em',
                  lineHeight: '1.4',
                  textShadow: `
                    0 2px 8px rgba(0, 0, 0, 0.4),
                    0 4px 16px rgba(0, 0, 0, 0.3)
                  `,
                  maxWidth: '800px',
                  margin: '0 auto 3rem',
                }}
              >
                {t.hero.tagline}
              </motion.p>
              
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.1, ease: [0.25, 0.1, 0.25, 1.0] }}
                className="flex flex-col sm:flex-row gap-4 justify-center items-start"
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
            </motion.div>
          </div>
        </div>
      </div>
      <ComingSoonModal isOpen={showComingSoonModal} onClose={() => setShowComingSoonModal(false)} />
    </section>
  );
}