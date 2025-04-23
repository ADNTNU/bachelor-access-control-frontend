export type OverrideType<
  T,
  U extends Partial<Record<keyof T | string, unknown>>,
> = {
  [K in keyof U as U[K] extends never ? never : K]: U[K];
} & Omit<T, keyof U>;

export type PickOptional<T, K extends keyof T> = Omit<T, K> &
  Partial<Pick<T, K>>;

export type OptionalToNull<T> = {
  [K in keyof T]: undefined extends T[K] ? T[K] | null : T[K];
};

export type UnionToUnknownKeys<T extends number | string | symbol> = Record<
  T,
  unknown
>;

export type UnknownKeys<T> = {
  [K in keyof T]: unknown;
};

export type RequireKeys<T> = {
  [K in keyof Required<T>]: T[K];
};

type KeysOfTypeUndefined<T> = {
  [K in keyof T]: undefined extends T[K] ? K : never;
}[keyof T];
type OptionalButNotUndefined<T> = {
  [K in KeysOfTypeUndefined<T>]?: Exclude<T[K], undefined>;
};
type ImplRequired<T> = Omit<T, KeysOfTypeUndefined<T>>;
export type OptionalUndefined<T> = ImplRequired<T> & OptionalButNotUndefined<T>;

/**
 * This type is used to encode a DTO to a format that can be sent to the API.
 * Dates are converted to milliseconds since epoch.
 */
export type APIEncode<T> =
  Extract<T, Date> extends never
    ? T extends (infer U)[]
      ? APIEncode<U>[]
      : T extends object
        ? { [K in keyof T]: APIEncode<T[K]> }
        : T
    : Exclude<T, Date> | (Extract<T, Date> extends Date ? number : never);

export type AsJson<T> = T extends boolean | number | string | null
  ? T
  : // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
    T extends Function
    ? never
    : T extends Date
      ? number
      : T extends object
        ? { [K in keyof T]: AsJson<T[K]> }
        : never;

export type DBOWithId<T, U = string> = {
  id: U;
} & T;

export type CompileTimeCheck = Record<string, never>;

export type NextPageProps = {
  params: URLSearchParams;
  searchParams: URLSearchParams;
};

export type WithId = {
  id: object | string | number;
};

export type APIResponse = {
  error?: string;
  message?: string;
};

export type PathImpl<T, K extends keyof T> = K extends string
  ? T[K] extends Record<string, unknown>
    ? // Recursively call PathImpl for nested objects and join with dot notation
      `${K}.${PathImpl<T[K], keyof T[K]>}` | `${K}`
    : `${K}` // If it's not a nested object, just return the key
  : never;

export type PathType<T> = PathImpl<T, keyof T>;
