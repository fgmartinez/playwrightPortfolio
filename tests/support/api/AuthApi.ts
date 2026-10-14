import type { APIRequestContext } from "@playwright/test";
import { appConfig } from "../../../app.config";
import type { ApiResult } from "../models/ApiResult";
import type { LoginRequest } from "../models/LoginRequest";
import type { ApiError, UserResponse } from "../models/UserRecord";
import { decodeApiError, decodeUserResponse } from "./decodeUser";
import { parseResponse } from "./parseResponse";

export class AuthApi {
  constructor(private readonly request: APIRequestContext) {}

  async login(credentials: LoginRequest): Promise<ApiResult<UserResponse>> {
    const response = await this.request.post(new URL("/login", appConfig.apiBaseURL).toString(), {
      data: credentials,
    });
    if (response.status() !== 200) {
      throw new Error(`POST /login: expected 200, received ${response.status()}`);
    }
    return parseResponse(response, decodeUserResponse);
  }

  async checkAuth(): Promise<ApiResult<UserResponse | ApiError>> {
    const response = await this.request.get(new URL("/checkAuth", appConfig.apiBaseURL).toString());
    if (response.status() === 200) return parseResponse(response, decodeUserResponse);
    if (response.status() === 401) return parseResponse(response, decodeApiError);
    throw new Error(`GET /checkAuth: unexpected status ${response.status()}`);
  }
}
