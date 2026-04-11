import { EVENT_FONTS, PLAYER_COLORS } from './store';

const MATCH_STAGES = ['Finals','Semi-Finals','Quarter-Finals','Top 8','Top 16','Group Stage','Playoffs'];
const TOURN_STYLES = ['Single Elim','Double Elim','Round Robin','Swiss','Best of Series'];

export default function GameControlsColumn({ state, setState }) {
  const s = state;

  function updEv(field, val) { setState(p => ({ ...p, [field]: val })); }

  function updPlayer(i, field, val) {
    setState(p => {
      const players = p.players.map((pl, idx) => idx === i ? { ...pl, [field]: val } : pl);
      return { ...p, players };
    });
  }

  function stepLP(i, delta) {
    setState(p => {
      const players = p.players.map((pl, idx) =>
        idx === i ? { ...pl, lp: Math.max(0, pl.lp + delta) } : pl
      );
      return { ...p, players };
    });
  }

  function toggleElim(i) {
    setState(p => {
      const players = p.players.map((pl, idx) => idx === i ? { ...pl, elim: !pl.elim } : pl);
      return { ...p, players };
    });
  }

  function addCounter(i, name, val) {
    if (!name.trim()) return;
    setState(p => {
      const players = p.players.map((pl, idx) =>
        idx === i ? { ...pl, ctrs: [...pl.ctrs, { name: name.trim(), val: parseInt(val) || 0 }] } : pl
      );
      return { ...p, players };
    });
  }

  function updCounter(pi, ci, field, val) {
    setState(p => {
      const players = p.players.map((pl, idx) => {
        if (idx !== pi) return pl;
        const ctrs = pl.ctrs.map((c, ci2) =>
          ci2 === ci ? { ...c, [field]: field === 'val' ? (parseInt(val) || 0) : val } : c
        );
        return { ...pl, ctrs };
      });
      return { ...p, players };
    });
  }

  function delCounter(pi, ci) {
    setState(p => {
      const players = p.players.map((pl, idx) => {
        if (idx !== pi) return pl;
        return { ...pl, ctrs: pl.ctrs.filter((_, i) => i !== ci) };
      });
      return { ...p, players };
    });
  }

  const PNAMES = ['P1','P2','P3','P4'];

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:14, height:'100%', overflowY:'auto' }}>
      <div style={secTitle}>Game Overlay Controls</div>

      {/* Overlay link */}
      <button style={linkBtn} onClick={() => window.open('/overlay/game', '_blank')}>
        🎮 Open Game Overlay
      </button>

      {/* Layout */}
      <Section title="Layout">
        <div style={{ display:'flex', gap:6 }}>
          {['bottom','corners','middle'].map(l => (
            <PillBtn key={l} active={s.gameLayout === l} onClick={() => updEv('gameLayout', l)}>
              {l === 'bottom' ? '⬇ Bottom' : l === 'corners' ? '⛶ Corners' : '▦ Middle'}
            </PillBtn>
          ))}
        </div>
      </Section>

      {/* Font */}
      <Section title="Event Name Font">
        <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
          {EVENT_FONTS.map(f => (
            <button key={f.value} onClick={() => updEv('evFont', f.value)} style={{
              padding: '6px 12px',
              border: s.evFont === f.value ? '2px solid #111' : '1px solid #ddd',
              borderRadius: 6, background: s.evFont === f.value ? '#f5f5f5' : '#fff',
              fontFamily: f.value, fontSize: 15, cursor: 'pointer',
              letterSpacing: 2, lineHeight: 1,
            }}>{f.label}</button>
          ))}
        </div>
      </Section>

      {/* Event info */}
      <Section title="Event Info">
        <Field label="Event Name">
          <input style={inp} value={s.evName} onChange={e => updEv('evName', e.target.value)} />
        </Field>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
          <Field label="Match Stage">
            <select style={inp} value={s.evStage} onChange={e => updEv('evStage', e.target.value)}>
              {MATCH_STAGES.map(x => <option key={x}>{x}</option>)}
            </select>
          </Field>
          <Field label="Tournament Style">
            <select style={inp} value={s.evStyle} onChange={e => updEv('evStyle', e.target.value)}>
              {TOURN_STYLES.map(x => <option key={x}>{x}</option>)}
            </select>
          </Field>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:8 }}>
          <Field label="Cur Round">
            <input style={inp} type="number" min={1} max={99}
              value={s.evCurRound} onChange={e => updEv('evCurRound', parseInt(e.target.value)||1)} />
          </Field>
          <Field label="Tot Rounds">
            <input style={inp} type="number" min={1} max={99}
              value={s.evTotRounds} onChange={e => updEv('evTotRounds', parseInt(e.target.value)||1)} />
          </Field>
          <Field label="Turn">
            <input style={inp} type="number" min={1} max={999}
              value={s.evTurn} onChange={e => updEv('evTurn', parseInt(e.target.value)||1)} />
          </Field>
        </div>
        <Field label="Max Life Points">
          <input style={inp} type="number" min={1} max={999999}
            value={s.maxLP} onChange={e => updEv('maxLP', parseInt(e.target.value)||1)} />
        </Field>
        {/* Show/hide toggles */}
        <div style={{ display:'flex', gap:10, marginTop:4 }}>
          <Toggle label="Show Round" checked={s.showRound} onChange={v => updEv('showRound', v)} />
          <Toggle label="Show Style" checked={s.showStyle} onChange={v => updEv('showStyle', v)} />
        </div>
      </Section>

      {/* Player count */}
      <Section title="Players">
        <div style={{ display:'flex', gap:6, marginBottom:10 }}>
          {[2,3,4].map(n => (
            <PillBtn key={n} active={s.playerCount === n} onClick={() => updEv('playerCount', n)}>
              {n}
            </PillBtn>
          ))}
        </div>

        {s.players.slice(0, s.playerCount).map((p, i) => (
          <div key={i} style={{
            border:'1px solid #ebebeb', borderRadius:8, padding:12, marginBottom:8,
          }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:10 }}>
              <div style={{ display:'flex', alignItems:'center', gap:7 }}>
                <div style={{ width:9, height:9, borderRadius:'50%', background:p.color }} />
                <span style={{ fontSize:11, fontWeight:700, color:'#222', textTransform:'uppercase', letterSpacing:1 }}>
                  {PNAMES[i]}
                </span>
              </div>
              <button
                onClick={() => toggleElim(i)}
                style={{
                  padding:'4px 10px', borderRadius:5, cursor:'pointer',
                  border: p.elim ? '1px solid #ef5350' : '1px solid #ddd',
                  background: p.elim ? '#fee2e2' : '#f9f9f9',
                  color: p.elim ? '#c0392b' : '#666',
                  fontSize:11, fontWeight:700,
                }}
              >{p.elim ? '✕ Eliminated' : '+ In Game'}</button>
            </div>

            <Field label="Name">
              <input style={inp} value={p.name} onChange={e => updPlayer(i,'name',e.target.value)} />
            </Field>
            <Field label="Strategy / Deck">
              <input style={inp} value={p.strat} onChange={e => updPlayer(i,'strat',e.target.value)} />
            </Field>

            {/* Color picker */}
            <Field label="Color">
              <div style={{ display:'flex', flexWrap:'wrap', gap:5 }}>
                {PLAYER_COLORS.map(c => (
                  <button key={c.value} title={c.label}
                    onClick={() => updPlayer(i,'color',c.value)}
                    style={{
                      width:22, height:22, borderRadius:'50%',
                      background: c.value, border: p.color === c.value ? '3px solid #111' : '2px solid transparent',
                      cursor:'pointer', outline:'none',
                    }}
                  />
                ))}
              </div>
            </Field>

            {/* LP controls */}
            <Field label={`Life Points (max ref: ${s.maxLP})`}>
              <div style={{ display:'flex', alignItems:'center', gap:5 }}>
                <LPBtn onClick={() => stepLP(i,-5)} minus>−5</LPBtn>
                <LPBtn onClick={() => stepLP(i,-1)} minus>−</LPBtn>
                <input
                  style={{ ...inp, width:70, textAlign:'center', fontWeight:700 }}
                  type="number" min={0} value={p.lp}
                  onChange={e => updPlayer(i,'lp', Math.max(0, parseInt(e.target.value)||0))}
                />
                <LPBtn onClick={() => stepLP(i,1)}>+</LPBtn>
                <LPBtn onClick={() => stepLP(i,5)}>+5</LPBtn>
              </div>
            </Field>

            {/* Counters */}
            <div style={{ fontSize:10, color:'#999', fontWeight:700, textTransform:'uppercase', letterSpacing:1, margin:'4px 0 6px' }}>
              Custom Counters
            </div>
            {p.ctrs.map((c, ci) => (
              <div key={ci} style={{ display:'flex', gap:5, marginBottom:5, alignItems:'center' }}>
                <input style={{ ...inp, flex:1, fontSize:12, padding:'5px 8px' }}
                  value={c.name} onChange={e => updCounter(i,ci,'name',e.target.value)} placeholder="Name" />
                <input style={{ ...inp, width:60, fontSize:12, padding:'5px 8px' }}
                  type="number" value={c.val} onChange={e => updCounter(i,ci,'val',e.target.value)} />
                <button onClick={() => delCounter(i,ci)}
                  style={{ background:'none', border:'none', cursor:'pointer', color:'#ccc', fontSize:14 }}>✕</button>
              </div>
            ))}
            <AddCounter onAdd={(name, val) => addCounter(i, name, val)} />
          </div>
        ))}
      </Section>
    </div>
  );
}

