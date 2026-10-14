# Playwright Portfolio

Independent Playwright/TypeScript test suite for the [Cypress Real World App](https://github.com/cypress-io/cypress-realworld-app). The application belongs to Cypress; this repository contains only the test framework and tests.

## Current scope

- Typed API setup: a unique user is created through the API for each test that needs one.
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

The UI defaults to http://localhost:3000 and the backend to http://localhost:3001. Both origins are defined in `app.config.ts` and can be overridden with `UI_BASE_URL` and `API_BASE_URL`. Browser pages navigate with paths such as `/signin`; API clients own endpoint paths such as `/users`. Specs call the page objects and API clients without specifying a host. Commit the generated `package-lock.json` after installation; use `npm ci` on subsequent installs.

## Structure and responsibilities

| Path | Responsibility |
| --- | --- |
| `app.config.ts` | Centralized UI and API origins with environment overrides. |
| `playwright.config.ts` | Runner configuration, browser, UI base URL and failure artifacts. |
| `tests/support/models/` | Typed requests, user projection and generic `ApiResult<T>`. |
| `tests/support/builders/` | Immutable credentials and unique UI/API user payloads. |
| `tests/support/pages/` | Page objects: UI actions and locators for one screen. |
| `tests/support/api/` | HTTP clients: endpoints and transport; they do not decide test outcomes. |
| `tests/support/fixtures.ts` | Constructs test-scoped objects and injects their dependencies. |
| `tests/ui/` | User journeys and assertions across UI and API. |
| `tests/api/` | Direct API behavior and authorization checks. |

The page object receives Playwright's `Page`; the API client receives `APIRequestContext`. Tests assert business outcomes. `ApiUserBuilder` produces a unique minimal POST body (`firstName`, `lastName`, `username`, `password`) and optionally a balance. The lazy `testUser` fixture creates an account through `POST /users` for each test that requests one, exposing `{ input, record }`: `input.password` is the test credential, while `record.id` is the server-generated identity. API responses are decoded from `unknown` into typed projections; the server's password hash is never included in `UserRecord`. The UI registration test creates its own user through `SignUpPage` because registration is the behavior under test. No login test relies on a fixed seeded account. See [ADR 0001](docs/decisions/0001-test-data-isolation.md) for the isolation decision.

`authApi` uses `page.request`, which shares the browser context's cookies; `apiAuth` and `usersApi` use the isolated Playwright `request` fixture. Each API client owns its relative endpoint path and returns `ApiResult<T>` with a status and validated body. `UsersApi.create(input): Promise<ApiResult<UserResponse>>` requires 201. `AuthApi.login({ type: "LOGIN", username, password }): Promise<ApiResult<UserResponse>>` requires 200 and logs in only its own request context. `AuthApi.checkAuth(): Promise<ApiResult<UserResponse | ApiError>>` accepts 200 and 401. The API login and checkAuth contracts match the pinned app; no frontend session is created by calling `apiAuth.login`.

```ts
const { input, record } = testUser; // fixture already called POST /users
await signInPage.open();
await signInPage.signIn(LoginCredentialsBuilder.fromUser(input).build());
const session = await authApi.checkAuth(); // shares browser cookies
expect(session.status).toBe(200);
expect(session.body).toMatchObject({ user: { id: record.id } });
```

The sample includes no hardcoded host. `app.config.ts` provides UI/API origins and page objects and API clients provide paths.

## Next slice

Once the current setup passes typecheck and runs against the pinned app, build a transfer flow: create/prepare users through API, submit a payment in UI, and verify the resulting transaction and balances through API. Before adding parallel workers, provide isolated data per worker or separate app/database instances.
