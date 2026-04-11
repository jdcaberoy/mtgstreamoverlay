import React, { useState } from 'react';
import { useDeckState, ChromaPicker, ImportModal, AddCardModal, CardRow, DeckTabs, DeckPanel } from './CardDeckColumn';

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
        <button onClick={onClear} style={{
          padding:'7px 10px', border:'1px solid #ddd', borderRadius:6,
          background:'#fafafa', color:'#888', fontSize:11, fontWeight:700, cursor:'pointer',
        }}>
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

      <div style={{ display:'flex', flexDirection:'column', height:'100%', overflow:'hidden', gap:0 }}>

        {/* ── Header row: title + open button side by side ── */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', borderBottom:'1px solid #ebebeb', paddingBottom:8, marginBottom:10 }}>
          <div style={{ fontSize:11, fontWeight:700, color:'#888', textTransform:'uppercase', letterSpacing:1.5 }}>
            Secondary Card / Deck
          </div>
          <button style={openBtn} onClick={() => window.open('/#/overlay/card/2', '_blank')}>
            🃏 Overlay 2
          </button>
        </div>

        {/* ── Visibility + Chroma in a compact 2-col grid ── */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr auto', gap:'6px 8px', alignItems:'start', marginBottom:8 }}>
          <VisibilityBar
            visible={state.card2Visible}
            hasCard={!!state.card2Image}
            onToggle={() => setVisible(!state.card2Visible)}
            onClear={clearCard}
          />
        </div>

        {/* Chroma compact */}
        <div style={{ marginBottom:8 }}>
          <div style={{ fontSize:9, color:'#aaa', fontWeight:700, textTransform:'uppercase', letterSpacing:1, marginBottom:4 }}>Chroma Background</div>
          <ChromaPicker label="" value={state.card2ChromaColor || '#00ff00'} onChange={setChroma} />
        </div>

        {/* ── Search row ── */}
        <div style={{ display:'flex', gap:5, marginBottom:4 }}>
          <input style={{ ...inp, flex:1 }} placeholder="Search card…"
            value={searchQ} onChange={e => setSearchQ(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch(searchQ)} />
          <button style={searchBtn} onClick={() => handleSearch(searchQ)} disabled={loading}>
            {loading ? '…' : 'Show'}
          </button>
        </div>
        {error && <div style={{ color:'#c62828', fontSize:11, marginBottom:4 }}>{error}</div>}

        {/* ── Card thumbnail — compact, side-by-side with name+status ── */}
        {state.card2Image && (
          <div style={{ display:'flex', gap:8, marginBottom:8, alignItems:'flex-start', background:'#f8f8f8', borderRadius:8, padding:'8px', border:'1px solid #ebebeb' }}>
            <img src={state.card2Image} alt={state.card2Name}
              style={{ width:60, borderRadius:6, display:'block', flexShrink:0, opacity: state.card2Visible ? 1 : 0.4 }} />
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontSize:12, fontWeight:700, color:'#111', marginBottom:4, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>
                {state.card2Name}
              </div>
              <div style={{ fontSize:10, color: state.card2Visible ? '#2e7d32' : '#aaa', fontWeight:600 }}>
                {state.card2Visible ? '● On Overlay' : '○ Hidden'}
              </div>
            </div>
          </div>
        )}

        {/* ── Deck area ── */}
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

const inp       = { width:'100%', padding:'6px 8px', border:'1px solid #ddd', borderRadius:6, fontSize:12, fontFamily:"'Inter',sans-serif", color:'#111', background:'#fafafa', outline:'none' };
const openBtn   = { padding:'5px 10px', background:'#1a73e8', color:'#fff', border:'none', borderRadius:6, fontSize:11, fontWeight:700, cursor:'pointer', whiteSpace:'nowrap', flexShrink:0 };
const searchBtn = { padding:'6px 12px', background:'#1a73e8', color:'#fff', border:'none', borderRadius:6, fontSize:12, fontWeight:700, cursor:'pointer', whiteSpace:'nowrap', flexShrink:0 };
