import type { Page } from "@playwright/test";

export class SignInPage {
  constructor(private readonly page: Page) {}

  async open(): Promise<void> {
    await this.page.goto("/signin");
  }

  async signIn(username: string, password: string): Promise<void> {
    await this.page.getByRole("textbox", { name: "Username" }).fill(username);
    await this.page.getByLabel("Password").fill(password);
    await this.page.getByRole("button", { name: "Sign In" }).click();
  }
}
