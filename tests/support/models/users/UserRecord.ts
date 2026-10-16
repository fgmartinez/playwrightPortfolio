/** Selected server fields; the response's password hash is intentionally discarded. */
export type UserRecord = Readonly<{
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  balance: number;
}>;

/** Successful user payload shared by creation, login and session endpoints. */
export type UserResponse = Readonly<{ user: UserRecord }>;
/** Error payload returned by the session check when unauthenticated. */
export type ApiError = Readonly<{ error: string }>;
