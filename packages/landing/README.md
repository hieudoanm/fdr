# FDR

> Can't decide what to eat? Spin the reel and let fate pick your next meal.

A food randomizer built with Next.js, Tailwind CSS, DaisyUI.

## Features

- Slot-machine reel of 32 dishes across six cuisines (Italy 🇮🇹, Korea 🇰🇷, Japan
  🇯🇵, Thailand 🇹🇭, Vietnam 🇻🇳, Mexico 🇲🇽)
- Cuisine picker with search, filter chips and expandable groups
- Spin with a button or Space / Enter; landed dishes link to Google search
- Light `fdr` / dark `fdr-dark` themes with persisted preference
- Weekly food schedules (Sheldon, Vietnam, United Kingdom)

## Development

```bash
pnpm install
pnpm run dev        # web dev server on :3000
pnpm run test       # unit tests with coverage thresholds (80%)
pnpm run lint       # eslint + prettier
pnpm run build      # static export to out/
```

See [docs/](./docs/) for architecture, features and packaging notes.
