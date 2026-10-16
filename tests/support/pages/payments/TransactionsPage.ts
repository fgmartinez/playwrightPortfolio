import type { Locator, Page } from "@playwright/test";

/** The transactions feed; callers own assertions about its contents. */
export class TransactionsPage {
  constructor(private readonly page: Page) {}

  transactionById(id: string): Locator {
    return this.page.getByTestId(`transaction-item-${id}`);
  }
}
