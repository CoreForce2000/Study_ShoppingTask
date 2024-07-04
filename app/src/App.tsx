import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import CsvTable from "./views/csv-viewer";
import DataEntry from "./views/data-entry";
import SlideShow from "./views/slide";

const App: React.FC = () => {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route
            path="/slide/:slideNumberRaw/:trialName?/:trialNumberRaw?"
            element={<SlideShow />}
          />
          <Route path="/" element={<DataEntry />} />
          <Route path="/csv" element={<CsvTable />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
