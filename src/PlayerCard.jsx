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
  @keyframes activePulse {
    0%, 100% { box-shadow: 0 0 0 2px rgba(255,215,0,0.6), 0 0 16px rgba(255,215,0,0.3); }
    50%       { box-shadow: 0 0 0 3px rgba(255,215,0,0.9), 0 0 28px rgba(255,215,0,0.5); }
  }
  @keyframes activeArrow {
    0%, 100% { transform: translateX(0); }
    50%       { transform: translateX(4px); }
  }
`;

const MANA_SVGS = {
  W: 'https://svgs.scryfall.io/card-symbols/W.svg',
  U: 'https://svgs.scryfall.io/card-symbols/U.svg',
  B: 'https://svgs.scryfall.io/card-symbols/B.svg',
  R: 'https://svgs.scryfall.io/card-symbols/R.svg',
  G: 'https://svgs.scryfall.io/card-symbols/G.svg',
};
const MANA_ORDER = ['W','U','B','R','G'];

export default function PlayerCard({ player, maxLP, index, compact = false, isActive = false }) {
  const pct     = Math.max(0, Math.min(100, (player.lp / maxLP) * 100));
  const overMax = player.lp > maxLP;
  const color   = player.color || '#4fc3f7';
  const wins    = player.wins || 0;
  const mana    = (player.manaColors || []).filter(c => MANA_ORDER.includes(c));
  const topBorderColor = player.elim ? '#b71c1c' : isActive ? '#ffd700' : color;
  const manaSize = compact ? 16 : (mana.length <= 2 ? 26 : mana.length === 3 ? 23 : mana.length === 4 ? 20 : 18);

  return (
    <div style={{
      background: isActive ? 'rgba(10,8,0,0.92)' : 'rgba(0,0,0,0.85)',
      border: isActive
        ? '2px solid rgba(255,215,0,0.35)'
        : `2px solid ${player.elim ? 'rgba(239,83,80,0.25)' : 'rgba(255,255,255,0.12)'}`,
      borderTop: `3px solid ${topBorderColor}`,
      borderRadius: 12,
      padding: compact ? '10px 14px' : '14px 18px',
      position: 'relative',
      overflow: 'hidden',
      transition: 'border-color 0.3s, border-top-color 0.3s, background 0.3s, box-shadow 0.3s',
      width: '100%',
      animation: isActive && !player.elim ? 'activePulse 2s ease-in-out infinite' : 'none',
    }}>
      <style>{ELIM_STYLES}</style>

      {/* Active turn indicator — left edge bar */}
      {isActive && !player.elim && (
        <div style={{
          position: 'absolute', left: 0, top: 0, bottom: 0,
          width: 4,
          background: 'linear-gradient(180deg, #ffd700, #ffaa00)',
          borderRadius: '0 0 0 10px',
          zIndex: 5,
        }} />
      )}

      {/* ── ELIMINATED overlay ── */}
      {player.elim && (
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(160deg, rgba(30,0,0,0.92) 0%, rgba(80,10,10,0.88) 100%)',
          borderRadius: 10, zIndex: 10,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexDirection: 'column', gap: 6, overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', left: 0, right: 0, height: '30%', background: 'linear-gradient(180deg, transparent, rgba(239,83,80,0.08), transparent)', animation: 'elimScan 3s ease-in-out infinite', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', opacity: 0.12 }}>
            {[...Array(6)].map((_,i) => (
              <div key={i} style={{ position: 'absolute', left: `${-20 + i * 25}%`, top: '-10%', width: 2, height: '140%', background: '#ef5350', transform: 'rotate(-35deg)' }} />
            ))}
          </div>
          <div style={{ fontSize: compact ? 18 : 26, lineHeight: 1, filter: 'drop-shadow(0 0 6px rgba(239,83,80,0.8))' }}>💀</div>
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: compact ? 20 : 30, letterSpacing: compact ? 4 : 7, color: '#ef5350', textShadow: '0 0 14px rgba(239,83,80,0.7)', border: '2px solid rgba(239,83,80,0.6)', padding: compact ? '2px 12px' : '4px 20px', borderRadius: 4, background: 'rgba(239,83,80,0.08)', animation: 'elimPulse 2.5s ease-in-out infinite', position: 'relative' }}>
            ELIMINATED
            <div style={{ position: 'absolute', top: '50%', left: 0, height: 2, background: 'rgba(239,83,80,0.5)', animation: 'elimStrike 0.6s ease-out 0.2s both', borderRadius: 1 }} />
          </div>
          <div style={{ fontSize: compact ? 9 : 11, color: 'rgba(255,255,255,0.4)', letterSpacing: 3, textTransform: 'uppercase', fontFamily: "'Inter', sans-serif", fontWeight: 600 }}>{player.name}</div>
        </div>
      )}

      {/* ── Content ── */}
      <div style={{ filter: player.elim ? 'grayscale(1) brightness(0.3)' : 'none', transition: 'filter 0.4s' }}>

        {/* Wins row — always present for consistent height */}
        <div style={{
          height: compact ? 13 : 15, marginBottom: 2,
          display: 'flex', alignItems: 'center', gap: 4,
          fontSize: compact ? 9 : 10, fontWeight: 700,
          letterSpacing: 1.5, textTransform: 'uppercase', overflow: 'hidden',
        }}>
          {player.showWins && wins > 0 && (
            <>
              {Array.from({ length: Math.min(wins, 10) }).map((_, wi) => (
                <span key={wi} style={{ color: '#ffd700', fontSize: compact ? 10 : 12 }}>★</span>
              ))}
              {wins > 10 && <span style={{ color: '#ffd700', fontSize: compact ? 10 : 11 }}>×{wins}</span>}
            </>
          )}
          {player.showWins && wins === 0 && <span style={{ color: '#444' }}>—</span>}
        </div>

        {/* Name row + mana icons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 0 }}>
          {/* Active arrow — sits just left of name */}
          {isActive && !player.elim && (
            <div style={{
              fontSize: compact ? 12 : 16,
              color: '#ffd700',
              animation: 'activeArrow 0.8s ease-in-out infinite',
              flexShrink: 0, lineHeight: 1,
              filter: 'drop-shadow(0 0 4px rgba(255,215,0,0.8))',
            }}>▶</div>
          )}

          <div style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: compact ? 20 : 26,
            color: isActive && !player.elim ? '#ffd700' : '#fff',
            letterSpacing: 2, lineHeight: 1,
            flex: 1, minWidth: 0,
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            transition: 'color 0.3s',
          }}>{player.name}</div>

          {/* Mana icons */}
          {mana.length > 0 && (
            <div style={{
              display: 'flex', alignItems: 'center',
              gap: mana.length <= 2 ? 4 : mana.length === 3 ? 2 : 1,
              flexShrink: 0,
            }}>
              {MANA_ORDER.filter(c => mana.includes(c)).map(c => (
                <img key={c} src={MANA_SVGS[c]} alt={c} style={{
                  width: manaSize, height: manaSize, borderRadius: '50%',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.6)',
                  marginLeft: mana.length >= 4 ? -4 : 0, flexShrink: 0,
                }} />
              ))}
            </div>
          )}
        </div>

        {/* Strategy */}
        <div style={{ fontSize: 11, color: '#777', textTransform: 'uppercase', letterSpacing: 1, margin: '2px 0 8px', fontWeight: 600 }}>
          {player.strat}
        </div>

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
                background: 'rgba(255,255,255,0.09)', border: '1px solid rgba(255,255,255,0.18)',
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
