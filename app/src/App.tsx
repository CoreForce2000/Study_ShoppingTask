
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import DataEntry from './views/DataEntry/DataEntry';
import SlideShow from './views/SlideShow/SlideShow';
import { Provider } from 'react-redux';
import store from './store/store';
import OnlineShop from './views/OnlineShop/OnlineShop';
import Experiment from './views/Experiment/Experiment';

const App: React.FC = () => {
  return (
    <div className="App">
      <Provider store={store}>
        <Routes>
          <Route path="/" element={<DataEntry/>} />
          <Route path="slide" element={<SlideShow/>} />
          <Route path="shop" element={<OnlineShop/>} />
          <Route path="contingency" element={<Experiment/>} />
        </Routes>
      </Provider>
    </div>
  );
}

export default App;