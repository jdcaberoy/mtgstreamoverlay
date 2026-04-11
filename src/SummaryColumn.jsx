import PlayerCard from './PlayerCard';

export default function SummaryColumn({ state }) {
  const { evName, evStage, evStyle, showStyle, evCurRound, evTotRounds, showRound, evTurn, players, playerCount, maxLP } = state;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, height: '100%', overflowY: 'auto' }}>
      <div style={sectionTitle}>Game Summary</div>

      {/* Event info */}
      <div style={card}>
        <div style={{ fontSize: 18, fontWeight: 700, color: '#111', marginBottom: 4 }}>{evName}</div>
        <div style={{ fontSize: 13, color: '#e6a000', fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase' }}>{evStage}</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
          {showRound && <Pill>{`Round ${evCurRound}/${evTotRounds}`}</Pill>}
          {showStyle && <Pill>{evStyle}</Pill>}
          <Pill accent>Turn {evTurn}</Pill>
        </div>
      </div>

      {/* Players */}
      {players.slice(0, playerCount).map((p, i) => (
        <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: p.color, textTransform: 'uppercase', letterSpacing: 1 }}>
            P{i+1}
          </div>
          <div style={{ transform: 'scale(0.9)', transformOrigin: 'top left', width: '111%' }}>
            <PlayerCard player={p} maxLP={maxLP} index={i} compact />
          </div>
        </div>
      ))}
    </div>
  );
}

function Pill({ children, accent }) {
  return (
    <span style={{
      fontSize: 11, background: accent ? '#fef3c7' : '#f0f0f0',
      color: accent ? '#92400e' : '#555',
      padding: '3px 10px', borderRadius: 12, fontWeight: 600,
    }}>{children}</span>
  );
}

const sectionTitle = {
  fontSize: 11, fontWeight: 700, color: '#888',
  textTransform: 'uppercase', letterSpacing: 1.5,
  borderBottom: '1px solid #ebebeb', paddingBottom: 8,
};

const card = {
  background: '#fafafa', border: '1px solid #ebebeb',
  borderRadius: 8, padding: '12px 14px',
};
