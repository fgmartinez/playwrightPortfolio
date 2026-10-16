import { test, expect } from "../support/fixtures";
import { BankAccountBuilder } from "../support/builders/bankAccounts/BankAccountBuilder";

test("an authenticated user can create their own bank account", async ({
  isolatedAuthApi,
  bankAccountsApi,
  testUser,
}) => {
  await isolatedAuthApi.login(testUser.input);
  const input = BankAccountBuilder.aValidAccount().build();

  const created = await bankAccountsApi.create(input);

  expect(created.status).toBe(200);
  expect(created.body).toMatchObject({
    id: expect.any(String),
    userId: testUser.record.id,
    bankName: input.bankName,
  });
});
