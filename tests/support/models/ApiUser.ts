import type { RegistrationUser } from "./RegistrationUser";

// POST /users accepts these fields; balance is optional and defaults to 0.
export type ApiUser = RegistrationUser & Readonly<{ balance?: number }>;
