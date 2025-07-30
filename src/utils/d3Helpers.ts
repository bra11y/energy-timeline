import * as d3 from 'd3';
import { TIMELINE_CONSTANTS } from '../constants/timeline';
import type { 
  ProcessedEnergyPoint,
  D3ScaleTime,
  D3ScaleLinear,
  D3Line
} from '../types/energy';

/**
 * Create D3 time scale for mapping time to Y position
 */
export const createTimeScale = (
  currentTimeDate: Date,
  totalHeight: number,
  marginTop: number
): D3ScaleTime => {
  const startTime = new Date(currentTimeDate);
  startTime.setHours(0, 0, 0, 0);
  const endTime = new Date(startTime);
  endTime.setHours(23, 59, 59, 999);
  
  return d3.scaleTime()
    .domain([startTime, endTime])
    .range([marginTop, totalHeight + marginTop]);
};

/**
 * Create D3 linear scale for mapping energy level to X position
 */
export const createEnergyScale = (
  marginLeft: number,
  chartWidth: number
): D3ScaleLinear => {
  const { RANGE_OFFSET, RANGE_MULTIPLIER } = TIMELINE_CONSTANTS.ENERGY_SCALE;
  
  return d3.scaleLinear()
    .domain(TIMELINE_CONSTANTS.ENERGY_SCALE.DOMAIN)
    .range([
      marginLeft + RANGE_OFFSET, 
      marginLeft + chartWidth * RANGE_MULTIPLIER
    ]);
};

/**
 * Create D3 line generator for smooth energy curve
 */
export const createLineGenerator = (
  energyScale: D3ScaleLinear,
  timeScale: D3ScaleTime
): D3Line<ProcessedEnergyPoint> => {
  return d3.line<ProcessedEnergyPoint>()
    .x(d => energyScale(d.energyLevel))
    .y(d => timeScale(d.time))
    .curve(d3.curveCatmullRom.alpha(TIMELINE_CONSTANTS.CURVE.SMOOTHING_ALPHA));
};

/**
 * Generate SVG path data from processed energy data
 */
export const generatePathData = (
  lineGenerator: D3Line<ProcessedEnergyPoint>,
  data: ProcessedEnergyPoint[]
): string | null => {
  return lineGenerator(data);
};

/**
 * Create SVG filter definitions for glow effect
 */
export const createGlowFilter = () => ({
  id: 'energyGlow',
  stdDeviation: TIMELINE_CONSTANTS.CURVE.GLOW_STD_DEVIATION,
});

/**
 * Create linear gradient definition for energy curve
 */
export const createEnergyGradient = () => ({
  id: 'energyGradient',
  x1: '0%',
  y1: '0%',
  x2: '0%',
  y2: '100%',
}); 