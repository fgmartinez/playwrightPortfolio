import type { Page } from "@playwright/test";
import type { RegistrationUser } from "../models/RegistrationUser";

export class SignUpPage {
  constructor(private readonly page: Page) {}

  async open(): Promise<void> {
    await this.page.goto("/signup");
  }

  async register(user: RegistrationUser): Promise<void> {
    await this.page.getByRole("textbox", { name: "First Name" }).fill(user.firstName);
    await this.page.getByRole("textbox", { name: "Last Name" }).fill(user.lastName);
    await this.page.getByRole("textbox", { name: "Username" }).fill(user.username);
    await this.page.getByLabel("Password", { exact: true }).fill(user.password);
    await this.page.getByLabel("Confirm Password").fill(user.password);
    await this.page.getByRole("button", { name: "Sign Up" }).click();
  }
}
