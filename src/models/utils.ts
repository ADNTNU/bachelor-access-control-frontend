export type UnknownKeys<T> = {
  [K in keyof T]: unknown;
};

export type CompileTimeCheck = Record<string, never>;

export type RequireKeys<T> = {
  [K in keyof Required<T>]: T[K];
};
