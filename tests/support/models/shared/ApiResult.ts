/** Parsed response with a literal HTTP status for status-based narrowing. */
export type ApiResult<T, S extends number = number> = Readonly<{
  status: S;
  body: T;
}>;
