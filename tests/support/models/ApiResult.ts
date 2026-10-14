export type ApiResult<T, S extends number = number> = Readonly<{
  status: S;
  body: T;
}>;
