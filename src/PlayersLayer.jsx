import { useState, useRef, useCallback } from 'react';
import PlayerCard from './PlayerCard';

// Default positions for "bottom" and "middle" when manual mode is activated
const DEFAULT_POSITIONS = {
  bottom: [
    { x: 60,  y: 860 }, { x: 500, y: 860 }, { x: 940, y: 860 }, { x: 1380, y: 860 }
  ],
  middle: [
    { x: 60,  y: 380 }, { x: 1020, y: 380 }, { x: 60, y: 660 }, { x: 1020, y: 660 }
  ],
};

const CORNER_POSITIONS = [
  { x: 28,  y: 180 }, { x: 1552, y: 180 }, { x: 28, y: 700 }, { x: 1552, y: 700 }
];

export default function PlayersLayer({ state, manualMode = false, positions = null, onPositionsChange = null }) {
  const { players, playerCount, gameLayout, maxLP } = state;
  const visible = players.slice(0, playerCount);
  const containerRef = useRef(null);
  const draggingRef  = useRef(null);
  const offsetRef    = useRef({ x: 0, y: 0 });

  // local drag positions (only used in overlay when manualMode=true)
  const [localPos, setLocalPos] = useState(() => {
    if (positions) return positions;
    return (DEFAULT_POSITIONS[gameLayout] || DEFAULT_POSITIONS.bottom).slice(0, 4);
  });

  const effectivePos = positions || localPos;

  const startDrag = useCallback((e, idx) => {
    if (!manualMode) return;
    e.preventDefault();
    draggingRef.current = idx;
    const rect = containerRef.current.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    offsetRef.current = {
      x: clientX - rect.left - effectivePos[idx].x,
      y: clientY - rect.top  - effectivePos[idx].y,
    };
  }, [manualMode, effectivePos]);

  const onMove = useCallback((e) => {
    if (!manualMode || draggingRef.current === null) return;
    const rect = containerRef.current.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const x = clientX - rect.left - offsetRef.current.x;
    const y = clientY - rect.top  - offsetRef.current.y;
    const updated = effectivePos.map((p, i) => i === draggingRef.current ? { x, y } : p);
    if (onPositionsChange) onPositionsChange(updated);
    else setLocalPos(updated);
  }, [manualMode, effectivePos, onPositionsChange]);

  const endDrag = useCallback(() => { draggingRef.current = null; }, []);

  // Corners layout — fixed, no manual mode
  if (gameLayout === 'corners') {
    const slots = [
      { position: 'absolute', top: 180, left: 28,   width: 340 },
      { position: 'absolute', top: 180, right: 28,  width: 340 },
      { position: 'absolute', bottom: 28, left: 28,  width: 340 },
      { position: 'absolute', bottom: 28, right: 28, width: 340 },
    ];
    return (
      <div style={{ position: 'absolute', inset: 0 }}>
        {visible.map((p, i) => (
          <div key={i} style={slots[i] || {}}>
            <PlayerCard player={p} maxLP={maxLP} index={i} />
          </div>
        ))}
      </div>
    );
  }

  // Bottom layout — flex row unless manual mode
  if (gameLayout === 'bottom' && !manualMode) {
    return (
      <div style={{
        position: 'absolute', bottom: 28, left: 28, right: 28,
        display: 'flex', gap: 14, justifyContent: 'center',
      }}>
        {visible.map((p, i) => (
          <div key={i} style={{ flex: 1, maxWidth: 420 }}>
            <PlayerCard player={p} maxLP={maxLP} index={i} />
          </div>
        ))}
      </div>
    );
  }

  // Middle layout — 2×2 grid unless manual mode
  if (gameLayout === 'middle' && !manualMode) {
    return (
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {visible.map((p, i) => (
            <div key={i} style={{ width: 320 }}>
              <PlayerCard player={p} maxLP={maxLP} index={i} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Manual drag mode (bottom or middle)
  return (
    <div
      ref={containerRef}
      style={{ position: 'absolute', inset: 0, cursor: manualMode ? 'default' : 'inherit' }}
      onMouseMove={onMove}
      onMouseUp={endDrag}
      onMouseLeave={endDrag}
      onTouchMove={onMove}
      onTouchEnd={endDrag}
    >
      {visible.map((p, i) => {
        const pos = effectivePos[i] || { x: 60 + i * 380, y: 860 };
        return (
          <div
            key={i}
            onMouseDown={e => startDrag(e, i)}
            onTouchStart={e => startDrag(e, i)}
            style={{
              position: 'absolute',
              left: pos.x, top: pos.y,
              width: 340,
              cursor: manualMode ? 'grab' : 'inherit',
              userSelect: 'none',
              outline: manualMode ? '2px dashed rgba(255,255,255,0.4)' : 'none',
              borderRadius: 14,
            }}
          >
            {manualMode && (
              <div style={{
                position: 'absolute', top: -18, left: 0,
                fontSize: 10, color: 'rgba(255,255,255,0.6)',
                fontFamily: 'monospace', letterSpacing: 1,
                pointerEvents: 'none',
              }}>P{i+1} ✥ drag</div>
            )}
            <PlayerCard player={p} maxLP={maxLP} index={i} />
          </div>
        );
      })}
    </div>
  );
}
