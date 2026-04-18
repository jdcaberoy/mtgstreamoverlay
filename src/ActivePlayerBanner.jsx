const BANNER_STYLES = `
  @keyframes bannerSlideIn {
    0%   { opacity: 0; transform: translateX(-24px); }
    100% { opacity: 1; transform: translateX(0); }
  }
  @keyframes bannerGlow {
    0%, 100% { box-shadow: 0 0 12px rgba(255,215,0,0.4), 0 2px 8px rgba(0,0,0,0.6); }
    50%       { box-shadow: 0 0 24px rgba(255,215,0,0.7), 0 2px 8px rgba(0,0,0,0.6); }
  }
  @keyframes arrowBounce {
    0%, 100% { transform: translateX(0); }
    50%       { transform: translateX(5px); }
  }
`;

export default function ActivePlayerBanner({ state }) {
  const { activePlayer, showActivePlayer, players, playerCount } = state;

  // Feature is off OR no player set
  if (!showActivePlayer || activePlayer === null || activePlayer === undefined) return null;

  const player = players?.[activePlayer];
  if (!player || activePlayer >= playerCount) return null;
  if (player.elim) return null; // Don't show if eliminated

  const color = player.color || '#ffd700';

  return (
    <>
      <style>{BANNER_STYLES}</style>
      <div style={{
        position: 'absolute',
        bottom: 160,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 20,
        pointerEvents: 'none',
        animation: 'bannerSlideIn 0.4s cubic-bezier(0.34,1.56,0.64,1) both, bannerGlow 2s ease-in-out 0.4s infinite',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        background: 'rgba(0,0,0,0.88)',
        border: `2px solid ${color}`,
        borderRadius: 10,
        padding: '8px 20px 8px 14px',
        backdropFilter: 'blur(4px)',
      }}>
        {/* Colored left accent bar */}
        <div style={{
          width: 4, height: 32, borderRadius: 2,
          background: `linear-gradient(180deg, ${color}, ${color}88)`,
          flexShrink: 0,
        }} />

        {/* Label */}
        <div style={{
          fontSize: 11, color: 'rgba(255,255,255,0.5)',
          fontFamily: "'Inter', sans-serif",
          fontWeight: 700, letterSpacing: 2,
          textTransform: 'uppercase', lineHeight: 1,
          marginBottom: 3,
          display: 'block',
        }}>
          Active Turn
        </div>

        {/* Player name */}
        <div style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: 28, color: '#ffd700',
          letterSpacing: 3, lineHeight: 1,
          textShadow: `0 0 12px rgba(255,215,0,0.6)`,
        }}>
          {player.name}
        </div>

        {/* Animated arrow */}
        <div style={{
          fontSize: 18, color: '#ffd700',
          animation: 'arrowBounce 0.8s ease-in-out infinite',
          filter: 'drop-shadow(0 0 4px rgba(255,215,0,0.8))',
          lineHeight: 1,
        }}>▶</div>
      </div>
    </>
  );
}
