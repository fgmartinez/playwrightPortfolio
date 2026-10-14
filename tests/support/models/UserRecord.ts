// Only fields the suite consumes; the server also returns a password hash.
export type UserRecord = Readonly<{
  id: string;
  uuid: string;
  firstName: string;
  lastName: string;
  username: string;
  balance: number;
  createdAt: string;
  modifiedAt: string;
}>;

export type UserResponse = Readonly<{ user: UserRecord }>;
export type ApiError = Readonly<{ error: string }>;
