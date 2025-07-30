import { ENERGY_THRESHOLDS, ENERGY_COLORS } from '../constants/timeline';
import type { 
  EnergyPoint, 
  ProcessedEnergyPoint, 
  GradientStop,
  EnergyLevel 
} from '../types/energy';

/**
 * Transform raw energy data to processed format with proper date handling
 */
export const transformEnergyData = (
  data: EnergyPoint[], 
  selectedDate?: Date
): ProcessedEnergyPoint[] => {
  const result = data.map(point => {
    const baseTime = new Date(point.time);
    let targetTime = baseTime;
    
    if (selectedDate) {
      targetTime = new Date(selectedDate);
      targetTime.setHours(
        baseTime.getHours(), 
        baseTime.getMinutes(), 
        baseTime.getSeconds(), 
        baseTime.getMilliseconds()
      );
    }
    
    return {
      time: targetTime,
      energyLevel: Math.max(0, Math.min(1, point.level)) // Clamp between 0-1
    };
  });
  
  // Ensure data is sorted by time and remove duplicates
  return result
    .sort((a, b) => a.time.getTime() - b.time.getTime())
    .filter((point, index, arr) => {
      return index === 0 || point.time.getTime() !== arr[index - 1].time.getTime();
    });
};

/**
 * Categorize energy level based on thresholds
 */
export const getEnergyLevel = (level: number): EnergyLevel => {
  if (level >= ENERGY_THRESHOLDS.HIGH) return 'high';
  if (level >= ENERGY_THRESHOLDS.MEDIUM) return 'medium';
  return 'low';
};

/**
 * Get color for energy level
 */
export const getEnergyColor = (level: number): string => {
  const energyLevel = getEnergyLevel(level);
  return ENERGY_COLORS[energyLevel.toUpperCase() as keyof typeof ENERGY_COLORS];
};

/**
 * Generate gradient stops for the energy curve
 */
export const generateGradientStops = (data: ProcessedEnergyPoint[]): GradientStop[] => {
  return data.map((point, index) => ({
    offset: `${(index / (data.length - 1)) * 100}%`,
    color: getEnergyColor(point.energyLevel)
  }));
};

/**
 * Calculate current energy level based on time and data interpolation
 */
export const calculateCurrentEnergyLevel = (
  currentTime: Date,
  data: ProcessedEnergyPoint[]
): number => {
  const currentHour = currentTime.getHours();
  const currentMinute = currentTime.getMinutes();
  const currentTotalMinutes = currentHour * 60 + currentMinute;
  
  // Find the two closest data points and interpolate
  for (let i = 0; i < data.length - 1; i++) {
    const point1 = data[i];
    const point2 = data[i + 1];
    const time1Minutes = point1.time.getHours() * 60 + point1.time.getMinutes();
    const time2Minutes = point2.time.getHours() * 60 + point2.time.getMinutes();
    
    if (currentTotalMinutes >= time1Minutes && currentTotalMinutes <= time2Minutes) {
      const ratio = (currentTotalMinutes - time1Minutes) / (time2Minutes - time1Minutes);
      return point1.energyLevel + (point2.energyLevel - point1.energyLevel) * ratio;
    }
  }
  
  return 0.9; // Default fallback
};

/**
 * Get background color for time sections with proper opacity
 */
export const getBackgroundColor = (sectionIndex: number): string => {
  const colors = [
    'rgba(30, 27, 75, 0.03)', // Night
    'rgba(30, 58, 138, 0.02)', // Morning  
    'rgba(124, 45, 18, 0.03)', // Afternoon
    'rgba(88, 28, 135, 0.03)', // Evening
  ];
  return colors[sectionIndex] || colors[0];
}; 