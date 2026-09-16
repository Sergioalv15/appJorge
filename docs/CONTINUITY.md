# Resume appJorge work

Read this file first after a context reset, usage limit, or session interruption. Then read `PRODUCT_READINESS.md` for the product roadmap. Verify the working tree before changing anything; this checkpoint is evidence from a specific point in time, not proof that the tree has remained unchanged.

## Current checkpoint — 2026-09-16

- Goal: professionalize the daily-financial tracker for small shops, prepare Android and iOS distribution, and validate a sustainable paid product.
- Roles: Codex reviews and directs; OpenCode using `opencode/big-pickle` implements bounded changes. One writer at a time.
- Branch: `master`. Base commit: `4499abc1947d6393c154e795004fe5760b22b8f1`.
- Financial slice is implemented but **not committed or published**. Gross profit is the margin instead of revenue; net profit preserves losses, rounds to cents, and normalizes negative zero. Negative summary values no longer use success colors.
- Last executed validation: focused tests 15/15; full suite 117/117 across 21 files; TypeScript passed. The independent review found no actionable regressions in this slice. No native build, physical-device QA, or store release was performed.
- The independent reviewer also inspected pre-existing investment changes; those are not part of this financial slice.
- `.atl/.skill-registry.cache.json` and `.atl/skill-registry.md` were modified before this work. Preserve them; do not attribute or include them in a financial-fix commit.
- Codex corrected the roadmap's test count and source links after implementation. These were documentation-only edits.

## Work still required

Next bounded unit: safe backup/restore. Existing restore overwrites the live SQLite database without candidate schema/integrity/version validation and does not refresh initialized consumers.

Before implementation, inspect `src/core/storage/backup.ts`, `sqlite.ts`, `sqliteMigrations.ts`, and their UI callers. Define a candidate-validation and recovery flow before editing. Reject foreign/corrupt/newer-schema files, migrate an isolated candidate, confirm overwrite, retain a durable recovery copy, and preserve live data on failure. Refresh consumers after success. See slice 2 in `PRODUCT_READINESS.md` for acceptance criteria. Never exercise destructive restore tests against a user's real database.

Later units: configurable business identity/onboarding, accessible mobile UI, clean Android/iOS production builds and store setup, and monetization validation. The actual numeric App Store Connect ID is still needed; do not invent it. Pricing, final product branding, and store publication have not been decided.

## Recovery procedure

1. Verify the repository path, branch, `git status --short`, and `git diff`. Do not reset, clean, or discard existing changes.
2. Read this file and `PRODUCT_READINESS.md`. Compare the current diff with this checkpoint before assuming any task is complete.
3. Check whether an OpenCode writer is still running before launching another. Session IDs are history references, not proof of an active process.
4. Recover OpenCode context with `opencode session list` and `opencode export <session-id>` when needed. Prefer a new bounded session with these documents if the old context is bloated.
5. Review any partial edits first. Run appropriate verification when code has changed or prior verification is uncertain. Do not repeat completed broad audits unnecessarily.
6. Update this checkpoint with the next action and exact verification results before starting the next unit.

## OpenCode and memory references

- Audit + financial implementation: `ses_f563cb196ffe4zQRusSE4gQ9XE`.
- Independent review: `ses_f562fa529ffej9PhAnBofwDrjL`.
- Requested implementation model: `opencode/big-pickle`.
- Engram project used by OpenCode: `appjorge`. Financial findings saved as observation 312; implementation saved as observation 313. Session summaries were saved by the implementing agent.
- Engram tools were not callable directly from Codex in this session. Local files are the recovery source even when Engram or OpenCode is unavailable.

## Prevention protocol

- Checkpoint after each bounded unit, before switching writers, and before ending a session. Record completed/pending work, touched files, exact tests, active session IDs, and the next concrete action.
- Save the implementation brief before dispatch and persist worker results after completion. Keep reports compact; retain full tool output in local session history rather than copying it into every prompt.
- At a usage warning, stop dispatching new units. Save current and partial work, note active processes, and hand off. Do not assume there will be enough quota for one final save: checkpoint incrementally.
- Maintain one writer. After interruption, verify whether the previous writer completed before retrying to avoid duplicate or conflicting edits.
- Keep recoverable local snapshots under `%LOCALAPPDATA%/Codex/checkpoints/appJorge/`. Each snapshot includes modified source/doc files, a Git patch, and a manifest with hashes and the base commit. A snapshot is not a Git commit and must not be applied blindly over newer edits.
- These local snapshots protect against lost conversation context and provide a copy of pending edits. They do not protect against disk loss. Remote backup/publication requires a separate deliberate action.
- No automatic quota reset, credit purchase, paid build, Git push, or store publication is part of this protocol.

## Resume prompt

> Read docs/CONTINUITY.md and docs/PRODUCT_READINESS.md. Verify the current Git state and recover the referenced OpenCode session if needed. Preserve pre-existing changes. Codex directs and reviews; OpenCode with opencode/big-pickle is the sole implementation writer. Continue from the next unfinished bounded unit and checkpoint before ending.

## Active runtime incident — 2026-09-16

User reported seven runtime errors. On emulator-5554, com.appjorge.mobile (PID 22405 at diagnosis) logged seven `Cannot find native module 'ExpoSharing'` failures, each followed by an Expo Router missing-default-export warning. Checked route files do export defaults. Installed app last updated 2026-09-04; current dependencies include expo-sharing. Working diagnosis: stale native development client.

OpenCode native-rebuild task: `ses_f547ca787ffeV3FCLOpXtb25p0`. Before resuming or launching another writer, inspect this session. It was instructed to copy private database files if accessible, rebuild locally against existing Metro on port 8081, install preserving app data, and verify fresh runtime logs. No source fix is authorized in that task without reporting need; no uninstall, data clear, clean prebuild, or paid build. This incident takes priority over roadmap slice 2 until resolved. Initial status: dispatched; completion not yet verified.
