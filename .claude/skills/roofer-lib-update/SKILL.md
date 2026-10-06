---
name: roofer-lib-update
description: The user has updated the @bpartners/roof-analyser library. Diff the old and new versions, find what this app must change to follow it, apply the changes, verify, and commit (never push). Use when the user says they bumped/updated the roof analyser lib, or runs /roofer-lib-update.
argument-hint: "[old-version] [new-version]"
---

# Follow a @bpartners/roof-analyser update

The user has already bumped `@bpartners/roof-analyser` (usually `package.json` + `package-lock.json` are modified and `node_modules` holds the new version). Your job: find out exactly what changed, adapt this app, verify, commit. **Do not push.**

Arguments (optional): `$ARGUMENTS` — `[old-version] [new-version]`. Defaults: old = version locked in `HEAD`'s `package-lock.json`, new = version installed in `node_modules`.

## 1. Make sure the new version is installed

- `git status --short` and `git diff HEAD -- package.json` to see the bump.
- Compare `jq -r .version node_modules/@bpartners/roof-analyser/package.json` with the range in `package.json`. If `node_modules` is behind, run `npm install` (CodeArtifact auth: `initNpmrc.sh` if it fails — tell the user rather than guessing credentials).
- If the bump is already committed (old == new by default), find the previous version with `git log -p -- package.json | grep roof-analyser` and pass it explicitly.

## 2. Diff the two versions

```bash
.claude/skills/roofer-lib-update/scripts/diff-lib.sh $ARGUMENTS
```

It prints a work directory holding `typings.diff`, `readme.diff`, `deps.diff`, `css.diff`, `sources.diff`, plus the full extracted sources under `src-old/` and `src-new/`. Read **all** of `typings.diff`, `deps.diff` and `readme.diff` — do not truncate with `head`; page through it if it is long. Use `sources.diff` / `src-new/` to confirm runtime behaviour, not just types.

## 3. Map the changes onto how this app uses the library

Find every touch point: `grep -rn "@bpartners/roof-analyser" src cypress`. As of writing they are:

| File | What it uses |
| --- | --- |
| `src/components/steps/annotate-image-step.tsx` | `<RoofAnnotator>` and every prop passed to it (`sessionId`, `latitude`, `longitude`, `address`, `resolveWmsLayers`, `resolveActiveWmsLayer`, `rooferButtonMode`, `onPdfExport`, `onFinish`, `accountId`, `accountHolderId`, `userId`, config) |
| `src/components/steps/roof-analyser-config.ts` | `RoofAnalyserConfig` fields fed from `.env.local` |
| `src/providers/geo-session-provider.ts` | `geoRecordIds`, `GeoPoint`, `WmsLayerOption`; host-side session creation (prospect → area picture → draft annotation), geocoding, WMS resolvers |
| `src/queries/roof-report-query.ts` | `GeoExportedPdf` (shape handed to `onPdfExport`) |
| `src/App.tsx` | `useGeoAnnotatorStore(({ screen }) => screen)` and the `'analyse'` / `'report'` screen values |

For each, check against the new version:

1. **Routing in `RoofAnnotator`** (`src-new/src/RoofAnnotator/RoofAnnotator.tsx`): with the props we pass, which inner component mounts? Does the library now create records itself (prospect / area picture / annotation) that `createGeoSession` already creates — i.e. would anything be duplicated or overwritten?
2. **Props**: removed, renamed, newly required, deprecated, or changed semantics (also props now silently ignored on our path).
3. **Config** (`types.d.ts` → `RoofAnalyserConfig`): new fields that should be wired from `.env.local` (and to CI's `.env.local` reconstruction in `.github/workflows/ci.yml` if a new env var is introduced — tell the user to add the GitHub secret).
4. **Exports**: anything we import that moved or changed shape; new exports that replace host code we maintain (geocoding, imagery resolvers, session creation, address autocomplete). Only adopt a replacement when it is a clear win and loses no behaviour we rely on (e.g. our `prospectId` caching, prospect `comment`, French error messages, the WMS proxy probe); otherwise list it as optional.
5. **`rooferButtonMode` behaviour** (our mode): footer, `onPdfExport` / `onFinish`, screens/tabs, store `screen` values, anything that auto-opens over the UI (guides, dialogs) — that can break Cypress specs in `cypress/e2e/`.
6. **Dependencies / peer dependencies**: new peers this app must install, version conflicts with React / MUI / leaflet / react-query.
7. **Network**: new endpoints the library calls on our path — check that offline Cypress mocks (`cypress/e2e/offline/`, `cypress/fixtures`, `mock/`) still cover them, and the Vite proxy (`vite.config.ts`).

## 4. Apply the changes

Edit the app to follow every **required** change. Follow the project conventions in `CLAUDE.md` (Prettier style, French UI copy, `className` + centralized styles rather than inline `sx`, `data-cy` selectors). Run `npm run format` on touched files.

## 5. Verify

- `npx tsc -b`
- `NODE_OPTIONS=--max-old-space-size=8192 npx vite build` (the default heap runs out locally)
- `npm run lint` — compare against the baseline: only errors in files you touched count. Get the baseline with `git stash` if unsure.
- `npm test` (offline Cypress) when anything on the UI path changed and time allows; say so explicitly if you skip it.

## 6. Commit (no push)

Follow `CLAUDE.md` contribution rules: Conventional Commits with a subject describing what was actually done, **no Claude attribution / Co-Authored-By trailer**, never push.

- First commit the bump alone: `git add package.json package-lock.json && git commit -m "chore: bump @bpartners/roof-analyser to <new>"` (skip if already committed).
- Then one commit per meaningful adaptation, typed by nature (`fix:` when the update broke something, `feat:` when adopting a new capability, `chore:` for refactors/config).
- Commit even when nothing but the bump was needed.

## 7. Report

Tell the user, concisely: old → new version, what changed in the library that matters to this app, what you changed (with file links) and the commits made, what you deliberately left alone and why, optional follow-ups, and the verification results — including anything you did not run.
