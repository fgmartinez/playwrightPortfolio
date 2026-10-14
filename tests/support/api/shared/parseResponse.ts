import type { APIResponse } from "@playwright/test";
import type { ApiResult } from "../../models/shared/ApiResult";

/** Check status, then decode unknown JSON; the generic alone cannot validate it. */
export async function parseResponse<T, S extends number>(
  response: APIResponse,
  expectedStatus: S,
  decode: (value: unknown) => T,
): Promise<ApiResult<T, S>> {
  if (response.status() !== expectedStatus) {
    throw new Error(`Expected HTTP ${expectedStatus}, received ${response.status()}`);
  }
  const json: unknown = await response.json();
  return { status: expectedStatus, body: decode(json) };
}
