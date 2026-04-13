# Tournament Overlay

A real-time tournament broadcast overlay system for OBS, built with React + Vite.

## Routes

| URL | Description |
|-----|-------------|
| `/` | 4-column control dashboard |
| `/overlay/game` | 1920×1080 game overlay (default chroma key #00FF00) |
| `/overlay/card/1` | Primary Card display overlay (default chroma key #00FF00) |
| `/overlay/card/2` | Secondary Card display overlay (default chroma key #00FF00) |

## Features

- **Real-time sync** between all open tabs via BroadcastChannel + localStorage
- **4-column dashboard**: Game Summary / Game Controls / Card+Deck / Card Preview
- **3 player layouts**: Bottom row, Corners, 2×2 Middle grid
- **Player customization**: name, strategy, color, life points (uncapped), custom counters, elimination, mana color combinations, no. of wins
- **Event info**: name, stage, tournament style, rounds, turn counter (all toggleable)
- **5 display fonts** for the event name
- **MTG card search** via Scryfall API with deck list parser. Can have two card show overlays for 2 players.
- **OBS-ready**: Add a Browser as Source and use the Game Overlay, Primary, and Secondary Card Display URLs, add a chroma key filter on the source, use a separate browser as a control hub.

## Local Development
install reactjs
for testing
```bash
npm install
npm run build
npm start
```

for deployment
```bash
npm install
npm run dev
# Open http://localhost:5173
```

## Deploy on Render

1. Push to GitHub
2. In Render: New → Static Site → connect repo
3. Render auto-detects `render.yaml` — build command, publish path, and SPA routing are all configured4
4. Set the Publish Directory to "dist"

## OBS Setup

1. Add a **Browser Source** → URL: `https://your-app.onrender.com/overlay/game`
   - Width: 1920, Height: 1080
   - Add **Chroma Key** filter → color `#00FF00`
2. Add another **Browser Source** → URL: `https://your-app.onrender.com/overlay/card`
   - Add **Chroma Key** filter → color `#00FF00`
3. Open `https://your-app.onrender.com/` in your browser to control everything live

## Deck List Format

```
4 Tarmogoyf
3 Verdant Catacombs (MH2) 260
1 Lightning Bolt

Sideboard
2 Surgical Extraction
```

Supports most common formats including MTGO, Moxfield, Archidekt exports.

## Sample

Control
<img width="1919" height="912" alt="Image" src="https://github.com/user-attachments/assets/93687426-1da6-4767-8b96-7e4b5cda9d9b" />

Overlay
<img width="1919" height="909" alt="Image" src="https://github.com/user-attachments/assets/d2c29506-490b-49a6-9cf0-fc942528d94d" />