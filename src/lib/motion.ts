export const EASE = {
  standard: [0.4, 0.0, 0.2, 1],   // smooth deceleration, used for most UI motion
  entrance: [0.16, 1, 0.3, 1],    // for hero/section reveals
  exit: [0.4, 0, 1, 1],
} as const;

export const DURATION = {
  fast: 0.2,
  base: 0.4,
  slow: 0.7,
  hero: 1.1,
};

export const VARIANTS = {
  fadeUp: {
    hidden: { opacity: 0, y: 24 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: DURATION.base, ease: EASE.standard }
    }
  },
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: DURATION.base, ease: EASE.standard }
    }
  },
  staggerContainer: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1
      }
    }
  },
  scaleIn: {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: DURATION.base, ease: EASE.entrance }
    }
  }
};
