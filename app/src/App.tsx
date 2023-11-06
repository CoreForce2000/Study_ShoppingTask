
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import DataEntry from './views/DataEntry/DataEntry';
import SlideShow from './views/SlideShow/SlideShow';

const App: React.FC = () => {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<DataEntry/>} />
        <Route path="slide" element={<SlideShow/>} />
        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />
      </Routes>
    </div>
  );
}

export default App;