# ADR 0001: Test users and state isolation

## Decision

Create a unique user through `POST /users` for every test that needs an existing account. Playwright's `testUser` fixture is test-scoped and lazy: the API call runs only for tests that request it. Do not share a mutable user across specs, files or workers.

The UI registration test is the deliberate exception: it creates its user through the UI because registration is the behavior under test. An unauthenticated API test needs no user at all.

## Why

- Any test can run alone, in any order, without depending on another spec.
- A wrong-password test starts with a real account but cannot corrupt another test's login.
- Unique usernames prevent collisions if the suite is rerun against a live local instance.
- The API setup is much faster than repeating UI registration in every login or transaction test.

The builder only produces data. `UsersApi` sends requests. The fixture decides when to create the user, and the test states the expected business outcome. The API context used for setup is separate from the browser; UI login must still establish a browser session.

## Database lifecycle

The demo app uses a shared JSON database and reseeds it on startup. There is no user DELETE endpoint. We do not reset the whole database between tests because that could erase another test's state. Locally, test users remain until the app restarts.

Start with one Playwright worker. Before adding parallelism, give each worker a separate application/database instance or demonstrate another reliable isolation strategy. A unique username alone does not protect shared balances or global reset operations.

## Exceptions

A suite-scoped user is acceptable only for explicitly read-only, immutable reference data and with a documented ownership rule. Transactions, profiles and balances are mutable, so they get per-test data. Avoid adding a suite-scoped login fixture as a speed optimization without measured evidence.

## Verification

For this slice, run `npm run typecheck` and `npm test` while the pinned version of the app is running. We have not yet verified those commands in the user's local environment.
