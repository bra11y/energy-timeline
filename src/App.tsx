import { EnergyTimeline } from './components';
import { energyData, highlights, currentTime, customMessage } from './data/sampleData';

function App() {
  return (
    <div className="min-h-screen bg-gray-900 w-full mx-auto">
      <EnergyTimeline
        data={energyData}
        highlights={highlights}
        currentTime={currentTime}
        customMessage={customMessage}
        hourHeight={40}
        className="desktop-energy-timeline"
      />
    </div>
  );
}

export default App;
