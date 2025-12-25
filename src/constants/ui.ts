export const UI_CONSTANTS = {
  // Animation durations (in milliseconds)
  ANIMATION: {
    FAST: 150,
    NORMAL: 300,
    SLOW: 500,
  },
  
  // Toast durations (in milliseconds)
  TOAST: {
    SUCCESS: 3000,
    ERROR: 5000,
    INFO: 4000,
    WARNING: 4000,
  },
  
  // Breakpoints (in pixels)
  BREAKPOINTS: {
    MOBILE: 640,
    TABLET: 768,
    DESKTOP: 1024,
    WIDE: 1280,
  },
  
  // Z-index layers
  Z_INDEX: {
    BASE: 0,
    DROPDOWN: 100,
    STICKY: 200,
    MODAL_BACKDROP: 900,
    MODAL: 1000,
    TOAST: 1100,
    TOOLTIP: 1200,
  },
} as const;

export type AnimationSpeed = typeof UI_CONSTANTS.ANIMATION[keyof typeof UI_CONSTANTS.ANIMATION];
export type ToastDuration = typeof UI_CONSTANTS.TOAST[keyof typeof UI_CONSTANTS.TOAST];
