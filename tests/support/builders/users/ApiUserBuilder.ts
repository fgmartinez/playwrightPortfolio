import type { ApiUser } from "../../models/users/ApiUser";
import { RegistrationUserBuilder } from "./RegistrationUserBuilder";

/** Immutable variants of the POST /users payload. */
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
