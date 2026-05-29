# Loka — Overview

Standalone Vite + React + TypeScript export of the Loka product overview page
(`/overview` route in the main app). Use this for landing-page experiments
without pulling in the rest of the dashboard.

## What's here

```
src/
  main.tsx           — entry; renders <LandingLoka />
  LandingLoka.tsx    — the whole landing page (hero, AegeanBench, Battle Arena, FAQ, CTA)
  ConsensusChat.tsx  — animated roundtable used on the hero
public/
  loka-logo-symbol.png
  loka-logo-symbol-white.png
  avatars/           — analyst portraits used by the cards + animation
  logos/partners/    — backer marks shown on the hero
```

Tailwind is loaded via CDN (`cdn.tailwindcss.com`) so no PostCSS / build
config is needed. Fonts come from Google Fonts (Geist / Inter / Instrument
Serif / Bricolage Grotesque).

## Run locally

```bash
npm install
npm run dev
# → http://localhost:3000
```

## Build

```bash
npm run build
npm run preview
```

## Notes

- Mock data lives inline in `LandingLoka.tsx`. The AegeanBench fields
  (`action`, `target_exposure_pct`, `simulated_return_pct`,
  `forward_return_30d`, `benchmark_return_30d`, …) match the contract in the
  product spec, so swapping in real API responses is a near-direct map.
- "Open App" CTAs link to `/` (currently a no-op in this standalone build).
- All Loka-internal navigation has been stripped; this app renders the
  overview page only.
