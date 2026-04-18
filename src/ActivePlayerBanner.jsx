const BANNER_STYLES = `
  @keyframes bannerSlideIn {
    0%   { opacity: 0; transform: translateX(-24px); }
    100% { opacity: 1; transform: translateX(0); }
  }
  @keyframes bannerGlow {
    0%, 100% { box-shadow: var(--banner-glow-lo); }
    50%       { box-shadow: var(--banner-glow-hi); }
  }
  @keyframes arrowBounce {
    0%, 100% { transform: translateX(0); }
    50%       { transform: translateX(5px); }
  }
`;

const PLAYER_LABELS = ['Player One', 'Player Two', 'Player Three', 'Player Four'];

export default function ActivePlayerBanner({ state }) {
  const {
    activePlayer,
    showActiveBanner,
    activeBannerUseName,
    players,
    playerCount,
  } = state;

  // Feature off OR no player set
  if (showActiveBanner === false) return null;
  if (activePlayer === null || activePlayer === undefined) return null;

  const player = players?.[activePlayer];
  if (!player || activePlayer >= playerCount) return null;
  if (player.elim) return null;

  const color = player.color || '#4fc3f7';

  // Choose display name: real name or generic "Player N" label
  const displayName = activeBannerUseName !== false
    ? player.name
    : PLAYER_LABELS[activePlayer] || `Player ${activePlayer + 1}`;

  return (
    <>
      <style>{BANNER_STYLES}</style>
      <div
        key={activePlayer} // re-triggers slide-in animation when player changes
        style={{
          position: 'absolute',
          bottom: 160,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 20,
          pointerEvents: 'none',
          animation: 'bannerSlideIn 0.4s cubic-bezier(0.34,1.56,0.64,1) both, bannerGlow 2s ease-in-out 0.4s infinite',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          background: 'rgba(0,0,0,0.88)',
          border: `2px solid ${color}`,
          borderRadius: 10,
          padding: '8px 20px 8px 14px',
          backdropFilter: 'blur(4px)',
          whiteSpace: 'nowrap',
          // CSS vars for keyframe glow using player color
          '--banner-glow-lo': `0 0 12px ${color}66, 0 2px 8px rgba(0,0,0,0.6)`,
          '--banner-glow-hi': `0 0 28px ${color}bb, 0 2px 8px rgba(0,0,0,0.6)`,
        }}
      >
        {/* Colored left accent bar */}
        <div style={{
          width: 4, height: 36, borderRadius: 2,
          background: `linear-gradient(180deg, ${color}, ${color}55)`,
          flexShrink: 0,
        }} />

        {/* Text group */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* "Active Turn" label */}
          <div style={{
            fontSize: 10,
            color: 'rgba(255,255,255,0.45)',
            fontFamily: "'Inter', sans-serif",
            fontWeight: 700,
            letterSpacing: 2.5,
            textTransform: 'uppercase',
            lineHeight: 1,
          }}>
            Active Turn
          </div>

          {/* Player name */}
          <div style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: 30,
            color: color,
            letterSpacing: 3,
            lineHeight: 1,
            textShadow: `0 0 14px ${color}88`,
          }}>
            {displayName}
          </div>
        </div>

        {/* Animated arrow — uses player color */}
        <div style={{
          fontSize: 20,
          color: color,
          animation: 'arrowBounce 0.8s ease-in-out infinite',
          filter: `drop-shadow(0 0 5px ${color}cc)`,
          lineHeight: 1,
          marginLeft: 4,
        }}>▶</div>
      </div>
    </>
  );
}
