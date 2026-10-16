import type { LoginCredentials } from "./LoginCredentials";

/** Wire format sent to POST /login; callers provide only LoginCredentials. */
export type LoginRequest = LoginCredentials & Readonly<{
  type: "LOGIN";
  remember?: readonly ["on"];
}>;
