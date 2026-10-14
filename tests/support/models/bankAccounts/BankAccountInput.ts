/** Bank account fields accepted by the API and entered in the UI. */
export type BankAccountInput = Readonly<{
  bankName: string;
  routingNumber: string;
  accountNumber: string;
}>;
