/** Fields used to verify a payment; the API returns additional presentation fields. */
export type TransactionRecord = Readonly<{
  id: string;
  senderId: string;
  receiverId: string;
  amount: number;
  description: string;
  status: string;
}>;

export type TransactionsResponse = Readonly<{ results: readonly TransactionRecord[] }>;
