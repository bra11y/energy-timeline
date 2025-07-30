import { useState, useCallback } from 'react';
import { TIMELINE_CONSTANTS } from '../constants/timeline';
import type { UseTimelineInteractionsReturn } from '../types/energy';

/**
 * Custom hook for managing timeline user interactions
 */
export const useTimelineInteractions = (
  currentTime?: string
): UseTimelineInteractionsReturn => {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [selectedDate, setSelectedDate] = useState(
    currentTime ? new Date(currentTime) : new Date()
  );
  const [showCalendar, setShowCalendar] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  
  // Zoom in handler with bounds checking
  const handleZoomIn = useCallback(() => {
    setZoomLevel(prev => 
      Math.min(prev * TIMELINE_CONSTANTS.ZOOM_STEP, TIMELINE_CONSTANTS.MAX_ZOOM)
    );
  }, []);
  
  // Zoom out handler with bounds checking
  const handleZoomOut = useCallback(() => {
    setZoomLevel(prev => 
      Math.max(prev / TIMELINE_CONSTANTS.ZOOM_STEP, TIMELINE_CONSTANTS.MIN_ZOOM)
    );
  }, []);
  
  // Date change handler with calendar auto-close
  const handleDateChange = useCallback((date: Date) => {
    setSelectedDate(date);
    setShowCalendar(false);
  }, []);
  
  return {
    zoomLevel,
    selectedDate,
    showCalendar,
    showTooltip,
    handleZoomIn,
    handleZoomOut,
    handleDateChange,
    setShowCalendar,
    setShowTooltip,
  };
}; 