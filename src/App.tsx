import { EnergyTimeline } from './components/EnergyTimeline';
import { energyData, highlights, currentTime, customMessage } from './data/sampleData';

function App() {
  return (
    <div className="min-h-screen bg-gray-900">
      <EnergyTimeline
        data={energyData}
        highlights={highlights}
        currentTime={currentTime}
        customMessage={customMessage}
        hourHeight={40}
        width={1240}
        className="desktop-energy-timeline"
      />
    </div>
  );
}

export default App;
