import type { APIRequestContext, APIResponse } from "@playwright/test";
import { appConfig } from "../../../app.config";

export class AuthApi {
  constructor(private readonly request: APIRequestContext) {}

  checkAuth(): Promise<APIResponse> {
    return this.request.get(new URL("/checkAuth", appConfig.apiBaseURL).toString());
  }
}
