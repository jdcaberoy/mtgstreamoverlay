import React, { useState } from 'react';
import { EVENT_FONTS, PLAYER_COLORS, CHROMA_COLORS } from './store';

const MATCH_STAGES = ['Finals','Semi-Finals','Quarter-Finals','Top 8','Top 16','Group Stage','Playoffs'];
const TOURN_STYLES = ['Single Elim','Double Elim','Round Robin','Swiss','Best of Series'];

export default function GameControlsColumn({ state, setState }) {
  const s = state;

  function updEv(field, val) { setState(p => ({ ...p, [field]: val })); }

  function updPlayer(i, field, val) {
    setState(p => ({ ...p, players: p.players.map((pl,idx) => idx===i ? {...pl,[field]:val} : pl) }));
  }

  function stepLP(i, delta) {
    setState(p => ({ ...p, players: p.players.map((pl,idx) => idx===i ? {...pl, lp: Math.max(0,pl.lp+delta)} : pl) }));
  }

  function toggleElim(i) {
    setState(p => ({ ...p, players: p.players.map((pl,idx) => idx===i ? {...pl, elim:!pl.elim} : pl) }));
  }

  function addCounter(i, name, val) {
    if (!name.trim()) return;
    setState(p => ({ ...p, players: p.players.map((pl,idx) => idx===i ? {...pl, ctrs:[...pl.ctrs,{name:name.trim(),val:parseInt(val)||0}]} : pl) }));
  }

  function updCounter(pi, ci, field, val) {
    setState(p => ({ ...p, players: p.players.map((pl,idx) => {
      if (idx!==pi) return pl;
      return {...pl, ctrs: pl.ctrs.map((c,ci2) => ci2===ci ? {...c,[field]:field==='val'?(parseInt(val)||0):val} : c)};
    })}));
  }

  function delCounter(pi, ci) {
    setState(p => ({ ...p, players: p.players.map((pl,idx) => idx===pi ? {...pl,ctrs:pl.ctrs.filter((_,i)=>i!==ci)} : pl) }));
  }

  const PNAMES = ['P1','P2','P3','P4'];

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100%', overflowY:'auto' }}>
      <div style={secTitle}>Game Overlay Controls</div>

      <button style={linkBtn} onClick={() => window.open('/#/overlay/game', '_blank')}>
        🎮 Open Game Overlay
      </button>

      {/* ── THREE-COLUMN LAYOUT ── */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'0 16px', flex:1 }}>

        {/* ── LEFT COLUMN ── */}
        <div>
          <Section title="Layout">
            <div style={{ display:'flex', flexDirection:'column', gap:5 }}>
              {['bottom','corners','middle'].map(l => (
                <PillBtn key={l} active={s.gameLayout===l} onClick={() => updEv('gameLayout',l)} fullWidth>
                  {l==='bottom' ? '⬇ Bottom' : l==='corners' ? '⛶ Corners' : '▦ Middle'}
                </PillBtn>
              ))}
            </div>
          </Section>

          <Section title="Game BG (Chroma Key)">
            <div style={{ display:'flex', flexWrap:'wrap', gap:4 }}>
              {CHROMA_COLORS.map(c => (
                <button key={c.value} title={c.label} onClick={() => updEv('gameChromaColor',c.value)} style={{
                  display:'flex', alignItems:'center', gap:4,
                  padding:'3px 8px', borderRadius:5, cursor:'pointer', fontSize:10, fontWeight:600,
                  border: s.gameChromaColor===c.value ? '2px solid #111' : '1px solid #ddd',
                  background: s.gameChromaColor===c.value ? '#f0f0f0' : '#fff', color:'#333',
                }}>
                  <span style={{ width:10, height:10, borderRadius:'50%', background:c.value, border:'1px solid #ccc', display:'inline-block', flexShrink:0 }} />
                  {c.label}
                </button>
              ))}
              <div style={{ display:'flex', alignItems:'center', gap:4, marginTop:2 }}>
                <label style={{ fontSize:10, color:'#aaa' }}>Custom:</label>
                <input type="color" value={s.gameChromaColor||'#00ff00'} onChange={e => updEv('gameChromaColor',e.target.value)}
                  style={{ width:24, height:24, border:'1px solid #ddd', borderRadius:4, cursor:'pointer', padding:1 }} />
              </div>
            </div>
          </Section>

          <Section title="Event Name Font">
            <div style={{ display:'flex', flexDirection:'column', gap:5 }}>
              {EVENT_FONTS.map(f => (
                <button key={f.value} onClick={() => updEv('evFont',f.value)} style={{
                  padding:'5px 10px', border: s.evFont===f.value ? '2px solid #111' : '1px solid #ddd',
                  borderRadius:6, background: s.evFont===f.value ? '#f5f5f5' : '#fff',
                  fontFamily:f.value, fontSize:14, cursor:'pointer', letterSpacing:2, lineHeight:1, textAlign:'left',
                }}>{f.label}</button>
              ))}
            </div>
          </Section>

          <Section title="Event Info">
            <Field label="Event Name">
              <input style={inp} value={s.evName} onChange={e => updEv('evName',e.target.value)} />
            </Field>
            <Field label="Match Stage">
              <select style={inp} value={s.evStage} onChange={e => updEv('evStage',e.target.value)}>
                {MATCH_STAGES.map(x => <option key={x}>{x}</option>)}
              </select>
            </Field>
            <Field label="Tournament Style">
              <select style={inp} value={s.evStyle} onChange={e => updEv('evStyle',e.target.value)}>
                {TOURN_STYLES.map(x => <option key={x}>{x}</option>)}
              </select>
            </Field>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:6 }}>
              <Field label="Cur Round">
                <input style={inp} type="number" min={1} max={99} value={s.evCurRound} onChange={e => updEv('evCurRound',parseInt(e.target.value)||1)} />
              </Field>
              <Field label="Total">
                <input style={inp} type="number" min={1} max={99} value={s.evTotRounds} onChange={e => updEv('evTotRounds',parseInt(e.target.value)||1)} />
              </Field>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:6 }}>
              <Field label="Turn">
                <input style={inp} type="number" min={1} max={999} value={s.evTurn} onChange={e => updEv('evTurn',parseInt(e.target.value)||1)} />
              </Field>
              <Field label="Max LP">
                <input style={inp} type="number" min={1} max={999999} value={s.maxLP} onChange={e => updEv('maxLP',parseInt(e.target.value)||1)} />
              </Field>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:5, marginTop:4 }}>
              <Toggle label="Show Round" checked={s.showRound} onChange={v => updEv('showRound',v)} />
              <Toggle label="Show Style" checked={s.showStyle} onChange={v => updEv('showStyle',v)} />
            </div>
          </Section>
        </div>

        {/* ── MIDDLE COLUMN — P1 + P3 ── */}
        <div>
          <Section title="Players">
            <div style={{ display:'flex', gap:5, marginBottom:10 }}>
              {[2,3,4].map(n => (
                <PillBtn key={n} active={s.playerCount===n} onClick={() => updEv('playerCount',n)}>{n}</PillBtn>
              ))}
            </div>

            {/* P1 — always shown */}
            <PlayerBlock key={0}
              p={s.players[0]} i={0} label={PNAMES[0]} maxLP={s.maxLP}
              onUpdPlayer={updPlayer} onStepLP={stepLP} onToggleElim={toggleElim}
              onAddCounter={addCounter} onUpdCounter={updCounter} onDelCounter={delCounter}
            />

            {/* P2 — shown for 2 players */}
            {s.playerCount === 2 && (
              <PlayerBlock key={1}
                p={s.players[1]} i={1} label={PNAMES[1]} maxLP={s.maxLP}
                onUpdPlayer={updPlayer} onStepLP={stepLP} onToggleElim={toggleElim}
                onAddCounter={addCounter} onUpdCounter={updCounter} onDelCounter={delCounter}
              />
            )}

            {/* P3 — shown for 3-4 players */}
            {s.playerCount >= 3 && (
              <PlayerBlock key={2}
                p={s.players[2]} i={2} label={PNAMES[2]} maxLP={s.maxLP}
                onUpdPlayer={updPlayer} onStepLP={stepLP} onToggleElim={toggleElim}
                onAddCounter={addCounter} onUpdCounter={updCounter} onDelCounter={delCounter}
              />
            )}
          </Section>
        </div>

        {/* ── RIGHT COLUMN — P2 + P4 ── */}
        <div>
          {/* Spacer to align with player count pills in middle col */}
          <div style={{ height: s.playerCount >= 2 ? 0 : 0 }} />
          <Section title={<span style={{ opacity:0, userSelect:'none' }}>Players</span>}>
            {/* Empty title row keeps vertical rhythm aligned with middle col */}
            <div style={{ height: 38, marginBottom: 0 }} />

            {/* P2 — shown for 3-4 players */}
            {s.playerCount >= 3 && (
              <PlayerBlock key={1}
                p={s.players[1]} i={1} label={PNAMES[1]} maxLP={s.maxLP}
                onUpdPlayer={updPlayer} onStepLP={stepLP} onToggleElim={toggleElim}
                onAddCounter={addCounter} onUpdCounter={updCounter} onDelCounter={delCounter}
              />
            )}

            {/* P4 — shown for 4 players */}
            {s.playerCount >= 4 && (
              <PlayerBlock key={3}
                p={s.players[3]} i={3} label={PNAMES[3]} maxLP={s.maxLP}
                onUpdPlayer={updPlayer} onStepLP={stepLP} onToggleElim={toggleElim}
                onAddCounter={addCounter} onUpdCounter={updCounter} onDelCounter={delCounter}
              />
            )}
          </Section>
        </div>

      </div>{/* end 3-col grid */}
    </div>
  );
}

