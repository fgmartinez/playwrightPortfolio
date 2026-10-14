import { test as base, expect } from "@playwright/test";
import { AuthApi } from "./api/AuthApi";
import { UsersApi } from "./api/UsersApi";
import { ApiUserBuilder } from "./builders/ApiUserBuilder";
import type { ApiUser } from "./models/ApiUser";
import { SignInPage } from "./pages/SignInPage";
import { SignUpPage } from "./pages/SignUpPage";

type TestFixtures = {
  signInPage: SignInPage;
  signUpPage: SignUpPage;
  authApi: AuthApi;
  usersApi: UsersApi;
  testUser: ApiUser;
};

export const test = base.extend<TestFixtures>({
  signInPage: async ({ page }, use) => {
    await use(new SignInPage(page));
  },
  signUpPage: async ({ page }, use) => {
    await use(new SignUpPage(page));
  },
  authApi: async ({ page }, use) => {
    // page.request shares cookies with this test's browser context.
    await use(new AuthApi(page.request));
  },
  usersApi: async ({ request }, use) => {
    // Isolated API context: creating a user does not authenticate the browser.
    await use(new UsersApi(request));
  },
  testUser: async ({ usersApi }, use) => {
    const user = ApiUserBuilder.aValidUser().build();
    const response = await usersApi.create(user);
    expect(response.status(), "create test user through POST /users").toBe(201);
    await use(user);
  },
});

export { expect };
