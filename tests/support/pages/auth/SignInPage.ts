import type { Locator, Page } from "@playwright/test";
import type { LoginCredentials } from "../../models/auth/LoginCredentials";

/** Sign-in screen interactions; assertions remain in the spec. */
export class SignInPage {
  readonly errorMessage: Locator;

  constructor(private readonly page: Page) {
    this.errorMessage = page.getByTestId("signin-error");
  }

  async open(): Promise<void> {
    await this.page.goto("/signin");
  }

  async signIn({ username, password }: LoginCredentials): Promise<void> {
    await this.page.getByRole("textbox", { name: "Username" }).fill(username);
    await this.page.getByLabel("Password").fill(password);
    await this.page.getByRole("button", { name: "Sign In" }).click();
    await this.page.waitForSelector(("sidenav-username"))
  }
}
