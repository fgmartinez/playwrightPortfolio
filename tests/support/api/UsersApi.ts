import type { APIRequestContext, APIResponse } from "@playwright/test";
import type { ApiUser } from "../models/ApiUser";

export class UsersApi {
  constructor(
    private readonly request: APIRequestContext,
    private readonly baseURL: string,
  ) {}

  create(user: ApiUser): Promise<APIResponse> {
    return this.request.post(new URL("/users", this.baseURL).toString(), {
      data: user,
    });
  }
}
