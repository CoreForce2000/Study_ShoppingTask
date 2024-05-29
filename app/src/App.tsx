import React from "react";
import { Routes, Route } from "react-router-dom";
import DataEntry from "./views/data-entry";
import SlideShow from "./views/experiment-sequence";
import { Provider } from "react-redux";
import store from "./store/store";
import OnlineShop from "./views/OnlineShop/online-shop";
import Experiment from "./views/OnlineShop/pages/experiment";

const App: React.FC = () => {
  return (
    <div className="App">
      <Provider store={store}>
        <Routes>
          <Route path="/" element={<DataEntry />} />
          <Route path="slide" element={<SlideShow />} />
          <Route path="shop" element={<OnlineShop />} />
          <Route path="contingency" element={<Experiment />} />
        </Routes>
      </Provider>
    </div>
  );
};

export default App;
