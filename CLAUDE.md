# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is **Nuti** — a React nutrition tracking app built with Vite. It allows users to log food intake and track macronutrients (carbs, protein, fat, calories).

## Common Commands

```bash
yarn dev      # Start development server
yarn build    # Build for production (runs TypeScript check + Vite build)
yarn lint     # Run ESLint
yarn preview  # Preview production build locally
```

## Tech Stack

- **Framework**: React 19 + TypeScript
- **Build**: Vite 7
- **Styling**: Tailwind CSS v4 (via `@tailwindcss/vite` plugin)
- **State**: Zustand 5 (`src/store/index.ts`)
- **UI Components**: Radix UI (`@radix-ui/react-dialog`, `@radix-ui/themes`)
- **Linting**: ESLint with `typescript-eslint` and React Hooks rules

## Architecture

### Data Flow

Components subscribe directly to Zustand stores via selectors (e.g., `useRecordStore((state) => state.records)`). There is no prop-drilling — each component reads what it needs from the store. Writes go through store actions (`addRecord`, `removeFood`, etc.).

Note: `src/hook/useFood.ts` wraps `useFoodStore` with convenience methods, but currently **components do not use this hook** — they consume stores directly. The hook has a known bug: it imports `useFoodStore` as a default export, but the store only has named exports.

### State Management

Two Zustand stores in `src/store/index.ts`:

- **`useFoodStore`** — manages `Food[]` (add, remove, update, get by id). Starts empty.
- **`useRecordStore`** — manages `Record[]` with date-based queries. Pre-seeded with 4 hardcoded records via `initialRecords`.

### Data Model (`src/interface.d.ts`)

- **`Food`** — single food item with nutrients per 100g and a `defaultWeight` (serving size in grams)
- **`Combo`** — collection of foods with cached aggregate nutrients (defined but not yet wired into the UI)
- **`Record`** — a logged meal (contains a Food or Combo) with `eatTime` (HH:MM) and `eatDate` (YYYY-MM-DD)

### Styling

- **Radix Themes** provides the `<Theme>` wrapper (accent color: "tomato", set in `src/utils/index.ts`) and CSS variables like `var(--accent-surface)`, `var(--accent-a3)`, `var(--accent-indicator)`
- **Tailwind v4** utility classes are used alongside Radix variables for layout and spacing
- Components use a mix of Tailwind classes and inline Radix CSS variable references

### Component Dependencies

- `TimeLine` → imports `Card` from `Combo.tsx`
- `AddRecordDialog` → imports `FoodSelect`, `FoodTag` from `FoodList.tsx`, `Card` from `Combo.tsx`, and `FoodDialog` (default export of `EditFoodDialog.tsx`)
- `FoodList` → imports `FoodDialog` from `EditFoodDialog.tsx`
- `App` → consumes `useRecordStore` directly, pass no props to children

### Mock Data

- `src/mock/index.js` — 8 food items (rice, chicken, egg, avocado, almond, broccoli, olive oil, apple). Used by `AddRecordDialog` as the initial food list.
- `src/store/index.ts` — 4 hardcoded records (banana, protein powder, lunch, dinner) pre-seeded into the record store.

### Utilities

- `src/utils/index.ts` — `calculateCalories(carbs, fats, proteins)` computes kcal from macros (4/9/4 kcal per gram). Also exports `themeConfig`.

### Project Maturity

This app is in early active development. Several features are stubbed:
- `BottomActions` handlers are `console.log` placeholders
- The `Combo` interface is defined but no combo creation UI exists
- `RecordsPageData` and `WeightUnit` types in `interface.d.ts` are unused
- Components use both named (`FoodDialog` as `EditFoodDialog`'s default) and direct (`FoodSelect`) imports — there's no consistent barrel export pattern yet
