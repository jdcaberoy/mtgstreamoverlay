const ELIM_STYLES = `
  @keyframes elimPulse {
    0%, 100% { opacity: 1; }
    50%       { opacity: 0.7; }
  }
  @keyframes elimScan {
    0%   { transform: translateY(-100%); }
    100% { transform: translateY(400%); }
  }
  @keyframes elimStrike {
    0%   { width: 0; opacity: 0; }
    20%  { opacity: 1; }
    100% { width: 100%; opacity: 1; }
  }
`;

export default function PlayerCard({ player, maxLP, index, compact = false }) {
  const pct     = Math.max(0, Math.min(100, (player.lp / maxLP) * 100));
  const overMax = player.lp > maxLP;
  const color   = player.color || '#4fc3f7';

  return (
    <div style={{
      background: 'rgba(0,0,0,0.85)',
      border: `2px solid ${player.elim ? 'rgba(239,83,80,0.25)' : 'rgba(255,255,255,0.12)'}`,
      borderTop: `3px solid ${player.elim ? '#b71c1c' : color}`,
      borderRadius: 12,
      padding: compact ? '10px 14px' : '14px 18px',
      position: 'relative',
      overflow: 'hidden',
      transition: 'border-color 0.4s, border-top-color 0.4s',
      width: '100%',
    }}>
      <style>{ELIM_STYLES}</style>

      {/* ── ELIMINATED overlay ── */}
      {player.elim && (
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(160deg, rgba(30,0,0,0.92) 0%, rgba(80,10,10,0.88) 100%)',
          borderRadius: 10,
          zIndex: 10,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: 6,
          overflow: 'hidden',
        }}>
          {/* Scan-line sweep effect */}
          <div style={{
            position: 'absolute', left: 0, right: 0, height: '30%',
            background: 'linear-gradient(180deg, transparent, rgba(239,83,80,0.08), transparent)',
            animation: 'elimScan 3s ease-in-out infinite',
            pointerEvents: 'none',
          }} />

          {/* Diagonal red lines (decorative) */}
          <div style={{
            position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', opacity: 0.12,
          }}>
            {[...Array(6)].map((_,i) => (
              <div key={i} style={{
                position: 'absolute',
                left: `${-20 + i * 25}%`, top: '-10%',
                width: 2, height: '140%',
                background: '#ef5350',
                transform: 'rotate(-35deg)',
              }} />
            ))}
          </div>

          {/* Skull icon */}
          <div style={{
            fontSize: compact ? 18 : 26,
            lineHeight: 1,
            filter: 'drop-shadow(0 0 6px rgba(239,83,80,0.8))',
          }}>💀</div>

          {/* ELIMINATED stamp */}
          <div style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: compact ? 20 : 30,
            letterSpacing: compact ? 4 : 7,
            color: '#ef5350',
            textShadow: '0 0 14px rgba(239,83,80,0.7), 0 0 2px rgba(0,0,0,0.9)',
            border: '2px solid rgba(239,83,80,0.6)',
            padding: compact ? '2px 12px' : '4px 20px',
            borderRadius: 4,
            background: 'rgba(239,83,80,0.08)',
            animation: 'elimPulse 2.5s ease-in-out infinite',
            backdropFilter: 'blur(2px)',
            position: 'relative',
          }}>
            ELIMINATED
            {/* Strike-through line */}
            <div style={{
              position: 'absolute', top: '50%', left: 0,
              height: 2, background: 'rgba(239,83,80,0.5)',
              animation: 'elimStrike 0.6s ease-out 0.2s both',
              borderRadius: 1,
            }} />
          </div>

          {/* Player name beneath */}
          <div style={{
            fontSize: compact ? 9 : 11,
            color: 'rgba(255,255,255,0.4)',
            letterSpacing: 3,
            textTransform: 'uppercase',
            fontFamily: "'Inter', sans-serif",
            fontWeight: 600,
          }}>
            {player.name}
          </div>
        </div>
      )}

      {/* ── Content (blurred + desaturated when eliminated) ── */}
      <div style={{
        filter: player.elim ? 'grayscale(1) brightness(0.3)' : 'none',
        transition: 'filter 0.4s',
      }}>
        {/* Wins badge */}
        {player.showWins && (
          <div style={{
            fontSize: compact ? 9 : 10, color: '#ffd700', fontWeight: 700,
            letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 2,
            display: 'flex', alignItems: 'center', gap: 5,
          }}>
            {Array.from({ length: Math.min(player.wins, 10) }).map((_, i) => (
              <span key={i} style={{ fontSize: compact ? 10 : 12 }}>★</span>
            ))}
            {player.wins > 10 && <span style={{ fontSize: compact ? 10 : 11 }}>×{player.wins}</span>}
            {player.wins === 0 && <span style={{ color: '#555' }}>No wins yet</span>}
          </div>
        )}

        {/* Name */}
        <div style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: compact ? 20 : 26,
          color: '#fff', letterSpacing: 2, lineHeight: 1,
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>{player.name}</div>

        {/* Strategy */}
        <div style={{
          fontSize: 11, color: '#777', textTransform: 'uppercase',
          letterSpacing: 1, margin: '2px 0 8px', fontWeight: 600,
        }}>{player.strat}</div>

        {/* LP bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <div style={{ fontSize: 10, color: '#555', textTransform: 'uppercase', letterSpacing: 1, width: 18 }}>LP</div>
          <div style={{ flex: 1, height: 8, background: 'rgba(255,255,255,0.1)', borderRadius: 4, overflow: 'hidden' }}>
            <div style={{
              height: '100%', borderRadius: 4,
              width: overMax ? '100%' : `${pct}%`,
              background: overMax ? 'linear-gradient(90deg,#ffd700,#ffaa00)' : color,
              transition: 'width 0.35s ease',
            }} />
          </div>
          <div style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: compact ? 18 : 22,
            color: overMax ? '#ffd700' : '#fff',
            minWidth: 40, textAlign: 'right', lineHeight: 1,
          }}>{player.lp}</div>
        </div>

        {/* Counters */}
        {player.ctrs?.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginTop: 7 }}>
            {player.ctrs.map((c, ci) => (
              <div key={ci} style={{
                background: 'rgba(255,255,255,0.09)',
                border: '1px solid rgba(255,255,255,0.18)',
                borderRadius: 20, padding: '3px 11px',
                display: 'flex', alignItems: 'center', gap: 5,
                fontSize: 11, color: '#ddd', whiteSpace: 'nowrap',
              }}>
                <span style={{ fontWeight: 600, color: '#ccc' }}>{c.name}</span>
                <span style={{ color: '#ffd700', fontWeight: 700 }}>{c.val}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
