# Expo SDK 54 -> 58 upgrade

Upgrade appJorge from Expo SDK 54 (RN 0.81.5) to SDK 58 so `npx expo run:ios` works with Xcode 27 (Device Hub replaced Simulator.app).
Branch: `chore/expo-sdk-58` (from `appJorgeEstable`). Guide: official skill `expo/skills@expo-upgrade`.

## Specs

- S1: "actualizamos el proyecto a expo sdk 58"
- S2: The original failure must be gone: `npx expo run:ios` must not fail with "CommandError: Can't determine id of Simulator app; the Simulator is most likely not installed on this machine. Run `sudo xcode-select -s /Applications/Xcode.app`"
- S3: Work on a new branch (not `appJorgeEstable`); the uncommitted `package-lock.json` change is discarded; use the official Expo upgrade skill.
- S4: Existing behavior keeps working: `npm run typecheck` and `npm test` pass as they did on SDK 54; `npx expo-doctor` reports no dependency issues.

## Tasks

- T1 [S4] Baseline typecheck + tests on SDK 54 — inline — no commit
- T2 [S1,S4] Bump expo to SDK 58 (`npx expo install expo@^58.0.24` + `--fix`), expo-doctor — inline — commit
- T3 [S1,S4] SDK 56 router migration: `@react-navigation/*` imports -> `expo-router/*`; drop unused `@react-navigation/*` deps — inline — commit
- T4 [S1,S4] Review SDK 55-58 breaking changes for used modules (expo-sqlite, expo-file-system, expo-router, reanimated), housekeeping (babel config) — inline — commit
- T5 [S2,S4] Verify: typecheck, tests, expo-doctor, `npx expo prebuild --clean -p ios`, `npx expo run:ios` on simulator — inline + independent verify (Risk item 5: dependencies)

## Log

- L1 (user, 2026-11-12): "actualizamos el proyecto a expo sdk 58 tienes las skills para eso?"
- L2 (user decisions): install official skill (yes), new branch (yes), discard package-lock.json change (yes).
- L3: Skill `upgrading-expo` was renamed upstream to `expo-upgrade`; installed `expo/skills --skill expo-upgrade` globally.
- L4: Skill note: avoid SDK 56 and expo<=57.0.8 (Hermes V1 memory regression with reanimated/worklets); target latest 58.0.24.
- L5: Native dirs `ios/` and `android/` are gitignored (CNG); regenerate with prebuild.
