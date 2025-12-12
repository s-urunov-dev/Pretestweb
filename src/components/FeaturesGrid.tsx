import { motion } from "motion/react";
import { Mic, PenTool, FileText } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";

export function FeaturesGrid() {
  const { t } = useLanguage();

  const features = [
    {
      icon: Mic,
      title: t.features.card1Title,
      description: t.features.card1Desc,
      gradient: "from-blue-500 to-indigo-600",
    },
    {
      icon: PenTool,
      title: t.features.card2Title,
      description: t.features.card2Desc,
      gradient: "from-purple-500 to-pink-600",
    },
    {
      icon: FileText,
      title: t.features.card3Title,
      description: t.features.card3Desc,
      gradient: "from-emerald-500 to-teal-600",
    },
  ];

  return (
    <section className="py-20 bg-gray-50" id="features">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 
            className="mb-4"
            style={{
              fontFamily: "'Oswald', sans-serif",
              color: '#182966',
            }}
          >
            {t.features.title}
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {t.features.subtitle}
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              {/* Icon */}
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ duration: 0.3 }}
                className={`w-16 h-16 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6`}
              >
                <feature.icon className="w-8 h-8 text-white" strokeWidth={2} />
              </motion.div>

              {/* Title */}
              <h3 
                className="mb-3"
                style={{
                  fontFamily: "'Montserrat', sans-serif",
                  color: '#182966',
                }}
              >
                {feature.title}
              </h3>

              {/* Description */}
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
