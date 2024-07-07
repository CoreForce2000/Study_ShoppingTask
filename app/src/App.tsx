import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import CsvTable from "./views/csv-viewer";
import DataEntry from "./views/data-entry";
import ImageViewer from "./views/image-viewer";
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
          <Route path="/images" element={<ImageViewer />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
