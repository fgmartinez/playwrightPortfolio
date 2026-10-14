import type { ApiError, UserResponse } from "../../models/users/UserRecord";

function record(value: unknown): Record<string, unknown> {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw new Error("Expected a JSON object");
  }
  return value as Record<string, unknown>;
}

function stringField(value: unknown, field: string): string {
  if (typeof value !== "string") throw new Error(`Invalid user field: ${field}`);
  return value;
}

/** Validate the fields tests depend on and omit the server-returned password hash. */
export function decodeUserResponse(value: unknown): UserResponse {
  const user = record(record(value).user);
  if (typeof user.balance !== "number") throw new Error("Invalid user field: balance");
  return {
    user: {
      id: stringField(user.id, "id"),
      firstName: stringField(user.firstName, "firstName"),
      lastName: stringField(user.lastName, "lastName"),
      username: stringField(user.username, "username"),
      balance: user.balance,
    },
  };
}

/** Decode the authorization error returned by GET /checkAuth. */
export function decodeApiError(value: unknown): ApiError {
  return { error: stringField(record(value).error, "error") };
}
