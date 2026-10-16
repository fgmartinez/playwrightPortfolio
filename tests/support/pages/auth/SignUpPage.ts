import type { Page } from "@playwright/test";
import type { RegistrationUser } from "../../models/users/RegistrationUser";

export class SignUpPage {
  constructor(private readonly page: Page) {}

  async open(): Promise<void> {
    await this.page.goto("/signup");
  }

  async register(user: RegistrationUser): Promise<void> {
    await this.page.getByRole("textbox", { name: "First Name" }).fill(user.firstName);
    await this.page.getByRole("textbox", { name: "Last Name" }).fill(user.lastName);
    await this.page.getByRole("textbox", { name: "Username" }).fill(user.username);
    await this.page.locator("input#password").fill(user.password);
    await this.page.locator("input#confirmPassword").fill(user.password);
    await this.page.getByRole("button", { name: "Sign Up" }).click();
  }
}
