import { test, expect } from "../support/fixtures";
import { BankAccountBuilder } from "../support/builders/bankAccounts/BankAccountBuilder";

test("sender pays receiver and both balances are updated", async ({
  page,
  signInPage,
  sideNav,
  onboardingDialog,
  topNav,
  newTransactionPage,
  transactionsPage,
  browserAuthApi,
  isolatedAuthApi,
  usersApi,
  browserUsersApi,
  browserBankAccountsApi,
  browserTransactionsApi,
  userFactory,
}) => {
  const amount = 25; // UI dollars; the API stores cents.
  const amountInCents = amount * 100;
  const sender = await userFactory.create(10_000);
  const receiver = await userFactory.create(0);
  const note = `Payment to ${receiver.record.username}`;

  expect(sender.record.balance).toBe(10_000);
  expect(receiver.record.balance).toBe(0);

  // The receiver's API context retains its own cookie jar throughout the test.
  await isolatedAuthApi.login({
    username: receiver.input.username,
    password: receiver.input.password,
  });

  await signInPage.open();
  await signInPage.signIn({
    username: sender.input.username,
    password: sender.input.password,
  });
  await expect(sideNav.username).toContainText(sender.record.username);
  expect(await browserAuthApi.checkAuth()).toMatchObject({
    status: 200,
    body: { user: { id: sender.record.id } },
  });

  // The newly registered sender must have a bank account to leave onboarding.
  const account = await browserBankAccountsApi.create(BankAccountBuilder.aValidAccount().build());
  expect(account.body.userId).toBe(sender.record.id);
  await page.reload(); // The onboarding list was loaded before the account was created.
  await expect(sideNav.username).toContainText(sender.record.username);
  await expect(onboardingDialog.dialog).toBeHidden();

  await topNav.openNewTransactionPage();
  await newTransactionPage.waitUntilReady();
  await newTransactionPage.selectReceiver(receiver.record.username, receiver.record.id);
  await newTransactionPage.enterDetails(amount, note);
  await newTransactionPage.submitPayment();
  await expect(newTransactionPage.completionButton).toBeVisible();

  // The wizard advances before its POST resolves; poll the authoritative API state.
  await expect.poll(async () => {
    const transactions = (await browserTransactionsApi.list()).body.results;
    return transactions.find((item) => item.description === note);
  }).toMatchObject({
    senderId: sender.record.id,
    receiverId: receiver.record.id,
    amount: amountInCents,
    description: note,
    status: "complete",
  });

  const transactions = (await browserTransactionsApi.list()).body.results;
  const matching = transactions.filter((item) => item.description === note);
  expect(matching).toHaveLength(1);
  const payment = matching[0];

  const senderProfile = await browserUsersApi.getById(sender.record.id);
  const receiverProfile = await usersApi.getById(receiver.record.id);
  expect(senderProfile.body.user.balance).toBe(sender.record.balance - amountInCents);
  expect(receiverProfile.body.user.balance).toBe(receiver.record.balance + amountInCents);

  await newTransactionPage.returnToTransactions();
  await topNav.openMine();
  await expect(transactionsPage.transactionById(payment.id)).toContainText(note);
});
