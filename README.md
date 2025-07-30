# Energy Timeline Visualization

A professional assessment for React + TypeScript + D3.js energy timeline visualization with clean architecture and modern best practices.

## 🏗️ Architecture Overview

This project showcases enterprise-level code organization with complete separation of concerns:

### 📁 Project Structure
```
src/
├── components/
│   └── EnergyTimeline/
│       └── EnergyTimeline.tsx      # Pure UI component (Tailwind only)
├── hooks/
│   ├── useEnergyData.ts            # Data processing & calculations
│   ├── useTimelineScales.ts        # D3.js scales & line generation
│   └── useTimelineInteractions.ts  # User interactions & state
├── utils/
│   ├── energyCalculations.ts       # Energy-related computations
│   ├── d3Helpers.ts               # D3.js utilities & helpers
│   ├── timelineHelpers.ts         # Timeline layout calculations
│   └── timeUtils.ts               # Time formatting utilities
├── constants/
│   └── timeline.ts                # All constants & configuration
├── types/
│   └── energy.ts                  # TypeScript definitions
└── data/
    └── sampleData.ts              # Sample energy data
```

## 🎯 Key Features

- **✅ Zero Inline Styles**: 100% Tailwind CSS implementation
- **✅ Custom Hooks**: Clean separation of data, scales, and interactions
- **✅ TypeScript**: Comprehensive type safety with detailed interfaces
- **✅ D3.js Integration**: Professional data visualization patterns
- **✅ Constants Management**: Centralized configuration
- **✅ Node Version Management**: `.nvmrc` for consistent environments

## 🚀 Technical Highlights

### **Clean Component Architecture**
- **Pure UI Component**: `EnergyTimeline.tsx` focuses solely on rendering
- **Custom Hooks**: Business logic separated into reusable hooks
- **Utility Functions**: Calculations and helpers in dedicated files

### **Modern React Patterns**
```typescript
// Clean hook composition
const interactions = useTimelineInteractions(currentTime);
const energyData = useEnergyData(data, interactions.selectedDate, currentTime);
const scales = useTimelineScales(width, hourHeight, currentTimeDate, energyData.transformedData);
```

### **TypeScript Excellence**
- Comprehensive interfaces for all data structures
- Strong typing for D3.js integration
- Generic types for reusability
- Proper return type definitions for hooks

### **Tailwind CSS Mastery**
- Custom utility classes for timeline-specific spacing
- Z-index management with semantic naming
- Opacity variables for consistent transparency
- Extended color palette for energy visualization

### **D3.js Best Practices**
- Scales and line generators in separate utilities
- Memoized calculations for performance
- Clean SVG structure with proper grouping
- Filter and gradient definitions

## 🛠️ Development Setup

### Prerequisites
```bash
# Use the specified Node version
nvm use

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Environment
- **Node.js**: 18.18.0 (specified in `.nvmrc`)
- **React**: 18+ with TypeScript
- **Vite**: Modern build tooling for 100ms hot reload
- **Tailwind CSS**: Utility-first styling
- **D3.js**: Data visualization

## 📊 Data Flow

```
Raw Data (EnergyPoint[])
    ↓ useEnergyData
Processed Data (ProcessedEnergyPoint[])
    ↓ useTimelineScales  
D3 Scales & Path Data
    ↓ EnergyTimeline
Rendered SVG Visualization
```

## 🎨 Design System

### Energy Colors
- **High Energy (≥0.6)**: `#256EFF` (Blue)
- **Medium Energy (≥0.3)**: `#DC8F69` (Orange)  
- **Low Energy (<0.3)**: `#B7148E` (Purple)

### Timeline Constants
- **Hour Height**: 40px (configurable for zoom)
- **Curve Smoothing**: Catmull-Rom with α=0.5
- **Grid Opacity**: 0.04 for subtle appearance
- **Zoom Range**: 0.5x to 3x with 1.2x steps


## 🎪 Affordance

- **Zoom Controls**: Smooth zoom in/out with bounds checking
- **Date Selection**: Calendar picker with shortcuts
- **Tooltip**: Hover/click interactions on the current time indicator
- **Time Format**: Professional "7:00 AM" format for clarity
- **Icon Labels**: Contextual icons for each energy phase
- **Grid Progression**: Energy-based grid highlighting system
- **Responsive**

## 🎨 Visual 

### **Perfect Mobile Design Match**
- **Time Labels**: "7:00 AM" format 
- **Icon Integration**: Sun (☀️), chart trends (📈📉), moon (🌙) for energy phases
- **Background Colors**: Energy level colors (blue/orange/purple) with proper opacity
- **Current Time Line**: Starts from the left margin to the current energy dot
- **Grid Progression**: Hour-based energy highlighting in left margin

### **Energy-Based Visual System**
- **Grid Colors**: Each hour shows energy level color
- **Background Sections**: Periods use corresponding energy colors
- **Progressive Highlighting**: Left margin displays energy progression
- **Opacity Management**: Subtle transparency for better grid visibility

## 🧪  Quality

- **Build Success**: Clean production builds
- **Performance Optimized**: Memoized calculations and efficient rendering


