import type { Locator, Page } from "@playwright/test";

export class SideNav {
  readonly username: Locator;

  constructor(page: Page) {
    this.username = page.getByTestId("sidenav-username");
  }
}
