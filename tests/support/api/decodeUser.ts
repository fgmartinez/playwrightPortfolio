import type { ApiError, UserRecord, UserResponse } from "../models/UserRecord";

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

export function decodeUserResponse(value: unknown): UserResponse {
  const user = record(record(value).user);
  if (typeof user.balance !== "number") throw new Error("Invalid user field: balance");
  return {
    user: {
      id: stringField(user.id, "id"),
      uuid: stringField(user.uuid, "uuid"),
      firstName: stringField(user.firstName, "firstName"),
      lastName: stringField(user.lastName, "lastName"),
      username: stringField(user.username, "username"),
      balance: user.balance,
      createdAt: stringField(user.createdAt, "createdAt"),
      modifiedAt: stringField(user.modifiedAt, "modifiedAt"),
    },
  };
}

export function decodeApiError(value: unknown): ApiError {
  return { error: stringField(record(value).error, "error") };
}
