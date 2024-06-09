import React from "react";
import { Routes, Route } from "react-router-dom";
import DataEntry from "./views/data-entry";
import SlideShow from "./views/slide";
import OnlineShop from "./views/online-shop";
import Experiment from "./views/contingency-degradation";

const App: React.FC = () => {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<DataEntry />} />
        <Route path="slide" element={<SlideShow />} />
        <Route path="shop" element={<OnlineShop />} />
        <Route path="contingency" element={<Experiment />} />
      </Routes>
    </div>
  );
};

export default App;
