import React, { useState } from 'react';
import { useDeckState, ChromaPicker, ImportModal, AddCardModal, CardRow, DeckTabs, DeckPanel } from './CardDeckColumn';

// Re-export shared components used here and in CardDeckColumn
function VisibilityBar({ visible, hasCard, onToggle, onClear }) {
  return (
    <div style={{ display:'flex', gap:6, marginBottom:8, alignItems:'center' }}>
      <button onClick={onToggle} disabled={!hasCard} style={{
        flex:1, padding:'7px 10px', borderRadius:6, cursor: hasCard ? 'pointer' : 'default',
        border: visible ? '1px solid #2e7d32' : '1px solid #ddd',
        background: visible ? '#e8f5e9' : '#fafafa',
        color: visible ? '#2e7d32' : '#888',
        fontSize:11, fontWeight:700,
        opacity: hasCard ? 1 : 0.5,
      }}>
        {visible ? '👁 Showing on Overlay' : '🙈 Hidden from Overlay'}
      </button>
      {hasCard && (
        <button onClick={onClear} style={{ padding:'7px 10px', border:'1px solid #ddd', borderRadius:6, background:'#fafafa', color:'#888', fontSize:11, fontWeight:700, cursor:'pointer' }}>
          ✕ Clear
        </button>
      )}
    </div>
  );
}

export default function CardPreviewColumn({ state, setState }) {
  const [searchQ,     setSearchQ]     = useState('');
  const [error,       setError]       = useState('');
  const [loading,     setLoading]     = useState(false);
  const [activeTab,   setActiveTab]   = useState(0);
  const [showImport,  setShowImport]  = useState(false);
  const [showAddCard, setShowAddCard] = useState(false);

  const { decks, fetchCard, clearCard, setVisible, setChroma, importDeck, addSingleCard, deleteCard, updateCardQty } =
    useDeckState(state, setState, 'decks2', 'card2Image', 'card2Name', 'card2Visible', 'card2ChromaColor');

  async function handleSearch(name) {
    setLoading(true); setError('');
    const result = await fetchCard(name);
    if (!result.ok) setError(result.error);
    setLoading(false);
  }

  const sections   = decks[activeTab] || [];
  const totalCards = sections.reduce((s,sec) => s + sec.cards.reduce((ss,c) => ss+c.qty, 0), 0);

  return (
    <>
      {showImport  && <ImportModal  onClose={() => setShowImport(false)}  onImport={(p,m) => importDeck(activeTab,p,m)} />}
      {showAddCard && <AddCardModal onClose={() => setShowAddCard(false)} onAdd={(n,q,s) => addSingleCard(activeTab,n,q,s)} />}

      <div style={{ display:'flex', flexDirection:'column', height:'100%', overflow:'hidden' }}>
        <div style={secTitle}>Secondary Card / Deck Controls</div>

        <button style={{ ...linkBtn, marginBottom:8 }} onClick={() => window.open('/#/overlay/card/2', '_blank')}>
          🃏 Open Card Overlay 2
        </button>

        <VisibilityBar
          visible={state.card2Visible}
          hasCard={!!state.card2Image}
          onToggle={() => setVisible(!state.card2Visible)}
          onClear={clearCard}
        />

        <ChromaPicker label="Card 2 Overlay Background" value={state.card2ChromaColor || '#00ff00'} onChange={setChroma} />

        <div style={{ display:'flex', gap:6, marginBottom:6 }}>
          <input style={{ ...inp, flex:1 }} placeholder="Search card name..."
            value={searchQ} onChange={e => setSearchQ(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch(searchQ)} />
          <button style={searchBtn} onClick={() => handleSearch(searchQ)} disabled={loading}>{loading ? '…' : 'Show'}</button>
        </div>
        {error && <div style={{ color:'#c62828', fontSize:12, marginBottom:6 }}>{error}</div>}

        {state.card2Image && (
          <div style={{ position:'relative', marginBottom:10 }}>
            <img src={state.card2Image} alt={state.card2Name}
              style={{ width:'100%', borderRadius:8, display:'block', opacity: state.card2Visible ? 1 : 0.4 }} />
            <div style={{ fontSize:12, fontWeight:700, color:'#333', textAlign:'center', marginTop:4 }}>{state.card2Name}</div>
          </div>
        )}

        <DeckTabs activeTab={activeTab} setActiveTab={setActiveTab} />

        <DeckPanel
          sections={sections} totalCards={totalCards}
          onShowImport={() => setShowImport(true)}
          onShowAddCard={() => setShowAddCard(true)}
          onShow={name => handleSearch(name)}
          onDelete={(si,ci) => deleteCard(activeTab,si,ci)}
          onQtyChange={(si,ci,qty) => updateCardQty(activeTab,si,ci,qty)}
        />
      </div>
    </>
  );
}

const secTitle = { fontSize:11, fontWeight:700, color:'#888', textTransform:'uppercase', letterSpacing:1.5, borderBottom:'1px solid #ebebeb', paddingBottom:8, marginBottom:12 };
const inp      = { width:'100%', padding:'7px 9px', border:'1px solid #ddd', borderRadius:6, fontSize:13, fontFamily:"'Inter',sans-serif", color:'#111', background:'#fafafa', outline:'none' };
const linkBtn  = { padding:'10px 14px', background:'#1a73e8', color:'#fff', border:'none', borderRadius:8, fontSize:12, fontWeight:700, cursor:'pointer', letterSpacing:1, textTransform:'uppercase', width:'100%' };
const searchBtn = { padding:'7px 14px', background:'#1a73e8', color:'#fff', border:'none', borderRadius:6, fontSize:13, fontWeight:700, cursor:'pointer', whiteSpace:'nowrap', flexShrink:0 };
