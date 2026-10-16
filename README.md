# Playwright Portfolio

Playwright and TypeScript tests for the [Cypress Real World App](https://github.com/cypress-io/cypress-realworld-app). This repository contains the tests and their runner; the application is maintained by Cypress and checked out at commit `0729f68ac220f7cda4ad09c5693dba11d7c532c6`.

## Run with Docker

From the repository root:

```bash
docker compose up --build --abort-on-container-exit --exit-code-from tests
```

The image installs the pinned app and Playwright browsers. The container starts the app, waits for the UI and API, runs `npm run check`, then runs the full suite. Playwright reports and test results are written to `playwright-report/` and `test-results/`. To run one project or a specific spec, pass Playwright arguments after the service name:

```bash
docker compose run --build --rm tests --project=firefox
```

## Run locally

Use Node.js 22.20.0, npm, and Yarn Classic 1.22.22. Put the repositories next to each other:

```text
portfolio-workspace/
  cypress-realworld-app/
  playwrightPortfolio/
```

Clone the app and check out the revision above, then install its dependencies and start it in one terminal:

```bash
git clone https://github.com/cypress-io/cypress-realworld-app.git
git -C cypress-realworld-app checkout 0729f68ac220f7cda4ad09c5693dba11d7c532c6
cd cypress-realworld-app
CYPRESS_INSTALL_BINARY=0 yarn install --frozen-lockfile
yarn dev
```

In another terminal, from `playwrightPortfolio/`:

```bash
npm ci
npx playwright install --with-deps chromium firefox webkit
npm test
```

The UI defaults to `http://localhost:3000` and the API to `http://localhost:3001`. Override them with `UI_BASE_URL` and `API_BASE_URL` if needed. `npm test` runs the type and lint checks before Playwright; `npx playwright test --project=api` runs one project directly.

## Coverage

| Project | Scenarios |
| --- | --- |
| API | Anonymous access, login, bank account ownership, and private profile isolation. |
| Chromium, Firefox, WebKit | Registration, successful login, two rejected logins, and a payment with transaction and balance checks. |

There are four API specs and five UI specs. The UI specs run once in each browser, for 19 test invocations in the full matrix. Each test creates its own user when needed; the registration test creates its user through the UI. The app uses a shared JSON database and reseeds on startup, so each Playwright project runs with one worker. See [ADR 0001](docs/decisions/0001-test-data-isolation.md).

The [Quality workflow](.github/workflows/quality.yml) runs type and lint checks, then four parallel jobs: API, Chromium, Firefox, and WebKit. Each job starts its own app instance and database and uploads Playwright artifacts. The Docker image is a separate local way to run the complete suite; the workflow installs the app and browsers directly on GitHub runners.

## Test design

| Path | Purpose |
| --- | --- |
| `app.config.ts`, `playwright.config.ts` | Origins and Playwright projects. |
| `tests/support/fixtures.ts` | Test-scoped users, page objects, and API clients. |
| `tests/support/builders/`, `tests/support/models/` | Test data and API types. |
| `tests/support/pages/` | UI actions and locators. |
| `tests/support/api/` | Typed HTTP calls and response decoding. |
| `tests/ui/`, `tests/api/` | Business assertions. |

Browser-bound API clients use `page.request` and share browser cookies. Isolated API clients use Playwright's `request` fixture and its separate cookie jar. The app also persists UI authorization in localStorage, so an API login by itself does not establish a navigable UI session. The payment test signs in the sender through the UI and uses a separate API session for the receiver. It waits for the payment request to finish before asserting balances because the app advances its wizard before the POST resolves.
