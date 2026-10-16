import { expect, test } from "../support/fixtures";
import { AuthApi } from "../support/api/auth/AuthApi";
import { appConfig } from "../../app.config";
import { UsersApi } from "../support/api/users/UsersApi";

test('a user cannot read another users private profile', async ({ request, playwright, userFactory, usersApi }) => {
    const user1 = await userFactory.create(1000);
    const user2 = await userFactory.create(1000);


    const user2Context = await playwright.request.newContext({
        baseURL: appConfig.apiBaseURL,
    });

    try {
        const user1Auth = new AuthApi(request);
        const user2Auth = new AuthApi(user2Context);

        await user1Auth.login({ username: user1.input.username, password: user1.input.password });
        await user2Auth.login({ username: user2.input.username, password: user2.input.password });

        const ownProfile = await usersApi.getById(user1.record.id);
        expect(ownProfile.status).toBe(200);
        expect(ownProfile.body.user.id).toBe(user1.record.id);

        const denied = await request.get(
            new URL(`/users/${user2.record.id}`, appConfig.apiBaseURL).toString(),
        );
        expect(denied.status()).toBe(401);
        expect(await denied.json()).toMatchObject({ error: "Unauthorized" });

        const user2Profile = new UsersApi(user2Context);
        const user2OwnProfile = await user2Profile.getById(user2.record.id);
        expect(user2OwnProfile.status).toBe(200);
        expect(user2OwnProfile.body.user.id).toBe(user2.record.id);

    } finally {
        await user2Context.dispose();
    }
});