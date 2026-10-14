import type { RegistrationUser } from "./RegistrationUser";

// POST /users accepts these fields; balance is optional and defaults to 0.
/** Creation payload; contains a plaintext test password only until submission. */
export type ApiUser = RegistrationUser & Readonly<{ balance?: number }>;
