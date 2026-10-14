import type { APIRequestContext } from "@playwright/test";
import { appConfig } from "../../../../app.config";
import type { ApiResult } from "../../models/shared/ApiResult";
import type { LoginCredentials } from "../../models/auth/LoginCredentials";
import type { LoginRequest } from "../../models/auth/LoginRequest";
import type { ApiError, UserResponse } from "../../models/users/UserRecord";
import { decodeApiError, decodeUserResponse } from "../users/decodeUser";
import { parseResponse } from "../shared/parseResponse";

/** Status discriminates between the authenticated and anonymous body shapes. */
export type AuthCheckResult = ApiResult<UserResponse, 200> | ApiResult<ApiError, 401>;

/** Session-cookie authentication. Reuse the same context for subsequent API calls. */
export class AuthApi {
  constructor(private readonly request: APIRequestContext) {}

  /** Log in this APIRequestContext; does not authenticate a separate browser context. */
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

  /** Read the current session, including the expected anonymous 401 response. */
  async checkAuth(): Promise<AuthCheckResult> {
    const response = await this.request.get(new URL("/checkAuth", appConfig.apiBaseURL).toString());
    if (response.status() === 200) return parseResponse(response, 200, decodeUserResponse);
    if (response.status() === 401) return parseResponse(response, 401, decodeApiError);
    throw new Error(`GET /checkAuth: unexpected status ${response.status()}`);
  }
}
