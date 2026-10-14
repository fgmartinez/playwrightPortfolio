import { test, expect } from "../support/fixtures";

test("UI login establishes an authenticated API session", async ({
  page,
  signInPage,
  authApi,
}) => {
  await signInPage.open();
  await signInPage.signIn("Heath93", "s3cret");

  await expect(page.getByTestId("nav-top-new-transaction")).toBeVisible();

  const response = await authApi.checkAuth();
  expect(response.status()).toBe(200);
  const body: unknown = await response.json();
  expect(body).toMatchObject({ user: { username: "Heath93" } });
});
