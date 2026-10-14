import type { APIRequestContext, APIResponse } from "@playwright/test";

export class AuthApi {
  constructor(
    private readonly request: APIRequestContext,
    private readonly baseURL: string,
  ) {}

  checkAuth(): Promise<APIResponse> {
    return this.request.get(new URL("/checkAuth", this.baseURL).toString());
  }
}
