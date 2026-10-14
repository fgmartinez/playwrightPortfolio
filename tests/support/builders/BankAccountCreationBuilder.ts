// tests/support/builders/BankAccountBuilder.ts
import { randomInt } from "node:crypto";
import type { BankAccountInput } from "../models/BankAccountInput";

export class BankAccountBuilder {
  private constructor(private readonly account: BankAccountInput) {}

  static aValidAccount(): BankAccountBuilder {
    return new BankAccountBuilder({
      bankName: "Portfolio Bank",
      routingNumber: "123456789",
      accountNumber: String(randomInt(1_000_000_000, 10_000_000_000)),
    });
  }

  withBankName(bankName: string): BankAccountBuilder {
    return new BankAccountBuilder({ ...this.account, bankName });
  }

  withRoutingNumber(routingNumber: string): BankAccountBuilder {
    return new BankAccountBuilder({ ...this.account, routingNumber });
  }

  withAccountNumber(accountNumber: string): BankAccountBuilder {
    return new BankAccountBuilder({ ...this.account, accountNumber });
  }

  build(): BankAccountInput {
    return Object.freeze({ ...this.account });
  }
}