import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './Dashboard';
import GameOverlay from './GameOverlay';
import CardOverlay from './CardOverlay';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/*
      HashRouter is used so GitHub Pages (static host, no server-side routing)
      can handle routes like /#/overlay/game, /#/overlay/card/1 etc.
      Render.com works the same way — no rewrite rules needed with hash routing.
    */}
    <HashRouter>
      <Routes>
        <Route path="/"                  element={<Dashboard />} />
        <Route path="/overlay/game"      element={<GameOverlay />} />
        <Route path="/overlay/card/:slot" element={<CardOverlay />} />
      </Routes>
    </HashRouter>
  </React.StrictMode>
);
