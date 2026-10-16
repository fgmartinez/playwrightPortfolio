import type { Locator, Page } from "@playwright/test";

export class OnboardingDialog {
  readonly dialog: Locator;

  constructor(page: Page) {
    this.dialog = page.getByTestId("user-onboarding-dialog");
  }
}
