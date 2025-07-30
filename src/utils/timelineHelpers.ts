import { TIMELINE_CONSTANTS } from '../constants/timeline';
import { formatTime } from './timeUtils';
import type { 
  TimeMarker, 
  BackgroundSection,
  TimelineLayout,
  D3ScaleTime 
} from '../types/energy';

/**
 * Generate time markers for both hours and half-hours
 */
export const generateTimeMarkers = (currentTimeDate: Date): TimeMarker[] => {
  const markers: TimeMarker[] = [];
  
  for (let hour = 0; hour < 24; hour++) {
    // Add hour marker
    const hourTime = new Date(currentTimeDate);
    hourTime.setHours(hour, 0, 0, 0);
    markers.push({
      time: hourTime,
      isHour: true,
      label: formatTime(hourTime)
    });
    
    // Add 30-minute marker
    const halfHourTime = new Date(currentTimeDate);
    halfHourTime.setHours(hour, 30, 0, 0);
    markers.push({
      time: halfHourTime,
      isHour: false,
      label: null
    });
  }
  
  return markers;
};

/**
 * Get background sections with computed colors
 */
export const getBackgroundSections = (): BackgroundSection[] => {
  return TIMELINE_CONSTANTS.BACKGROUND_SECTIONS.map(section => ({
    ...section,
  }));
};

/**
 * Calculate timeline layout dimensions and positions
 */
export const calculateTimelineLayout = (
  width: number,
  hourHeight: number,
  currentTimeDate: Date,
  timeScale: D3ScaleTime
): TimelineLayout => {
  const totalHeight = 24 * hourHeight;
  const chartWidth = width - TIMELINE_CONSTANTS.MARGIN.LEFT - TIMELINE_CONSTANTS.MARGIN.RIGHT;
  const currentTimePosition = timeScale(currentTimeDate);
  const timeMarkers = generateTimeMarkers(currentTimeDate);
  const backgroundSections = getBackgroundSections();
  
  return {
    totalHeight,
    chartWidth,
    currentTimePosition,
    timeMarkers,
    backgroundSections,
  };
};

/**
 * Get grid line styling based on marker type
 */
export const getGridLineStyles = (isHour: boolean) => ({
  strokeWidth: isHour 
    ? TIMELINE_CONSTANTS.GRID.HOUR_STROKE_WIDTH 
    : TIMELINE_CONSTANTS.GRID.HALF_HOUR_STROKE_WIDTH,
  opacity: TIMELINE_CONSTANTS.GRID.OPACITY,
});

/**
 * Get tick mark length based on marker type
 */
export const getTickLength = (isHour: boolean): number => {
  return isHour 
    ? TIMELINE_CONSTANTS.GRID.TICK_LENGTH.HOUR
    : TIMELINE_CONSTANTS.GRID.TICK_LENGTH.HALF_HOUR;
};

/**
 * Calculate section Y positions and height
 */
export const calculateSectionDimensions = (
  section: BackgroundSection,
  currentTimeDate: Date,
  timeScale: D3ScaleTime
) => {
  const startTime = new Date(currentTimeDate);
  startTime.setHours(section.start, 0, 0, 0);
  const endTime = new Date(currentTimeDate);
  endTime.setHours(section.end, 0, 0, 0);
  
  const startY = timeScale(startTime);
  const endY = timeScale(endTime);
  const height = Math.abs(endY - startY);
  
  return { startY, height };
};

/**
 * Calculate highlight label position
 */
export const calculateHighlightPosition = (
  highlightTime: Date,
  selectedDate: Date,
  timeScale: D3ScaleTime,
  marginTop: number
) => {
  const adjustedTime = new Date(highlightTime);
  adjustedTime.setFullYear(
    selectedDate.getFullYear(),
    selectedDate.getMonth(),
    selectedDate.getDate()
  );
  
  return timeScale(adjustedTime) - marginTop;
};

/**
 * Get background color for time sections using energy level colors with reduced opacity
 */
export const getBackgroundColor = (sectionIndex: number): string => {
  const colors = [
    'rgba(183, 20, 142, 0.08)', // Night - Low energy purple with opacity
    'rgba(37, 110, 255, 0.06)', // Morning - High energy blue with opacity
    'rgba(220, 143, 105, 0.08)', // Afternoon - Medium energy orange with opacity
    'rgba(183, 20, 142, 0.06)', // Evening - Low energy purple with opacity
  ];
  return colors[sectionIndex] || colors[0];
}; 