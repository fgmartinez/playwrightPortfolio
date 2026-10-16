import type { Page } from "@playwright/test";

export class TopNav {
  constructor(private readonly page: Page) {}

  async openNewTransactionPage(): Promise<void> {
    await this.page.getByTestId("nav-top-new-transaction").click();
  }

  async openMine(): Promise<void> {
    await this.page.getByTestId("nav-personal-tab").click();
  }
}
