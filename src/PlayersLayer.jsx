import PlayerCard from './PlayerCard';

const SLOT_STYLES = {
  corners: [
    { position: 'absolute', top: 180, left: 28, width: 340 },
    { position: 'absolute', top: 180, right: 28, width: 340 },
    { position: 'absolute', bottom: 28, left: 28, width: 340 },
    { position: 'absolute', bottom: 28, right: 28, width: 340 },
  ],
};

export default function PlayersLayer({ state }) {
  const { players, playerCount, gameLayout, maxLP } = state;
  const visible = players.slice(0, playerCount);

  if (gameLayout === 'bottom') {
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

  if (gameLayout === 'corners') {
    return (
      <div style={{ position: 'absolute', inset: 0 }}>
        {visible.map((p, i) => (
          <div key={i} style={SLOT_STYLES.corners[i] || {}}>
            <PlayerCard player={p} maxLP={maxLP} index={i} />
          </div>
        ))}
      </div>
    );
  }

  // middle — 2×2 grid centered
  return (
    <div style={{
      position: 'absolute', inset: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 12,
      }}>
        {visible.map((p, i) => (
          <div key={i} style={{ width: 320 }}>
            <PlayerCard player={p} maxLP={maxLP} index={i} />
          </div>
        ))}
      </div>
    </div>
  );
}
