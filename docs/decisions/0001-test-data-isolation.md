# ADR 0001: Test users and state isolation

## Decision

Create a unique user through `POST /users` for every test that needs an existing account. Playwright's `testUser` fixture is test-scoped and lazy: the API call runs only for tests that request it. Do not share a mutable user across specs, files, or workers.

The UI registration test creates its user through the UI because registration is the behavior under test. An unauthenticated API test needs no user.

## Why

- Tests can run alone and in any order without depending on another spec.
- A wrong-password test starts with a real account without changing another test's login.
- Unique usernames prevent collisions across runs against the same local app.
- API setup is faster than UI registration for every login or payment test.

The builder produces data, `UsersApi` sends requests, and the fixture decides when to create the user. The setup API context is separate from the browser; UI login must still establish a browser session.

## Database lifecycle

The demo app uses a shared JSON database and reseeds it on startup. It has no user DELETE endpoint. Tests do not reset the database between cases, since that could erase another test's state. Locally, test users remain until the app restarts.

Playwright runs one worker per project. GitHub Actions runs the API and three browser projects in separate jobs, each with its own app process and database. Local runs and the Docker service use one app instance, so the projects execute serially. Additional workers within one instance would require separate databases or another proven isolation strategy; unique usernames alone do not protect shared balances or global resets.

## Exceptions

A suite-scoped user is suitable only for immutable reference data with a documented ownership rule. Transactions, profiles, and balances are mutable, so they use per-test data.

## Verification

The suite targets app revision `0729f68ac220f7cda4ad09c5693dba11d7c532c6`. The Quality workflow runs static checks and the API, Chromium, Firefox, and WebKit projects in isolated jobs.