// ── Player block ──────────────────────────────────────────────────
function PlayerBlock({ p, i, label, maxLP, onUpdPlayer, onStepLP, onToggleElim, onAddCounter, onUpdCounter, onDelCounter }) {
  return (
    <div style={{ border:'1px solid #ebebeb', borderRadius:8, padding:10, marginBottom:8 }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:8 }}>
        <div style={{ display:'flex', alignItems:'center', gap:6 }}>
          <div style={{ width:9, height:9, borderRadius:'50%', background:p.color }} />
          <span style={{ fontSize:11, fontWeight:700, color:'#222', textTransform:'uppercase', letterSpacing:1 }}>{label}</span>
        </div>
        <button onClick={() => onToggleElim(i)} style={{
          padding:'3px 8px', borderRadius:5, cursor:'pointer', fontSize:10, fontWeight:700,
          border: p.elim ? '1px solid #ef5350' : '1px solid #ddd',
          background: p.elim ? '#fee2e2' : '#f9f9f9',
          color: p.elim ? '#c0392b' : '#666',
        }}>{p.elim ? '✕ Out' : '✓ In'}</button>
      </div>

      <Field label="Name">
        <input style={inp} value={p.name} onChange={e => onUpdPlayer(i,'name',e.target.value)} />
      </Field>
      <Field label="Strategy">
        <input style={inp} value={p.strat} onChange={e => onUpdPlayer(i,'strat',e.target.value)} />
      </Field>

      {/* Wins */}
      <Field label="Wins">
        <div style={{ display:'flex', alignItems:'center', gap:5 }}>
          <Toggle label="Show" checked={!!p.showWins} onChange={v => onUpdPlayer(i,'showWins',v)} />
          <div style={{ display:'flex', alignItems:'center', gap:3, marginLeft:'auto' }}>
            <SmBtn minus onClick={() => onUpdPlayer(i,'wins',Math.max(0,(p.wins||0)-1))}>−</SmBtn>
            <input style={{ ...inp, width:40, textAlign:'center', fontWeight:700, padding:'4px 4px' }}
              type="number" min={0} value={p.wins||0}
              onChange={e => onUpdPlayer(i,'wins',Math.max(0,parseInt(e.target.value)||0))} />
            <SmBtn onClick={() => onUpdPlayer(i,'wins',(p.wins||0)+1)}>+</SmBtn>
          </div>
        </div>
      </Field>

      {/* Color */}
      <Field label="Color">
        <div style={{ display:'flex', flexWrap:'wrap', gap:4 }}>
          {PLAYER_COLORS.map(c => (
            <button key={c.value} title={c.label} onClick={() => onUpdPlayer(i,'color',c.value)} style={{
              width:20, height:20, borderRadius:'50%', background:c.value,
              border: p.color===c.value ? '3px solid #111' : '2px solid transparent', cursor:'pointer', outline:'none',
            }} />
          ))}
          <input type="color" value={p.color||'#4fc3f7'} onChange={e => onUpdPlayer(i,'color',e.target.value)}
            style={{ width:20, height:20, border:'1px solid #ddd', borderRadius:'50%', cursor:'pointer', padding:1 }} />
        </div>
      </Field>

      {/* Mana Colors */}
      <ManaColorPicker
        selected={p.manaColors || []}
        onChange={val => onUpdPlayer(i, 'manaColors', val)}
      />

      {/* LP */}
      <Field label={`LP (max ${maxLP})`}>
        <div style={{ display:'flex', alignItems:'center', gap:3 }}>
          <SmBtn minus onClick={() => onStepLP(i,-5)}>−5</SmBtn>
          <SmBtn minus onClick={() => onStepLP(i,-1)}>−</SmBtn>
          <input style={{ ...inp, flex:1, minWidth:52, textAlign:'center', fontWeight:700, padding:'4px 2px' }}
            type="number" min={0} value={p.lp}
            onChange={e => onUpdPlayer(i,'lp',Math.max(0,parseInt(e.target.value)||0))} />
          <SmBtn onClick={() => onStepLP(i,1)}>+</SmBtn>
          <SmBtn onClick={() => onStepLP(i,5)}>+5</SmBtn>
        </div>
      </Field>

      {/* Counters */}
      <div style={{ fontSize:9, color:'#aaa', fontWeight:700, textTransform:'uppercase', letterSpacing:1, margin:'4px 0 5px' }}>Counters</div>
      {p.ctrs.map((c,ci) => (
        <div key={ci} style={{ display:'flex', gap:4, marginBottom:4, alignItems:'center' }}>
          <input style={{ ...inp, flex:1, fontSize:11, padding:'4px 6px' }}
            value={c.name} onChange={e => onUpdCounter(i,ci,'name',e.target.value)} placeholder="Name" />
          <input style={{ ...inp, width:48, fontSize:11, padding:'4px 5px' }}
            type="number" value={c.val} onChange={e => onUpdCounter(i,ci,'val',e.target.value)} />
          <button onClick={() => onDelCounter(i,ci)} style={{ background:'none', border:'none', cursor:'pointer', color:'#ccc', fontSize:13 }}>✕</button>
        </div>
      ))}
      <AddCounter onAdd={(name,val) => onAddCounter(i,name,val)} />
    </div>
  );
}


