import { useState, useEffect, useCallback } from 'react';

const CHANNEL_NAME = 'tournament-overlay-sync';
const STORAGE_KEY  = 'tournament-overlay-state';

export const PLAYER_COLORS = [
  { label: 'Sky Blue',   value: '#4fc3f7' },
  { label: 'Red',        value: '#ef5350' },
  { label: 'Green',      value: '#66bb6a' },
  { label: 'Orange',     value: '#ffa726' },
  { label: 'Purple',     value: '#ab47bc' },
  { label: 'Yellow',     value: '#ffee58' },
  { label: 'Pink',       value: '#f48fb1' },
  { label: 'Teal',       value: '#26c6da' },
  { label: 'White',      value: '#f5f5f5' },
  { label: 'Gold',       value: '#ffd700' },
];

export const EVENT_FONTS = [
  { label: 'Bebas Neue',    value: "'Bebas Neue', sans-serif" },
  { label: 'Anton',         value: "'Anton', sans-serif" },
  { label: 'Black Han Sans',value: "'Black Han Sans', sans-serif" },
  { label: 'Oswald',        value: "'Oswald', sans-serif" },
  { label: 'Teko',          value: "'Teko', sans-serif" },
];

function makePlayer(name, strat, color) {
  return { name, strat, lp: 40, elim: false, ctrs: [], color };
}

export function defaultState() {
  return {
    // event
    evName:       'Clash of Cards',
    evFont:       EVENT_FONTS[0].value,
    evStage:      'Finals',
    evStyle:      'Single Elim',
    showStyle:    true,
    evCurRound:   1,
    evTotRounds:  3,
    showRound:    true,
    evTurn:       1,
    maxLP:        40,
    // players
    playerCount:  4,
    players: [
      makePlayer('Player One',   'Aggro',    '#4fc3f7'),
      makePlayer('Player Two',   'Control',  '#ef5350'),
      makePlayer('Player Three', 'Midrange', '#66bb6a'),
      makePlayer('Player Four',  'Combo',    '#ffa726'),
    ],
    // overlay
    gameLayout:   'bottom',   // bottom | corners | middle
    // card overlay
    cardImage:    null,
    cardName:     '',
    // decks per player [0..3] = array of sections
    decks: [[], [], [], []],
  };
}

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    return { ...defaultState(), ...JSON.parse(raw) };
  } catch { return defaultState(); }
}

let channel = null;
try { channel = new BroadcastChannel(CHANNEL_NAME); } catch {}

export function useStore() {
  const [state, setStateRaw] = useState(loadFromStorage);

  const setState = useCallback((updater) => {
    setStateRaw(prev => {
      const next = typeof updater === 'function' ? updater(prev) : { ...prev, ...updater };
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch {}
      try { if (channel) channel.postMessage({ type: 'sync', state: next }); } catch {}
      return next;
    });
  }, []);

  // listen for changes from other tabs
  useEffect(() => {
    if (!channel) return;
    const handler = (e) => {
      if (e.data?.type === 'sync') {
        setStateRaw(e.data.state);
      }
    };
    channel.addEventListener('message', handler);
    return () => channel.removeEventListener('message', handler);
  }, []);

  // also listen for storage events (fallback for same-origin tabs)
  useEffect(() => {
    const handler = (e) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try { setStateRaw(JSON.parse(e.newValue)); } catch {}
      }
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  return [state, setState];
}

// read-only hook for overlay pages (they only receive)
export function useOverlayState() {
  const [state, setStateRaw] = useState(loadFromStorage);

  useEffect(() => {
    if (!channel) return;
    const handler = (e) => {
      if (e.data?.type === 'sync') setStateRaw(e.data.state);
    };
    channel.addEventListener('message', handler);
    return () => channel.removeEventListener('message', handler);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try { setStateRaw(JSON.parse(e.newValue)); } catch {}
      }
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  return state;
}
