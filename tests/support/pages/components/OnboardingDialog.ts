import type { Locator, Page } from "@playwright/test";

/** The bank-account onboarding gate shown to new users. */
export class OnboardingDialog {
  readonly dialog: Locator;

  constructor(page: Page) {
    this.dialog = page.getByTestId("user-onboarding-dialog");
  }
}
