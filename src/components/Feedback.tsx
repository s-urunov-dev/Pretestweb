import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Video, Clock, Star, CheckCircle } from "lucide-react";
import { authService } from "../services/auth.service";
import { useLanguage } from "../contexts/LanguageContext";

export function Feedback() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  // Use direct path from public folder (no import needed)
  const feedbackImage = "/images/feedback-image.png";
  
  const steps = [
    {
      id: 'step-1',
      icon: Video,
      title: t?.feedbackLanding?.step1Title || 'Upload Your Work',
      description: t?.feedbackLanding?.step1Desc || 'Submit your writing or speaking test',
    },
    {
      id: 'step-2',
      icon: Clock,
      title: t?.feedbackLanding?.step2Title || 'Expert Review',
      description: t?.feedbackLanding?.step2Desc || 'Get reviewed by IELTS experts',
    },
    {
      id: 'step-3',
      icon: Star,
      title: t?.feedbackLanding?.step3Title || 'Improve Your Score',
      description: t?.feedbackLanding?.step3Desc || 'Apply feedback to improve',
    },
  ];

  const handleGetFeedbackClick = () => {
    try {
      if (authService.isAuthenticated()) {
        navigate('/feedback');
      } else {
        navigate('/login');
      }
    } catch (error) {
      console.error('Navigation error:', error);
      navigate('/login');
    }
  };

  return (
    <section id="feedback" className="py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="mb-4 text-[#182966]">{t.feedbackLanding.title}</h2>
          <p className="max-w-2xl mx-auto text-[#182966]/70">
              {t.feedbackLanding.subtitle}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Steps */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            {steps.map((step, index) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="relative"
              >
                {index < steps.length - 1 && (
                  <div className="absolute left-6 top-16 w-0.5 h-full bg-[#182966]/10" />
                )}
                <div className="flex gap-4">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="flex-shrink-0 w-12 h-12 bg-[#182966] text-white rounded-xl flex items-center justify-center"
                  >
                    <step.icon className="h-6 w-6" />
                  </motion.div>
                  <div>
                    <h3 className="mb-2 text-[#182966]">{step.title}</h3>
                    <p className="text-[#182966]/70">{step.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.8 }}
              className="pt-4"
            >
              <Button className="bg-[#182966] hover:bg-[#182966]/90 text-white px-8 w-full sm:w-auto" onClick={handleGetFeedbackClick}>
                  {t.feedbackLanding.getYourFeedback}
              </Button>
            </motion.div>
          </motion.div>

          {/* Visual */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl">
              <img
                src={feedbackImage}
                alt="IELTS Expert providing personalized video feedback"
                className="w-full h-[300px] sm:h-[400px] lg:h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#182966]/60 to-transparent" />
              
              {/* Floating Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6 bg-white/95 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-[#182966]/10 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-[#182966]" />
                  </div>
                  <div>
                    <div className="text-[#182966] mb-1">{t.feedbackLanding.formerExaminers}</div>
                    <p className="text-[#182966]/70 text-sm">
                        {t.feedbackLanding.formerExaminersDesc}
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Floating Stats */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
              className="absolute -top-4 sm:-top-6 -right-4 sm:-right-6 bg-white rounded-2xl shadow-xl p-4 sm:p-6 border border-[#182966]/10 hidden sm:block"
            >
              <div className="text-[#182966] text-center mb-1">{t.feedbackLanding.avgImprovement}</div>
              <div className="text-[#182966] text-center">{t.feedbackLanding.bandsImprovement}</div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}