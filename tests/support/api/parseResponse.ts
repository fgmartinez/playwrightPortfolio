import type { APIResponse } from "@playwright/test";
import type { ApiResult } from "../models/ApiResult";

// JSON arrives from the network as unknown. A generic alone cannot validate it.
export async function parseResponse<T>(
  response: APIResponse,
  decode: (value: unknown) => T,
): Promise<ApiResult<T>> {
  const json: unknown = await response.json();
  return { status: response.status(), body: decode(json) };
}
