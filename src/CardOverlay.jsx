import { useParams } from 'react-router-dom';
import { useOverlayState } from './store';
import { useEffect, useRef, useState } from 'react';

// CSS injected once for keyframe animations
const STYLES = `
  @keyframes cardIn {
    0%   { opacity: 0; transform: scale(0.82) translateY(40px); }
    60%  { opacity: 1; transform: scale(1.04) translateY(-6px); }
    80%  { transform: scale(0.98) translateY(2px); }
    100% { opacity: 1; transform: scale(1) translateY(0); }
  }
  @keyframes cardOut {
    0%   { opacity: 1; transform: scale(1) translateY(0); }
    30%  { opacity: 1; transform: scale(1.03) translateY(-8px); }
    100% { opacity: 0; transform: scale(0.8) translateY(50px); }
  }
  @keyframes nameIn {
    0%   { opacity: 0; transform: translateY(16px); }
    100% { opacity: 1; transform: translateY(0); }
  }
  .card-enter {
    animation: cardIn 0.55s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
  }
  .card-exit {
    animation: cardOut 0.4s cubic-bezier(0.4, 0, 0.6, 1) forwards;
  }
  .name-enter {
    animation: nameIn 0.35s ease 0.35s both;
  }
`;

export default function CardOverlay() {
  const { slot } = useParams();
  const state    = useOverlayState();

  const isSlot2  = slot === '2';
  const image    = isSlot2 ? state.card2Image    : state.card1Image;
  const name     = isSlot2 ? state.card2Name     : state.card1Name;
  const visible  = isSlot2 ? state.card2Visible  : state.card1Visible;
  const bg       = isSlot2 ? (state.card2ChromaColor || '#00ff00') : (state.card1ChromaColor || '#00ff00');

  const shouldShow = !!(image && visible);

  // Track animation state
  const [displayState, setDisplayState] = useState(() => shouldShow ? 'shown' : 'hidden');
  // displayState: 'hidden' | 'entering' | 'shown' | 'exiting'

  const prevShouldShow = useRef(shouldShow);
  const exitTimer = useRef(null);
  const [displayImage, setDisplayImage] = useState(image);
  const [displayName,  setDisplayName]  = useState(name);

  useEffect(() => {
    const was = prevShouldShow.current;
    prevShouldShow.current = shouldShow;

    if (shouldShow && !was) {
      // Card appearing — update content then enter
      clearTimeout(exitTimer.current);
      setDisplayImage(image);
      setDisplayName(name);
      setDisplayState('entering');
      const t = setTimeout(() => setDisplayState('shown'), 600);
      return () => clearTimeout(t);
    }

    if (!shouldShow && was) {
      // Card disappearing — exit then hide
      setDisplayState('exiting');
      exitTimer.current = setTimeout(() => setDisplayState('hidden'), 450);
      return () => clearTimeout(exitTimer.current);
    }

    // Visible and card changed (new card while already showing)
    if (shouldShow && was && (image !== displayImage || name !== displayName)) {
      setDisplayState('exiting');
      exitTimer.current = setTimeout(() => {
        setDisplayImage(image);
        setDisplayName(name);
        setDisplayState('entering');
        const t2 = setTimeout(() => setDisplayState('shown'), 600);
        return () => clearTimeout(t2);
      }, 420);
    }
  }, [shouldShow, image, name]);

  const isVisible = displayState !== 'hidden';
  const animClass = displayState === 'entering' ? 'card-enter'
                  : displayState === 'exiting'  ? 'card-exit'
                  : '';

  return (
    <div style={{
      width: '100vw', height: '100vh',
      background: bg,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      gap: 16, overflow: 'hidden',
    }}>
      <style>{STYLES}</style>

      {isVisible && (
        <>
          <img
            key={displayImage}
            src={displayImage}
            alt={displayName}
            className={animClass}
            style={{
              maxHeight: '82vh', maxWidth: '88vw',
              borderRadius: 18,
              boxShadow: '0 16px 60px rgba(0,0,0,0.6), 0 4px 20px rgba(0,0,0,0.4)',
              display: 'block',
              willChange: 'transform, opacity',
            }}
          />
          {displayName && (
            <div
              className={displayState === 'entering' ? 'name-enter' : ''}
              style={{
                color: 'white', fontSize: 24, fontWeight: 700,
                textShadow: '0 2px 12px rgba(0,0,0,0.8)',
                background: 'rgba(0,0,0,0.4)',
                padding: '7px 24px', borderRadius: 32,
                fontFamily: "'Inter', sans-serif",
                letterSpacing: 1,
                backdropFilter: 'blur(4px)',
              }}
            >
              {displayName}
            </div>
          )}
        </>
      )}
    </div>
  );
}
