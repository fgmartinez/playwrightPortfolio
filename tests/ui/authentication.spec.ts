import { test, expect } from "../support/fixtures";
import { ApiUserBuilder } from "../support/builders/ApiUserBuilder";
import { LoginCredentialsBuilder } from "../support/builders/LoginCredentialsBuilder";

test("UI login establishes an authenticated API session", async ({
  page,
  signInPage,
  authApi,
  testUser,
}) => {
  const credentials = LoginCredentialsBuilder.fromUser(testUser).build();

  await signInPage.open();
  await signInPage.signIn(credentials);

  await expect(page.getByTestId("nav-top-new-transaction")).toBeVisible();

  const response = await authApi.checkAuth();
  expect(response.status()).toBe(200);
  const body: unknown = await response.json();
  expect(body).toMatchObject({ user: { username: testUser.username } });
});

test("UI login rejects the wrong password for an existing user", async ({
  signInPage,
  testUser,
}) => {
  const credentials = LoginCredentialsBuilder.fromUser(testUser)
    .withPassword("incorrect-password")
    .build();

  await signInPage.open();
  await signInPage.signIn(credentials);

  await expect(signInPage.errorMessage).toHaveText("Username or password is invalid");
});

test("UI login rejects an unknown username", async ({ signInPage }) => {
  // The generated user is intentionally not created through the API.
  const unknownUser = ApiUserBuilder.aValidUser().build();
  const credentials = LoginCredentialsBuilder.fromUser(unknownUser).build();

  await signInPage.open();
  await signInPage.signIn(credentials);

  await expect(signInPage.errorMessage).toHaveText("Username or password is invalid");
});
