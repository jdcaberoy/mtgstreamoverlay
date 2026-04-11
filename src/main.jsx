import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './Dashboard';
import GameOverlay from './GameOverlay';
import CardOverlay from './CardOverlay';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/"              element={<Dashboard />} />
        <Route path="/overlay/game"  element={<GameOverlay />} />
        <Route path="/overlay/card"  element={<CardOverlay />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
