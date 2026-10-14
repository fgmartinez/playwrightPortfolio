import { test as base, expect } from "@playwright/test";
import { AuthApi } from "./api/AuthApi";
import { SignInPage } from "./pages/SignInPage";
import { SignUpPage } from "./pages/SignUpPage";

type TestFixtures = {
  signInPage: SignInPage;
  signUpPage: SignUpPage;
  authApi: AuthApi;
};

export const test = base.extend<TestFixtures>({
  signInPage: async ({ page }, use) => {
    await use(new SignInPage(page));
  },
  signUpPage: async ({ page }, use) => {
    await use(new SignUpPage(page));
  },
  authApi: async ({ page }, use) => {
    // page.request shares the browser context's cookies after UI login.
    await use(new AuthApi(page.request, process.env.API_BASE_URL ?? "http://localhost:3001"));
  },
});

export { expect };
