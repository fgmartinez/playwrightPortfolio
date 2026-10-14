import type { LoginCredentials } from "./LoginCredentials";

export type LoginRequest = LoginCredentials & Readonly<{
  type: "LOGIN";
  remember?: readonly ["on"];
}>;
