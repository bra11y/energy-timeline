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
  
  const hourHeight = propHourHeight * zoomLevel;
  
  const handleZoomIn = useCallback(() => {
    setZoomLevel(prev => Math.min(prev * 1.5, 4));
  }, []);
  
  const handleZoomOut = useCallback(() => {
    setZoomLevel(prev => Math.max(prev / 1.5, 0.5));
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
  const margin = { top: 40, right: 250, bottom: 40, left: 120 };
  const chartWidth = width - margin.left - margin.right;
  
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
  
  const timeScale = useMemo(() => {
    const startTime = new Date(currentTimeDate);
    startTime.setHours(0, 0, 0, 0);
    const endTime = new Date(startTime);
    endTime.setHours(23, 59, 59, 999);
    
    return d3.scaleTime()
      .domain([startTime, endTime])
      .range([margin.top, totalHeight + margin.top]);
  }, [currentTimeDate, totalHeight, margin.top]);
  
  const energyScale = useMemo(() => {
    return d3.scaleLinear()
      .domain([0, 1])
      .range([margin.left + 80, margin.left + chartWidth * 0.7]);
  }, [margin.left, chartWidth]);
  
  const lineGenerator = useMemo(() => {
    return d3.line<{ time: Date; energyLevel: number }>()
      .x(d => energyScale(d.energyLevel))
      .y(d => timeScale(d.time))
      .curve(d3.curveBasis);
  }, [energyScale, timeScale]);
  
  const timeMarkers = useMemo(() => {
    const markers = [];
    for (let hour = 0; hour < 24; hour++) {
      const time = new Date(currentTimeDate);
      time.setHours(hour, 0, 0, 0);
      markers.push(time);
    }
    return markers;
  }, [currentTimeDate]);
  
  const currentTimePosition = useMemo(() => {
    return timeScale(currentTimeDate);
  }, [timeScale, currentTimeDate]);
  
  const gradientStops = useMemo(() => {
    return transformedData.map((point, index) => ({
      offset: `${(index / (transformedData.length - 1)) * 100}%`,
      color: getEnergyColor(point.energyLevel)
    }));
  }, [transformedData]);

  const pathData = useMemo(() => {
    return lineGenerator(transformedData);
  }, [lineGenerator, transformedData]);
  
  const backgroundSections = useMemo(() => [
    { start: 0, end: 6, color: 'rgba(30, 27, 75, 0.15)', label: 'Night' },
    { start: 6, end: 12, color: 'rgba(30, 58, 138, 0.15)', label: 'Morning' },
    { start: 12, end: 18, color: 'rgba(124, 45, 18, 0.15)', label: 'Afternoon' },
    { start: 18, end: 24, color: 'rgba(88, 28, 135, 0.15)', label: 'Evening' }
  ], []);
   
  return (
    <div className={`bg-gray-900 text-white min-h-screen ${className}`}>
      <div className="mx-auto max-w-7xl px-8 py-8">
        <header className="flex items-center justify-between p-6 border-b border-gray-700 rounded-t-lg bg-gray-800">
          <div className="flex items-center space-x-4">
            <button className="text-gray-400 hover:text-white transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <h1 className="text-3xl font-bold font-inclusive">Energy Rhythm</h1>
            
            <div className="flex items-center space-x-2 bg-gray-700 rounded-lg px-3 py-1">
              <button 
                onClick={handleZoomOut}
                className="text-gray-300 hover:text-white text-lg px-2 py-1 rounded hover:bg-gray-600 transition-colors"
              >
                −
              </button>
              <span className="text-sm text-gray-300 px-2">{zoomLevel.toFixed(1)}x</span>
              <button 
                onClick={handleZoomIn}
                className="text-gray-300 hover:text-white text-lg px-2 py-1 rounded hover:bg-gray-600 transition-colors"
              >
                +
              </button>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <button 
                onClick={() => setShowCalendar(!showCalendar)}
                className="flex items-center space-x-2 bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-sm">{selectedDate.toLocaleDateString()}</span>
              </button>
              
              {showCalendar && (
                <div className="absolute top-full mt-2 right-0 bg-gray-700 rounded-lg p-4 shadow-xl z-50 min-w-64">
                  <input
                    type="date"
                    value={selectedDate.toISOString().split('T')[0]}
                    onChange={(e) => handleDateChange(new Date(e.target.value))}
                    className="w-full bg-gray-600 text-white px-3 py-2 rounded border border-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                  />
                  <div className="mt-3 flex space-x-2">
                    <button 
                      onClick={() => handleDateChange(new Date())}
                      className="flex-1 bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700 transition-colors"
                    >
                      Today
                    </button>
                    <button 
                      onClick={() => {
                        const yesterday = new Date();
                        yesterday.setDate(yesterday.getDate() - 1);
                        handleDateChange(yesterday);
                      }}
                      className="flex-1 bg-gray-600 text-white px-3 py-1 rounded text-xs hover:bg-gray-500 transition-colors"
                    >
                      Yesterday
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            <button className="bg-white text-gray-900 px-4 py-2 rounded-lg flex items-center space-x-2 text-sm hover:bg-gray-100 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>See Your Schedule</span>
            </button>
          </div>
        </header>
        
        <main className="flex-1 bg-gray-800 rounded-b-lg">
          <div 
            className="w-full overflow-y-auto relative"
            style={{ 
              height: `calc(100vh - 160px)`,
              minHeight: `${totalHeight + margin.top + margin.bottom}px`
            }}
          >
            <div className="relative" style={{ height: `${totalHeight + margin.top + margin.bottom}px` }}>
              {backgroundSections.map((section, index) => {
                const startTime = new Date(currentTimeDate);
                startTime.setHours(section.start, 0, 0, 0);
                const endTime = new Date(currentTimeDate);
                endTime.setHours(section.end, 0, 0, 0);
                
                const startY = timeScale(startTime);
                const endY = timeScale(endTime);
                const sectionHeight = endY - startY;
                
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

              <svg
                ref={svgRef}
                width={width}
                height={totalHeight + margin.top + margin.bottom}
                className="absolute inset-0"
                style={{ zIndex: 10 }}
              >
                <defs>
                  <linearGradient id="energyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    {gradientStops.map((stop, index) => (
                      <stop key={index} offset={stop.offset} stopColor={stop.color} />
                    ))}
                  </linearGradient>
                </defs>
                
                {timeMarkers.map((time, index) => {
                  const y = timeScale(time);
                  return (
                    <g key={index}>
                      <line
                        x1={margin.left - 20}
                        y1={y}
                        x2={margin.left}
                        y2={y}
                        stroke="white"
                        strokeWidth={1}
                        opacity={0.6}
                      />
                      <text
                        x={margin.left - 25}
                        y={y + 4}
                        fill="white"
                        fontSize="14"
                        fontFamily="Inclusive Sans, sans-serif"
                        textAnchor="end"
                      >
                        {formatTime(time)}
                      </text>
                    </g>
                  );
                })}
                
                <path
                  d={pathData || ''}
                  fill="none"
                  stroke="url(#energyGradient)"
                  strokeWidth={6}
                  strokeLinecap="round"
                  style={{ filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.3))' }}
                />
                
                <g>
                  <line
                    x1={margin.left}
                    y1={currentTimePosition}
                    x2={width - margin.right}
                    y2={currentTimePosition}
                    stroke="white"
                    strokeWidth={2}
                    opacity={0.9}
                  />
                  <circle
                    cx={energyScale(0.9)}
                    cy={currentTimePosition}
                    r={8}
                    fill="white"
                    stroke="none"
                  />
                </g>
              </svg>
            
              <div className="absolute z-30" style={{ 
                right: `${margin.right - 220}px`, 
                top: `${margin.top}px`,
                width: '200px',
                height: `${totalHeight}px` 
              }}>
                {highlights.map((highlight, index) => {
                  const highlightTime = new Date(highlight.time);
                  const labelY = timeScale(highlightTime) - margin.top;
                  
                  return (
                    <div
                      key={index}
                      className="absolute px-3 py-1 rounded-lg text-xs font-medium shadow-lg whitespace-nowrap"
                      style={{ 
                        top: `${labelY - 12}px`,
                        backgroundColor: highlight.color,
                        color: 'white',
                        right: '0px'
                      }}
                    >
                      <span>{highlight.label}</span>
                    </div>
                  );
                })}
              </div>

              {customMessage && (
                <div 
                  className="absolute z-40 bg-white rounded-lg shadow-xl p-4 max-w-xs pointer-events-none"
                  style={{
                    left: `${energyScale(0.9) + 30}px`,
                    top: `${currentTimePosition - 60}px`
                  }}
                >
                  <div className="text-gray-900">
                    <p className="text-sm font-semibold mb-2">{customMessage.title}</p>
                    <p className="text-xs text-gray-600 leading-relaxed">{customMessage.description}</p>
                  </div>
                  <div className="absolute left-0 top-1/2 transform -translate-x-2 -translate-y-1/2">
                    <div className="w-0 h-0 border-t-[6px] border-b-[6px] border-r-[12px] border-t-transparent border-b-transparent border-r-white"></div>
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