import type { APIRequestContext } from "@playwright/test";
import { appConfig } from "../../../../app.config";
import type { ApiUser } from "../../models/users/ApiUser";
import type { ApiResult } from "../../models/shared/ApiResult";
import type { UserResponse } from "../../models/users/UserRecord";
import { decodeUserResponse } from "./decodeUser";
import { parseResponse } from "../shared/parseResponse";

/** HTTP operations for user resources; accepts an isolated or authenticated context. */
export class UsersApi {
  constructor(private readonly request: APIRequestContext) {}

  /** Create a user without authenticating the request context. */
  async create(user: ApiUser): Promise<ApiResult<UserResponse, 201>> {
    const response = await this.request.post(new URL("/users", appConfig.apiBaseURL).toString(), {
      data: user,
    });
    return parseResponse(response, 201, decodeUserResponse);
  }
}
