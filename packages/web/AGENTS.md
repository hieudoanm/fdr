# FDR

Can't decide what to eat? A food randomizer that spins a reel of dishes across
world cuisines, built with Next.js.

## Commands

| Command             | Description                               |
| ------------------- | ----------------------------------------- |
| `pnpm run dev`      | Start the development server              |
| `pnpm run build`    | Production build with type checking       |
| `pnpm run lint`     | ESLint, writing fixes                     |
| `pnpm run test`     | Unit tests with coverage (80% thresholds) |
| `pnpm run test:e2e` | Playwright end-to-end tests               |

## Key Conventions

- The randomizer feature is wired up in
  `src/components/organisms/Randomizer.tsx` (the `FoodRandomizer` organism), and
  its reusable pieces live in `src/components/molecules/` (`CuisineSelect`,
  `Reel`, `SchedulePicker`) and `src/hooks/` (`useFoodPicker`).
- Jest treats every file inside `__tests__/` as a suite: keep shared fixtures in
  `<feature>/testing/`, not in `__tests__/`.
- Pages are thin: they compose templates (`HomeTemplate`) and feature
  components.
- Path alias `@/*` maps to `./src/*`.
- DaisyUI has a single `fdr` light theme, defined in `src/styles/globals.css`
  and applied via `data-theme="fdr"` on `<html>`.
- Shared infrastructure lives in `src/providers/` (`SWProvider`),
  `src/components/atoms/` (`Badge`, `OfflineBadge`) and `src/hooks/`.

## Data

Static food data lives in `src/data/json/`, imported through
`src/data/index.ts`. The canonical CSV sources are in `packages/data/csv/`;
regenerate JSON with `node packages/data/csv-to-json.mjs`, which writes both
`packages/data/json/` and this `src/data/json/` copy.

- `foods.json` — 200 dishes with
  `{ country, category, subcategory, value, label, emoji }`.
- `countries.json` — 10 countries with `{ value, label, emoji }`.
- `schedule-scheldon.json` — 7 entries, `schedule-vietnam.json` — 14 entries
  (two weeks, with `week`), `schedule-united-kingdom.json` — 7 entries; all with
  `{ day, week?, meal, emoji, restaurant, note }`.
- `FOOD_OPTIONS` maps `all`, each country, and each dish value to label lists
  used by the reel and picker.

Types (`Cuisine`, `Food`, `ScheduleEntry`) live in `src/data/types.ts` and are
re-exported from `src/data/index.ts`.

## Documentation

| Document        | Description                                  |
| --------------- | -------------------------------------------- |
| [docs](./docs/) | Architecture notes and feature documentation |