// ── Mana Color Picker ─────────────────────────────────────────────
const MANA_SVGS = {
  W: 'https://svgs.scryfall.io/card-symbols/W.svg',
  U: 'https://svgs.scryfall.io/card-symbols/U.svg',
  B: 'https://svgs.scryfall.io/card-symbols/B.svg',
  R: 'https://svgs.scryfall.io/card-symbols/R.svg',
  G: 'https://svgs.scryfall.io/card-symbols/G.svg',
};
const MANA_NAMES = { W: 'White', U: 'Blue', B: 'Black', R: 'Red', G: 'Green' };
const MANA_ORDER = ['W','U','B','R','G'];

function ManaColorPicker({ selected, onChange }) {
  function toggle(c) {
    const next = selected.includes(c) ? selected.filter(x => x !== c) : [...selected, c];
    onChange(next);
  }
  return (
    <div style={{ marginBottom:7 }}>
      <label style={{ display:'block', fontSize:10, color:'#888', marginBottom:5, fontWeight:600 }}>Mana Colors (shown on overlay)</label>
      <div style={{ display:'flex', gap:5, alignItems:'center' }}>
        {MANA_ORDER.map(c => {
          const active = selected.includes(c);
          return (
            <button key={c} title={MANA_NAMES[c]} onClick={() => toggle(c)} style={{
              width:28, height:28, padding:0, borderRadius:'50%',
              border: active ? '3px solid #111' : '2px solid transparent',
              background: 'transparent', cursor:'pointer', outline:'none',
              boxShadow: active ? '0 0 0 1px rgba(0,0,0,0.2)' : 'none',
              transition:'border 0.15s, box-shadow 0.15s',
              opacity: active ? 1 : 0.4,
            }}>
              <img src={MANA_SVGS[c]} alt={c} style={{ width:22, height:22, display:'block', margin:'auto', pointerEvents:'none' }} />
            </button>
          );
        })}
        {selected.length > 0 && (
          <button onClick={() => onChange([])} style={{ fontSize:10, color:'#aaa', background:'none', border:'none', cursor:'pointer', padding:'0 4px' }}>✕ clear</button>
        )}
      </div>
    </div>
  );
}