function AddCounter({ onAdd }) {
  const [name, setName] = React.useState('');
  const [val,  setVal]  = React.useState(0);
  return (
    <div style={{ display:'flex', gap:5, marginTop:4 }}>
      <input style={{ ...inp, flex:1, fontSize:12, padding:'5px 8px' }}
        value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Poison" />
      <input style={{ ...inp, width:56, fontSize:12, padding:'5px 8px' }}
        type="number" value={val} onChange={e => setVal(e.target.value)} />
      <button onClick={() => { onAdd(name, val); setName(''); setVal(0); }}
        style={{ padding:'6px 10px', background:'#111', color:'#fff', border:'none', borderRadius:5, fontSize:11, fontWeight:700, cursor:'pointer' }}>
        + Add
      </button>
    </div>
  );
}

import React from 'react';

function Section({ title, children }) {
  return (
    <div>
      <div style={{ fontSize:10, fontWeight:700, color:'#888', textTransform:'uppercase', letterSpacing:1.5, marginBottom:8 }}>{title}</div>
      {children}
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div style={{ marginBottom:8 }}>
      <label style={{ display:'block', fontSize:11, color:'#777', marginBottom:3, fontWeight:500 }}>{label}</label>
      {children}
    </div>
  );
}

function Toggle({ label, checked, onChange }) {
  return (
    <label style={{ display:'flex', alignItems:'center', gap:6, cursor:'pointer', fontSize:12, color:'#555', userSelect:'none' }}>
      <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)}
        style={{ width:14, height:14, cursor:'pointer', accentColor:'#333' }} />
      {label}
    </label>
  );
}

