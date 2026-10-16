import type { APIRequestContext } from "@playwright/test";
import { appConfig } from "../../../../app.config";
import type { BankAccountInput } from "../../models/bankAccounts/BankAccountInput";
import type { BankAccountRecord } from "../../models/bankAccounts/BankAccountRecord";
import type { ApiResult } from "../../models/shared/ApiResult";
import { parseResponse } from "../shared/parseResponse";
import { decodeCreatedAccount } from "./decodeBankAccount";

const CREATE_BANK_ACCOUNT = `
  mutation CreateBankAccount(
    $bankName: String!
    $accountNumber: String!
    $routingNumber: String!
  ) {
    createBankAccount(
      bankName: $bankName
      accountNumber: $accountNumber
      routingNumber: $routingNumber
    ) {
      id
      userId
      bankName
    }
  }
`;

/** Creates an account using the session cookie held by this request context. */
export class BankAccountsApi {
  constructor(private readonly request: APIRequestContext) {}

  async create(input: BankAccountInput): Promise<ApiResult<BankAccountRecord, 200>> {
    const response = await this.request.post(new URL("/graphql", appConfig.apiBaseURL).toString(), {
      data: {
        operationName: "CreateBankAccount",
        query: CREATE_BANK_ACCOUNT,
        variables: input,
      },
    });

    return parseResponse(response, 200, decodeCreatedAccount);
  }
}
