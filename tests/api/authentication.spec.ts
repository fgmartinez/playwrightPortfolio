import { test, expect } from "../support/fixtures";

test("an unauthenticated client cannot read the current user", async ({ apiAuth }) => {
  const response = await apiAuth.checkAuth();

  expect(response.status).toBe(401);
  expect(response.body).toMatchObject({ error: "User is unauthorized" });
});