function PillBtn({ children, active, onClick }) {
  return (
    <button onClick={onClick} style={{
      padding:'6px 13px', border: active ? '1px solid #111' : '1px solid #ddd',
      borderRadius:6, fontSize:11, fontWeight:700,
      color: active ? '#fff' : '#666',
      background: active ? '#111' : '#fff',
      cursor:'pointer', userSelect:'none',
    }}>{children}</button>
  );
}

function LPBtn({ children, onClick, minus }) {
  return (
    <button onClick={onClick} style={{
      width:30, height:30, border: '1px solid #ddd',
      borderRadius:5, fontSize:12, fontWeight:700,
      background: minus ? '#fdf3f2' : '#f0faf3',
      color: minus ? '#e74c3c' : '#2ecc71',
      cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center',
    }}>{children}</button>
  );
}

const secTitle = { fontSize:11, fontWeight:700, color:'#888', textTransform:'uppercase', letterSpacing:1.5, borderBottom:'1px solid #ebebeb', paddingBottom:8 };
const inp = { width:'100%', padding:'7px 9px', border:'1px solid #ddd', borderRadius:6, fontSize:13, fontFamily:"'Inter',sans-serif", color:'#111', background:'#fafafa', outline:'none' };
const linkBtn = { padding:'10px 14px', background:'#111', color:'#fff', border:'none', borderRadius:8, fontSize:12, fontWeight:700, cursor:'pointer', letterSpacing:1, textTransform:'uppercase', width:'100%' };
