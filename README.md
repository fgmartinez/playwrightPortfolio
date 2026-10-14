# Playwright Portfolio

Independent Playwright/TypeScript test suite for the [Cypress Real World App](https://github.com/cypress-io/cypress-realworld-app). The application belongs to Cypress; this repository contains only the test framework and tests.

## Current scope

- Browser authentication flow with a unique user created through the API for each test that needs one.
- The UI session is verified through the authenticated API endpoint.
- Invalid credentials: wrong password and unknown username.
- New account registration through UI, followed by login and API session verification.
- API authorization check from a separate, unauthenticated HTTP context.
- Chromium, serial execution, failure traces and screenshots.

The application is a local Express/React demo with a shared JSON database. It reseeds on `yarn dev`, so manually registered accounts are temporary. There is no per-user DELETE endpoint. We start with one worker; parallel runs need isolated application and database instances.

## Run locally

Use Node.js 22.20.0, npm and Yarn Classic 1.22.22. Keep both repositories in the same parent directory.

```text
portfolio-workspace/
  cypress-realworld-app/
  playwrightPortfolio/
```

Clone and check out the tested application revision:

```bash
git clone https://github.com/cypress-io/cypress-realworld-app.git
git -C cypress-realworld-app checkout 0729f68ac220f7cda4ad09c5693dba11d7c532c6
git clone https://github.com/fgmartinez/playwrightPortfolio.git
```

Install app dependencies with Yarn Classic and start it in one terminal:

```bash
cd cypress-realworld-app
yarn install --frozen-lockfile
yarn dev
```

In a second terminal, install and run the test suite:

```bash
cd playwrightPortfolio
npm install
npx playwright install chromium
npm run typecheck
npm test
```

The UI defaults to http://localhost:3000 and the backend to http://localhost:3001. Override these with `UI_BASE_URL` and `API_BASE_URL` if needed. Commit the generated `package-lock.json` after installation; use `npm ci` on subsequent installs.

## Structure and responsibilities

| Path | Responsibility |
| --- | --- |
| `playwright.config.ts` | Runner configuration, browser, base URL and failure artifacts. |
| `tests/support/models/` | Types shared by test data and UI actions. |
| `tests/support/builders/` | Immutable credentials and unique UI/API user payloads. |
| `tests/support/pages/` | Page objects: UI actions and locators for one screen. |
| `tests/support/api/` | HTTP clients: endpoints and transport; they do not decide test outcomes. |
| `tests/support/fixtures.ts` | Constructs test-scoped objects and injects their dependencies. |
| `tests/ui/` | User journeys and assertions across UI and API. |
| `tests/api/` | Direct API behavior and authorization checks. |

The page object receives Playwright's `Page`; the API client receives `APIRequestContext`. Tests assert outcomes. The login builder derives credentials from a user. `ApiUserBuilder` produces complete, unique user payloads; the lazy `testUser` fixture creates an account through `POST /users` for each test that requests one. The UI registration test creates its own user through `SignUpPage` because registration is the behavior under test. No login test relies on a fixed seeded account. See [ADR 0001](docs/decisions/0001-test-data-isolation.md) for the isolation decision.

The UI test injects `page.request`, which shares the browser context's cookies with API calls. The API-only test uses Playwright's isolated `request` fixture, so it intentionally starts unauthenticated. This distinction is part of the test design.

## Next slice

Build a transfer flow: create/prepare users through API, submit a payment in UI, and verify the resulting transaction and balances through API. Before adding parallel workers, provide isolated data per worker or separate app/database instances.
