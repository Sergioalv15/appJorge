# appJorge

Pocket daily-financial tracker for small businesses.

---

## Descripción

Una app simple, rápida e intuitiva para autónomos, pequeños comercios y negocios familiares que quieren registrar su actividad diaria en segundos y ver su rentabilidad de un vistazo — sin necesitar conocimientos de contabilidad. El objetivo es que cada día, en menos de 30 segundos, puedas anotar cuánto vendiste y tus gastos, y la app calcule automáticamente tu inversión y beneficio neto — para que al final del mes tengas una imagen clara de tu negocio. Diseñada con principios de simplicidad, rapidez, automatización, mínimo diseño y escalabilidad a futuro.

---

## Features

- **Daily record screen** — total sold (€), profit % (default 30%), additional expenses, notes. Investment amount and gross/net profit are auto-computed and read-only (investment = `totalSold × (1 - profitPercent)`; grossProfit = `totalSold × profitPercent`; netProfit = `grossProfit - additionalExpenses`, may be negative).
- **Monthly + biweekly calendar views** — per-day record-status indicators; tapping a day opens that date's record.
- **Home dashboard** — 4 KPIs (last-day sales, last-day amount allocated to investment, month gross profit, month net profit), a previous-month summary card, and an investment-balance card (capital available to invest) with manual add/retire adjustments.
- **Annual summary screen** — per-month summary cards with year navigation.
- **Toast confirmation** on record save.
- **Local persistence** via `expo-sqlite`.

## Tech stack

- Expo SDK 54 / Expo Router 6 / React Native 0.81 / React 19
- TypeScript (strict)
- `expo-sqlite` for local persistence
- Hand-rolled dependency injection (`container.ts`)
- Drawer navigation (`@react-navigation/drawer`), `react-native-reanimated`, `react-native-safe-area-context`
- Uses `expo-dev-client` with a native `android/` folder (via `expo run:android`)
- Platforms: android, ios, web (per `app.json`)

## Getting started

```bash
npm install
npm run typecheck
npm test
npm run android   # or: npm run ios / npm run web
npm start          # launches Metro
```

## Architecture

Clean-architecture-lite, feature-first, under `src/`.

```text
app/                        # expo-router file-based routes
  (drawer)/index.tsx        # HomeScreen
  (drawer)/calendar.tsx     # CalendarScreen
  (drawer)/annual.tsx       # AnnualSummaryScreen
  day/[date].tsx            # DailyRecordScreen

src/
  core/                     # navigation, providers, storage (sqlite + migrations), theme, utils
  ui/                       # theme.ts, components (Screen, Toast)
  features/daily-records/
    domain/                 # types, calculators, validation, errors
    application/            # DailyRecordService, DailyRecordRepository interface, dto
    infrastructure/         # SQLiteDailyRecordRepository, container (DI)
    presentation/           # screens, components, hooks, home, calendar
    investment/             # nested feature: investment balance + adjustments
```

**Layering rules:**
- Domain is fully isolated from UI — no React, no hooks, no navigation imports.
- `DailyRecordService` orchestrates validation + calculation + repository.
- `SQLiteDailyRecordRepository` is swappable behind the `DailyRecordRepository` interface.
- `container.ts` wires all dependencies manually (no DI framework).

## Business / data model

**DailyRecord**

| Field                | Source               | Type    |
|----------------------|----------------------|---------|
| `date`               | user input           | string  |
| `totalSold`          | user input           | number  |
| `additionalExpenses` | user input           | number  |
| `profitPercent`      | user input (default) | number  |
| `notes`              | user input           | string  |

All derived fields are **computed live on every render** — never stored by the user:

```
investment    = totalSold × (1 - profitPercent)
grossProfit   = totalSold × profitPercent
netProfit     = grossProfit - additionalExpenses   (may be negative)
```

Formulas sourced from `calculators.ts`.

## Persistence & migrations

- Engine: `expo-sqlite` — database file: `appjorge.db`
- Migrations use `PRAGMA user_version` and run inside transactions
- Each version is gated: `if (currentVersion < N) { ... PRAGMA user_version = N }`

| Version | What it does |
|---------|--------------|
| v1 | Creates `daily_records` table + `date` index |
| v2 | Creates `investment_adjustments` table + `date` index |
| v3 | Adds `profit_percent` (default `0.3`) and `net_profit` (default `0`) |
| v4 | Idempotent repair — re-adds `net_profit` only if missing (heals partially-migrated DBs) |

**Legacy columns:** `investment_cost` and `net_profit` columns are legacy — still written on upsert (`investment_cost` computed, `net_profit` hardcoded to `0`) but never read. All SELECTs use only: `date`, `total_sold`, `additional_expenses`, `profit_percent`, `notes`.

## Testing

- Framework: **vitest**, node environment
- 21 test files covering: domain (calculators, validation), application/service, home KPIs, calendar model/visual/boundary/biweekly/a11y, hooks/state, migrations, theme, navigation options, date utils

```bash
npm test
npm run typecheck
```

## What this is NOT

- **Not** an ERP, accounting tool, invoicing system, CRM, inventory manager, or HR tool.
- Single-purpose by design — record daily financials and see profitability at a glance.

### Future ideas (from mission.md)

- Multi-business / multi-user support
- Client & supplier tracking
- PDF / Excel export
- Backups & cloud sync
- Authentication
