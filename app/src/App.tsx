
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import DataEntry from './views/DataEntry/DataEntry';
import SlideShow from './views/SlideShow/SlideShow';
import { Provider } from 'react-redux';
import store from './store/store';

const App: React.FC = () => {
  return (
    <div className="App">
      <Provider store={store}>
        <Routes>
          <Route path="/" element={<DataEntry/>} />
          <Route path="slide" element={<SlideShow/>} />
          <Route
            path="*"
            element={<Navigate to="/" replace />}
          />
        </Routes>
      </Provider>
    </div>
  );
}

export default App;