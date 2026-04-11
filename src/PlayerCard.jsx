export default function PlayerCard({ player, maxLP, index, compact = false }) {
  const pct    = Math.max(0, Math.min(100, (player.lp / maxLP) * 100));
  const overMax = player.lp > maxLP;
  const color   = player.color || '#4fc3f7';

  return (
    <div style={{
      background: 'rgba(0,0,0,0.85)',
      border: '2px solid rgba(255,255,255,0.12)',
      borderTop: `3px solid ${color}`,
      borderRadius: 12,
      padding: compact ? '10px 14px' : '14px 18px',
      position: 'relative',
      overflow: 'hidden',
      opacity: player.elim ? 0.45 : 1,
      filter: player.elim ? 'grayscale(0.8)' : 'none',
      transition: 'opacity 0.3s, filter 0.3s',
      width: '100%',
    }}>

      {/* Eliminated overlay */}
      {player.elim && (
        <div style={{
          position: 'absolute', inset: 0,
          background: 'rgba(0,0,0,0.68)', borderRadius: 10,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexDirection: 'column', gap: 5, zIndex: 10,
        }}>
          <div style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: compact ? 24 : 36, letterSpacing: 5, color: '#ef5350',
            border: '2px solid #ef5350', padding: '4px 22px', borderRadius: 6,
          }}>ELIMINATED</div>
          <div style={{ fontSize: 11, color: '#999', letterSpacing: 2, textTransform: 'uppercase' }}>
            {player.name}
          </div>
        </div>
      )}

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
        fontSize: compact ? 20 : 26, color: '#fff',
        letterSpacing: 2, lineHeight: 1,
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
  );
}
