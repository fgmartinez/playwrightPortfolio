import type { APIRequestContext } from "@playwright/test";
import { appConfig } from "../../../app.config";
import type { ApiUser } from "../models/ApiUser";
import type { ApiResult } from "../models/ApiResult";
import type { UserResponse } from "../models/UserRecord";
import { decodeUserResponse } from "./decodeUser";
import { parseResponse } from "./parseResponse";

export class UsersApi {
  constructor(private readonly request: APIRequestContext) {}

  async create(user: ApiUser): Promise<ApiResult<UserResponse>> {
    const response = await this.request.post(new URL("/users", appConfig.apiBaseURL).toString(), {
      data: user,
    });
    if (response.status() !== 201) {
      throw new Error(`POST /users: expected 201, received ${response.status()}`);
    }
    return parseResponse(response, decodeUserResponse);
  }
}
