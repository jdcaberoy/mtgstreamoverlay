import { useState } from 'react';
import { useOverlayState } from './store';
import EventBanner from './EventBanner';
import PlayersLayer from './PlayersLayer';

const DEFAULT_POS = [
  { x: 60,  y: 860 }, { x: 500, y: 860 }, { x: 940, y: 860 }, { x: 1380, y: 860 }
];

export default function GameOverlay() {
  const state = useOverlayState();
  const bg = state.gameChromaColor || '#00ff00';
  const [manualMode, setManualMode] = useState(false);
  const [positions,  setPositions]  = useState(DEFAULT_POS);
  const isCorners = state.gameLayout === 'corners';

  return (
    <div style={{
      width: '100vw', height: '100vh',
      background: bg,
      position: 'relative',
      overflow: 'hidden',
      fontFamily: "'Inter', sans-serif",
    }}>
      <link
        href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Anton&family=Black+Han+Sans&family=Oswald:wght@700&family=Teko:wght@700&family=Inter:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />

      {/* Manual edit toggle — hidden in corners mode */}
      {!isCorners && (
        <button
          onClick={() => setManualMode(m => !m)}
          style={{
            position: 'absolute', top: 16, left: 16, zIndex: 100,
            padding: '7px 14px',
            background: manualMode ? 'rgba(255,200,0,0.9)' : 'rgba(0,0,0,0.6)',
            color: manualMode ? '#000' : '#fff',
            border: manualMode ? '2px solid #ffd700' : '2px solid rgba(255,255,255,0.3)',
            borderRadius: 8,
            fontSize: 12, fontWeight: 700, cursor: 'pointer',
            letterSpacing: 1, textTransform: 'uppercase',
            backdropFilter: 'blur(4px)',
            transition: 'all 0.2s',
            pointerEvents: 'all',
          }}
        >
          {manualMode ? '🔒 Lock Layout' : '✥ Edit Layout'}
        </button>
      )}

      <EventBanner state={state} />
      <PlayersLayer
        state={state}
        manualMode={manualMode}
        positions={manualMode ? positions : null}
        onPositionsChange={setPositions}
      />
    </div>
  );
}
