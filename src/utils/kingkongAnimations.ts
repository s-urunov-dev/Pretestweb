// King Kong-style animation configurations
// Smooth, professional scroll-triggered animations

export const fadeInUp = {
  initial: { 
    opacity: 0, 
    y: 60 
  },
  whileInView: { 
    opacity: 1, 
    y: 0 
  },
  viewport: { 
    once: true, 
    margin: "-100px" 
  },
  transition: { 
    duration: 0.8,
    ease: [0.25, 0.1, 0.25, 1.0] // Custom easing for smooth motion
  }
};

export const fadeInUpStagger = (index: number) => ({
  initial: { 
    opacity: 0, 
    y: 60 
  },
  whileInView: { 
    opacity: 1, 
    y: 0 
  },
  viewport: { 
    once: true, 
    margin: "-100px" 
  },
  transition: { 
    duration: 0.8,
    delay: index * 0.15,
    ease: [0.25, 0.1, 0.25, 1.0]
  }
});

export const scaleIn = {
  initial: { 
    opacity: 0, 
    scale: 0.9 
  },
  whileInView: { 
    opacity: 1, 
    scale: 1 
  },
  viewport: { 
    once: true, 
    margin: "-100px" 
  },
  transition: { 
    duration: 0.8,
    ease: [0.25, 0.1, 0.25, 1.0]
  }
};

export const fadeInLeft = {
  initial: { 
    opacity: 0, 
    x: -60 
  },
  whileInView: { 
    opacity: 1, 
    x: 0 
  },
  viewport: { 
    once: true, 
    margin: "-100px" 
  },
  transition: { 
    duration: 0.8,
    ease: [0.25, 0.1, 0.25, 1.0]
  }
};

export const fadeInRight = {
  initial: { 
    opacity: 0, 
    x: 60 
  },
  whileInView: { 
    opacity: 1, 
    x: 0 
  },
  viewport: { 
    once: true, 
    margin: "-100px" 
  },
  transition: { 
    duration: 0.8,
    ease: [0.25, 0.1, 0.25, 1.0]
  }
};

export const hoverLift = {
  whileHover: { 
    y: -12,
    transition: { 
      duration: 0.4,
      ease: [0.25, 0.1, 0.25, 1.0]
    }
  }
};

export const hoverScale = {
  whileHover: { 
    scale: 1.03,
    transition: { 
      duration: 0.4,
      ease: [0.25, 0.1, 0.25, 1.0]
    }
  }
};

export const parallaxConfig = {
  initial: { y: 0 },
  whileInView: { y: -30 },
  viewport: { 
    once: false,
    margin: "0px"
  },
  transition: {
    duration: 1.2,
    ease: [0.25, 0.1, 0.25, 1.0]
  }
};

export const staggerContainer = {
  initial: {},
  whileInView: {
    transition: {
      staggerChildren: 0.15
    }
  },
  viewport: { 
    once: true, 
    margin: "-100px" 
  }
};

export const staggerItem = {
  initial: { 
    opacity: 0, 
    y: 40 
  },
  whileInView: { 
    opacity: 1, 
    y: 0 
  },
  transition: { 
    duration: 0.7,
    ease: [0.25, 0.1, 0.25, 1.0]
  }
};