function AddCounter({ onAdd }) {
  const [name, setName] = useState('');
  const [val,  setVal]  = useState(0);
  return (
    <div style={{ display:'flex', gap:4, marginTop:3 }}>
      <input style={{ ...inp, flex:1, fontSize:11, padding:'4px 6px' }}
        value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Poison" />
      <input style={{ ...inp, width:44, fontSize:11, padding:'4px 5px' }}
        type="number" value={val} onChange={e => setVal(e.target.value)} />
      <button onClick={() => { onAdd(name,val); setName(''); setVal(0); }}
        style={{ padding:'4px 8px', background:'#111', color:'#fff', border:'none', borderRadius:5, fontSize:10, fontWeight:700, cursor:'pointer' }}>
        +
      </button>
    </div>
  );
}

// ── Utility components ────────────────────────────────────────────
function Section({ title, children }) {
  return (
    <div style={{ marginBottom:16 }}>
      <div style={{ fontSize:10, fontWeight:700, color:'#888', textTransform:'uppercase', letterSpacing:1.5, marginBottom:8, paddingBottom:4, borderBottom:'1px solid #f0f0f0' }}>{title}</div>
      {children}
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div style={{ marginBottom:7 }}>
      <label style={{ display:'block', fontSize:10, color:'#888', marginBottom:3, fontWeight:600 }}>{label}</label>
      {children}
    </div>
  );
}

