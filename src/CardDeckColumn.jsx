import React, { useState } from 'react';
import { CHROMA_COLORS } from './store';

// ── Deck parser ───────────────────────────────────────────────────
function parseDeckList(text) {
  const lines = text.trim().split('\n');
  const sections = [];
  let cur = { label: null, cards: [] };
  sections.push(cur);
  const HEADERS = /^(commander|mainboard|sideboard|maybeboard|lands|creatures|instants|sorceries|enchantments|artifacts|planeswalkers|companion|other spells?)$/i;
  for (const line of lines) {
    const t = line.trim();
    if (!t) continue;
    if (HEADERS.test(t)) { cur = { label: t, cards: [] }; sections.push(cur); continue; }
    let rest = t.replace(/\^[^^]*\^/g,'').replace(/\[[^\]]*\]/g,'').replace(/\*[^*]+\*/g,'').trim();
    let qty = 1;
    const m = rest.match(/^(\d+)x?\s+(.+)$/i);
    if (m) { qty = parseInt(m[1]); rest = m[2].trim(); }
    rest = rest.replace(/\s*\([A-Za-z0-9]+\)\s*\d*/g,'').trim();
    if (rest) cur.cards.push({ qty, name: rest });
  }
  return sections.filter(s => s.cards.length > 0);
}

// ── Shared sub-components ─────────────────────────────────────────
export function ChromaPicker({ label, value, onChange }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ fontSize: 10, color: '#888', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 5 }}>{label}</div>
      <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', alignItems: 'center' }}>
        {CHROMA_COLORS.map(c => (
          <button key={c.value} title={c.label} onClick={() => onChange(c.value)} style={{
            display: 'flex', alignItems: 'center', gap: 4,
            padding: '3px 8px', borderRadius: 5, cursor: 'pointer', fontSize: 10, fontWeight: 600,
            border: value === c.value ? '2px solid #111' : '1px solid #ddd',
            background: value === c.value ? '#f0f0f0' : '#fff', color: '#333',
          }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: c.value, border: '1px solid #ccc', display: 'inline-block', flexShrink: 0 }} />
            {c.label}
          </button>
        ))}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <label style={{ fontSize: 10, color: '#aaa' }}>Custom:</label>
          <input type="color" value={value} onChange={e => onChange(e.target.value)}
            style={{ width: 24, height: 24, border: '1px solid #ddd', borderRadius: 4, cursor: 'pointer', padding: 1 }} />
        </div>
      </div>
    </div>
  );
}

