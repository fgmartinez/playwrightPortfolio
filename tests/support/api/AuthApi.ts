import type { APIRequestContext } from "@playwright/test";
import { appConfig } from "../../../app.config";
import type { ApiResult } from "../models/ApiResult";
import type { LoginCredentials } from "../models/LoginCredentials";
import type { LoginRequest } from "../models/LoginRequest";
import type { ApiError, UserResponse } from "../models/UserRecord";
import { decodeApiError, decodeUserResponse } from "./decodeUser";
import { parseResponse } from "./parseResponse";

export type AuthCheckResult = ApiResult<UserResponse, 200> | ApiResult<ApiError, 401>;

export class AuthApi {
  constructor(private readonly request: APIRequestContext) {}

  async login(credentials: LoginCredentials, remember = false): Promise<ApiResult<UserResponse, 200>> {
    const payload: LoginRequest = {
      type: "LOGIN",
      ...credentials,
      ...(remember ? { remember: ["on"] as const } : {}),
    };
    const response = await this.request.post(new URL("/login", appConfig.apiBaseURL).toString(), {
      data: payload,
    });
    return parseResponse(response, 200, decodeUserResponse);
  }

  async checkAuth(): Promise<AuthCheckResult> {
    const response = await this.request.get(new URL("/checkAuth", appConfig.apiBaseURL).toString());
    if (response.status() === 200) return parseResponse(response, 200, decodeUserResponse);
    if (response.status() === 401) return parseResponse(response, 401, decodeApiError);
    throw new Error(`GET /checkAuth: unexpected status ${response.status()}`);
  }
}
