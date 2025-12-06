import { useState, useEffect, useRef } from "react";
import { landingService, Partner as ApiPartner } from "../services/landing.service";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { motion, useMotionValue, useTransform, animate } from "motion/react";
import { MOCK_INSTITUTIONS } from "../data/mock-data";
import {useLanguage} from "../contexts/LanguageContext";

interface Institution {
  id: string;
  name: string;
  logoUrl: string;
  websiteUrl: string;
  order: number;
}

export function Partners() {
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [containerWidth, setContainerWidth] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const { t } = useLanguage();

  useEffect(() => {
    loadInstitutions();
  }, []);

  // Measure container width
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.scrollWidth / 2);
      }
    };

    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, [institutions]);

  // Infinite scroll animation
  useEffect(() => {
    if (isDragging || containerWidth === 0) return;

    const controls = animate(x, -containerWidth, {
      duration: 40,
      ease: "linear",
      repeat: Infinity,
      repeatType: "loop",
      onRepeat: () => {
        x.set(0);
      },
    });

    return controls.stop;
  }, [isDragging, containerWidth, x]);

  const loadInstitutions = async () => {
    try {
      const apiPartners = await landingService.getPartners();
      
      if (apiPartners && apiPartners.length > 0) {
        // Convert API partners to Institution format
        const converted: Institution[] = apiPartners.map((partner: ApiPartner) => ({
          id: partner.id.toString(),
          name: partner.title,
          logoUrl: partner.logo, // Now using logo from API
          websiteUrl: partner.url,
          order: partner.id,
        }));
        setInstitutions(converted);
      }
    } catch (error) {
      console.error('Failed to load institutions:', error);
      // Use mock data on error
      const mockConverted: Institution[] = MOCK_INSTITUTIONS.map((inst) => ({
        id: inst.id.toString(),
        name: inst.name,
        logoUrl: inst.logo,
        websiteUrl: '#',
        order: inst.id,
      }));
      setInstitutions(mockConverted);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <section className="py-12 border-y border-[#182966]/10 bg-[#182966]/5">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm text-[#182966]/70 uppercase tracking-widest">
            Trusted by leading institutions
          </p>
        </div>
      </section>
    );
  }

  // If we have logos, show them, otherwise show text
  const hasLogos = institutions.some(inst => inst.logoUrl);

  // Create enough duplicates for seamless loop
  const duplicatedInstitutions = [
    ...institutions,
    ...institutions,
    ...institutions,
  ];

  return (
    <section className="py-12 border-y border-[#182966]/10 bg-[#182966]/5 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 mb-8 text-center">
        <p className="text-sm text-[#182966]/70 uppercase tracking-widest">
            {t.partners.title}
        </p>
      </div>
      
      <div 
        ref={containerRef}
        className="relative overflow-hidden cursor-grab active:cursor-grabbing"
      >
        <motion.div 
          className="flex items-center gap-16 px-8"
          style={{ x }}
          drag="x"
          dragConstraints={{ left: -containerWidth, right: 0 }}
          dragElastic={0.05}
          onDragStart={() => setIsDragging(true)}
          onDragEnd={() => {
            setIsDragging(false);
            // Snap to nearest position for seamless loop
            const currentX = x.get();
            if (currentX < -containerWidth) {
              x.set(currentX + containerWidth);
            } else if (currentX > 0) {
              x.set(currentX - containerWidth);
            }
          }}
          onHoverStart={() => setIsDragging(true)}
          onHoverEnd={() => setIsDragging(false)}
        >
          {duplicatedInstitutions.map((partner, i) => (
            <a
              key={`${partner.id}-${i}`}
              href={partner.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 hover:opacity-70 transition-opacity select-none pointer-events-auto"
              style={{ userSelect: 'none', WebkitUserSelect: 'none' }}
              draggable="false"
              onClick={(e) => {
                // Prevent navigation if dragging
                if (isDragging) {
                  e.preventDefault();
                }
              }}
              onMouseDown={(e) => {
                // Prevent text selection on mousedown
                e.preventDefault();
              }}
            >
              {hasLogos && partner.logoUrl ? (
                <ImageWithFallback
                  src={partner.logoUrl}
                  alt={partner.name}
                  className="h-12 w-auto object-contain transition-all hover:scale-110 pointer-events-none select-none"
                  draggable="false"
                  style={{ userSelect: 'none', WebkitUserSelect: 'none' }}
                />
              ) : (
                <span 
                  className="text-xl md:text-2xl text-[#182966]/20 hover:text-[#182966]/40 transition-colors whitespace-nowrap select-none"
                  style={{ userSelect: 'none', WebkitUserSelect: 'none' }}
                  draggable="false"
                >
                  {partner.name}
                </span>
              )}
            </a>
          ))}
        </motion.div>
        
        <div className="absolute top-0 left-0 w-20 h-full bg-gradient-to-r from-[#182966]/5 to-transparent pointer-events-none" />
        <div className="absolute top-0 right-0 w-20 h-full bg-gradient-to-l from-[#182966]/5 to-transparent pointer-events-none" />
      </div>
    </section>
  );
}