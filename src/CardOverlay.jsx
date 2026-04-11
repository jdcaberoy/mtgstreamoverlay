import { useOverlayState } from './store';

export default function CardOverlay() {
  const state = useOverlayState();
  const { cardImage, cardName, cardChromaColor } = state;
  const bg = cardChromaColor || '#00ff00';

  return (
    <div style={{
      width: '100vw', height: '100vh',
      background: bg,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      gap: 12,
    }}>
      {cardImage ? (
        <>
          <img
            src={cardImage}
            alt={cardName}
            style={{
              maxHeight: '85vh', maxWidth: '90vw',
              borderRadius: 14,
              boxShadow: '0 8px 40px rgba(0,0,0,0.5)',
            }}
          />
          {cardName && (
            <div style={{
              color: 'white', fontSize: 22, fontWeight: 700,
              textShadow: '0 2px 8px rgba(0,0,0,0.7)',
              background: 'rgba(0,0,0,0.35)',
              padding: '6px 20px', borderRadius: 30,
              fontFamily: "'Inter', sans-serif",
            }}>
              {cardName}
            </div>
          )}
        </>
      ) : (
        <div style={{ color: 'rgba(0,0,0,0.15)', fontSize: 18, fontFamily: 'sans-serif' }}>
          No card selected
        </div>
      )}
    </div>
  );
}
