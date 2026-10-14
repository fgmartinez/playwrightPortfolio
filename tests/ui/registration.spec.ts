import { test, expect } from "../support/fixtures";
import { RegistrationUserBuilder } from "../support/builders/RegistrationUserBuilder";

test("a new user can register, sign in and access their API session", async ({
  page,
  signUpPage,
  signInPage,
  authApi,
}) => {
  const user = RegistrationUserBuilder.aValidUser().build();

  await signUpPage.open();
  await signUpPage.register(user);

  await expect(page).toHaveURL(/\/signin$/);
  await signInPage.signIn(user);

  await expect(page.getByTestId("nav-top-new-transaction")).toBeVisible();

  const response = await authApi.checkAuth();
  expect(response.status()).toBe(200);
  const body: unknown = await response.json();
  expect(body).toMatchObject({
    user: {
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
    },
  });
});
