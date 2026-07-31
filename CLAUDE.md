# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

"Bouton couvreur" (Birdia) — a single-page React app that lets homeowners run an AI analysis of their roof. It is a 4-step wizard: enter address → view/delimit the roof on a satellite image → run BIRDIA detection → acknowledgement (a roofer calls back).

## Commands

- `npm run dev` — Vite dev server (the `test:open.sh` interactive flow expects it on port 3000)
- `npm run build` — type-check then build (`tsc -b && vite build`)
- `npm run lint` — ESLint over the repo
- `npm run format` — Prettier + organize-imports over `src` and root config files
- `npm test` — Cypress e2e against **offline/mocked** specs (`cypress/e2e/offline/`)
- `npm run it` — Cypress e2e against **online** specs that hit the real API (`cypress/e2e/online/`)
- `npm run test:open` — starts dev server (port 3000) + `cypress open` together (see `test:open.sh`)
- Single spec: `npx cypress run --e2e --spec ./cypress/e2e/offline/app.cy.tsx`

`initAWS.sh` / `initNpmrc.sh` configure AWS CodeArtifact auth for installing the private `@bpartners/*` packages.

## Configuration & environments

- Env vars live in `.env.local` and are injected wholesale at build time — `vite.config.ts` does `define: { 'process.env': env }`, so code reads `process.env.REACT_APP_*` directly (there is no runtime `.env` loading). Changing env requires restarting Vite.
- `.env.local` holds both **prod** and **preprod** values; the preprod block is commented out. Switching environments means toggling those comments. Key vars: `REACT_APP_BPARTNERS_API_URL` (bpartners SDK), `REACT_APP_GEO_DETECTION_API` (raw detection API), `LLM_ANALYSE_RESULT`, `RECAPTCHA_SITE_KEY`.
- The app requires an `apiKey` **query param** to function. `App` redirects to `/api-key` when it's absent; the entered key is validated via `useValidateApiKey` and threaded into every request.
- Path alias `@` → `src` (configured in both `vite.config.ts` and tsconfig via `vite-tsconfig-paths`).

## Architecture

The `src/` tree is organized by role, not by feature. The layering matters:

- **`providers/`** — the data-access layer. Two distinct backends:
  1. `api.ts` wraps the generated `@bpartners/typescript-client` SDK (SecurityApi, UserAccountsApi, AreaPictureApi, ProspectingApi, FilesApi, AddressAutocompletionApi), each constructed per-call with the apiKey.
  2. `detection-provider.ts` and others use **raw `fetch`** against `REACT_APP_GEO_DETECTION_API` with an `x-api-key` header (the SDK does not cover the geo-detection endpoints). Detection is fire-and-poll: `processDetection` POSTs to `/detections/{id}/sync`, then `getDetectionResult` polls until `vgg_file_url` appears. Backend error conditions are detected by string-matching the response `message` and re-thrown as coded errors (`featureNotAllowed`, `detectionLimitExceeded`, `polygonTooBig`).
- **`queries/`** — React Query (`@tanstack/react-query`) hooks that call providers, handle pending/error state, and drive the wizard. This is where UI-facing async logic lives.
- **`mappers/`** — pure transforms between the app's polygon/annotation shapes and the various backend GeoJSON formats. The geo pipeline is non-trivial: pixel polygons → referencer/mercator conversion (external Lambda URLs in `.env.local`) → GeoJSON for detection.
- **`components/steps/`** — the four wizard step components (`get-address-step`, `annotate-image-step`, `detection-result-step`, `acknowlegements-step`), assembled in `App.tsx`.
- **`components/`** — shared UI, including the annotator integration built on `@bpartners/annotator-component`.
- **`hooks/`**, **`forms/`** (react-hook-form + zod), **`loader/`**, **`utilities/`**.

### State & persistence

There are three parallel state mechanisms — know which to use:

- **Zustand** (`hooks/use-step.ts`) — the wizard's in-memory state: `actualStep` (0–3) and a `params` bag (image, polygons, prospect, detection, etc.). `setStep` shallow-merges into `params`.
- **`utilities/cache.ts`** — a typed `localStorage` façade (`cache` / `getCached` / `clearCached`) for IDs and one-shot flags (detectionId, prospectId, "email already sent", "annotation already saved", etc.) that must survive re-renders and guard against duplicate side-effects.
- **`utilities/local-db.ts`** — IndexedDB, used only for large blobs (e.g. the detection image) that would blow the localStorage quota.

Note: `main.tsx` clears `localStorage`, `sessionStorage`, and the query cache on every mount, and `App` assigns a fresh session UUID — the app is designed to start clean each load.

### Routing & providers tree

`utilities/routes.tsx` defines a `createBrowserRouter` with `GlobalLayout` (renders `<Outlet/>` + global dialog/snackbar + Birdia disclaimer) wrapping `App` (`/`) and `ApiKeyPage` (`/api-key`). `main.tsx` wraps everything in `GoogleReCaptchaProvider` → `QueryClientProvider` → MUI `ThemeProvider`.

## Testing

Cypress is split into **offline** (mocked, run in CI as `npm test`) and **online** (real backend, `npm run it`) e2e suites. Coverage is instrumented via `vite-plugin-istanbul` + `@cypress/code-coverage`, and results are written as SonarQube XML to `dist/test-reports/`. Cypress viewport is a small 700×500 with a 60s default command timeout. Use `data-cy` attributes for selectors (see `api-key-page.tsx`). The `mock/` directory holds sample request/response payloads and scratch conversion scripts for the geo pipeline.

## Code Style

Prettier config (`.prettierrc`): `printWidth: 160`, `singleQuote: true` (incl. `jsxSingleQuote: true`), `trailingComma: 'es5'`, `tabWidth: 2`, `arrowParens: 'avoid'`. Import organization is handled automatically by `prettier-plugin-organize-imports`. Run `npm run format` before committing.

ESLint (`eslint.config.js`): flat config with `@typescript-eslint` + `react-hooks` + `react-refresh` recommended rules. `@typescript-eslint/no-explicit-any` is **disabled** — `any` is used liberally around the geo/GeoJSON conversion code. `dist` is excluded.

UI copy is in French.

## Contribution Requirements

- **Conventional Commits** — commit messages follow `type: subject` (`feat:`, `fix:`, `chore:`, `docs:`, `test:`), matching the existing history. The `subject` must describe **the thing actually done**, never a generic placeholder or timestamp. Pick the `type` from the nature of the change: `fix:` for a bug fix (`fix: {the thing done}`), `feat:` for a new feature (`feat: {the thing done}`), `chore:` for tooling/config/styling/refactors (`chore: {the thing done}`), `docs:` for documentation (`docs: {the thing done}`).
- **Commit as you go** — commit directly after each meaningful step of development, when a commit is warranted, using the conventional form `type: what you've done` (per the rule above). There is no auto-commit safety net, so nothing gets committed unless you commit it yourself with a descriptive message — never leave work for a generic/timestamped fallback.
- Branches: `prod` is the main/deploy branch; `preprod` is the pre-production branch (currently the working branch). Open PRs against these.
- CI (`.github/workflows/ci.yml`) runs on every push and pull request: it authenticates to AWS CodeArtifact (via `initAWS.sh` / `initNpmrc.sh`), reconstructs `.env.local` from GitHub secrets, builds, and runs the offline `npm run test` suite (Node 20.19.0, Firefox). Online integration tests run separately (`it.yml`). Tests must pass before merge.
