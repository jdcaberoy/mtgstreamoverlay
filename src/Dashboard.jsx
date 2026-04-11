import { useStore } from './store';
import SummaryColumn from './SummaryColumn';
import GameControlsColumn from './GameControlsColumn';
import CardDeckColumn from './CardDeckColumn';
import CardPreviewColumn from './CardPreviewColumn';

const COL = {
  width: '100%',
  height: '100vh',
  overflowY: 'auto',
  padding: '16px 14px',
  borderRight: '1px solid #ebebeb',
};

export default function Dashboard() {
  const [state, setState] = useStore();

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Anton&family=Black+Han+Sans&family=Oswald:wght@700&family=Teko:wght@700&family=Inter:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />
      <div style={{
        display: 'grid',
        gridTemplateColumns: '260px 340px 300px 280px',
        height: '100vh',
        overflow: 'hidden',
        fontFamily: "'Inter', sans-serif",
        fontSize: 13,
        background: '#fff',
        color: '#111',
      }}>
        {/* Col 1 — Summary */}
        <div style={{ ...COL, background: '#fafafa' }}>
          <SummaryColumn state={state} />
        </div>

        {/* Col 2 — Game Controls */}
        <div style={{ ...COL }}>
          <GameControlsColumn state={state} setState={setState} />
        </div>

        {/* Col 3 — Card/Deck */}
        <div style={{ ...COL, borderRight:'1px solid #ebebeb' }}>
          <CardDeckColumn state={state} setState={setState} />
        </div>

        {/* Col 4 — Card Preview */}
        <div style={{ ...COL, borderRight:'none' }}>
          <CardPreviewColumn state={state} />
        </div>
      </div>
    </>
  );
}