export function ImportModal({ onClose, onImport }) {
  const [text, setText]     = useState('');
  const [mode, setMode]     = useState('replace');
  const [parsed, setParsed] = useState(null);
  const total = parsed ? parsed.reduce((s,sec) => s + sec.cards.reduce((ss,c) => ss+c.qty, 0), 0) : 0;
  return (
    <div style={{ position:'fixed', inset:0, zIndex:1000, background:'rgba(0,0,0,0.5)', display:'flex', alignItems:'center', justifyContent:'center' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{ background:'#fff', borderRadius:12, width:560, maxWidth:'95vw', boxShadow:'0 8px 40px rgba(0,0,0,0.25)', display:'flex', flexDirection:'column', maxHeight:'85vh', overflow:'hidden' }}>
        <div style={{ padding:'18px 20px 14px', borderBottom:'1px solid #ebebeb', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div>
            <div style={{ fontSize:15, fontWeight:700, color:'#111' }}>Import Deck List</div>
            <div style={{ fontSize:11, color:'#888', marginTop:2 }}>Supports MTGO, Moxfield, Archidekt formats.</div>
          </div>
          <button onClick={onClose} style={{ background:'none', border:'none', cursor:'pointer', fontSize:18, color:'#aaa' }}>✕</button>
        </div>
        <div style={{ padding:'16px 20px', flex:1, overflowY:'auto', display:'flex', flexDirection:'column', gap:14 }}>
          <div>
            <div style={fLabel}>Import mode</div>
            <div style={{ display:'flex', gap:8 }}>
              {[['replace','Replace deck'],['add','Add to existing']].map(([v,l]) => (
                <button key={v} onClick={() => setMode(v)} style={{ flex:1, padding:'8px 0', borderRadius:6, cursor:'pointer', fontSize:12, fontWeight:700, border: mode===v ? '2px solid #1a73e8' : '1px solid #ddd', background: mode===v ? '#e8f0fe' : '#fafafa', color: mode===v ? '#1a73e8' : '#555' }}>{l}</button>
              ))}
            </div>
          </div>
          <div>
            <div style={fLabel}>Deck list</div>
            <textarea style={{ width:'100%', height:200, fontFamily:'monospace', fontSize:12, padding:'10px 12px', border:'1px solid #ddd', borderRadius:8, resize:'vertical', outline:'none', lineHeight:1.6, color:'#111', background:'#fafafa' }}
              placeholder="4 Tarmogoyf\n3 Lightning Bolt" value={text} onChange={e => { setText(e.target.value); setParsed(null); }} />
          </div>
          {text.trim() && !parsed && (
            <button onClick={() => setParsed(parseDeckList(text))} style={{ padding:'9px', background:'#f0f4ff', color:'#1a73e8', border:'1px solid #c5d3f0', borderRadius:7, fontSize:12, fontWeight:700, cursor:'pointer' }}>
              Preview ({text.trim().split('\n').filter(l=>l.trim()).length} lines)
            </button>
          )}
          {parsed && (
            <div style={{ background:'#f8fffe', border:'1px solid #c8e6c9', borderRadius:8, padding:'10px 14px' }}>
              <div style={{ fontSize:12, fontWeight:700, color:'#2e7d32', marginBottom:6 }}>✓ Parsed: {total} cards</div>
              <div style={{ maxHeight:100, overflowY:'auto' }}>
                {parsed.map((sec,si) => (
                  <div key={si}>
                    {sec.label && <div style={{ fontSize:10, color:'#1a73e8', fontWeight:700, textTransform:'uppercase', letterSpacing:1, marginTop:4 }}>{sec.label}</div>}
                    {sec.cards.map((c,ci) => <div key={ci} style={{ fontSize:11, color:'#444', padding:'1px 0' }}><span style={{ color:'#888', fontWeight:700, marginRight:6 }}>{c.qty}×</span>{c.name}</div>)}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <div style={{ padding:'12px 20px', borderTop:'1px solid #ebebeb', display:'flex', gap:8, justifyContent:'flex-end' }}>
          <button onClick={onClose} style={{ padding:'8px 18px', border:'1px solid #ddd', borderRadius:7, background:'#fafafa', fontSize:13, fontWeight:600, color:'#555', cursor:'pointer' }}>Cancel</button>
          <button disabled={!text.trim()} onClick={() => { onImport(parseDeckList(text), mode); onClose(); }}
            style={{ padding:'8px 22px', border:'none', borderRadius:7, background: text.trim() ? '#2e7d32' : '#ccc', color:'#fff', fontSize:13, fontWeight:700, cursor: text.trim() ? 'pointer' : 'default' }}>
            {mode === 'replace' ? '↩ Replace Deck' : '+ Add to Deck'}
          </button>
        </div>
      </div>
    </div>
  );
}

export function AddCardModal({ onClose, onAdd }) {
  const [name, setName] = useState('');
  const [qty,  setQty]  = useState(1);
  const [sec,  setSec]  = useState('');
  return (
    <div style={{ position:'fixed', inset:0, zIndex:1000, background:'rgba(0,0,0,0.5)', display:'flex', alignItems:'center', justifyContent:'center' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{ background:'#fff', borderRadius:12, width:380, maxWidth:'95vw', boxShadow:'0 8px 40px rgba(0,0,0,0.25)', padding:20 }}>
        <div style={{ fontSize:15, fontWeight:700, color:'#111', marginBottom:14 }}>Add Card</div>
        <div style={{ marginBottom:10 }}><div style={fLabel}>Card Name</div><input style={inp} value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Lightning Bolt" autoFocus /></div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:10 }}>
          <div><div style={fLabel}>Quantity</div><input style={inp} type="number" min={1} max={99} value={qty} onChange={e => setQty(parseInt(e.target.value)||1)} /></div>
          <div><div style={fLabel}>Section (optional)</div><input style={inp} value={sec} onChange={e => setSec(e.target.value)} placeholder="e.g. Creatures" /></div>
        </div>
        <div style={{ display:'flex', gap:8, justifyContent:'flex-end' }}>
          <button onClick={onClose} style={{ padding:'8px 16px', border:'1px solid #ddd', borderRadius:7, background:'#fafafa', fontSize:12, fontWeight:600, color:'#555', cursor:'pointer' }}>Cancel</button>
          <button disabled={!name.trim()} onClick={() => { if(name.trim()){ onAdd(name.trim(),qty,sec.trim()); onClose(); } }}
            style={{ padding:'8px 18px', border:'none', borderRadius:7, background: name.trim() ? '#1a73e8' : '#ccc', color:'#fff', fontSize:12, fontWeight:700, cursor: name.trim() ? 'pointer' : 'default' }}>
            Add Card
          </button>
        </div>
      </div>
    </div>
  );
}

export function CardRow({ card, onShow, onDelete, onQtyChange }) {
  const [hover, setHover] = useState(false);
  return (
    <div onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ display:'flex', alignItems:'center', padding:'4px 10px', borderBottom:'1px solid #f0f0f0', gap:6, background: hover ? '#f0f7ff' : 'transparent', transition:'background 0.1s' }}>
      <div style={{ display:'flex', alignItems:'center', gap:2, flexShrink:0 }}>
        <button onClick={() => onQtyChange(card.qty-1)} style={qtyBtn}>−</button>
        <span style={{ width:20, textAlign:'center', fontSize:12, fontWeight:700, color:'#555' }}>{card.qty}</span>
        <button onClick={() => onQtyChange(card.qty+1)} style={qtyBtn}>+</button>
      </div>
      <span onClick={onShow} style={{ flex:1, fontSize:12, color:'#222', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis', cursor:'pointer' }} title={card.name}>{card.name}</span>
      <button onClick={onShow} title="Show" style={{ background:'none', border:'none', cursor:'pointer', color:'#1a73e8', fontSize:12, flexShrink:0, padding:'0 2px' }}>👁</button>
      <button onClick={onDelete} title="Remove" style={{ background:'none', border:'none', cursor:'pointer', color:'#ccc', fontSize:12, flexShrink:0, padding:'0 2px' }}
        onMouseEnter={e => e.currentTarget.style.color='#e74c3c'}
        onMouseLeave={e => e.currentTarget.style.color='#ccc'}>🗑</button>
    </div>
  );
}

// ── Shared deck state helpers ─────────────────────────────────────
export function useDeckState(state, setState, deckKey, imageKey, nameKey, visibleKey, chromaKey) {
  const decks = state[deckKey] || [[], [], [], []];

  async function fetchCard(name) {
    try {
      const r = await fetch(`https://api.scryfall.com/cards/named?fuzzy=${encodeURIComponent(name)}`);
      if (!r.ok) throw new Error('Not found');
      const d = await r.json();
      const img = d.image_uris?.large || d.card_faces?.[0]?.image_uris?.large;
      if (!img) throw new Error('No image');
      setState(p => ({ ...p, [imageKey]: img, [nameKey]: d.name, [visibleKey]: true }));
      return { ok: true };
    } catch (e) {
      return { ok: false, error: 'Could not find: ' + name };
    }
  }

  function clearCard() {
    setState(p => ({ ...p, [imageKey]: null, [nameKey]: '', [visibleKey]: false }));
  }

  function setVisible(v) {
    setState(p => ({ ...p, [visibleKey]: v }));
  }

  function setChroma(v) {
    setState(p => ({ ...p, [chromaKey]: v }));
  }

  function importDeck(activeTab, parsed, mode) {
    setState(p => {
      const d = [...(p[deckKey] || [[], [], [], []])];
      if (mode === 'replace') {
        d[activeTab] = parsed;
      } else {
        const existing = d[activeTab] ? JSON.parse(JSON.stringify(d[activeTab])) : [];
        for (const newSec of parsed) {
          const match = existing.find(s => (s.label||'') === (newSec.label||''));
          if (match) {
            for (const nc of newSec.cards) {
              const ec = match.cards.find(c => c.name.toLowerCase() === nc.name.toLowerCase());
              if (ec) ec.qty += nc.qty; else match.cards.push({...nc});
            }
          } else { existing.push({...newSec, cards:[...newSec.cards]}); }
        }
        d[activeTab] = existing;
      }
      return { ...p, [deckKey]: d };
    });
  }

  function addSingleCard(activeTab, name, qty, sectionLabel) {
    setState(p => {
      const d = [...(p[deckKey] || [[], [], [], []])];
      const existing = d[activeTab] ? JSON.parse(JSON.stringify(d[activeTab])) : [];
      const label = sectionLabel || null;
      let sec = existing.find(s => (s.label||'') === (label||''));
      if (!sec) { sec = { label, cards:[] }; existing.push(sec); }
      const ec = sec.cards.find(c => c.name.toLowerCase() === name.toLowerCase());
      if (ec) ec.qty += qty; else sec.cards.push({ qty, name });
      d[activeTab] = existing;
      return { ...p, [deckKey]: d };
    });
  }

  function deleteCard(activeTab, si, ci) {
    setState(p => {
      const d = [...(p[deckKey] || [[], [], [], []])];
      const sections = JSON.parse(JSON.stringify(d[activeTab] || []));
      sections[si].cards.splice(ci, 1);
      d[activeTab] = sections.filter(s => s.cards.length > 0);
      return { ...p, [deckKey]: d };
    });
  }

  function updateCardQty(activeTab, si, ci, qty) {
    if (qty < 1) { deleteCard(activeTab, si, ci); return; }
    setState(p => {
      const d = [...(p[deckKey] || [[], [], [], []])];
      const sections = JSON.parse(JSON.stringify(d[activeTab] || []));
      sections[si].cards[ci].qty = qty;
      d[activeTab] = sections;
      return { ...p, [deckKey]: d };
    });
  }

  return { decks, fetchCard, clearCard, setVisible, setChroma, importDeck, addSingleCard, deleteCard, updateCardQty };
}

// ── Primary Card/Deck Column ──────────────────────────────────────
export default function CardDeckColumn({ state, setState }) {
  const [searchQ,     setSearchQ]     = useState('');
  const [error,       setError]       = useState('');
  const [loading,     setLoading]     = useState(false);
  const [activeTab,   setActiveTab]   = useState(0);
  const [showImport,  setShowImport]  = useState(false);
  const [showAddCard, setShowAddCard] = useState(false);

  const { decks, fetchCard, clearCard, setVisible, setChroma, importDeck, addSingleCard, deleteCard, updateCardQty } =
    useDeckState(state, setState, 'decks1', 'card1Image', 'card1Name', 'card1Visible', 'card1ChromaColor');

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

        {/* Header: title + open button inline */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', borderBottom:'1px solid #ebebeb', paddingBottom:8, marginBottom:10 }}>
          <div style={{ fontSize:11, fontWeight:700, color:'#888', textTransform:'uppercase', letterSpacing:1.5 }}>
            Primary Card / Deck
          </div>
          <button style={openBtn} onClick={() => window.open('/#/overlay/card/1', '_blank')}>
            🃏 Overlay 1
          </button>
        </div>

        {/* Visibility toggle */}
        <VisibilityBar
          visible={state.card1Visible}
          hasCard={!!state.card1Image}
          onToggle={() => setVisible(!state.card1Visible)}
          onClear={clearCard}
        />

        {/* Chroma compact */}
        <div style={{ marginBottom:8 }}>
          <div style={{ fontSize:9, color:'#aaa', fontWeight:700, textTransform:'uppercase', letterSpacing:1, marginBottom:4 }}>Chroma Background</div>
          <ChromaPicker label="" value={state.card1ChromaColor || '#00ff00'} onChange={setChroma} />
        </div>

        {/* Search */}
        <div style={{ display:'flex', gap:5, marginBottom:4 }}>
          <input style={{ ...inp, flex:1 }} placeholder="Search card…"
            value={searchQ} onChange={e => setSearchQ(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch(searchQ)} />
          <button style={searchBtn} onClick={() => handleSearch(searchQ)} disabled={loading}>{loading ? '…' : 'Show'}</button>
        </div>
        {error && <div style={{ color:'#c62828', fontSize:11, marginBottom:4 }}>{error}</div>}

        {/* Card thumbnail — compact side-by-side */}
        {state.card1Image && (
          <div style={{ display:'flex', gap:8, marginBottom:8, alignItems:'flex-start', background:'#f8f8f8', borderRadius:8, padding:'8px', border:'1px solid #ebebeb' }}>
            <img src={state.card1Image} alt={state.card1Name}
              style={{ width:60, borderRadius:6, display:'block', flexShrink:0, opacity: state.card1Visible ? 1 : 0.4 }} />
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontSize:12, fontWeight:700, color:'#111', marginBottom:4, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>
                {state.card1Name}
              </div>
              <div style={{ fontSize:10, color: state.card1Visible ? '#2e7d32' : '#aaa', fontWeight:600 }}>
                {state.card1Visible ? '● On Overlay' : '○ Hidden'}
              </div>
            </div>
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

// ── Shared sub-components ─────────────────────────────────────────
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

export function DeckTabs({ activeTab, setActiveTab }) {
  return (
    <div style={{ display:'flex', gap:4, marginBottom:0, alignItems:'flex-end' }}>
      {['P1','P2','P3','P4'].map((label, i) => (
        <button key={i} onClick={() => setActiveTab(i)} style={{
          padding:'5px 12px', border: activeTab===i ? '1px solid #1a73e8' : '1px solid #ddd',
          borderBottom:'none', borderRadius:'6px 6px 0 0', fontSize:12, cursor:'pointer',
          color: activeTab===i ? '#1a73e8' : '#555', fontWeight: activeTab===i ? 700 : 400,
          background: activeTab===i ? '#fff' : '#f8f8f8',
        }}>{label}</button>
      ))}
    </div>
  );
}

export function DeckPanel({ sections, totalCards, onShowImport, onShowAddCard, onShow, onDelete, onQtyChange }) {
  return (
    <div style={{ border:'1px solid #ddd', borderRadius:'0 6px 6px 6px', flex:1, overflow:'hidden', display:'flex', flexDirection:'column' }}>
      <div style={{ display:'flex', alignItems:'center', gap:6, padding:'8px 10px', borderBottom:'1px solid #eee', background:'#fafafa', flexWrap:'wrap' }}>
        <span style={{ fontSize:11, color:'#888', fontWeight:600, marginRight:'auto' }}>
          {totalCards > 0 ? `${totalCards} cards` : 'No deck loaded'}
        </span>
        <button onClick={onShowAddCard} style={toolBtn}>+ Card</button>
        <button onClick={onShowImport} style={{ ...toolBtn, background:'#1a73e8', color:'#fff', borderColor:'#1a73e8' }}>↩ Import</button>
      </div>
      <div style={{ flex:1, overflowY:'auto', padding:'4px 0' }}>
        {sections.length === 0 ? (
          <div style={{ padding:20, textAlign:'center', color:'#aaa', fontSize:12, lineHeight:1.8 }}>
            No deck loaded.<br />
            <button onClick={onShowImport} style={{ marginTop:8, padding:'6px 14px', background:'#1a73e8', color:'#fff', border:'none', borderRadius:5, fontSize:12, fontWeight:700, cursor:'pointer' }}>
              Import Deck List
            </button>
          </div>
        ) : (
          sections.map((sec, si) => (
            <div key={si}>
              {sec.label && (
                <div style={{ fontSize:10, fontWeight:700, color:'#1a73e8', textTransform:'uppercase', letterSpacing:1, padding:'6px 12px 3px', borderTop: si>0 ? '1px solid #e8f0fe' : 'none', display:'flex', justifyContent:'space-between' }}>
                  <span>{sec.label}</span>
                  <span style={{ color:'#aaa', fontWeight:400 }}>{sec.cards.reduce((s,c)=>s+c.qty,0)}</span>
                </div>
              )}
              {sec.cards.map((c, ci) => (
                <CardRow key={ci} card={c}
                  onShow={() => onShow(c.name)}
                  onDelete={() => onDelete(si,ci)}
                  onQtyChange={qty => onQtyChange(si,ci,qty)}
                />
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

const fLabel   = { fontSize:11, color:'#777', marginBottom:4, fontWeight:500 };
const secTitle = { fontSize:11, fontWeight:700, color:'#888', textTransform:'uppercase', letterSpacing:1.5, borderBottom:'1px solid #ebebeb', paddingBottom:8, marginBottom:12 };
const openBtn  = { padding:'5px 10px', background:'#1a73e8', color:'#fff', border:'none', borderRadius:6, fontSize:11, fontWeight:700, cursor:'pointer', whiteSpace:'nowrap', flexShrink:0 };
const inp      = { width:'100%', padding:'6px 8px', border:'1px solid #ddd', borderRadius:6, fontSize:12, fontFamily:"'Inter',sans-serif", color:'#111', background:'#fafafa', outline:'none' };

const searchBtn = { padding:'6px 12px', background:'#1a73e8', color:'#fff', border:'none', borderRadius:6, fontSize:12, fontWeight:700, cursor:'pointer', whiteSpace:'nowrap', flexShrink:0 };
const toolBtn  = { padding:'5px 11px', background:'#fff', color:'#444', border:'1px solid #ddd', borderRadius:6, fontSize:11, fontWeight:700, cursor:'pointer' };
const qtyBtn   = { width:18, height:18, background:'none', border:'1px solid #ddd', borderRadius:3, fontSize:11, fontWeight:700, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', padding:0, color:'#555', lineHeight:1 };
