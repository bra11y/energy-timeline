import React, { useMemo, useRef, useState, useCallback } from 'react';
import * as d3 from 'd3';
import type { EnergyTimelineProps } from '../../types/energy';
import { formatTime, getEnergyColor, transformEnergyData } from '../../utils/timeUtils';

export const EnergyTimeline: React.FC<EnergyTimelineProps> = ({
  data,
  highlights = [],
  currentTime,
  customMessage,
  hourHeight: propHourHeight = 40,
  width = 1240,
  className = ''
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [selectedDate, setSelectedDate] = useState(currentTime ? new Date(currentTime) : new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false); // Add tooltip state
  
  const hourHeight = propHourHeight * zoomLevel;
  
  const handleZoomIn = useCallback(() => {
    setZoomLevel(prev => Math.min(prev * 1.2, 3));
  }, []);
  
  const handleZoomOut = useCallback(() => {
    setZoomLevel(prev => Math.max(prev / 1.2, 0.5));
  }, []);
  
  const handleDateChange = useCallback((date: Date) => {
    setSelectedDate(date);
    setShowCalendar(false);
  }, []);

  const transformedData = useMemo(() => 
    transformEnergyData(data, selectedDate), 
    [data, selectedDate]
  );
  
  const totalHeight = 24 * hourHeight;
  const margin = { top: 40, right: 200, bottom: 40, left: 80 };
  const chartWidth = width - margin.left - margin.right;
  
  // Current time calculation
  const currentTimeDate = useMemo(() => {
    if (currentTime) {
      const baseTime = new Date(currentTime);
      const currentHour = baseTime.getHours();
      const currentMinute = baseTime.getMinutes();
      
      const resultTime = new Date(selectedDate);
      resultTime.setHours(currentHour, currentMinute, 0, 0);
      return resultTime;
    }
    
    const defaultTime = new Date(selectedDate);
    defaultTime.setHours(10, 0, 0, 0);
    return defaultTime;
  }, [currentTime, selectedDate]);
  
  // Time scale - maps time to Y position
  const timeScale = useMemo(() => {
    const startTime = new Date(currentTimeDate);
    startTime.setHours(0, 0, 0, 0);
    const endTime = new Date(startTime);
    endTime.setHours(23, 59, 59, 999);
    
    return d3.scaleTime()
      .domain([startTime, endTime])
      .range([margin.top, totalHeight + margin.top]);
  }, [currentTimeDate, totalHeight, margin.top]);
  
  // Energy scale - maps energy level to X position
  const energyScale = useMemo(() => {
    return d3.scaleLinear()
      .domain([0, 1])
      .range([margin.left + 30, margin.left + chartWidth * 0.7]); // Reduced range to prevent loops
  }, [margin.left, chartWidth]);
  
  // Line generator - simple, follows the data closely without loops
  const lineGenerator = useMemo(() => {
    return d3.line<{ time: Date; energyLevel: number }>()
      .x(d => energyScale(d.energyLevel))
      .y(d => timeScale(d.time))
      .curve(d3.curveCatmullRom.alpha(0.5)); // Moderate smoothing to prevent loops
  }, [energyScale, timeScale]);
  
  // Generate time markers (hours and half-hours)
  const timeMarkers = useMemo(() => {
    const markers = [];
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
  }, [currentTimeDate]);
  
  const currentTimePosition = useMemo(() => {
    return timeScale(currentTimeDate);
  }, [timeScale, currentTimeDate]);
  
  // Create gradient stops based on the data
  const gradientStops = useMemo(() => {
    return transformedData.map((point, index) => ({
      offset: `${(index / (transformedData.length - 1)) * 100}%`,
      color: getEnergyColor(point.energyLevel)
    }));
  }, [transformedData]);

  const pathData = useMemo(() => {
    return lineGenerator(transformedData);
  }, [lineGenerator, transformedData]);
  
  // Background sections with subtle colors
  const backgroundSections = useMemo(() => [
    { start: 0, end: 6, color: 'rgba(30, 27, 75, 0.03)', label: 'Night' }, // More subtle
    { start: 6, end: 12, color: 'rgba(30, 58, 138, 0.02)', label: 'Morning' }, // More subtle
    { start: 12, end: 18, color: 'rgba(124, 45, 18, 0.03)', label: 'Afternoon' }, // More subtle
    { start: 18, end: 24, color: 'rgba(88, 28, 135, 0.03)', label: 'Evening' } // More subtle
  ], []);
  
  // Find current energy level for the dot position
  const currentEnergyLevel = useMemo(() => {
    const currentHour = currentTimeDate.getHours();
    const currentMinute = currentTimeDate.getMinutes();
    const currentTotalMinutes = currentHour * 60 + currentMinute;
    
    // Find the two closest data points and interpolate
    for (let i = 0; i < transformedData.length - 1; i++) {
      const point1 = transformedData[i];
      const point2 = transformedData[i + 1];
      const time1Minutes = point1.time.getHours() * 60 + point1.time.getMinutes();
      const time2Minutes = point2.time.getHours() * 60 + point2.time.getMinutes();
      
      if (currentTotalMinutes >= time1Minutes && currentTotalMinutes <= time2Minutes) {
        const ratio = (currentTotalMinutes - time1Minutes) / (time2Minutes - time1Minutes);
        return point1.energyLevel + (point2.energyLevel - point1.energyLevel) * ratio;
      }
    }
    return 0.9; // Default for 10am
  }, [currentTimeDate, transformedData]);
   
  return (
    <div className={`bg-gray-900 text-white min-h-screen ${className}`}>
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
          <div className="flex items-center space-x-4">
            <button className="text-gray-400 hover:text-white transition-colors p-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <h1 className="text-2xl font-semibold">Energy Rhythm</h1>
            
            <div className="flex items-center space-x-1 bg-gray-800 rounded-lg px-2 py-1 ml-6">
              <button 
                onClick={handleZoomOut}
                className="text-gray-400 hover:text-white text-lg px-2 py-0.5 rounded hover:bg-gray-700 transition-all"
                aria-label="Zoom out"
              >
                −
              </button>
              <span className="text-xs text-gray-500 px-2 min-w-[2.5rem] text-center">
                {zoomLevel.toFixed(1)}x
              </span>
              <button 
                onClick={handleZoomIn}
                className="text-gray-400 hover:text-white text-lg px-2 py-0.5 rounded hover:bg-gray-700 transition-all"
                aria-label="Zoom in"
              >
                +
              </button>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="relative">
              <button 
                onClick={() => setShowCalendar(!showCalendar)}
                className="flex items-center space-x-2 bg-gray-800 text-white px-3 py-1.5 rounded-lg hover:bg-gray-700 transition-colors text-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>{selectedDate.toLocaleDateString()}</span>
                <svg className="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {showCalendar && (
                <div className="absolute top-full mt-2 right-0 bg-gray-800 rounded-lg p-3 shadow-xl z-50 min-w-[240px] border border-gray-700">
                  <input
                    type="date"
                    value={selectedDate.toISOString().split('T')[0]}
                    onChange={(e) => handleDateChange(new Date(e.target.value))}
                    className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 
                             focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-sm"
                  />
                  <div className="mt-2 flex space-x-2">
                    <button 
                      onClick={() => handleDateChange(new Date())}
                      className="flex-1 bg-blue-600 text-white px-3 py-1.5 rounded text-xs font-medium
                               hover:bg-blue-700 transition-colors"
                    >
                      Today
                    </button>
                    <button 
                      onClick={() => {
                        const yesterday = new Date();
                        yesterday.setDate(yesterday.getDate() - 1);
                        handleDateChange(yesterday);
                      }}
                      className="flex-1 bg-gray-700 text-white px-3 py-1.5 rounded text-xs font-medium
                               hover:bg-gray-600 transition-colors"
                    >
                      Yesterday
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            <button className="bg-gray-800 text-white px-4 py-1.5 rounded-full flex items-center 
                             space-x-2 text-sm hover:bg-gray-700 transition-colors border border-gray-700">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>See Your Schedule</span>
            </button>
          </div>
        </header>
        
        {/* Main Timeline */}
        <main className="bg-gray-900">
          <div 
            className="w-full overflow-y-auto overflow-x-hidden relative"
            style={{ 
              height: `calc(100vh - 80px)`,
              minHeight: `600px`
            }}
          >
            <div className="relative" style={{ height: `${totalHeight + margin.top + margin.bottom}px` }}>
              {/* Background sections */}
              {backgroundSections.map((section, index) => {
                const startTime = new Date(currentTimeDate);
                startTime.setHours(section.start, 0, 0, 0);
                const endTime = new Date(currentTimeDate);
                endTime.setHours(section.end, 0, 0, 0);
                
                const startY = timeScale(startTime);
                const endY = timeScale(endTime);
                const sectionHeight = Math.abs(endY - startY);
                
                return (
                  <div
                    key={index}
                    className="absolute w-full"
                    style={{
                      top: `${startY}px`,
                      height: `${sectionHeight}px`,
                      backgroundColor: section.color
                    }}
                  />
                );
              })}

              {/* SVG Chart */}
              <svg
                ref={svgRef}
                width={width}
                height={totalHeight + margin.top + margin.bottom}
                className="absolute inset-0"
                style={{ zIndex: 10 }}
              >
                <defs>
                  {/* Gradient definition */}
                  <linearGradient id="energyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    {gradientStops.map((stop, index) => (
                      <stop key={index} offset={stop.offset} stopColor={stop.color} />
                    ))}
                  </linearGradient>
                  
                  {/* Subtle glow */}
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                    <feMerge>
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                </defs>
                
                {/* Time markers and labels */}
                {timeMarkers.map((marker, index) => {
                  const y = timeScale(marker.time);
                  
                  return (
                    <g key={index}>
                      {/* Grid line - extend full width */}
                      <line
                        x1={margin.left}
                        y1={y}
                        x2={width - margin.right}
                        y2={y}
                        stroke="rgba(255, 255, 255, 0.04)"
                        strokeWidth={marker.isHour ? 1 : 0.5}
                      />
                      
                      {/* Tick mark */}
                      <line
                        x1={margin.left - (marker.isHour ? 10 : 5)}
                        y1={y}
                        x2={margin.left}
                        y2={y}
                        stroke="rgba(255, 255, 255, 0.3)"
                        strokeWidth={1}
                      />
                      
                      {/* Time label - only for hours */}
                      {marker.label && (
                        <text
                          x={margin.left - 15}
                          y={y + 4}
                          fill="rgba(255, 255, 255, 0.7)"
                          fontSize="12"
                          fontWeight="400"
                          textAnchor="end"
                          className="select-none"
                        >
                          {marker.label}
                        </text>
                      )}
                    </g>
                  );
                })}
                
                {/* Energy curve */}
                <path
                  d={pathData || ''}
                  fill="none"
                  stroke="url(#energyGradient)"
                  strokeWidth={5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  filter="url(#glow)"
                />
                
                {/* Current time indicator */}
                <g>
                  {/* Horizontal line */}
                  <line
                    x1={margin.left}
                    y1={currentTimePosition}
                    x2={width - margin.right}
                    y2={currentTimePosition}
                    stroke="white"
                    strokeWidth={1.5}
                    opacity={0.8}
                  />
                  
                  {/* Interactive white dot */}
                  <circle
                    cx={energyScale(currentEnergyLevel)}
                    cy={currentTimePosition}
                    r={8}
                    fill="white"
                    stroke="none"
                    style={{ cursor: 'pointer' }}
                    onMouseEnter={() => setShowTooltip(true)}
                    onMouseLeave={() => setShowTooltip(false)}
                    onClick={() => setShowTooltip(!showTooltip)}
                  />
                </g>
              </svg>
            
              {/* Highlight labels */}
              <div className="absolute z-30" style={{ 
                right: `20px`, 
                top: `${margin.top}px`,
                width: '160px',
                height: `${totalHeight}px` 
              }}>
                {highlights.map((highlight, index) => {
                  const highlightTime = new Date(highlight.time);
                  highlightTime.setFullYear(
                    selectedDate.getFullYear(),
                    selectedDate.getMonth(),
                    selectedDate.getDate()
                  );
                  const labelY = timeScale(highlightTime) - margin.top;
                  
                  return (
                    <div
                      key={index}
                      className="absolute"
                      style={{ 
                        top: `${labelY - 14}px`,
                        right: '0px'
                      }}
                    >
                      <div 
                        className="px-3 py-1.5 rounded-full text-xs font-medium text-white shadow-sm"
                        style={{ 
                          backgroundColor: highlight.color, // Use exact color from highlights data
                          fontSize: '11px'
                        }}
                      >
                        {highlight.label}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Custom message tooltip - only show on hover/click */}
              {customMessage && showTooltip && (
                <div 
                  className="absolute z-40 bg-white rounded-lg shadow-md p-2.5 max-w-[220px]"
                  style={{
                    left: `${energyScale(currentEnergyLevel) + 20}px`,
                    top: `${currentTimePosition - 45}px`
                  }}
                >
                  <div className="text-gray-900">
                    <p className="text-xs font-medium mb-1 leading-tight">
                      {customMessage.title}
                    </p>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      {customMessage.description}
                    </p>
                  </div>
                  {/* Subtle arrow pointing to the dot */}
                  <div className="absolute left-0 top-1/2 transform -translate-x-1.5 -translate-y-1/2">
                    <div className="w-0 h-0 border-t-[5px] border-b-[5px] border-r-[8px] 
                                  border-t-transparent border-b-transparent border-r-white"></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};