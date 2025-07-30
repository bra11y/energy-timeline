/**
 * Format date or time string to match mobile image format (e.g., "7am", "12pm", "12am")
 */
export const formatTime = (timeInput: Date | string): string => {
  const date = typeof timeInput === 'string' ? new Date(timeInput) : timeInput;
  const hours = date.getHours();
  const ampm = hours >= 12 ? 'pm' : 'am';
  let displayHours = hours % 12;
  if (displayHours === 0) displayHours = 12; // Handle 12am and 12pm correctly
  
  // Match mobile image format: "7am", "8am", "12pm", "12am"
  return `${displayHours}${ampm}`;
};

// Enhanced color function with more precise gradients
export const getEnergyColor = (level: number): string => {
  // Define color stops for smooth transitions
  const colors = [
    { level: 0.0, color: '#B7148E' },  // Deep purple for very low energy
    { level: 0.2, color: '#B7148E' },  // Purple for low energy
    { level: 0.3, color: '#DC8F69' },  // Start transitioning to orange
    { level: 0.5, color: '#DC8F69' },  // Orange for medium energy
    { level: 0.6, color: '#256EFF' },  // Start transitioning to blue
    { level: 1.0, color: '#256EFF' }   // Blue for high energy
  ];
  
  // Find the two colors to interpolate between
  for (let i = 0; i < colors.length - 1; i++) {
    if (level >= colors[i].level && level <= colors[i + 1].level) {
      const startColor = colors[i];
      const endColor = colors[i + 1];
      
      // If same color, return it
      if (startColor.color === endColor.color) {
        return startColor.color;
      }
      
      // Calculate interpolation ratio
      const ratio = (level - startColor.level) / (endColor.level - startColor.level);
      
      // Interpolate between colors
      return interpolateColor(startColor.color, endColor.color, ratio);
    }
  }
  
  return colors[colors.length - 1].color;
};

// Helper function to interpolate between two hex colors
function interpolateColor(color1: string, color2: string, ratio: number): string {
  // Convert hex to RGB
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);
  
  if (!rgb1 || !rgb2) return color1;
  
  // Interpolate each channel
  const r = Math.round(rgb1.r + (rgb2.r - rgb1.r) * ratio);
  const g = Math.round(rgb1.g + (rgb2.g - rgb1.g) * ratio);
  const b = Math.round(rgb1.b + (rgb2.b - rgb1.b) * ratio);
  
  // Convert back to hex
  return rgbToHex(r, g, b);
}

// Convert hex color to RGB
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

// Convert RGB to hex
function rgbToHex(r: number, g: number, b: number): string {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
}

export const transformEnergyData = (
  data: { time: string; level: number }[], 
  selectedDate?: Date
): { time: Date; energyLevel: number }[] => {
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
  
  // Ensure data is sorted by time and remove any potential duplicates
  return result
    .sort((a, b) => a.time.getTime() - b.time.getTime())
    .filter((point, index, arr) => {
      // Remove duplicate time points
      return index === 0 || point.time.getTime() !== arr[index - 1].time.getTime();
    });
};