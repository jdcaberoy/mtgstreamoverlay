import React, { useState } from 'react';

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

export default function CardDeckColumn({ state, setState }) {
  const [searchQ, setSearchQ]     = useState('');
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState('');
  const [deckText, setDeckText]   = useState('');
  const [showLoad, setShowLoad]   = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  const decks = state.decks || [[],[],[],[]];

  async function fetchCard(name) {
    setLoading(true); setError('');
    try {
      const r = await fetch(`https://api.scryfall.com/cards/named?fuzzy=${encodeURIComponent(name)}`);
      if (!r.ok) throw new Error('Not found');
      const d = await r.json();
      let img = d.image_uris?.large || d.card_faces?.[0]?.image_uris?.large;
      if (!img) throw new Error('No image');
      setState(p => ({ ...p, cardImage: img, cardName: d.name }));
    } catch (e) {
      setError('Could not find: ' + name);
    } finally { setLoading(false); }
  }

  function loadDeck() {
    if (!deckText.trim()) return;
    const parsed = parseDeckList(deckText);
    setState(p => {
      const decks = [...(p.decks || [[],[],[],[]])];
      decks[activeTab] = parsed;
      return { ...p, decks };
    });
    setDeckText(''); setShowLoad(false);
  }

  function clearCard() {
    setState(p => ({ ...p, cardImage: null, cardName: '' }));
  }

  const sections = decks[activeTab] || [];

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100%', overflow:'hidden' }}>
      <div style={secTitle}>Card / Deck Controls</div>

      {/* Open card overlay */}
      <button style={{ ...linkBtn, marginBottom:8 }} onClick={() => window.open('/overlay/card', '_blank')}>
        🃏 Open Card Overlay
      </button>

      {/* Search */}
      <div style={{ display:'flex', gap:6, marginBottom:6 }}>
        <input
          style={{ ...inp, flex:1 }}
          placeholder="Search card name..."
          value={searchQ}
          onChange={e => setSearchQ(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && fetchCard(searchQ)}
        />
        <button style={searchBtn} onClick={() => fetchCard(searchQ)} disabled={loading}>
          {loading ? '...' : 'Show'}
        </button>
      </div>
      {error && <div style={{ color:'#c62828', fontSize:12, marginBottom:6 }}>{error}</div>}

      {/* Current card preview */}
      {state.cardImage && (
        <div style={{ position:'relative', marginBottom:10 }}>
          <img src={state.cardImage} alt={state.cardName}
            style={{ width:'100%', borderRadius:8, display:'block' }} />
          <div style={{ fontSize:12, fontWeight:700, color:'#333', textAlign:'center', marginTop:4 }}>
            {state.cardName}
          </div>
          <button onClick={clearCard}
            style={{ position:'absolute', top:4, right:4, background:'rgba(0,0,0,0.5)', border:'none', color:'#fff', borderRadius:4, padding:'2px 7px', cursor:'pointer', fontSize:11 }}>
            ✕
          </button>
        </div>
      )}

      {/* Deck tabs */}
      <div style={{ display:'flex', gap:4, marginBottom:0, flexWrap:'wrap' }}>
        {['P1','P2','P3','P4'].map((label, i) => (
          <button key={i} onClick={() => { setActiveTab(i); setShowLoad(false); }}
            style={{
              padding:'5px 12px', border: activeTab === i ? '1px solid #1a73e8' : '1px solid #ddd',
              borderBottom: 'none', borderRadius:'6px 6px 0 0', fontSize:12, cursor:'pointer',
              color: activeTab === i ? '#1a73e8' : '#555',
              fontWeight: activeTab === i ? 700 : 400,
              background: activeTab === i ? '#fff' : '#f8f8f8',
            }}>
            {label}
          </button>
        ))}
        <button onClick={() => setShowLoad(p => !p)}
          style={{ padding:'5px 12px', border:'1px solid #ddd', borderBottom:'none', borderRadius:'6px 6px 0 0', fontSize:12, cursor:'pointer', color:'#555', background:'#f8f8f8', marginLeft:'auto' }}>
          + Load
        </button>
      </div>

      <div style={{ border:'1px solid #ddd', borderRadius:'0 6px 6px 6px', flex:1, overflow:'hidden', display:'flex', flexDirection:'column' }}>
        {showLoad && (
          <div style={{ padding:10, borderBottom:'1px solid #eee', background:'#fafafa' }}>
            <textarea
              style={{ width:'100%', height:90, fontFamily:'monospace', fontSize:11, padding:6, border:'1px solid #ddd', borderRadius:5, resize:'vertical' }}
              placeholder={`4 Tarmogoyf\n3 Lightning Bolt\n1 Black Lotus`}
              value={deckText}
              onChange={e => setDeckText(e.target.value)}
            />
            <button style={{ marginTop:4, padding:'6px 14px', background:'#2e7d32', color:'#fff', border:'none', borderRadius:5, fontSize:12, fontWeight:700, cursor:'pointer' }}
              onClick={loadDeck}>Load Deck</button>
          </div>
        )}

        <div style={{ flex:1, overflowY:'auto', padding:'4px 0' }}>
          {sections.length === 0 ? (
            <div style={{ padding:16, textAlign:'center', color:'#aaa', fontSize:12 }}>
              No deck loaded. Use "+ Load" to paste a deck list.
            </div>
          ) : (
            sections.map((sec, si) => (
              <div key={si}>
                {sec.label && (
                  <div style={{ fontSize:10, fontWeight:700, color:'#1a73e8', textTransform:'uppercase', letterSpacing:1, padding:'6px 12px 3px', borderTop: si > 0 ? '1px solid #e8f0fe' : 'none' }}>
                    {sec.label}
                  </div>
                )}
                {sec.cards.map((c, ci) => (
                  <div key={ci}
                    onClick={() => fetchCard(c.name)}
                    style={{ display:'flex', alignItems:'center', padding:'5px 12px', borderBottom:'1px solid #f0f0f0', cursor:'pointer', gap:8, transition:'background 0.1s' }}
                    onMouseEnter={e => e.currentTarget.style.background='#f0f7ff'}
                    onMouseLeave={e => e.currentTarget.style.background=''}
                  >
                    <span style={{ width:22, textAlign:'right', fontSize:12, fontWeight:700, color:'#555', flexShrink:0 }}>{c.qty}</span>
                    <span style={{ flex:1, fontSize:12, color:'#222', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{c.name}</span>
                    <span style={{ fontSize:10, color:'#1a73e8', flexShrink:0 }}>👁</span>
                  </div>
                ))}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

const secTitle = { fontSize:11, fontWeight:700, color:'#888', textTransform:'uppercase', letterSpacing:1.5, borderBottom:'1px solid #ebebeb', paddingBottom:8, marginBottom:12 };
const inp = { padding:'7px 9px', border:'1px solid #ddd', borderRadius:6, fontSize:13, fontFamily:"'Inter',sans-serif", color:'#111', background:'#fafafa', outline:'none' };
const linkBtn = { padding:'10px 14px', background:'#1a73e8', color:'#fff', border:'none', borderRadius:8, fontSize:12, fontWeight:700, cursor:'pointer', letterSpacing:1, textTransform:'uppercase', width:'100%' };
const searchBtn = { padding:'7px 14px', background:'#1a73e8', color:'#fff', border:'none', borderRadius:6, fontSize:13, fontWeight:700, cursor:'pointer', whiteSpace:'nowrap', flexShrink:0 };
