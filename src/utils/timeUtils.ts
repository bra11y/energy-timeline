export const formatTime = (timeInput: Date | string): string => {
  const date = typeof timeInput === 'string' ? new Date(timeInput) : timeInput;
  const hours = date.getHours();
  const ampm = hours >= 12 ? 'pm' : 'am';
  const displayHours = hours % 12 || 12;
  return `${displayHours}${ampm}`;
};

export const getEnergyColor = (level: number): string => {
  if (level >= 0.6) return '#256EFF';
  if (level >= 0.3) return '#DC8F69';
  return '#B7148E';
};

export const transformEnergyData = (data: { time: string; level: number }[], selectedDate?: Date): { time: Date; energyLevel: number }[] => {
  return data.map(point => {
    const baseTime = new Date(point.time);
    let targetTime = baseTime;
    
    if (selectedDate) {
      targetTime = new Date(selectedDate);
      targetTime.setHours(baseTime.getHours(), baseTime.getMinutes(), baseTime.getSeconds(), baseTime.getMilliseconds());
    }
    
    return {
      time: targetTime,
      energyLevel: point.level
    };
  });
}; 