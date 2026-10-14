import type { APIRequestContext, APIResponse } from "@playwright/test";
import { appConfig } from "../../../app.config";
import type { ApiUser } from "../models/ApiUser";

export class UsersApi {
  constructor(private readonly request: APIRequestContext) {}

  create(user: ApiUser): Promise<APIResponse> {
    return this.request.post(new URL("/users", appConfig.apiBaseURL).toString(), {
      data: user,
    });
  }
}
