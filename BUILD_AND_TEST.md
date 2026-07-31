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

Manual browser testing only. Uses Web Audio API for SFX and localStorage for saves.
