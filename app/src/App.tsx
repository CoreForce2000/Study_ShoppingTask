import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import DataEntry from "./views/data-entry";
import SlideShow from "./views/slide";

const App: React.FC = () => {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/slide/:slideNumber" element={<SlideShow />} />
          <Route path="/" element={<DataEntry />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
