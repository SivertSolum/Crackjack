# Build & Test

**Stack:** Vanilla HTML/CSS/JavaScript roguelike blackjack. No build tools.

The game source lives in the `Crackjack/` subfolder.

## Prerequisites

A modern browser. Optional: Python or `npx serve` for local hosting.

## Build

None required.

## Run

Open `Crackjack/index.html` in a browser, or serve the folder:

```bash
cd Crackjack
python -m http.server 8000
```

Then open http://localhost:8000

Alternatively: `npx serve Crackjack`

## Test

Manual browser testing only. Uses Web Audio API for SFX and localStorage for saves.
