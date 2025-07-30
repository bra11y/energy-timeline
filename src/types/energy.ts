// Base data structures from API/props
export interface EnergyPoint {
  id: number;
  time: string; // ISO string format
  level: number; // 0-1 scale
}

export interface EnergyHighlight {
  time: string; // ISO string format
  label: string;
  color: string; // Hex color
}

export interface TimelineMessage {
  title: string;
  description: string;
}

// Internal processed data structures
export interface ProcessedEnergyPoint {
  time: Date;
  energyLevel: number; // Clamped 0-1
}

export interface TimeMarker {
  time: Date;
  isHour: boolean;
  label: string | null;
}

export interface BackgroundSection {
  start: number; // Hour (0-23)
  end: number; // Hour (0-24)
  label: string;
}

export interface GradientStop {
  offset: string; // Percentage string like "50%"
  color: string; // Hex color
}

// Component props
export interface EnergyTimelineProps {
  data: EnergyPoint[];
  highlights?: EnergyHighlight[];
  currentTime?: string; // ISO string
  customMessage?: TimelineMessage;
  hourHeight?: number;
  width?: number;
  className?: string;
}

// Hook return types
export interface UseEnergyDataReturn {
  transformedData: ProcessedEnergyPoint[];
  gradientStops: GradientStop[];
  currentEnergyLevel: number;
}

export interface UseTimelineScalesReturn {
  timeScale: d3.ScaleTime<number, number>;
  energyScale: d3.ScaleLinear<number, number>;
  lineGenerator: d3.Line<ProcessedEnergyPoint>;
  pathData: string | null;
}

export interface UseTimelineInteractionsReturn {
  zoomLevel: number;
  selectedDate: Date;
  showCalendar: boolean;
  showTooltip: boolean;
  handleZoomIn: () => void;
  handleZoomOut: () => void;
  handleDateChange: (date: Date) => void;
  setShowCalendar: (show: boolean) => void;
  setShowTooltip: (show: boolean) => void;
}

// Utility types
export type EnergyLevel = 'high' | 'medium' | 'low';

export interface TimelineLayout {
  totalHeight: number;
  chartWidth: number;
  currentTimePosition: number;
  timeMarkers: TimeMarker[];
  backgroundSections: BackgroundSection[];
}

// D3 types (re-exported for convenience)
export type D3ScaleTime = d3.ScaleTime<number, number>;
export type D3ScaleLinear = d3.ScaleLinear<number, number>;
export type D3Line<T> = d3.Line<T>;