# Verification

## Executed locally

- Node engine/state/build tests: 24 passing, including catalogue uniqueness and independent logical difficulty classification.
- Legacy runtime: all five runtime scripts parse as ES5; layout guard passes.
- Built-site Chromium: 14 browser flows passing.
- Tablet layouts: 768×928 portrait, 1024×672 and 1024×768 landscape; board cells at least 44×44 CSS pixels, no horizontal overflow, New puzzle remains in the viewport.
- Offline reload and localStorage restoration exercised against the self-contained production build.
- Fresh visitor, denied storage, hints, undo, confirmed replacement, completion, ranking, XSS-safe player names, reduced-animation setting, keyboard controls, modal focus, and paused/dialog time checked.
- Rendered portrait/landscape/difficulty-picker screenshots visually inspected; no clipping or missing controls found. Portrait footer/help can require a little vertical scrolling.
- No JavaScript page errors during visual QA.
- npm audit: zero vulnerabilities in the initial dependency lockfile.

## Continuous integration

GitHub Actions runs the unit/build/legacy checks and the same browser flows in **Chromium and current WebKit**, against `dist/`, before allowing the Pages deployment.

## Limits

Current WebKit is not an emulator for Safari on iOS 12. No physical MD790 iPad was available. The runtime deliberately avoids modern-only JavaScript/CSS features, but Mum's device should get a final tap/type/reload smoke test. Local saves are browser-managed data, not a cloud backup. Leaderboards are per browser/device, not shared or tamper-proof.

No backend, paid service, hosted database, tracking code, third-party font, or CDN runtime is used.
