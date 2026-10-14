import { randomUUID } from "node:crypto";
import type { RegistrationUser } from "../models/RegistrationUser";

export class RegistrationUserBuilder {
  private constructor(private readonly user: RegistrationUser) {}

  static aValidUser(): RegistrationUserBuilder {
    return new RegistrationUserBuilder({
      firstName: "Portfolio",
      lastName: "Tester",
      username: `qa_${randomUUID().replaceAll("-", "").slice(0, 12)}`,
      password: "test-password-123",
    });
  }

  withUsername(username: string): RegistrationUserBuilder {
    return new RegistrationUserBuilder({ ...this.user, username });
  }

  withPassword(password: string): RegistrationUserBuilder {
    return new RegistrationUserBuilder({ ...this.user, password });
  }

  build(): RegistrationUser {
    return Object.freeze({ ...this.user });
  }
}
