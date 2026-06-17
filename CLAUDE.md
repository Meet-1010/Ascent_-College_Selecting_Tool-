# Ascent — MS/Graduate CS University Explorer

## What this project is
A React + Vite web app for exploring the top 100 US universities for MS/Graduate CS programs. Built for Meet Chauhan (meetsc03@gmail.com) who is applying for Fall 2026. Live at: https://ascent-zet7.onrender.com

## Tech stack
- React 18 + Vite, JSX, hooks
- Single CSS file: `react-app/src/index.css` (CSS variables via `:root`, no Tailwind)
- No backend — all university data is static in `react-app/src/data/universities.js`
- GitHub: https://github.com/Meet-1010/Ascent_-College_Selecting_Tool-.git (branch: main)

## Key files
- `react-app/src/App.jsx` — root state, routing between main/compare page
- `react-app/src/data/universities.js` — all university data + helper fns (`admitMid`, `tierLabel`, etc.)
- `react-app/src/components/Topbar.jsx` — search, view toggle (Spiral/Grid/Table), compare drop zone
- `react-app/src/components/Sidebar.jsx` — filters, tier chips, text size slider, profile match
- `react-app/src/components/SpiralView.jsx` — 3D rotating card carousel (the default view)
- `react-app/src/components/GridView.jsx` — card grid
- `react-app/src/components/TableView.jsx` — sortable table
- `react-app/src/components/ComparePage.jsx` — full-page side-by-side comparison
- `react-app/src/components/CompareBar.jsx` — sticky bottom bar when universities are in compare list
- `react-app/src/components/UnivCard.jsx` — card used in grid view, has touch drag logic

## Features built so far
- **3 views**: Spiral (3D carousel), Grid (cards), Table — toggled via animated sliding pill in topbar
- **Compare page**: drag any card to the ⟷ Compare icon in topbar, or click ⟷ on a card. Full page with rank-sorted columns, 👑 Best Fit badge, green ✓ on winning stats, summary section. Max 8 universities. Horizontally scrollable with sticky label column.
- **Touch drag-drop**: long-press (300ms) on a card → ghost pill follows finger → drop on Compare icon. Uses native touch events (`{passive:false}`) not HTML5 DnD (which doesn't work on mobile touch).
- **Mobile responsive topbar**: logo hidden on mobile, view toggle wraps to second row so search bar is always visible
- **Text size slider**: in sidebar, 100–150%, scales only font sizes via CSS `--fs` variable (not zoom)
- **Filters**: tier, GRE, tuition range, admit rate, funding type, state, sort order
- **Profile match**: user profile stored in localStorage via `useProfile` hook
- **Toast notifications**, starred universities, auto-refresh indicator

## CSS architecture
- CSS variables in `:root`: `--gold`, `--navy`, `--surface`, `--border`, `--radius-pill`, etc.
- `--fs` variable (default 1) multiplied in `calc()` for text-only font scaling
- `--topbar-h: 60px` desktop, `100px` mobile (2-row topbar)
- `body.cmp-open` class added when compare bar is visible → `.main` gets `padding-bottom:70px`

## Mobile notes
- Breakpoint: 680px
- Touch drag uses long-press pattern: hold 300ms without moving >12px to start drag
- Drop detection: triple-layer (dz-drag-over class + elementFromPoint + rect+48px padding)
- Spiral view has NO touch drag (conflicts with scroll) — use the ⟷ Compare button in focus bar instead

## Dev server
```
cd react-app && npm run dev
```
Preview server config: `.claude/launch.json`

## Deployment
Hosted on Render. Push to `main` branch triggers auto-deploy.

## Owner preferences
- Keep changes minimal — no extra abstractions, no unnecessary comments
- Mobile-first thinking — Meet uses the site on mobile frequently
- University data is manually curated — don't modify `universities.js` without being asked
