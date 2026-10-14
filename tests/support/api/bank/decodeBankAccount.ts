import type { BankAccountRecord } from "../../models/bankAccounts/BankAccountRecord";
import { object, stringField } from "../shared/decodeJson";

export function decodeCreatedAccount(value: unknown): BankAccountRecord {
  const response = object(value, "response");
  if (Array.isArray(response.errors) && response.errors.length > 0) {
    throw new Error("CreateBankAccount returned GraphQL errors");
  }

  const account = object(object(response.data, "data").createBankAccount, "data.createBankAccount");
  return {
    id: stringField(account.id, "data.createBankAccount.id"),
    userId: stringField(account.userId, "data.createBankAccount.userId"),
    bankName: stringField(account.bankName, "data.createBankAccount.bankName"),
  };
}
