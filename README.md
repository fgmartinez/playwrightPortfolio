# Playwright Portfolio

Independent Playwright/TypeScript test suite for the [Cypress Real World App](https://github.com/cypress-io/cypress-realworld-app). The application belongs to Cypress; this repository contains only the test framework and tests.

## Current scope

- Typed API setup creates a unique user for each test that needs one.
- UI registration and login are verified through the authenticated API session.
- Negative UI login cases cover a wrong password and an unknown username.
- API tests cover unauthenticated access, login, and authenticated bank account creation.
- Payment setup checks independent receiver API and sender browser sessions, with bank accounts owned by the correct users.
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
npm ci
npx playwright install chromium
npm run check
npm test
```

The UI defaults to http://localhost:3000 and the backend to http://localhost:3001. Both origins are defined in `app.config.ts` and can be overridden with `UI_BASE_URL` and `API_BASE_URL`. Browser pages navigate with paths such as `/signin`; API clients own endpoint paths such as `/users`. Specs call the page objects and API clients without specifying a host. The committed lockfile makes `npm ci` reproducible.

## Structure and responsibilities

| Path | Responsibility |
| --- | --- |
| `app.config.ts` | Centralized UI and API origins with environment overrides. |
| `playwright.config.ts` | Runner configuration, browser, UI base URL and failure artifacts. |
| `tests/support/models/{auth,users,bankAccounts,shared}/` | Request and response types grouped by domain. |
| `tests/support/builders/{auth,users,bankAccounts}/` | Immutable data generation and variants. |
| `tests/support/pages/auth/` | Page objects: UI actions and locators for one screen. |
| `tests/support/api/{auth,users,bank,shared}/` | HTTP clients and response decoders; they do not decide test outcomes. |
| `tests/support/fixtures.ts` | Constructs test-scoped objects and injects their dependencies. |
| `tests/ui/` | User journeys and assertions across UI and API. |
| `tests/api/` | Direct API behavior and authorization checks. |
| `eslint.config.mjs` | Type-aware ESLint checks and consistent type imports. |

Page objects receive Playwright's `Page`; API clients receive `APIRequestContext`. Tests own business assertions. The lazy `testUser` fixture creates a unique account through `POST /users` and exposes `{ input, record }`: `input.password` is the test credential, while `record.id` is the server-generated identity. The registration test creates its user through the UI because registration is the behavior under test. No login test relies on a seeded account. See [ADR 0001](docs/decisions/0001-test-data-isolation.md) for the isolation decision.

`browserAuthApi` uses `page.request` and shares browser cookies. `isolatedAuthApi`, `usersApi`, and `bankAccountsApi` use Playwright's separate `request` fixture; those API clients share its cookie jar within a test. API clients never create or switch sessions themselves.

The app also keeps UI authorization state in an XState machine persisted to localStorage. A cookie obtained with `page.request` authenticates HTTP calls but does not initialize that UI state. For a scenario that navigates the app, log in with `SignInPage` and then use `page.request` for API reads or setup in the same browser session. A second user who only needs API operations logs in with `isolatedAuthApi` and uses clients bound to `request`. In the payment setup test, the receiver uses `request`, while the sender logs in through the UI and uses `page.request`; creating the sender's bank account after UI login requires a reload so the onboarding list refetches it. A new user may be given a balance through `ApiUserBuilder.withBalance()` for API setup; the UI sign-up form creates users with a zero balance. Each client owns its endpoint path and returns a status plus a decoded body. Response decoders validate only fields used by the suite, with common JSON field checks in `api/shared/decodeJson.ts`. They discard the server's password hash. GraphQL errors are checked even when HTTP returns 200.

```ts
const { input, record } = testUser; // fixture already called POST /users
await signInPage.open();
await signInPage.signIn(LoginCredentialsBuilder.fromUser(input).build());
const session = await browserAuthApi.checkAuth(); // shares browser cookies
expect(session.status).toBe(200);
expect(session.body).toMatchObject({ user: { id: record.id } });
```

The sample includes no hardcoded host. `app.config.ts` provides UI/API origins; page objects and API clients provide paths. `AuthApi.checkAuth()` models both the 200 and 401 responses as a status-discriminated union. Unexpected statuses and malformed response fields fail at the API boundary.

## Coverage

| Layer | Behavior |
| --- | --- |
| UI | Registration, successful login, wrong password, unknown username, and preparation of two separately authenticated bank account owners. |
| API | Anonymous session rejection, login session, authenticated bank account creation and ownership. |

The suite currently has eight independent tests. Bank account creation uses the app's GraphQL mutation and checks that the returned account belongs to the newly created user.

## Quality gate and documentation

`npm run typecheck` checks TypeScript types; `npm run lint` applies ESLint rules with type information. `npm run check` runs both, and `npm test` runs that check before the browser suite. The GitHub Actions Quality workflow runs static checks, then installs the pinned app and runs the live suite. It uploads Playwright artifacts on failure. Run `npx playwright test` directly when deliberately bypassing the npm pretest gate during debugging.

Public types, builders, API clients, page objects and non-obvious behavior have short JSDoc comments explaining their contract or why they exist. Keep business assertions in specs and explain test intent there; avoid comments that repeat what a method name already says.

## Next slice

Extend `tests/ui/payment.spec.ts` with a payment from the sender to the receiver. Verify the transaction and both user balances through the API (balances and transaction amounts are stored in cents). The existing test establishes account ownership and independent sessions; it does not yet submit a payment. Before adding parallel workers, provide isolated application/database instances or another proven state isolation strategy.
