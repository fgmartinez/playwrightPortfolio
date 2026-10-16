import { expect, test } from "../support/fixtures";
import { AuthApi } from "../support/api/auth/AuthApi";
import { appConfig } from "../../app.config";
import { UsersApi } from "../support/api/users/UsersApi";

test("a user cannot read another user's private profile", async ({
  request,
  playwright,
  userFactory,
  usersApi,
}) => {
  const owner = await userFactory.create();
  const other = await userFactory.create();

  const otherContext = await playwright.request.newContext({
    baseURL: appConfig.apiBaseURL,
  });

  try {
    await new AuthApi(request).login({
      username: owner.input.username,
      password: owner.input.password,
    });
    await new AuthApi(otherContext).login({
      username: other.input.username,
      password: other.input.password,
    });

    const ownProfile = await usersApi.getById(owner.record.id);
    expect(ownProfile.status).toBe(200);
    expect(ownProfile.body.user.id).toBe(owner.record.id);

    const denied = await request.get(
      new URL(`/users/${other.record.id}`, appConfig.apiBaseURL).toString(),
    );
    expect(denied.status()).toBe(401);
    expect(await denied.json()).toMatchObject({ error: "Unauthorized" });

    const otherProfile = await new UsersApi(otherContext).getById(other.record.id);
    expect(otherProfile.status).toBe(200);
    expect(otherProfile.body.user.id).toBe(other.record.id);
  } finally {
    await otherContext.dispose();
  }
});
