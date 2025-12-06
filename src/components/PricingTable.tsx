import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Check, AlertTriangle, X, Zap, Search, MessageSquare, Rocket, Flame, Bot } from "lucide-react";
import { authService } from "../services/auth.service";
import { useLanguage } from "../contexts/LanguageContext";
import westminsterBigBen from "figma:asset/3600c3807830360d61d240921531dcdb4a5b4085.png";

interface PricingCardProps {
  isRecommended?: boolean;
  title: string;
  subtitle: string;
  price: string;
  currency: string;
  features: Array<{
    text: string;
    icon: "check" | "warning" | "cross" | "lightning" | "search" | "message" | "rocket" | "flame" | "bot";
    color: string;
  }>;
  buttonText: string;
  buttonVariant: "primary" | "secondary";
  onSelect: () => void;
  delay?: number;
  recommendedBadge?: string;
}

const iconComponents = {
  check: Check,
  warning: AlertTriangle,
  cross: X,
  lightning: Zap,
  search: Search,
  message: MessageSquare,
  rocket: Rocket,
  flame: Flame,
  bot: Bot,
};

function PricingCard({
  isRecommended = false,
  title,
  subtitle,
  price,
  currency,
  features,
  buttonText,
  buttonVariant,
  onSelect,
  delay = 0,
  recommendedBadge,
}: PricingCardProps) {
  const westminsterImage = westminsterBigBen;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      whileHover={{ 
        y: isRecommended ? -8 : -2, 
        transition: { duration: 0.3 } 
      }}
      className={`relative bg-white rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-lg border-2 transition-all ${
        isRecommended
          ? "border-[#FFD700] shadow-2xl md:scale-105 md:-translate-y-4"
          : "border-gray-300 hover:border-gray-400 opacity-75"
      }`}
    >
      {/* Background Image for HOT SALE card */}
      {isRecommended && (
        <div 
          className="absolute inset-0 z-0 rounded-2xl md:rounded-3xl overflow-hidden"
          style={{
            backgroundImage: `url(${westminsterImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.08,
            filter: 'brightness(1.3) saturate(0.5)',
          }}
        />
      )}
      
      {/* Recommended Badge - positioned relative to card */}
      {isRecommended && recommendedBadge && (
        <motion.div
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: delay + 0.2, type: "spring", stiffness: 200 }}
          className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20"
        >
          <div className="relative bg-gradient-to-br from-[#FFD700] via-[#FFA500] to-[#FF8C00] text-white px-6 md:px-10 py-2.5 md:py-4 rounded-full shadow-2xl flex items-center gap-1.5 md:gap-2 whitespace-nowrap">
            {/* Shiny overlay effect */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-transparent rounded-full"></div>
            <div className="absolute inset-0 bg-gradient-to-bl from-transparent via-yellow-200/20 to-transparent rounded-full"></div>
            
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, -10, 10, -10, 0],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="relative z-10"
            >
              <Flame className="h-4 w-4 md:h-5 md:w-5 lg:h-6 lg:w-6 drop-shadow-md" />
            </motion.div>
            <motion.span 
              className="text-sm md:text-lg lg:text-xl font-extrabold uppercase tracking-wider relative z-10 drop-shadow-md"
              animate={{
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              style={{
                textShadow: '0 2px 4px rgba(0,0,0,0.3), 0 0 10px rgba(255,215,0,0.5)'
              }}
            >
              {recommendedBadge}
            </motion.span>
          </div>
        </motion.div>
      )}
      
      {/* Content wrapper with z-index */}
      <div className="relative z-10">
        {/* Header */}
        <div className="mb-8 text-center">
          <h3 
            className={`mb-2 ${isRecommended ? "text-3xl md:text-4xl font-bold inline-block" : "text-2xl md:text-3xl text-gray-800"}`}
            style={isRecommended ? {
              color: '#182966',
              letterSpacing: '0.05em',
              marginTop: '0.5rem',
              fontWeight: '800'
            } : undefined}
          >
            {title}
          </h3>
          <div 
            className={`inline-block mt-2 ${isRecommended ? "px-3 py-1 rounded-md text-xs font-semibold" : ""}`}
            style={isRecommended ? {
              background: 'linear-gradient(135deg, #182966 0%, #C84B6B 50%, #182966 100%)'
            } : undefined}
          >
            <p className={`${isRecommended ? "text-white uppercase tracking-wide" : "text-sm md:text-base text-gray-600"}`}>
              {subtitle}
            </p>
          </div>
        </div>

        {/* Separator Line */}
        {isRecommended && (
          <div className="mb-8">
            <hr className="border-t border-gray-200" />
          </div>
        )}

        {/* Price */}
        <div className="mb-8 text-center">
          <div className="flex items-baseline justify-center gap-1">
            <span className={`text-4xl md:text-5xl ${isRecommended ? "text-[#182966]" : "text-gray-900"}`}>
              {price}
            </span>
            <span className="text-sm md:text-base text-gray-400 ml-1">{currency}</span>
          </div>
        </div>

        {/* Features */}
        <div className="space-y-3 md:space-y-4 mb-8">
          {features.map((feature, idx) => {
            const IconComponent = iconComponents[feature.icon];
            
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: delay + 0.3 + idx * 0.1 }}
                className="flex items-start gap-3"
              >
                <div className="flex-shrink-0 mt-0.5">
                  <IconComponent className={`h-5 w-5 ${feature.color}`} />
                </div>
                <span 
                  className="text-gray-700 text-sm leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: feature.text }}
                />
              </motion.div>
            );
          })}
        </div>

        {/* CTA Button */}
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            onClick={onSelect}
            className={`w-full py-4 md:py-6 text-sm md:text-base transition-all shadow-lg hover:shadow-xl ${
              buttonVariant === "primary"
                ? "text-white"
                : "text-gray-600"
            }`}
            style={
              buttonVariant === "primary"
                ? {
                    background: 'linear-gradient(135deg, #182966 0%, #C84B6B 50%, #182966 100%)',
                  }
                : {
                    background: '#D1D5DB',
                  }
            }
          >
            {buttonVariant === "primary" ? "Pretest Qilaman" : "Pretest Qilaman !"}
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
}

export function PricingTable() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleBookTest = (productType: "lite" | "premium") => {
    const bookingData = {
      productId: productType === "lite" ? 1 : 2,
      productName: productType === "lite" ? "PRETEST LITE" : "PRETEST 24",
      productPrice: productType === "lite" ? 199990 : 299990,
      step: "session" as const,
    };

    if (authService.isAuthenticated()) {
      localStorage.setItem("pendingBooking", JSON.stringify(bookingData));
      navigate("/dashboard");
    } else {
      localStorage.setItem("pendingBooking", JSON.stringify(bookingData));
      navigate("/login");
    }
  };

  return (
    <section id="products" className="py-16 md:py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16 max-w-5xl mx-auto"
        >
          <motion.h2 
            className="mb-4 text-4xl sm:text-5xl md:text-6xl lg:text-7xl px-4"
            initial={{ scale: 0.95 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            style={{
              background: 'linear-gradient(135deg, #182966 0%, #C84B6B 50%, #182966 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              fontWeight: '800',
              lineHeight: '1.1',
            }}
          >
            {t.products.choosePackage}
          </motion.h2>
          <p className="max-w-2xl mx-auto text-[#182966]/70">
            {t.products.selectPackageDesc}
          </p>
        </motion.div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-5xl mx-auto">
          {/* PRETEST LITE - Left Card */}
          <PricingCard
            title={t.products.liteTitle}
            subtitle={t.products.liteSubtitle}
            price={t.products.litePrice}
            currency={t.products.currency}
            features={[
              {
                text: t.products.liteFeature1,
                icon: "check",
                color: "text-green-600",
              },
              {
                text: t.products.liteFeature2,
                icon: "bot",
                color: "text-blue-600",
              },
              {
                text: t.products.liteFeature3,
                icon: "cross",
                color: "text-red-600",
              },
              {
                text: t.products.liteFeature4,
                icon: "lightning",
                color: "text-purple-600",
              },
              {
                text: t.products.liteFeature5,
                icon: "check",
                color: "text-[#182966]",
              },
            ]}
            buttonText={t.products.liteButton}
            buttonVariant="secondary"
            onSelect={() => handleBookTest("lite")}
            delay={0.2}
          />

          {/* PRETEST 24 - Right Card (Recommended) */}
          <PricingCard
            isRecommended={true}
            recommendedBadge={t.products.recommended}
            title={t.products.premiumTitle}
            subtitle={t.products.premiumSubtitle}
            price={t.products.premiumPrice}
            currency={t.products.currency}
            features={[
              {
                text: t.products.premiumFeature1,
                icon: "flame",
                color: "text-orange-600",
              },
              {
                text: t.products.premiumFeature2,
                icon: "flame",
                color: "text-orange-600",
              },
              {
                text: t.products.premiumFeature3,
                icon: "flame",
                color: "text-orange-600",
              },
              {
                text: t.products.premiumFeature4,
                icon: "flame",
                color: "text-orange-600",
              },
              {
                text: t.products.premiumFeature5,
                icon: "flame",
                color: "text-orange-600",
              },
            ]}
            buttonText={t.products.premiumButton}
            buttonVariant="primary"
            onSelect={() => handleBookTest("premium")}
            delay={0.4}
          />
        </div>
      </div>
    </section>
  );
}