import React from "react";
import { Route, Routes } from "react-router-dom";
import Experiment from "./views/contingency-degradation";
import DataEntry from "./views/data-entry";
import OnlineShop from "./views/online-shop";
import SlideShow from "./views/slide";

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
