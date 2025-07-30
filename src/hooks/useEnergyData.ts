import { useMemo } from 'react';
import { 
  transformEnergyData, 
  generateGradientStops, 
  calculateCurrentEnergyLevel 
} from '../utils/energyCalculations';
import type { EnergyPoint, UseEnergyDataReturn } from '../types/energy';

/**
 * Custom hook for processing energy data and related calculations
 */
export const useEnergyData = (
  data: EnergyPoint[],
  selectedDate: Date,
  currentTime?: string
): UseEnergyDataReturn => {
  // Transform raw data to processed format
  const transformedData = useMemo(() => 
    transformEnergyData(data, selectedDate), 
    [data, selectedDate]
  );
  
  // Generate gradient stops for the curve
  const gradientStops = useMemo(() => 
    generateGradientStops(transformedData),
    [transformedData]
  );
  
  // Calculate current energy level based on time
  const currentEnergyLevel = useMemo(() => {
    // Adjust current time to selected date if different
    if (currentTime) {
      const baseTime = new Date(currentTime);
      const resultTime = new Date(selectedDate);
      resultTime.setHours(
        baseTime.getHours(),
        baseTime.getMinutes(),
        baseTime.getSeconds(),
        baseTime.getMilliseconds()
      );
      return calculateCurrentEnergyLevel(resultTime, transformedData);
    }
    
    // Default to 10 AM for the selected date
    const defaultTime = new Date(selectedDate);
    defaultTime.setHours(10, 0, 0, 0);
    return calculateCurrentEnergyLevel(defaultTime, transformedData);
  }, [currentTime, selectedDate, transformedData]);
  
  return {
    transformedData,
    gradientStops,
    currentEnergyLevel,
  };
}; 