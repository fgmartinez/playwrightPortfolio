# ADR 0002: Payment scenario composition

## First business risk

A sender with sufficient balance pays a newly created receiver through the UI. Verify one completed transaction and the exact balance delta for both users through authenticated API reads. The UI form uses currency units; the backend stores cents (`amount * 100`). For example, $25 produces `amount: 2500`.

## Test ownership

The spec owns intent and assertions. It must be understandable without opening page objects: who pays whom, how much, and which state transitions are expected. A `PaymentPage` owns navigation, locators and UI actions. `UsersApi`, `BankAccountsApi` and `TransactionsApi` own HTTP paths, typed payloads and decoded responses. Builders create valid values and immutable variants; they make no HTTP calls. Fixtures compose test-scoped dependencies and create only the data explicitly requested by a test. Do not create a generic BasePage or a speculative service hierarchy.

## Scenario data

Create a unique sender and receiver for each test via `POST /users`. Set the sender balance to 10000 cents and the receiver balance to 0. Use a unique transaction note. Authenticate an API context as the sender and create one bank account through the `CreateBankAccount` GraphQL mutation at `POST /graphql` before UI login, because the app blocks new users with no account behind onboarding. The variables need `bankName`, `routingNumber`, and `accountNumber`; keep fake but valid values. The resolver obtains `userId` from the authenticated session, so do not supply it as a variable. GraphQL may return HTTP 200 with `errors`; check errors and `data.createBankAccount` before accepting the response.

For assertions that require each user's private data, use a separate authenticated API context per persona. Never log in sender then receiver using the same context before completing sender assertions. Dispose contexts after the test. The browser session is independent: log in through UI because that interaction is part of the journey. Request context creation and cleanup belong to a fixture, not to shared globals.

No transaction or mutable user is shared between tests or specs. The current single-worker setting stays until the app/database can be isolated per worker. Do not reset the global database while a test is running.

## First test sequence

1. Fixture creates sender, receiver, and sender's bank account via API. Capture starting balances from the creation response.
2. Test logs in as sender via UI, searches for receiver by its unique username, enters $25 and a unique note, then clicks Pay.
3. Assert the UI reaches the completion screen. Treat that as UI evidence only.
4. Read sender and receiver via their own authenticated API contexts; read the transaction via the sender's context.
5. Assert exactly one matching transaction for the unique note and actor IDs, its complete status and amount 2500 cents, and balances 7500 and 2500 cents. Use a bounded retry on an eventual business state only if observation shows the API is asynchronous. Do not add sleeps.

The app has a demo backend: its creation code does not enforce every banking invariant. Avoid invented tests for insufficient funds rejection, idempotency, or ledger guarantees until the app contract actually supports them.

## Implementation order

1. Define `BankAccountInput`, `BankAccountRecord`, and `BankAccountBuilder`; implement `BankAccountsApi.create(input)` against the GraphQL mutation. Decode `data.createBankAccount` and reject GraphQL errors even when HTTP is 200.
2. Add test-scoped authenticated API context handling with cleanup. Add `UsersApi.getById(id)` for balance reads.
3. Define the minimal transaction response projection and `TransactionsApi` read operation. Add `PaymentPage` only with actions used by this journey.
4. Compose a lazy `paymentScenario` fixture. Write the first test in the spec; keep assertions there.
5. Run typecheck and the one scenario, then the whole suite. Review the trace if it fails.

## Diagnostics

Keep Playwright traces and screenshots on failure. Errors in setup should identify the endpoint and status without dumping credentials or server-returned password hashes. Document unexpected app behavior as observed, rather than weakening assertions to make a test pass.
