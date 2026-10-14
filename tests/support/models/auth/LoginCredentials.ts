/** Credentials used by UI sign-in or an isolated API session. */
export type LoginCredentials = Readonly<{
  username: string;
  password: string;
}>;
