import { useMemo } from 'react';
import { TIMELINE_CONSTANTS } from '../constants/timeline';
import { 
  createTimeScale, 
  createEnergyScale, 
  createLineGenerator, 
  generatePathData 
} from '../utils/d3Helpers';
import type { 
  ProcessedEnergyPoint, 
  UseTimelineScalesReturn 
} from '../types/energy';

/**
 * Custom hook for managing D3 scales and line generation
 */
export const useTimelineScales = (
  width: number,
  hourHeight: number,
  currentTimeDate: Date,
  transformedData: ProcessedEnergyPoint[]
): UseTimelineScalesReturn => {
  const totalHeight = 24 * hourHeight;
  const chartWidth = width - TIMELINE_CONSTANTS.MARGIN.LEFT - TIMELINE_CONSTANTS.MARGIN.RIGHT;
  
  // Create time scale for Y-axis positioning
  const timeScale = useMemo(() => 
    createTimeScale(currentTimeDate, totalHeight, TIMELINE_CONSTANTS.MARGIN.TOP),
    [currentTimeDate, totalHeight]
  );
  
  // Create energy scale for X-axis positioning
  const energyScale = useMemo(() => 
    createEnergyScale(TIMELINE_CONSTANTS.MARGIN.LEFT, chartWidth),
    [chartWidth]
  );
  
  // Create line generator for smooth curve
  const lineGenerator = useMemo(() => 
    createLineGenerator(energyScale, timeScale),
    [energyScale, timeScale]
  );
  
  // Generate SVG path data
  const pathData = useMemo(() => 
    generatePathData(lineGenerator, transformedData),
    [lineGenerator, transformedData]
  );
  
  return {
    timeScale,
    energyScale,
    lineGenerator,
    pathData,
  };
}; 