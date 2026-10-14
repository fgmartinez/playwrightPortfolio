import { test as base } from "@playwright/test";
import { AuthApi } from "./api/auth/AuthApi";
import { UsersApi } from "./api/users/UsersApi";
import { ApiUserBuilder } from "./builders/users/ApiUserBuilder";
import type { ApiUser } from "./models/users/ApiUser";
import type { UserRecord } from "./models/users/UserRecord";
import { SignInPage } from "./pages/auth/SignInPage";
import { SignUpPage } from "./pages/auth/SignUpPage";

/** A test-owned user: original credentials plus server-generated identity. */
export type TestUser = Readonly<{ input: ApiUser; record: UserRecord }>;

type TestFixtures = {
  signInPage: SignInPage;
  signUpPage: SignUpPage;
  authApi: AuthApi;
  apiAuth: AuthApi;
  usersApi: UsersApi;
  testUser: TestUser;
};

/** Test-scoped dependencies. Fixtures run only when a test requests them. */
export const test = base.extend<TestFixtures>({
  signInPage: async ({ page }, use) => {
    await use(new SignInPage(page));
  },
  signUpPage: async ({ page }, use) => {
    await use(new SignUpPage(page));
  },
  authApi: async ({ page }, use) => {
    // Shares the browser session's cookies.
    await use(new AuthApi(page.request));
  },
  apiAuth: async ({ request }, use) => {
    // Separate cookie jar for API-only login and authorization checks.
    await use(new AuthApi(request));
  },
  usersApi: async ({ request }, use) => {
    await use(new UsersApi(request));
  },
  testUser: async ({ usersApi }, use) => {
    const input = ApiUserBuilder.aValidUser().build();
    const created = await usersApi.create(input);
    await use({ input, record: created.body.user });
  },
});

export { expect } from "@playwright/test";
