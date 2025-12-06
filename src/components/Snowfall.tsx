import { useEffect, useState } from "react";
import { motion } from "motion/react";

interface Snowflake {
  id: number;
  left: number;
  delay: number;
  duration: number;
  size: number;
}

// Snowflake SVG component - realistic 6-pointed snowflake (optimized without heavy filters)
function SnowflakeIcon({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ filter: 'drop-shadow(0 0 2px rgba(255, 255, 255, 0.5))' }} // Lighter shadow
    >
      <defs>
        <linearGradient id={`snowGradient-${size}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#F5F5F5', stopOpacity: 0.95 }} />
          <stop offset="50%" style={{ stopColor: '#E0E0E0', stopOpacity: 0.95 }} />
          <stop offset="100%" style={{ stopColor: '#C0C0C0', stopOpacity: 0.95 }} />
        </linearGradient>
      </defs>
      
      {/* Main 6 branches from center */}
      <g stroke={`url(#snowGradient-${size})`} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none">
        {/* Vertical branch (top) */}
        <line x1="50" y1="50" x2="50" y2="10" />
        <line x1="50" y1="25" x2="42" y2="18" />
        <line x1="50" y1="25" x2="58" y2="18" />
        <line x1="50" y1="35" x2="44" y2="28" />
        <line x1="50" y1="35" x2="56" y2="28" />
        <circle cx="50" cy="10" r="2.5" fill={`url(#snowGradient-${size})`} />
        
        {/* Vertical branch (bottom) */}
        <line x1="50" y1="50" x2="50" y2="90" />
        <line x1="50" y1="75" x2="42" y2="82" />
        <line x1="50" y1="75" x2="58" y2="82" />
        <line x1="50" y1="65" x2="44" y2="72" />
        <line x1="50" y1="65" x2="56" y2="72" />
        <circle cx="50" cy="90" r="2.5" fill={`url(#snowGradient-${size})`} />
        
        {/* Top-right branch */}
        <line x1="50" y1="50" x2="84.64" y2="30" />
        <line x1="70" y1="38" x2="75" y2="30" />
        <line x1="70" y1="38" x2="63" y2="35" />
        <line x1="77" y1="33" x2="81" y2="26" />
        <line x1="77" y1="33" x2="71" y2="30" />
        <circle cx="84.64" cy="30" r="2.5" fill={`url(#snowGradient-${size})`} />
        
        {/* Bottom-left branch */}
        <line x1="50" y1="50" x2="15.36" y2="70" />
        <line x1="30" y1="62" x2="25" y2="70" />
        <line x1="30" y1="62" x2="37" y2="65" />
        <line x1="23" y1="67" x2="19" y2="74" />
        <line x1="23" y1="67" x2="29" y2="70" />
        <circle cx="15.36" cy="70" r="2.5" fill={`url(#snowGradient-${size})`} />
        
        {/* Top-left branch */}
        <line x1="50" y1="50" x2="15.36" y2="30" />
        <line x1="30" y1="38" x2="25" y2="30" />
        <line x1="30" y1="38" x2="37" y2="35" />
        <line x1="23" y1="33" x2="19" y2="26" />
        <line x1="23" y1="33" x2="29" y2="30" />
        <circle cx="15.36" cy="30" r="2.5" fill={`url(#snowGradient-${size})`} />
        
        {/* Bottom-right branch */}
        <line x1="50" y1="50" x2="84.64" y2="70" />
        <line x1="70" y1="62" x2="75" y2="70" />
        <line x1="70" y1="62" x2="63" y2="65" />
        <line x1="77" y1="67" x2="81" y2="74" />
        <line x1="77" y1="67" x2="71" y2="70" />
        <circle cx="84.64" cy="70" r="2.5" fill={`url(#snowGradient-${size})`} />
      </g>
      
      {/* Center decoration */}
      <circle cx="50" cy="50" r="4" fill={`url(#snowGradient-${size})`} />
      <circle cx="50" cy="50" r="2" fill="white" fillOpacity="0.3" />
    </svg>
  );
}

export function Snowfall() {
  const [snowflakes, setSnowflakes] = useState<Snowflake[]>([]);
  const [isVisible, setIsVisible] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if mobile on mount
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);

    // Generate 35 snowflakes (reduced from 80 for better performance)
    const flakes = Array.from({ length: 35 }, (_, i) => ({
      id: i,
      left: Math.random() * 100, // Random horizontal position (0-100%)
      duration: 12 + Math.random() * 15, // 12-27 seconds (slightly faster)
      size: 14 + Math.random() * 12, // 14-26px
      delay: Math.random() * 8, // 0-8 seconds delay
    }));
    
    setSnowflakes(flakes);

    const handleScroll = () => {
      const shouldShow = window.scrollY < 500;
      if (shouldShow !== isVisible) {
        setIsVisible(shouldShow);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // Don't render on mobile or when scrolled down
  if (!isVisible || isMobile) {
    return null;
  }

  return (
    <div 
      className="fixed top-0 left-0 w-full h-screen pointer-events-none overflow-hidden"
      style={{ zIndex: 45 }}
    >
      {snowflakes.map((flake) => (
        <motion.div
          key={flake.id}
          className="absolute"
          style={{
            left: `${flake.left}%`,
            top: -50,
            willChange: 'transform',
            transform: 'translateZ(0)', // Force GPU acceleration
          }}
          animate={{
            y: ["0vh", "110vh"],
            x: [0, Math.sin(flake.id) * 50, 0],
            rotate: [0, 360],
          }}
          transition={{
            duration: flake.duration,
            delay: flake.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <SnowflakeIcon size={flake.size} />
        </motion.div>
      ))}
    </div>
  );
}
