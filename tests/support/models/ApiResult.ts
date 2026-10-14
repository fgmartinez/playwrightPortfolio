export type ApiResult<T> = Readonly<{
  status: number;
  body: T;
}>;
