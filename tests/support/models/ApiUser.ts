import type { RegistrationUser } from "./RegistrationUser";

export type ApiUser = RegistrationUser & Readonly<{
  email: string;
  phoneNumber: string;
  avatar: string;
  balance: number;
  defaultPrivacyLevel: "public" | "private" | "contacts";
}>;
