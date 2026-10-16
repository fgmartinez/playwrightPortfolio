export function object(value: unknown, field: string): Record<string, unknown> {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw new Error(`Invalid response: ${field} must be an object`);
  }
  return value as Record<string, unknown>;
}

export function stringField(value: unknown, field: string): string {
  if (typeof value !== "string") {
    throw new Error(`Invalid response: ${field} must be a string`);
  }
  return value;
}

export function numberField(value: unknown, field: string): number {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new Error(`Invalid response: ${field} must be a finite number`);
  }
  return value;
}
