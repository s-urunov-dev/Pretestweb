/**
 * Motion configuration for performance optimization
 * Reduces motion for users who prefer reduced motion
 */

// Check if user prefers reduced motion
const prefersReducedMotion = 
  typeof window !== 'undefined' && 
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Default animation variants optimized for performance
 */
export const fadeInUpVariants = {
  hidden: { 
    opacity: 0, 
    y: prefersReducedMotion ? 0 : 20 
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: prefersReducedMotion ? 0 : 0.5,
      ease: "easeOut"
    }
  }
};

export const fadeInVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: {
      duration: prefersReducedMotion ? 0 : 0.3,
    }
  }
};

export const scaleInVariants = {
  hidden: { 
    opacity: 0, 
    scale: prefersReducedMotion ? 1 : 0.95 
  },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: {
      duration: prefersReducedMotion ? 0 : 0.4,
      ease: "easeOut"
    }
  }
};

export const slideInVariants = {
  hidden: { 
    opacity: 0, 
    x: prefersReducedMotion ? 0 : -20 
  },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: {
      duration: prefersReducedMotion ? 0 : 0.5,
      ease: "easeOut"
    }
  }
};

/**
 * Stagger children animation configuration
 */
export const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: prefersReducedMotion ? 0 : 0.1,
      delayChildren: prefersReducedMotion ? 0 : 0.1
    }
  }
};

/**
 * Motion transition presets
 */
export const transitionPresets = {
  spring: prefersReducedMotion 
    ? { duration: 0 } 
    : { type: "spring", stiffness: 100, damping: 15 },
  
  smooth: prefersReducedMotion 
    ? { duration: 0 } 
    : { duration: 0.3, ease: "easeInOut" },
  
  slow: prefersReducedMotion 
    ? { duration: 0 } 
    : { duration: 0.6, ease: "easeOut" },
};

/**
 * Utility function to get motion config
 */
export const getMotionConfig = (enableMotion = true) => {
  if (!enableMotion || prefersReducedMotion) {
    return {
      initial: false,
      animate: false,
      exit: false,
      transition: { duration: 0 }
    };
  }
  return {};
};
