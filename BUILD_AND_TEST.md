# Build & Test

**Stack:** Vanilla HTML/CSS/JavaScript roguelike blackjack. No build tools.

The game source lives at the repository root (`EvilCasino/`).

## Prerequisites

A modern browser. Optional: Python or `npx serve` for local hosting.

## Build

None required.

## Run

Open `index.html` in a browser, or serve the folder:

```bash
python -m http.server 8000
```

Then open http://localhost:8000

Alternatively: `npx serve .`

## Test

Manual browser testing only. Uses Web Audio API for SFX. No `localStorage` / save system — settings reset on refresh.

### Animation smoke checklist

After animation changes, verify in browser:

1. Deal / hit / stand / double / split — controls never stuck
2. Hole card flip on stand — correct face, sound synced
3. Win / loss / push — table tint, card glow, money flash
4. Floor map open/close, node complete animation, contract-done highlight
5. Boss / shop / event / rest popups animate in
6. Black Widow burn, Countess money drain, Lady Luck hide/reveal
7. Chip collect on deal, scatter on clear bets
8. Side bet win glow and loss shake
9. Split hands spread apart; active hand highlighted
10. Card Counter bust % pulses on threshold cross
11. `prefers-reduced-motion` — game still playable with animations skipped
