import React from 'react';
import { TIMELINE_CONSTANTS } from '../../constants/timeline';
import { useEnergyData } from '../../hooks/useEnergyData';
import { useTimelineScales } from '../../hooks/useTimelineScales';
import { useTimelineInteractions } from '../../hooks/useTimelineInteractions';
import { 
  calculateTimelineLayout,
  getGridLineStyles,
  getTickLength,
  calculateSectionDimensions,
  calculateHighlightPosition,
  getBackgroundColor
} from '../../utils/timelineHelpers';
import { createEnergyGradient, createGlowFilter } from '../../utils/d3Helpers';
import type { EnergyTimelineProps } from '../../types/energy';
 
export const EnergyTimeline: React.FC<EnergyTimelineProps> = ({
  data,
  highlights = [],
  currentTime,
  customMessage,
  hourHeight: propHourHeight = TIMELINE_CONSTANTS.HOUR_HEIGHT,
  width = TIMELINE_CONSTANTS.DEFAULT_WIDTH,
  className = ''
}) => {
  // Use custom hooks for clean separation of concerns
  const interactions = useTimelineInteractions(currentTime);
  const hourHeight = propHourHeight * interactions.zoomLevel;
  
  const energyData = useEnergyData(data, interactions.selectedDate, currentTime);
  
  const currentTimeDate = React.useMemo(() => {
    if (currentTime) {
      const baseTime = new Date(currentTime);
      const resultTime = new Date(interactions.selectedDate);
      resultTime.setHours(
        baseTime.getHours(),
        baseTime.getMinutes(),
        baseTime.getSeconds(),
        baseTime.getMilliseconds()
      );
      return resultTime;
    }
    
    const defaultTime = new Date(interactions.selectedDate);
    defaultTime.setHours(10, 0, 0, 0);
    return defaultTime;
  }, [currentTime, interactions.selectedDate]);
  
  const scales = useTimelineScales(
    width, 
    hourHeight, 
    currentTimeDate, 
    energyData.transformedData
  );
  
  const layout = calculateTimelineLayout(
    width,
    hourHeight,
    currentTimeDate,
    scales.timeScale
  );

  const gradientDef = createEnergyGradient();
  const glowFilter = createGlowFilter();
   
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
        
          {/* Zoom Controls */}
            <div className="flex items-center space-x-1 bg-gray-800 rounded-lg px-2 py-1 ml-6">
            <button 
                onClick={interactions.handleZoomOut}
                className="text-gray-400 hover:text-white text-lg px-2 py-0.5 rounded hover:bg-gray-700 transition-all"
                aria-label="Zoom out"
              >
                −
            </button>
              <span className="text-xs text-gray-500 px-2 min-w-[2.5rem] text-center">
                {interactions.zoomLevel.toFixed(1)}x
              </span>
            <button 
                onClick={interactions.handleZoomIn}
                className="text-gray-400 hover:text-white text-lg px-2 py-0.5 rounded hover:bg-gray-700 transition-all"
                aria-label="Zoom in"
              >
                +
            </button>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
          {/* Date Selector */}
          <div className="relative">
            <button 
                onClick={() => interactions.setShowCalendar(!interactions.showCalendar)}
                className="flex items-center space-x-2 bg-gray-800 text-white px-3 py-1.5 rounded-lg hover:bg-gray-700 transition-colors text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>{interactions.selectedDate.toLocaleDateString()}</span>
                <svg className="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
              {/* Calendar Dropdown */}
              {interactions.showCalendar && (
                <div className="absolute top-full mt-2 right-0 bg-gray-800 rounded-lg p-3 shadow-xl z-timeline-calendar min-w-[240px] border border-gray-700">
                <input
                  type="date"
                    value={interactions.selectedDate.toISOString().split('T')[0]}
                    onChange={(e) => interactions.handleDateChange(new Date(e.target.value))}
                    className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 
                             focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-sm"
                  />
                  <div className="mt-2 flex space-x-2">
                  <button 
                      onClick={() => interactions.handleDateChange(new Date())}
                      className="flex-1 bg-blue-600 text-white px-3 py-1.5 rounded text-xs font-medium
                               hover:bg-blue-700 transition-colors"
                  >
                    Today
                  </button>
                  <button 
                    onClick={() => {
                      const yesterday = new Date();
                      yesterday.setDate(yesterday.getDate() - 1);
                        interactions.handleDateChange(yesterday);
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
          
            {/* Schedule Button */}
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
              height: 'calc(100vh - 80px)',
              minHeight: '600px'
            }}
          >
            <div 
              className="relative"
              style={{ height: `${layout.totalHeight + TIMELINE_CONSTANTS.MARGIN.TOP + TIMELINE_CONSTANTS.MARGIN.BOTTOM}px` }}
            >
              {/* Background Sections */}
              {layout.backgroundSections.map((section, index) => {
                const { startY, height } = calculateSectionDimensions(section, currentTimeDate, scales.timeScale);
              return (
                <div
                  key={index}
                  className="absolute w-full"
                  style={{
                    top: `${startY}px`,
                      height: `${height}px`,
                      backgroundColor: getBackgroundColor(index)
                  }}
                />
              );
            })}

              {/* SVG Chart */}
            <svg
              width={width}
                height={layout.totalHeight + TIMELINE_CONSTANTS.MARGIN.TOP + TIMELINE_CONSTANTS.MARGIN.BOTTOM}
                className="absolute inset-0 z-timeline-grid"
            >
              <defs>
                  {/* Gradient Definition */}
                  <linearGradient {...gradientDef}>
                    {energyData.gradientStops.map((stop, index) => (
                    <stop key={index} offset={stop.offset} stopColor={stop.color} />
                  ))}
                </linearGradient>
                  
                  {/* Glow Filter */}
                  <filter id={glowFilter.id}>
                    <feGaussianBlur stdDeviation={glowFilter.stdDeviation} result="coloredBlur"/>
                    <feMerge>
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
              </defs>
              
                {/* Grid Lines and Time Labels */}
                {layout.timeMarkers.map((marker, index) => {
                  const y = scales.timeScale(marker.time);
                  const gridStyles = getGridLineStyles(marker.isHour);
                  const tickLength = getTickLength(marker.isHour);
                  
                  // Calculate energy level at this time for progression highlighting
                  const timeHour = marker.time.getHours();
                  const energyAtTime = energyData.transformedData.find(point => 
                    point.time.getHours() === timeHour
                  )?.energyLevel || 0;
                  
                  // Get energy-based grid color for progression
                  const getGridColor = (energy: number) => {
                    if (energy >= 0.6) return 'rgba(37, 110, 255, 0.1)'; // Blue for high
                    if (energy >= 0.3) return 'rgba(220, 143, 105, 0.08)'; // Orange for medium
                    return 'rgba(183, 20, 142, 0.06)'; // Purple for low
                  };
                  
                return (
                  <g key={index}>
                      {/* Enhanced Grid Line with energy progression */}
                      <line
                        x1={TIMELINE_CONSTANTS.MARGIN.LEFT}
                        y1={y}
                        x2={width - TIMELINE_CONSTANTS.MARGIN.RIGHT}
                        y2={y}
                        stroke={marker.isHour ? getGridColor(energyAtTime) : "rgba(255, 255, 255, 0.02)"}
                        strokeWidth={gridStyles.strokeWidth}
                      />
                      
                      {/* Energy progression highlight on left margin */}
                      {marker.isHour && (
                        <rect
                          x={0}
                          y={y - (hourHeight / 2)}
                          width={TIMELINE_CONSTANTS.MARGIN.LEFT}
                          height={hourHeight}
                          fill={getGridColor(energyAtTime)}
                          opacity={0.3}
                        />
                      )}
                      
                      {/* Tick Mark */}
                    <line
                        x1={TIMELINE_CONSTANTS.MARGIN.LEFT - tickLength}
                      y1={y}
                        x2={TIMELINE_CONSTANTS.MARGIN.LEFT}
                      y2={y}
                        stroke="rgba(255, 255, 255, 0.4)"
                      strokeWidth={1}
                    />
                      
                      {/* Time Label */}
                      {marker.label && (
                    <text
                          x={TIMELINE_CONSTANTS.MARGIN.LEFT - 15}
                      y={y + 4}
                          fill="rgba(255, 255, 255, 0.8)"
                          fontSize="12"
                          fontWeight="500"
                      textAnchor="end"
                          className="select-none"
                    >
                          {marker.label}
                    </text>
                      )}
                  </g>
                );
              })}
              
                {/* Energy Curve */}
              <path
                  d={scales.pathData || ''}
                fill="none"
                stroke="url(#energyGradient)"
                  strokeWidth={TIMELINE_CONSTANTS.CURVE.STROKE_WIDTH}
                strokeLinecap="round"
                  strokeLinejoin="round"
                  filter={`url(#${glowFilter.id})`}
              />
              
                {/* Current Time Indicator */}
              <g>
                  {/* Horizontal Line - starts from left side */}
                <line
                    x1={TIMELINE_CONSTANTS.MARGIN.LEFT}
                    y1={layout.currentTimePosition}
                    x2={scales.energyScale(energyData.currentEnergyLevel)}
                    y2={layout.currentTimePosition}
                  stroke="white"
                    strokeWidth={TIMELINE_CONSTANTS.CURRENT_TIME.LINE_WIDTH}
                    opacity={TIMELINE_CONSTANTS.CURRENT_TIME.LINE_OPACITY}
                />
                  
                  {/* Interactive Dot - positioned at left side of time marker */}
                <circle
                    cx={TIMELINE_CONSTANTS.MARGIN.LEFT}
                    cy={layout.currentTimePosition}
                    r={TIMELINE_CONSTANTS.CURRENT_TIME.DOT_RADIUS}
                  fill="white"
                    className="cursor-pointer"
                    onMouseEnter={() => interactions.setShowTooltip(true)}
                    onMouseLeave={() => interactions.setShowTooltip(false)}
                    onClick={() => interactions.setShowTooltip(!interactions.showTooltip)}
                />
              </g>
            </svg>
          
              {/* Highlight Labels */}
              <div 
                className="absolute z-timeline-highlights right-5"
                style={{ 
                  top: `${TIMELINE_CONSTANTS.MARGIN.TOP}px`,
                  width: '160px',
                  height: `${layout.totalHeight}px` 
                }}
              >
              {highlights.map((highlight, index) => {
                const highlightTime = new Date(highlight.time);
                  const labelY = calculateHighlightPosition(
                    highlightTime, 
                    interactions.selectedDate, 
                    scales.timeScale, 
                    TIMELINE_CONSTANTS.MARGIN.TOP
                  );
                  
                  // Get appropriate icon for each label
                  const getIcon = (label: string) => {
                    if (label.includes('Morning Rise') || label.includes('Wake up')) {
                      return (
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                      );
                    }
                    if (label.includes('Peak') || label.includes('Rebound')) {
                      return (
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                            d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                      );
                    }
                    if (label.includes('Dip') || label.includes('Wind Down')) {
                      return (
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                            d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                        </svg>
                      );
                    }
                    if (label.includes('Sleep') || label.includes('Bedtime')) {
                      return (
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                        </svg>
                      );
                    }
                    return null;
                  };
                
                return (
                  <div
                    key={index}
                      className="absolute"
                      style={{ top: `${labelY - 14}px`, right: '0px' }}
                    >
                      <div 
                        className="px-3 py-1.5 rounded-full text-xs font-medium text-white shadow-sm flex items-center space-x-1"
                    style={{ 
                      backgroundColor: highlight.color,
                          fontSize: '11px'
                    }}
                  >
                        {getIcon(highlight.label)}
                    <span>{highlight.label}</span>
                      </div>
                  </div>
                );
              })}
            </div>

              {/* Tooltip */}
              {customMessage && interactions.showTooltip && (
                <div 
                  className="absolute z-timeline-tooltip bg-white rounded-lg shadow-md p-2.5 max-w-[220px]"
                  style={{
                    left: `${TIMELINE_CONSTANTS.MARGIN.LEFT + TIMELINE_CONSTANTS.CURRENT_TIME.DOT_RADIUS + 10}px`,
                    top: `${layout.currentTimePosition - TIMELINE_CONSTANTS.TOOLTIP.VERTICAL_OFFSET}px`
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
                  {/* Arrow */}
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