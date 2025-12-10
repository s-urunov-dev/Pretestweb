import { motion } from "motion/react";
import { Check } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { fadeInUp, staggerItem } from "../utils/animations";

// Icon and color mapping for each test type
const FEATURE_CONFIG = {
  reading: {
    icon: BookOpen,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
  },
  listening: {
    icon: Headphones,
    color: 'text-purple-600',
    bg: 'bg-purple-50',
  },
  writing: {
    icon: PenTool,
    color: 'text-green-600',
    bg: 'bg-green-50',
  },
  speaking: {
    icon: Mic,
    color: 'text-orange-600',
    bg: 'bg-orange-50',
  },
  invigilator: {
    icon: Users,
    color: 'text-[#182966]',
    bg: 'bg-[#182966]/10',
  },
};

export function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleBookTest = (bookingData: { productId: number; productName: string; productPrice: number; step: 'session' }) => {
    if (authService.isAuthenticated()) {
      // Save booking data and navigate to dashboard
      localStorage.setItem('pendingBooking', JSON.stringify(bookingData));
      navigate('/dashboard');
    } else {
      // Save booking data and navigate to login
      localStorage.setItem('pendingBooking', JSON.stringify(bookingData));
      navigate('/login');
    }
  };

  const loadProducts = useCallback(async () => {
    try {
      const response = await publicService.getTestPackages();
      if (response.success && response.data) {
        setProducts(response.data);
      }
    } catch (error) {
      console.error('Failed to load products:', error);
      // Use mock data on error
      setProducts(MOCK_PRODUCTS);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  // Get features list based on product type with icon mapping
  const getFeatures = (product: Product): Array<{ label: string; type: keyof typeof FEATURE_CONFIG }> => {
    const features: Array<{ label: string; type: keyof typeof FEATURE_CONFIG }> = [];
    if (product.has_reading) features.push({ label: 'Reading Test', type: 'reading' });
    if (product.has_listening) features.push({ label: 'Listening Test', type: 'listening' });
    if (product.has_writing) features.push({ label: 'Writing Test', type: 'writing' });
    if (product.has_speaking) features.push({ label: 'Speaking Test', type: 'speaking' });
    if (product.has_invigilator) features.push({ label: 'With Invigilator', type: 'invigilator' });
    return features;
  };

  // Determine if product is popular (full simulation type)
  const isPopular = (product: Product): boolean => {
    return product.product_type === 'full';
  };

  if (isLoading) {
    return (
      <section id="products" className="py-24 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="mb-4 text-[#182966]">{t.products.choosePackage}</h2>
            <p className="max-w-2xl mx-auto text-[#182966]/70">{t.common.loading}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="products" className="py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          {...fadeInUp}
          className="text-center mb-16"
        >
          <h2 className="mb-4 text-[#182966]">{t.products.choosePackage}</h2>
          <p className="max-w-2xl mx-auto text-[#182966]/70">
            {t.products.selectPackageDesc}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-5xl mx-auto">
          {products.map((product, index) => {
            const features = getFeatures(product);
            const popular = isPopular(product);
            
            return (
              <motion.div
                key={product.id}
                {...staggerItem(index, 0.1)}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                className={`relative rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-lg border-2 transition-all ${
                  popular
                    ? "bg-[#182966]/50 backdrop-blur-md border-[#182966] shadow-xl"
                    : "bg-white border-gray-100 hover:border-[#182966]/30"
                }`}
              >
                {popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-[#182966] text-white px-4 py-1 rounded-full text-sm">
                      {t.products.mostPopular}
                    </span>
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="text-[#182966] mb-3">{product.name}</h3>
                  <div className="flex items-baseline gap-2">
                    <span className="text-[#182966]">{product.price.toLocaleString()}</span>
                  </div>
                </div>

                <div className="space-y-3 mb-8">
                  {features.map((feature, idx) => {
                    const config = FEATURE_CONFIG[feature.type];
                    const Icon = config.icon;
                    
                    return (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 + idx * 0.1 }}
                        className="flex items-center gap-3"
                      >
                        <div className={`p-2 rounded-lg ${config.bg}`}>
                          <Icon className={`h-4 w-4 ${config.color}`} />
                        </div>
                        <span className="text-[#182966]/80">{feature.label}</span>
                      </motion.div>
                    );
                  })}
                </div>

                <Button
                  className={`w-full group ${
                    popular
                      ? "bg-[#182966] hover:bg-[#182966]/90 text-white"
                      : "bg-white border-2 border-[#182966] text-[#182966] hover:bg-[#182966] hover:text-white"
                  }`}
                  onClick={() => handleBookTest({ productId: product.id, productName: product.name, productPrice: product.price, step: 'session' })}
                >
                  {t.products.selectButton}
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}