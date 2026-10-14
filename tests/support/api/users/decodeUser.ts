import type { ApiError, UserResponse } from "../../models/users/UserRecord";
import { numberField, object, stringField } from "../shared/decodeJson";

/** Validate the fields tests depend on and omit the server-returned password hash. */
export function decodeUserResponse(value: unknown): UserResponse {
  const user = object(object(value, "response").user, "user");
  return {
    user: {
      id: stringField(user.id, "user.id"),
      firstName: stringField(user.firstName, "user.firstName"),
      lastName: stringField(user.lastName, "user.lastName"),
      username: stringField(user.username, "user.username"),
      balance: numberField(user.balance, "user.balance"),
    },
  };
}

/** Decode the authorization error returned by GET /checkAuth. */
export function decodeApiError(value: unknown): ApiError {
  return { error: stringField(object(value, "response").error, "error") };
}
