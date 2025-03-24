import type { CompileTimeCheck, UnknownKeys } from "../utils";

export type LoginResponseBody = {
  id: string;
  token: string;
  // ...other properties
  // role: UserRole;
}

export function isLoginResponseBody(data: unknown): data is LoginResponseBody {
  if (!data || typeof data !== 'object') {
    return false;
  }

  const { id, token, ...rest } = data as UnknownKeys<LoginResponseBody>;

  const compileTimeCheck: CompileTimeCheck = rest;

  if (Object.keys(compileTimeCheck).length > 0) {
    console.warn('Unexpected keys in LoginResponseBody', compileTimeCheck);
    // return false;
  }

  return (
    'id' in data && typeof id === 'string' &&
    'token' in data && typeof token === 'string'
  );
}

