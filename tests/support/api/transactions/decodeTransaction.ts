import type { TransactionRecord, TransactionsResponse } from "../../models/transactions/TransactionRecord";
import { numberField, object, stringField } from "../shared/decodeJson";

function decodeTransaction(value: unknown): TransactionRecord {
  const transaction = object(value, "transaction");
  return {
    id: stringField(transaction.id, "transaction.id"),
    senderId: stringField(transaction.senderId, "transaction.senderId"),
    receiverId: stringField(transaction.receiverId, "transaction.receiverId"),
    amount: numberField(transaction.amount, "transaction.amount"),
    description: stringField(transaction.description, "transaction.description"),
    status: stringField(transaction.status, "transaction.status"),
  };
}

export function decodeTransactionsResponse(value: unknown): TransactionsResponse {
  const results = object(value, "response").results;
  if (!Array.isArray(results)) {
    throw new Error("Invalid response: results must be an array");
  }
  return { results: results.map((item: unknown) => decodeTransaction(item)) };
}
