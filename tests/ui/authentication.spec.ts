import { test, expect } from "../support/fixtures";
import { LoginCredentialsBuilder } from "../support/builders/LoginCredentialsBuilder";

test("UI login establishes an authenticated API session", async ({
  page,
  signInPage,
  authApi,
}) => {
  const credentials = LoginCredentialsBuilder.forSeededUser().build();

  await signInPage.open();
  await signInPage.signIn(credentials);

  await expect(page.getByTestId("nav-top-new-transaction")).toBeVisible();

  const response = await authApi.checkAuth();
  expect(response.status()).toBe(200);
  const body: unknown = await response.json();
  expect(body).toMatchObject({ user: { username: credentials.username } });
});

for (const scenario of [
  {
    name: "wrong password",
    credentials: LoginCredentialsBuilder.forSeededUser()
      .withPassword("incorrect-password")
      .build(),
  },
  {
    name: "unknown username",
    credentials: LoginCredentialsBuilder.forSeededUser()
      .withUsername("nonexistent-user-portfolio")
      .build(),
  },
]) {
  test(`UI login rejects ${scenario.name}`, async ({ signInPage }) => {
    await signInPage.open();
    await signInPage.signIn(scenario.credentials);

    await expect(signInPage.errorMessage).toHaveText("Username or password is invalid");
  });
}
