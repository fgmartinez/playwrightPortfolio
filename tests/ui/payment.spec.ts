import { test, expect } from "../support/fixtures";
import { BankAccountsApi } from "../support/api/bank/BankAccountsApi";
import { UsersApi } from "../support/api/users/UsersApi";
import { BankAccountBuilder } from "../support/builders/bankAccounts/BankAccountBuilder";
import { ApiUserBuilder } from "../support/builders/users/ApiUserBuilder";

test("sender and receiver prepare bank accounts with independent sessions", async ({
  page,
  signInPage,
  browserAuthApi,
  isolatedAuthApi,
  usersApi,
  bankAccountsApi,
}) => {
  const receiverInput = ApiUserBuilder.aValidUser().build();
  const senderInput = ApiUserBuilder.aValidUser().withBalance(10_000).build();

  // User creation is public; the isolated request context is still anonymous here.
  const receiver = (await usersApi.create(receiverInput)).body.user;
  const sender = (await usersApi.create(senderInput)).body.user;
  expect(receiver.balance).toBe(0);
  expect(sender.balance).toBe(10_000);

  // The receiver only needs API access. This login authenticates the request fixture.
  await isolatedAuthApi.login(receiverInput);
  const receiverAccount = await bankAccountsApi.create(
    BankAccountBuilder.aValidAccount().build(),
  );
  expect(receiverAccount.body.userId).toBe(receiver.id);

  // This app stores UI auth state in XState/localStorage as well as a session cookie.
  // Signing in through the UI initializes both; page.request then shares its cookie.
  await signInPage.open();
  await signInPage.signIn(senderInput);
  const senderSession = await browserAuthApi.checkAuth();
  expect(senderSession).toMatchObject({
    status: 200,
    body: { user: { id: sender.id } },
  });

  const senderAccount = await new BankAccountsApi(page.request).create(
    BankAccountBuilder.aValidAccount().build(),
  );
  expect(senderAccount.body.userId).toBe(sender.id);

  // The onboarding list was loaded before the API created the sender's account.
  await page.reload();
  await expect(page.getByTestId("sidenav-username")).toContainText(sender.username);
  await expect(page.getByTestId("user-onboarding-dialog")).toBeHidden();

  const receiverProfile = await usersApi.getById(receiver.id);
  const senderProfile = await new UsersApi(page.request).getById(sender.id);
  expect(receiverProfile.body.user.balance).toBe(0);
  expect(senderProfile.body.user.balance).toBe(10_000);
});
