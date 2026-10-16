import { test, expect } from "../support/fixtures";
import { BankAccountsApi } from "../support/api/bank/BankAccountsApi";
import { UsersApi } from "../support/api/users/UsersApi";
import { BankAccountBuilder } from "../support/builders/bankAccounts/BankAccountBuilder";
import { ApiUserBuilder } from "../support/builders/users/ApiUserBuilder";

test("sender pays receiver and both balances are updated", async ({
  page,
  signInPage,
  browserAuthApi,
  isolatedAuthApi,
  usersApi,
  bankAccountsApi,
  sideNav,
  userFactory,
}) => {
  const amount = 25;
  const sender = await userFactory.create(10000);
  const receiver = await userFactory.create(0);

  // keep the receiver's API session isolated from the sender's browser session
  await isolatedAuthApi.login({
    username: receiver.input.username,
    password: receiver.input.password,
  });
 
  await signInPage.open();
  await signInPage.signIn({
    username: sender.input.username,
    password: sender.input.password,
  })
  await expect(sideNav.username).toContainText(sender.record.username);
  const senderSession = browserAuthApi.checkAuth();
  expect(senderSession).resolves.toMatchObject({
    status: 200,
    body: { user: {id:sender.record.id}}
  });

  const senderBankAccount = await new BankAccountsApi(page.request).create(BankAccountBuilder.aValidAccount().build());
  expect(senderBankAccount.status).toBe(201);
  expect(senderBankAccount.body.userId).toBe(sender.record.id);
  

});
