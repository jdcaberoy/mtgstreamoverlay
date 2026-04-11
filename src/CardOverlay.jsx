import { useParams } from 'react-router-dom';
import { useOverlayState } from './store';

export default function CardOverlay() {
  const { slot } = useParams();           // '1' or '2'
  const state    = useOverlayState();

  const isSlot2  = slot === '2';
  const image    = isSlot2 ? state.card2Image    : state.card1Image;
  const name     = isSlot2 ? state.card2Name     : state.card1Name;
  const visible  = isSlot2 ? state.card2Visible  : state.card1Visible;
  const bg       = isSlot2 ? (state.card2ChromaColor || '#00ff00') : (state.card1ChromaColor || '#00ff00');

  return (
    <div style={{
      width: '100vw', height: '100vh',
      background: bg,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      gap: 12,
    }}>
      {image && visible ? (
        <>
          <img
            src={image}
            alt={name}
            style={{
              maxHeight: '85vh', maxWidth: '90vw',
              borderRadius: 14,
              boxShadow: '0 8px 40px rgba(0,0,0,0.5)',
            }}
          />
          {name && (
            <div style={{
              color: 'white', fontSize: 22, fontWeight: 700,
              textShadow: '0 2px 8px rgba(0,0,0,0.7)',
              background: 'rgba(0,0,0,0.35)',
              padding: '6px 20px', borderRadius: 30,
              fontFamily: "'Inter', sans-serif",
            }}>
              {name}
            </div>
          )}
        </>
      ) : (
        <div style={{ color: 'rgba(0,0,0,0.15)', fontSize: 18, fontFamily: 'sans-serif' }}>
          {/* Empty chroma — card hidden or not selected */}
        </div>
      )}
    </div>
  );
}
