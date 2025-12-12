import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Check } from "lucide-react";
import { authService } from "../services/auth.service";
import { useLanguage } from "../contexts/LanguageContext";

interface PricingCardProps {
  isRecommended?: boolean;
  label: string;
  price: string;
  currency: string;
  features: Array<string>;
  quote?: string;
  buttonText: string;
  onSelect: () => void;
  delay?: number;
}

function PricingCard({
  isRecommended = false,
  label,
  price,
  currency,
  features,
  quote,
  buttonText,
  onSelect,
  delay = 0,
}: PricingCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      whileHover={{ 
        y: -4, 
        transition: { duration: 0.3 } 
      }}
      className={`relative rounded-2xl p-8 border transition-all ${
        isRecommended
          ? "bg-[#182966] border-[#182966] shadow-2xl"
          : "bg-gray-50 border-gray-200 shadow-lg"
      }`}
      style={{
        fontFamily: '"Inter", "Roboto", system-ui, -apple-system, sans-serif',
      }}
    >
      {/* Card Label (Eyebrow) */}
      <div className="mb-6 text-center">
        <p 
          className="uppercase tracking-wider"
          style={{
            fontSize: isRecommended ? '24px' : '14px',
            fontWeight: 700,
            letterSpacing: '0.04em',
            color: isRecommended ? '#FFFFFF' : '#6B7280',
          }}
        >
          {label}
        </p>
      </div>

      {/* Price */}
      <div className="mb-8 pb-8" style={{ borderBottom: `2px solid ${isRecommended ? 'rgba(255,255,255,0.3)' : '#E5E7EB'}` }}>
        <div className="flex items-baseline gap-2">
          <span 
            style={{
              fontSize: '48px',
              fontWeight: 800,
              color: isRecommended ? '#FFFFFF' : '#182966',
              lineHeight: 1,
            }}
          >
            {price}
          </span>
          <span 
            style={{
              fontSize: '18px',
              fontWeight: 500,
              color: isRecommended ? '#E5E7EB' : '#6B7280',
            }}
          >
            {currency}
          </span>
        </div>
      </div>

      {/* Features List */}
      <div className="space-y-4 mb-8">
        {features.map((feature, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: delay + 0.2 + idx * 0.1 }}
            className="flex items-start gap-3"
          >
            <div className="flex-shrink-0 mt-0.5">
              {isRecommended ? (
                <span className="text-xl">🔥</span>
              ) : (
                <Check className="h-5 w-5 text-green-600" />
              )}
            </div>
            <span 
              style={{
                fontSize: '16px',
                fontWeight: 400,
                color: isRecommended ? '#FFFFFF' : '#374151',
                lineHeight: 1.5,
              }}
            >
              {feature}
            </span>
          </motion.div>
        ))}
      </div>

      {/* Quote */}
      {quote && (
        <div className="mb-8 pt-4" style={{ borderTop: `1px solid ${isRecommended ? 'rgba(255,255,255,0.2)' : '#E5E7EB'}` }}>
          <p 
            style={{
              fontSize: '14px',
              fontWeight: 500,
              fontStyle: 'italic',
              color: isRecommended ? '#E5E7EB' : '#4B5563',
              lineHeight: 1.5,
            }}
          >
            "{quote}"
          </p>
        </div>
      )}

      {/* CTA Button */}
      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        <Button
          onClick={onSelect}
          className={`w-full transition-all ${
            isRecommended
              ? "bg-white hover:bg-gray-100 text-[#182966] shadow-lg hover:shadow-xl"
              : "bg-[#182966] hover:bg-[#182966]/90 text-white shadow-lg hover:shadow-xl"
          }`}
          style={{
            fontSize: '16px',
            fontWeight: 600,
            padding: '16px 24px',
            borderRadius: '12px',
          }}
        >
          {buttonText}
        </Button>
      </motion.div>
    </motion.div>
  );
}

export function PricingTable() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleBookTest = (productType: "british" | "local") => {
    const bookingData = {
      productId: productType === "british" ? 2 : 1,
      productName: productType === "british" ? "BRITANIYALIK MUTAXASSIS" : "MAHALLIY MUTAXASSIS",
      productPrice: productType === "british" ? 299990 : 199990,
      step: "session" as const,
    };

    if (authService.isAuthenticated()) {
      localStorage.setItem("pendingBooking", JSON.stringify(bookingData));
      navigate("/dashboard");
    } else {
      localStorage.setItem("pendingBooking", JSON.stringify(bookingData));
      navigate("/register");
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
              color: '#182966',
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
          {/* BRITANIYALIK MUTAXASSIS - Premium Card */}
          <PricingCard
            isRecommended={true}
            label={t.products.britishLabel}
            price={t.products.britishPrice}
            currency={t.products.currency}
            features={[
              t.products.britishFeature1,
              t.products.britishFeature2,
              t.products.britishFeature3,
              t.products.britishFeature4,
            ]}
            quote={t.products.britishQuote}
            buttonText={t.products.britishButton}
            onSelect={() => handleBookTest("british")}
            delay={0.2}
          />

          {/* MAHALLIY MUTAXASSIS - Standard Card */}
          <PricingCard
            isRecommended={false}
            label={t.products.localLabel}
            price={t.products.localPrice}
            currency={t.products.currency}
            features={[
              t.products.localFeature1,
              t.products.localFeature2,
              t.products.localFeature3,
              t.products.localFeature4,
            ]}
            buttonText={t.products.localButton}
            onSelect={() => handleBookTest("local")}
            delay={0.4}
          />
        </div>

        {/* Location Note for SEO */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-12 text-gray-600 italic"
        >
          {t.footer.locationNote}
        </motion.p>
      </div>
    </section>
  );
}