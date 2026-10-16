import { test as base } from "@playwright/test";
import { AuthApi } from "./api/auth/AuthApi";
import { BankAccountsApi } from "./api/bank/BankAccountsApi";
import { TransactionsApi } from "./api/transactions/TransactionsApi";
import { UsersApi } from "./api/users/UsersApi";
import { ApiUserBuilder } from "./builders/users/ApiUserBuilder";
import type { ApiUser } from "./models/users/ApiUser";
import type { UserRecord } from "./models/users/UserRecord";
import { SignInPage } from "./pages/auth/SignInPage";
import { SignUpPage } from "./pages/auth/SignUpPage";
import { SideNav } from "./pages/components/SideNav";
import { OnboardingDialog } from "./pages/components/OnboardingDialog";
import { TopNav } from "./pages/components/TopNav";
import { NewTransactionPage } from "./pages/payments/NewTransactionPage";
import { TransactionsPage } from "./pages/payments/TransactionsPage";

/** A test-owned user: original credentials plus server-generated identity. */
export type TestUser = Readonly<{ input: ApiUser; record: UserRecord }>;
export type UserFactory = {
  create: (balance?: number) => Promise<TestUser>;
};

type TestFixtures = {
  signInPage: SignInPage;
  signUpPage: SignUpPage;
  browserAuthApi: AuthApi;
  isolatedAuthApi: AuthApi;
  bankAccountsApi: BankAccountsApi;
  usersApi: UsersApi;
  browserBankAccountsApi: BankAccountsApi;
  browserUsersApi: UsersApi;
  browserTransactionsApi: TransactionsApi;
  testUser: TestUser;
  userFactory: UserFactory;
  sideNav: SideNav;
  onboardingDialog: OnboardingDialog;
  topNav: TopNav;
  newTransactionPage: NewTransactionPage;
  transactionsPage: TransactionsPage;
};

/** Test-scoped dependencies. Fixtures run only when a test requests them. */
export const test = base.extend<TestFixtures>({
  signInPage: async ({ page }, use) => {
    await use(new SignInPage(page));
  },
  signUpPage: async ({ page }, use) => {
    await use(new SignUpPage(page));
  },
  sideNav: async ({ page }, use) => {
    await use(new SideNav(page));
  },
  onboardingDialog: async ({ page }, use) => {
    await use(new OnboardingDialog(page));
  },
  topNav: async ({ page }, use) => {
    await use(new TopNav(page));
  },
  newTransactionPage: async ({ page }, use) => {
    await use(new NewTransactionPage(page));
  },
  transactionsPage: async ({ page }, use) => {
    await use(new TransactionsPage(page));
  },
  browserAuthApi: async ({ page }, use) => {
    // Shares browser cookies; an API login alone does not initialize the app's UI auth state.
    await use(new AuthApi(page.request));
  },
  isolatedAuthApi: async ({ request }, use) => {
    // Independent cookie jar for a user who only needs API access.
    await use(new AuthApi(request));
  },
  usersApi: async ({ request }, use) => {
    await use(new UsersApi(request));
  },
  bankAccountsApi: async ({ request }, use) => {
    await use(new BankAccountsApi(request));
  },
  browserBankAccountsApi: async ({ page }, use) => {
    await use(new BankAccountsApi(page.request));
  },
  browserUsersApi: async ({ page }, use) => {
    await use(new UsersApi(page.request));
  },
  browserTransactionsApi: async ({ page }, use) => {
    await use(new TransactionsApi(page.request));
  },
  testUser: async ({ usersApi }, use) => {
    const input = ApiUserBuilder.aValidUser().build();
    const created = await usersApi.create(input);
    await use({ input, record: created.body.user });
  },

  userFactory: async ({ usersApi }, use) => {
    const factory: UserFactory = {
      create: async (balance = 0) => {
        const input = ApiUserBuilder.aValidUser().withBalance(balance).build();
        const created = await usersApi.create(input);
        return { input, record: created.body.user };
      },
    };
    await use(factory);
  },
});

export { expect } from "@playwright/test";
