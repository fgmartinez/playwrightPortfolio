import { Locator, Page } from "@playwright/test";

// NewTransactionPage.ts
export class NewTransactionPage {
  constructor(private readonly page: Page) {}

  async waitUntilReady(): Promise<void> {
    await this.page.getByTestId("user-list-search-input").waitFor({
      state: "visible",
    });
  }

 async selectReceiver(username: string, userId: string): Promise<void> {
    await this.page.getByTestId("user-list-search-input").fill(username);
    await this.page.getByTestId(`user-list-item-${userId}`).click();
  }

  async enterDetails(amount: number, note: string): Promise<void> {
    await this.page.getByPlaceholder("Amount").fill(String(amount));
    await this.page.getByPlaceholder("Add a note").fill(note);
  }

  async submitPayment(): Promise<void> {
    await this.page.getByTestId("transaction-create-submit-payment").click();
  }

  async submitRequest(): Promise<void> {
    await this.page.getByTestId("transaction-create-submit-request").click();
  }

  get completionButton(): Locator {
    return this.page.getByTestId("new-transaction-return-to-transactions");
  }
}