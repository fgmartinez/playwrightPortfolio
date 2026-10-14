import type { ApiUser } from "../models/ApiUser";
import { RegistrationUserBuilder } from "./RegistrationUserBuilder";

export class ApiUserBuilder {
  private constructor(private readonly user: ApiUser) {}

  static aValidUser(): ApiUserBuilder {
    return new ApiUserBuilder(RegistrationUserBuilder.aValidUser().build());
  }

  withBalance(balance: number): ApiUserBuilder {
    return new ApiUserBuilder({ ...this.user, balance });
  }

  build(): ApiUser {
    return Object.freeze({ ...this.user });
  }
}
