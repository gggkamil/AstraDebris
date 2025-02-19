import React from 'react';
import "./App.css";
import CesiumGlobe from './components/SpaceGlobe';
const App: React.FC = () => {
  return (
    <div className="App">
     <h1 style={{ position: 'absolute', zIndex: 1000, color: 'white' }}>
        Space Debris Tracker
      </h1>
      <CesiumGlobe />
    </div>
  );
};

export default App;