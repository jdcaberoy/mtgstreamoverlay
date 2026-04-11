export default function EventBanner({ state }) {
  const { evName, evFont, evStage, evStyle, showStyle, evCurRound, evTotRounds, showRound, evTurn } = state;
  const showMeta = showStyle || showRound;

  return (
    <div style={{
      position: 'absolute', top: 28, left: '50%', transform: 'translateX(-50%)',
      background: 'rgba(0,0,0,0.85)',
      border: '2px solid rgba(255,255,255,0.2)',
      borderRadius: 12, padding: '12px 52px 14px',
      minWidth: 480, textAlign: 'center', whiteSpace: 'nowrap',
      pointerEvents: 'none',
    }}>
      <div style={{ fontFamily: evFont, fontSize: 46, color: '#fff', letterSpacing: 5, lineHeight: 1 }}>
        {evName}
      </div>
      <div style={{
        fontFamily: "'Bebas Neue', sans-serif",
        fontSize: 22, color: '#ffd700', letterSpacing: 4, marginTop: 3, lineHeight: 1,
      }}>
        {evStage.toUpperCase()}
      </div>
      {showMeta && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginTop: 8 }}>
          {showRound && (
            <span style={{
              fontSize: 11, color: '#bbb', fontWeight: 600,
              letterSpacing: '1.5px', textTransform: 'uppercase',
              background: 'rgba(255,255,255,0.08)', padding: '3px 12px', borderRadius: 4,
            }}>
              Round {evCurRound} / {evTotRounds}
            </span>
          )}
          {showStyle && (
            <span style={{
              fontSize: 11, color: '#bbb', fontWeight: 600,
              letterSpacing: '1.5px', textTransform: 'uppercase',
              background: 'rgba(255,255,255,0.08)', padding: '3px 12px', borderRadius: 4,
            }}>
              {evStyle}
            </span>
          )}
          <span style={{
            fontSize: 11, color: '#bbb', fontWeight: 600,
            letterSpacing: '1.5px', textTransform: 'uppercase',
            background: 'rgba(255,255,255,0.08)', padding: '3px 12px', borderRadius: 4,
          }}>
            Turn {evTurn}
          </span>
        </div>
      )}
      {!showMeta && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginTop: 8 }}>
          <span style={{
            fontSize: 11, color: '#bbb', fontWeight: 600,
            letterSpacing: '1.5px', textTransform: 'uppercase',
            background: 'rgba(255,255,255,0.08)', padding: '3px 12px', borderRadius: 4,
          }}>
            Turn {evTurn}
          </span>
        </div>
      )}
    </div>
  );
}
