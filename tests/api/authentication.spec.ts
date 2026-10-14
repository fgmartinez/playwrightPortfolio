import { test, expect } from "../support/fixtures";

test("an unauthenticated client cannot read the current user", async ({ isolatedAuthApi }) => {
  const response = await isolatedAuthApi.checkAuth();

  expect(response.status).toBe(401);
  expect(response.body).toMatchObject({ error: "User is unauthorized" });
});

test("API login authenticates its request context", async ({ isolatedAuthApi, testUser }) => {
  const login = await isolatedAuthApi.login(testUser.input);
  expect(login.status).toBe(200);
  expect(login.body.user.id).toBe(testUser.record.id);

  const session = await isolatedAuthApi.checkAuth();
  expect(session.status).toBe(200);
  expect(session.body).toMatchObject({ user: { id: testUser.record.id } });
});
