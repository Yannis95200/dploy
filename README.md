# Dploy Audio Lab

Web app for creating time-contextualized audio ads: pick a product, an era (from the Renaissance to the future) and an intention, then the app generates the spot.

Originally generated with [Bolt](https://bolt.new).

## Stack

- React 18 + TypeScript
- Vite 5
- Tailwind CSS 3
- lucide-react (icons)
- Supabase JS (listed in dependencies, not used yet)

## Run locally

```bash
npm install
npm run dev
```

The app is available at http://localhost:5173.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Production build (`dist/` folder) |
| `npm run preview` | Preview the build |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript check |

## How it works

The whole flow lives in `src/App.tsx`:

1. **Product**: pick a product or type a custom one
2. **Era**: 1500, 1950, 1980, 2000, 2020 or 2500
3. **Intention**: the ad text (300 characters max)
4. **Result**: displays the spot text and the audio player

## To do

- Generate the spot voice with ElevenLabs (text-to-speech) from the intention text
- Wire up the audio player (play/pause, real duration)
- Go through a proxy (Supabase Edge Function or Node server) so the API key is not exposed in the browser

## Environment variables

Put these in a `.env` file at the project root (ignored by git):

```
ELEVENLABS_API_KEY=
ELEVENLABS_VOICE_ID=
```

Never prefix the ElevenLabs key with `VITE_`: it would be bundled into the code sent to the browser.
