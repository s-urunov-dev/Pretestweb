import { useState, useEffect, useCallback } from "react";
import { motion } from "motion/react";
import { landingService, Reel as ApiReel } from "../services/landing.service";
import { VideoTestimonialCard } from "./VideoTestimonialCard";
import {useLanguage} from "../contexts/LanguageContext";
import { fadeInUp, fadeInUpStagger } from "../utils/kingkongAnimations";

interface Testimonial {
  id: string;
  studentName: string;
  studentPhoto: string;
  score: number;
  testimonial: string;
  testDate: string;
  country: string;
  order: number;
  videoUrl?: string;
}

const gradients = [
  "from-blue-500/20 to-purple-500/20",
  "from-green-500/20 to-teal-500/20",
  "from-pink-500/20 to-rose-500/20",
  "from-orange-500/20 to-red-500/20",
  "from-indigo-500/20 to-blue-500/20",
];

export function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    loadTestimonials();
  }, []);

  // Auto-rotation - paused when video is playing or dragging
  useEffect(() => {
    if (testimonials.length <= 1 || isDragging || isVideoPlaying) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 8000); // 8 seconds - increased for better UX

    return () => clearInterval(timer);
  }, [testimonials.length, isDragging, isVideoPlaying]);

  const loadTestimonials = async () => {
    try {
      const apiReels = await landingService.getReels();

      if (apiReels && apiReels.length > 0) {
        // Convert API reels to Testimonial format
        const converted: Testimonial[] = apiReels.map((reel: ApiReel) => {
          // Parse score safely - ensure it's a valid number
          const parsedScore = parseFloat(reel.score);
          const validScore = !isNaN(parsedScore) && isFinite(parsedScore) ? parsedScore : 0;

          return {
            id: reel.id.toString(),
            studentName: reel.title,
            studentPhoto: reel.thumbnail,
            score: validScore,
            testimonial: reel.description,
            testDate: '',
            country: '',
            order: reel.id,
            videoUrl: reel.video, // Direct URL from API
          };
        });

        setTestimonials(converted);
      }
    } catch (error) {
      // Silent fail - will show empty state
      setTestimonials([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVideoClick = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  const handleDragEnd = useCallback((event: any, info: any) => {
    const threshold = 50;
    const velocity = 500;

    // Check velocity for faster swipes
    if (Math.abs(info.velocity.x) > velocity) {
      if (info.velocity.x > 0) {
        // Fast swipe right - previous
        setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
      } else {
        // Fast swipe left - next
        setCurrentIndex((prev) => (prev + 1) % testimonials.length);
      }
    } else if (info.offset.x > threshold) {
      // Slow swipe right - previous
      setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    } else if (info.offset.x < -threshold) {
      // Slow swipe left - next
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }

    setIsDragging(false);
  }, [testimonials.length]);

  if (isLoading) {
    return (
      <section id="testimonials" className="py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="mb-4 text-[#182966]">{t.testimonials.title}</h2>
            <p className="max-w-2xl mx-auto text-[#182966]/70">Loading testimonials...</p>
          </div>
        </div>
      </section>
    );
  }

  if (testimonials.length === 0) {
    return null;
  }

  const currentTestimonial = testimonials[currentIndex];
  const gradient = gradients[currentIndex % gradients.length];

  return (
    <section id="testimonials" className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="mb-4 text-[#182966]">{t.testimonials.title}</h2>
          <p className="max-w-2xl mx-auto text-[#182966]/70">
              {t.testimonials.subtitle}
          </p>
        </motion.div>

        {/* Instagram Reels Style Layout */}
        <div className="flex justify-center items-center gap-4 md:gap-6">
          {/* Side Videos (Left) */}
          <div className="hidden md:flex flex-col gap-4 opacity-40">
            {testimonials.length > 1 && (() => {
              const prevIndex = (currentIndex - 1 + testimonials.length) % testimonials.length;
              const video = testimonials[prevIndex];
              const videoGradient = gradients[prevIndex % gradients.length];

              return (
                <motion.div
                  key={video.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 0.4, scale: 0.85 }}
                  className="w-32 h-56 rounded-2xl overflow-hidden cursor-pointer"
                  onClick={() => handleVideoClick(prevIndex)}
                >
                  <div className={`w-full h-full bg-gradient-to-br ${videoGradient} relative`}>
                    <img
                      src={video.studentPhoto}
                      alt={video.studentName}
                      className="w-full h-full object-cover mix-blend-overlay"
                    />
                  </div>
                </motion.div>
              );
            })()}
          </div>

          {/* Main Video */}
          <motion.div
            key={currentIndex}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.15}
            dragTransition={{ bounceStiffness: 400, bounceDamping: 30 }}
            onDragStart={() => setIsDragging(true)}
            onDragEnd={handleDragEnd}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="relative w-full max-w-[280px] sm:max-w-[300px] md:max-w-[320px] h-[450px] sm:h-[500px] md:h-[600px] rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl group cursor-grab active:cursor-grabbing"
          >
            <VideoTestimonialCard
              videoUrl={currentTestimonial.videoUrl}
              thumbnail={currentTestimonial.studentPhoto}
              studentName={currentTestimonial.studentName}
              score={currentTestimonial.score}
              description={currentTestimonial.testimonial}
              country={currentTestimonial.country}
              isCurrent={true}
              isMuted={isMuted}
              onMuteToggle={() => {
                setIsMuted(!isMuted);
              }}
              onVideoPlayingChange={(playing) => {
                setIsVideoPlaying(playing);
              }}
              gradient={gradient}
              totalCount={testimonials.length}
              currentIndex={currentIndex}
            />
          </motion.div>

          {/* Side Videos (Right) */}
          <div className="hidden md:flex flex-col gap-4 opacity-40">
            {testimonials.length > 1 && (() => {
              const nextIndex = (currentIndex + 1) % testimonials.length;
              const video = testimonials[nextIndex];
              const videoGradient = gradients[nextIndex % gradients.length];

              return (
                <motion.div
                  key={video.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 0.4, scale: 0.85 }}
                  className="w-32 h-56 rounded-2xl overflow-hidden cursor-pointer"
                  onClick={() => handleVideoClick(nextIndex)}
                >
                  <div className={`w-full h-full bg-gradient-to-br ${videoGradient} relative`}>
                    <img
                      src={video.studentPhoto}
                      alt={video.studentName}
                      className="w-full h-full object-cover mix-blend-overlay"
                    />
                  </div>
                </motion.div>
              );
            })()}
          </div>
        </div>

        {/* Dots Navigation */}
        {testimonials.length > 1 && (
          <div className="flex flex-wrap justify-center items-center gap-1.5 mt-8 px-4">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => handleVideoClick(index)}
                style={{
                  height: '6px',
                  minHeight: '6px',
                  maxHeight: '6px',
                  width: index === currentIndex ? '24px' : '6px',
                  minWidth: index === currentIndex ? '24px' : '6px',
                  backgroundColor: index === currentIndex ? '#182966' : 'rgba(24, 41, 102, 0.3)',
                  borderRadius: '9999px',
                  padding: 0,
                  border: 'none'
                }}
                className="transition-all duration-300 cursor-pointer flex-shrink-0 hover:opacity-80"
                aria-label={`Go to video ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}