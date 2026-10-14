export const appConfig = {
  uiBaseURL: process.env.UI_BASE_URL ?? "http://localhost:3000",
  apiBaseURL: process.env.API_BASE_URL ?? "http://localhost:3001",
} as const;