function Toggle({ label, checked, onChange }) {
  return (
    <label style={{ display:'flex', alignItems:'center', gap:5, cursor:'pointer', fontSize:11, color:'#555', userSelect:'none' }}>
      <input type="checkbox" checked={!!checked} onChange={e => onChange(e.target.checked)}
        style={{ width:13, height:13, cursor:'pointer', accentColor:'#333' }} />
      {label}
    </label>
  );
}

function PillBtn({ children, active, onClick, fullWidth }) {
  return (
    <button onClick={onClick} style={{
      padding:'6px 12px', width: fullWidth ? '100%' : undefined,
      border: active ? '1px solid #111' : '1px solid #ddd',
      borderRadius:6, fontSize:11, fontWeight:700,
      color: active ? '#fff' : '#666',
      background: active ? '#111' : '#fff',
      cursor:'pointer', userSelect:'none', textAlign:'left',
    }}>{children}</button>
  );
}

function SmBtn({ children, onClick, minus }) {
  return (
    <button onClick={onClick} style={{
      minWidth:26, height:28, padding:'0 4px', border:'1px solid #ddd', borderRadius:5, fontSize:11, fontWeight:700,
      background: minus ? '#fdf3f2' : '#f0faf3',
      color: minus ? '#e74c3c' : '#2ecc71',
      cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0,
    }}>{children}</button>
  );
}

const secTitle = { fontSize:11, fontWeight:700, color:'#888', textTransform:'uppercase', letterSpacing:1.5, borderBottom:'1px solid #ebebeb', paddingBottom:8, marginBottom:12 };
const inp      = { width:'100%', padding:'7px 9px', border:'1px solid #ddd', borderRadius:6, fontSize:12, fontFamily:"'Inter',sans-serif", color:'#111', background:'#fafafa', outline:'none' };
const linkBtn  = { padding:'10px 14px', background:'#111', color:'#fff', border:'none', borderRadius:8, fontSize:12, fontWeight:700, cursor:'pointer', letterSpacing:1, textTransform:'uppercase', width:'100%', marginBottom:14 };
