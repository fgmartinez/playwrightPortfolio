import type { APIRequestContext } from "@playwright/test";
import { appConfig } from "../../../../app.config";
import type { ApiResult } from "../../models/shared/ApiResult";
import type { TransactionsResponse } from "../../models/transactions/TransactionRecord";
import { parseResponse } from "../shared/parseResponse";
import { decodeTransactionsResponse } from "./decodeTransaction";

/** Reads transactions in the caller's authenticated API session. */
export class TransactionsApi {
  constructor(private readonly request: APIRequestContext) {}

  async list(): Promise<ApiResult<TransactionsResponse, 200>> {
    const response = await this.request.get(new URL("/transactions", appConfig.apiBaseURL).toString());
    return parseResponse(response, 200, decodeTransactionsResponse);
  }
}
