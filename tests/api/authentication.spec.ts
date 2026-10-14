import { test, expect } from "../support/fixtures";

test("an unauthenticated client cannot read the current user", async ({ authApi }) => {
  // The browser starts unauthenticated; its request context shares its cookies.
  const response = await authApi.checkAuth();

  expect(response.status()).toBe(401);
  expect(await response.json()).toMatchObject({ error: "User is unauthorized" });
});
