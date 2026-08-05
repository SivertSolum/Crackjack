# 🃏 EVIL CASINO 🃏

### *"Definitely Not Rigged"™*

A darkly hilarious roguelike blackjack game where you face off against Satan himself in his rigged casino. Traverse branching floor maps, complete hellish contracts, collect perks, and survive 7 floors of anomaly dealers — if the house doesn't destroy you first.

---

## [Play Now on GitHub Pages](https://sivertsolum.github.io/EvilCasino/)

> ⚠️ **Warning:** You WILL lose. The house always wins. (But that's part of the fun!)

---

## How To Play

| Action | Description |
|--------|-------------|
| **Goal** | Survive 7 floors and defeat **Satan Himself** |
| **Map** | Pick a path through rooms each floor (Slay the Spire style) |
| **Contract** | Finish it before you clear the boss — or forfeit your soul |
| **Hit** | Take another card (probably a bad idea) |
| **Stand** | Keep your hand (also probably bad) |
| **Double** | Double your bet, take one card, then stand (lmao) |
| **Split** | Split pairs into two hands (risky) |
| **Side bets** | Perfect Pairs and 21+3 (chip tray, optional unless a boss forces them) |

### Progression
- Explore a **branching floor map** — normal tables, elites, events, rest, treasure, gamble, and shops
- **Shops only appear on the map** — no free shop after every win
- Clear rooms along your path; the **boss becomes available when your path reaches it**
- Finish the **floor contract** before you clear the boss — you can still enter the fight incomplete, but winning that way forfeits your soul
- Floors 1–6: a random boss from a pool of **12** (no repeats in a run)
- Floor 7: **Satan Himself** — win this fight to escape

### Money
Cash is survival fuel for bets and shops — not the win condition. You start with **$100**. Go broke and Satan claims your soul.

---

## Room Types

| Room | What happens |
|------|----------------|
| 🃏 Normal | Blackjack vs the House Dealer — win a hand to clear |
| ⚔️ Elite | Harder fight, perk reward on clear |
| 🛒 Shop | Buy perks (only if your path includes it) |
| ❓ Event | Risky choices and rewards |
| 😴 Rest | Rest / meditate / train / gamble |
| 💎 Treasure | Loot — or a mimic |
| 🎰 Gamble | High-risk money games |
| 👹 Boss | Floor anomaly (or Satan on floor 7) |

---

## Bosses

**12 anomalies** are shuffled each run; you face 6 of them on floors 1–6 (never the same twice). **Satan** is always the floor-7 finale.

| Boss | Special Rule |
|------|--------------|
| 👔 THE PIT BOSS | Dealer stands on 18+ |
| 🎭 LADY LUCK | All cards face-down until stand |
| 🦈 THE LOAN SHARK | Win = 2.5x, Lose = 2x loss |
| 🧛 THE COUNTESS | Lose $75 every time you hit |
| 👯 THE TWINS | Must beat TWO dealer hands |
| 🎩 THE GRANDMASTER | Dealer always hits soft 17 |
| 🎴 THE CROUPIER | Side bets mandatory |
| 🪢 THE HANGMAN | Bust costs an extra full bet |
| 🃏 THE JESTER | Random rule each hand |
| 📒 THE BOOKIE | Declare hit/stand before the deal |
| 🕷️ THE BLACK WIDOW | Burns the top card each hand |
| 📋 THE AUDITOR | Normal wins taxed; BJ pays full |
| 👹 SATAN HIMSELF | Dealer starts with 3 cards (finale) |

---

## Perks & Relics

Collect upgrades from elites, bosses, shops, and events. Sample perks include X-Ray Vision, Insurance Fraud, Soul Shield, and Greed.

---

## Tech Stack

- **Pure HTML/CSS/JavaScript** — No frameworks, no bundler, no dependencies
- **CSS-only characters** — House Dealer, anomalies, and Satan
- **Web Audio API** — Synthesized sound effects; `<audio>` for music
- **No save system** — settings and runs are session-only (nothing in `localStorage`)

Current version: **v2.0.0** (roguelike maps & contracts). See in-game changelog.

---

## Local Development

1. Clone the repository and open `index.html`, or serve locally:

```bash
python -m http.server 8000
# Then visit http://localhost:8000
```

After editing scripts or CSS, bump the `?v=` query on that file in `index.html` so caches pick up the change.

---

## License

This project is open source. Feel free to fork, modify, and lose all your virtual money.

*© 2026 Satan's Casino Inc. — All rights to your soul reserved.*

<p align="center">
  <b>Remember: The house always wins.</b><br>
  <i>(But maybe, just maybe, you'll get lucky...)</i>
</p>
