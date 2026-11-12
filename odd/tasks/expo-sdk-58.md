# Expo SDK 54 -> 58 upgrade

Upgrade appJorge from Expo SDK 54 (RN 0.81.5) to SDK 58 so `npx expo run:ios` works with Xcode 27 (Device Hub replaced Simulator.app).
Branch: `chore/expo-sdk-58` (from `appJorgeEstable`). Guide: official skill `expo/skills@expo-upgrade`.

## Specs

- S1: "actualizamos el proyecto a expo sdk 58"
- S2: The original failure must be gone: `npx expo run:ios` must not fail with "CommandError: Can't determine id of Simulator app; the Simulator is most likely not installed on this machine. Run `sudo xcode-select -s /Applications/Xcode.app`"
- S3: Work on a new branch (not `appJorgeEstable`); the uncommitted `package-lock.json` change is discarded; use the official Expo upgrade skill.
- S4: Existing behavior keeps working: `npm run typecheck` and `npm test` pass as they did on SDK 54; `npx expo-doctor` reports no dependency issues.

## Tasks

- [x] T1 [S4] Baseline typecheck + tests on SDK 54 — inline — no commit (typecheck clean, 174/174 tests)
- [x] T2 [S1,S4] Bump expo to SDK 58 (`~58.0.24`, `expo install --fix`), TS 6 `baseUrl` removal, RN 0.88 type fixes — inline — baee2a9
- [x] T3 [S1,S4] `HeaderHeightContext` from `expo-router/react-navigation`; drop unused `@react-navigation/drawer` and `elements` — inline — b70d4eb
- [x] T4a [S1,S4] expo-file-system 58 `File.write()` became async: use `writeSync` in backup export and recovery snapshot, with tests — inline — 4d91e1c
- [x] T4b [S1,S4] Expo Router 58 makes `href: null` tabs unreachable: hide the suppliers tab item with `tabBarItemStyle: { display: 'none' }` — inline — f96f05c + fix commit
- [x] T5 [S2,S4] Verify: typecheck, tests, expo-doctor, `prebuild --clean -p ios`, `expo run:ios` on Xcode 27 simulator, suppliers navigation — inline + independent verify

## Log

- L1 (user, 2026-11-12): "actualizamos el proyecto a expo sdk 58 tienes las skills para eso?"
- L2 (user decisions): install official skill (yes), new branch (yes), discard package-lock.json change (yes).
- L3: Skill `upgrading-expo` was renamed upstream to `expo-upgrade`; installed `expo/skills --skill expo-upgrade` globally.
- L4: Skill note: avoid SDK 56 and expo<=57.0.8 (Hermes V1 memory regression with reanimated/worklets); target latest 58.0.24.
- L5: Native dirs `ios/` and `android/` are gitignored (CNG); regenerate with prebuild.
- L6: Explorer audit (SDK 55-58): required changes were `File.write()` async (expo-file-system 58.0.0) and `href: null` tab redirect (expo-router 58.0.0, #48499); iOS 26 header change does not apply (root stack sets headerStyle.backgroundColor); expo-sqlite APIs unchanged.
- L7: Evidence: typecheck exit 0; 176/176 tests; expo-doctor 19/20 (only preexisting `eas-cli` in devDependencies); `expo prebuild --clean -p ios` exit 0; `expo run:ios --device "iPhone 17"` build succeeded, installed and opened via Device Hub without the Simulator.app error; home screen and Más -> Abrir proveedores render on SDK 58 (tab bar shows 4 tabs).
- L8: Deprecation: `HeaderHeightContext` from `expo-router/react-navigation` is marked @deprecated ("Copy the component into your codebase... Will be removed in a future SDK"); kept for now, user decision pending.
- L9: Preexisting, out of scope: `work/investment-history-qa` imports `react-dom/client` without `@types/react-dom` (never in base package.json/lockfile; outside tsconfig include).
- L10 (user, 2026-11-12): "porque sale la barra de navegacion alineada los iconos ala izquierda?"
- L11: Cause: f96f05c used `tabBarButton: () => null`, which keeps the hidden item's wrapper in the flex row (5 slots of 20%, last one empty). Fix: `tabBarItemStyle: { display: 'none' }`. Simulator evidence: 4 tabs at 25% width each; Más -> Abrir proveedores still opens Proveedores. VoiceOver labels still say "N of 5" (counts the hidden route).
