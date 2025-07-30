export const TIMELINE_CONSTANTS = {
  // Core timeline settings
  HOUR_HEIGHT: 40,
  DEFAULT_WIDTH: 1200,
  MIN_ZOOM: 0.5,
  MAX_ZOOM: 3,
  ZOOM_STEP: 1.2,
  
  // Layout margins
  MARGIN: {
    TOP: 40,
    RIGHT: 200,
    BOTTOM: 40,
    LEFT: 80,
  },
  
  // Energy scale settings
  ENERGY_SCALE: {
    DOMAIN: [0, 1] as const,
    RANGE_OFFSET: 30,
    RANGE_MULTIPLIER: 0.7,
  },
  
  // Current time indicator
  CURRENT_TIME: {
    DOT_RADIUS: 8,
    LINE_OPACITY: 0.8,
    LINE_WIDTH: 1.5,
  },
  
  // Grid and markers
  GRID: {
    HOUR_STROKE_WIDTH: 1,
    HALF_HOUR_STROKE_WIDTH: 0.5,
    OPACITY: 0.04,
    TICK_LENGTH: {
      HOUR: 10,
      HALF_HOUR: 5,
    },
  },
  
  // Energy curve
  CURVE: {
    STROKE_WIDTH: 5,
    SMOOTHING_ALPHA: 0.5,
    GLOW_STD_DEVIATION: 2,
  },
  
  // Tooltip
  TOOLTIP: {
    OFFSET: 20,
    VERTICAL_OFFSET: 45,
    MAX_WIDTH: 220,
  },
  
  // Background sections
  BACKGROUND_SECTIONS: [
    { start: 0, end: 6, label: 'Night' },
    { start: 6, end: 12, label: 'Morning' },
    { start: 12, end: 18, label: 'Afternoon' },
    { start: 18, end: 24, label: 'Evening' },
  ] as const,
} as const;

export const ENERGY_THRESHOLDS = {
  HIGH: 0.6,
  MEDIUM: 0.3,
  LOW: 0,
} as const;

export const ENERGY_COLORS = {
  HIGH: '#256EFF',
  MEDIUM: '#DC8F69', 
  LOW: '#B7148E',
} as const; 