# appJorge Pilot (Expo + React Native)

Production-minded first vertical slice for daily financial tracking.

## What is included

- Expo Router app scaffold with TypeScript strict mode
- Home screen with monthly overview card
- Month day-list for quick date access
- Daily record screen with:
  - total sold
  - investment cost
  - additional expenses
  - notes
- Automatic gross/net profit calculations
- Local persistence via SQLite (`expo-sqlite`)
- Clean architecture lite + feature-first modules
- Unit tests for core business rules and application flow

## Run

```bash
npm install
npm run typecheck
npm test
npm start
```

## Architecture (lite)

```text
app/
  index.tsx
  day/[date].tsx
src/
  core/
    storage/sqlite.ts
    utils/
  ui/
    theme.ts
    components/Screen.tsx
  features/daily-records/
    domain/
    application/
    infrastructure/
    presentation/
```

## Notes

- Domain logic is fully isolated from UI.
- `DailyRecordService` orchestrates validation + calculations + repository.
- SQLite repository is swappable thanks to `DailyRecordRepository` interface.
