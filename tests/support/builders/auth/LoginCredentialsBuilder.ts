import type { LoginCredentials } from "../../models/auth/LoginCredentials";

/** Derive login credentials from an existing user and vary one field at a time. */
export class LoginCredentialsBuilder {
  private constructor(private readonly credentials: LoginCredentials) {}

  static fromUser(user: LoginCredentials): LoginCredentialsBuilder {
    return new LoginCredentialsBuilder({
      username: user.username,
      password: user.password,
    });
  }

  withUsername(username: string): LoginCredentialsBuilder {
    return new LoginCredentialsBuilder({ ...this.credentials, username });
  }

  withPassword(password: string): LoginCredentialsBuilder {
    return new LoginCredentialsBuilder({ ...this.credentials, password });
  }

  build(): LoginCredentials {
    return Object.freeze({ ...this.credentials });
  }
}
