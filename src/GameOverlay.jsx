import { useOverlayState } from './store';
import EventBanner from './EventBanner';
import PlayersLayer from './PlayersLayer';

export default function GameOverlay() {
  const state = useOverlayState();

  return (
    <div style={{
      width: 1920, height: 1080,
      background: '#00ff00',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: "'Inter', sans-serif",
    }}>
      <link
        href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Anton&family=Black+Han+Sans&family=Oswald:wght@700&family=Teko:wght@700&family=Inter:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />
      <EventBanner state={state} />
      <PlayersLayer state={state} />
    </div>
  );
}
