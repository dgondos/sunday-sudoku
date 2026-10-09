# Sunday Sudoku

A calm, touch-first Sudoku made for an older iPad. No ads, accounts, analytics, fonts from a CDN, or runtime dependencies.

**Play:** https://dgondos.github.io/sunday-sudoku/

## For Mum

1. Open the play link in **Safari**.
2. Tap an empty square, then a number. Dark numbers are fixed clues.
3. **Notes** toggles pencil marks, **Undo** takes back a move, and **Hint** offers a reveal after confirming the points cost.
4. Choose **New puzzle** for Easy, Medium, Hard, or Expert.
5. Your current puzzle saves automatically after every move and every active second. Coming back shows a **Resume game** button.
6. Optional: Safari → **Share → Add to Home Screen** for an app-style icon.

Keep using the same browser or the same home-screen app: iOS can give them separate storage. Do not use Private Browsing if you want durable saves. Clearing website data clears progress and scores. Browsers may also evict local data; this is not a cloud backup.

## Features

- Four solving-technique-based difficulty tiers; uniquely solvable, internally generated base puzzles, shuffled into many variations without generating puzzles on the iPad.
- Big, readable numerals; touch controls; portrait and landscape tablet layouts.
- Pencil marks, note cleanup, undo, erase, optional mistake highlighting, unlimited confirmed hints.
- Automatic localStorage saves, validated on restore, with a visible warning when storage is unavailable.
- Pause/resume, auto-pause when the page loses focus or becomes hidden, and timer-free dialogs.
- Points, difficulty multipliers, completion bonuses, and top-10 personal bests **per difficulty**.
- Board entrance, number-pop, mistake-shake, progress, dialog, toast, button, and completion-confetti animations.
- An animations setting and system reduced-motion support.
- Keyboard controls and accessible labels/focus handling.
- Optional offline caching on HTTPS/localhost after the first successful load.

### Scoring

For the selected difficulty multiplier (Easy 1, Medium 2, Hard 3, Expert 4):

```text
score = max(0,
  (50 × currently correct non-clue squares
   + completion bonus
   − 20 × wrong attempts
   − 100 × hints) × difficulty multiplier)

completion bonus = 1,000 + max(0, 600 − active seconds)
```

No time limit; no three-mistakes game-over. Undo never refunds hints or mistakes. Disabling red highlighting does not disable mistake penalties. Notes do not earn points. Leaderboards rank completed games by score, then shorter active time. Scores are local, not shared across devices, and are not tamper-proof competitive records.

## Compatibility

The MD790 model family is the 2013 first-generation iPad Air (9.7-inch). The runtime targets **iOS 12-era Safari**:

- ES5 syntax checked with Acorn.
- No modules, transpiler runtime, modern framework, external assets, or `fetch` requirement for the game.
- CSS Grid uses `grid-gap`, not unsupported flex-gap; square sizing uses a padding fallback instead of `aspect-ratio`.
- Home-screen metadata and a PNG touch icon.
- Offline support is optional; failure to register a service worker never blocks play.

The automated suite exercises current Chromium and WebKit at iPad viewport sizes. Those are **not an actual iOS 12 device emulator**. A final physical-device smoke test is still appropriate.

## Develop & verify

Node 24+ and npm are development/CI tools only. The hosted game does not need Node.

```sh
npm ci
npm test
npm run check
npx playwright install --with-deps chromium webkit
npm run build
SITE_DIR=dist npm run test:browser
npm run serve
```

For an already installed Chromium:

```sh
CHROMIUM_PATH=/usr/bin/chromium npm run test:browser -- --project=ipad-chromium
```

Serve the built page with `SITE_DIR=dist npm run serve`. Open http://localhost:4173.

## Static hosting & CI/CD

`npm run build` creates a **self-contained `dist/index.html`** with all game code, puzzle data, and CSS embedded. This file is the whole game and can also be opened directly. `dist/sw.js`, `icon.svg`, and `apple-touch-icon.png` provide optional offline caching and icons. Upload `dist/` to any basic static HTTPS host; no backend or secret is needed.

The GitHub Actions workflow runs unit/build tests, legacy compatibility checks, and Chromium/WebKit browser tests **against the built artifact**, then deploys to GitHub Pages. Pull requests test but do not deploy. Pushes to `main` and manual workflow runs on `main` deploy only after checks pass. Actions are pinned to commit SHAs.

Pages must be configured to use **GitHub Actions**, not a branch source. To set this on a new repository:

```sh
gh api --method POST repos/dgondos/sunday-sudoku/pages -f build_type=workflow
```

## Project structure

- `engine.js`, `puzzles.js`: unique-solution catalogue, transformations, solver, logical rater.
- `state.js`: testable state transitions, scoring, leaderboard and save validation.
- `app.js`, `index.html`, `style.css`: the UI.
- `sw.js`: optional offline shell; build injects a content-derived cache version.
- `tests/`: engine/state/build unit tests and browser flows.
- `scripts/`: local server, single-file build, compatibility check, puzzle/icon generation.
- `.github/workflows/pages.yml`: test-gated Pages deployment.

## Privacy

All puzzle progress, names, settings, and scores stay in localStorage on the device. The app has no telemetry. Like any hosted website, the static host receives ordinary asset requests and can log IP addresses; "no analytics" is not a claim that the hosting provider sees nothing.

## License

MIT. Puzzle catalogue generated by this project's own tools; no external puzzle dataset is required.
