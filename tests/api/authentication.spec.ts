import { test, expect } from "@playwright/test";
import { AuthApi } from "../support/api/AuthApi";

test("an unauthenticated client cannot read the current user", async ({ request }) => {
  // The standalone request fixture has its own cookie jar.
  const authApi = new AuthApi(request, process.env.API_BASE_URL ?? "http://localhost:3001");
  const response = await authApi.checkAuth();

  expect(response.status()).toBe(401);
  expect(await response.json()).toMatchObject({ error: "User is unauthorized" });
});
