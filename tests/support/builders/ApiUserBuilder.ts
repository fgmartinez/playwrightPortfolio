import type { ApiUser } from "../models/ApiUser";
import { RegistrationUserBuilder } from "./RegistrationUserBuilder";

export class ApiUserBuilder {
  private constructor(private readonly user: ApiUser) {}

  static aValidUser(): ApiUserBuilder {
    const identity = RegistrationUserBuilder.aValidUser().build();
    return new ApiUserBuilder({
      ...identity,
      email: `${identity.username}@example.test`,
      phoneNumber: "555-0100",
      avatar: "https://api.dicebear.com/9.x/pixel-art/svg?seed=Portfolio",
      balance: 10_000,
      defaultPrivacyLevel: "private",
    });
  }

  withBalance(balance: number): ApiUserBuilder {
    return new ApiUserBuilder({ ...this.user, balance });
  }

  withPrivacy(level: ApiUser["defaultPrivacyLevel"]): ApiUserBuilder {
    return new ApiUserBuilder({ ...this.user, defaultPrivacyLevel: level });
  }

  build(): ApiUser {
    return Object.freeze({ ...this.user });
  }
}
