import { test, expect } from "../support/fixtures";
import { ApiUserBuilder } from "../support/builders/users/ApiUserBuilder";
import { BankAccountBuilder } from "../support/builders/bankAccounts/BankAccountBuilder";
import { BankAccountsApi } from "../support/api/bank/BankAccountsApi";

test("two users create bank accounts in independent sessions", async ({
  page,
  browserAuthApi,
  isolatedAuthApi,
  usersApi,
  bankAccountsApi,
}) => {
  const receiverInput = ApiUserBuilder.aValidUser().build();
  const senderInput = ApiUserBuilder.aValidUser()
    .withBalance(10_000)
    .build();

  // Both users are created before the isolated API context logs in.
  const receiver = (await usersApi.create(receiverInput)).body.user;
  const sender = (await usersApi.create(senderInput)).body.user;

  // Each login stores its cookie in a different context.
  const receiverLogin = await isolatedAuthApi.login(receiverInput);
  const senderLogin = await browserAuthApi.login(senderInput);

  expect(receiverLogin.body.user.id).toBe(receiver.id);
  expect(senderLogin.body.user.id).toBe(sender.id);

  const receiverAccount = await bankAccountsApi.create(
    BankAccountBuilder.aValidAccount().build(),
  );

  const senderBankAccountsApi = new BankAccountsApi(page.request);
  const senderAccount = await senderBankAccountsApi.create(
    BankAccountBuilder.aValidAccount().build(),
  );

  expect(receiverAccount.body.userId).toBe(receiver.id);
  expect(senderAccount.body.userId).toBe(sender.id);

  await page.goto("/");
  await expect(page.getByTestId("sidenav-username"))
    .toContainText(sender.username);
  await expect(page.getByTestId("user-onboarding-dialog"))
    .toBeHidden();
});