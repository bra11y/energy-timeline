// Provided sample data structure
export interface EnergyPoint {
  id: number;
  time: string; // ISO string format
  level: number; // 0-1 scale
}

export interface EnergyHighlight {
  time: string;
  label: string;
  color: string;
}

export interface TimelineMessage {
  title: string;
  description: string;
}

// Internal data structure after transformation
export interface EnergyDataPoint {
  time: Date;
  energyLevel: number;
}

export interface EnergyTimelineProps {
  data: EnergyPoint[];
  highlights?: EnergyHighlight[];
  currentTime?: string;
  customMessage?: TimelineMessage;
  hourHeight?: number;
  width?: number;
  className?: string;
}

export type EnergyLevel = 'high' | 'medium' | 'low';

export const ENERGY_COLORS = {
  high: '#256EFF',
  medium: '#DC8F69', 
  low: '#B7148E'
} as const;