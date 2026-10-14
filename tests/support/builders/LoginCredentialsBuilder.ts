import type { LoginCredentials } from "../models/LoginCredentials";

export class LoginCredentialsBuilder {
  private constructor(private readonly credentials: LoginCredentials) {}

  static forSeededUser(): LoginCredentialsBuilder {
    return new LoginCredentialsBuilder({
      username: "Heath93",
      password: "s3cret",
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
