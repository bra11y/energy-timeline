/**
 * Format date or time string to match requirement format (e.g., "7:00 AM", "12:00 PM", "12:00 AM")
 */
export const formatTime = (timeInput: Date | string): string => {
  const date = typeof timeInput === 'string' ? new Date(timeInput) : timeInput;
  const hours = date.getHours();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  let displayHours = hours % 12;
  if (displayHours === 0) displayHours = 12; // Handle 12am and 12pm correctly
  
  // Format as "7:00 AM", "8:00 AM", "12:00 PM", "12:00 AM"
  return `${displayHours}:00 ${ampm}`;
};

/**
 * Get vertical position for time on timeline
 */
export const getTimePosition = (timeInput: Date | string, hourHeight: number): number => {
  const date = typeof timeInput === 'string' ? new Date(timeInput) : timeInput;
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  
  // Precise time calculation including seconds
  const totalHours = hours + minutes / 60 + seconds / 3600;
  return totalHours * hourHeight;
};