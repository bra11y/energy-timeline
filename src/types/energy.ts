export interface EnergyPoint {
  id: number;
  time: string;
  level: number;
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