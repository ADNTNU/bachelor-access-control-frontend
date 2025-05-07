import type { CompileTimeCheck, UnknownKeys } from "../utils";

export type LoginRequestBody = {
  usernameOrEmail: string;
  password: string;
};

export type LoginResponseBody = {
  token: string;
  refreshToken: string;
  tokenType: "Bearer";
  id: number;
  email: string;
  username: string;
  emailVerified?: number;
  name: string;
  roles: [];
  // ...other properties
  // role: UserRole;
};

export function isLoginResponseBody(data: unknown): data is LoginResponseBody {
  if (!data || typeof data !== "object") {
    return false;
  }

  const {
    token,
    refreshToken,
    tokenType,
    id,
    email,
    username,
    emailVerified,
    name,
    roles,
    ...rest
  } = data as UnknownKeys<LoginResponseBody>;

  const compileTimeCheck: CompileTimeCheck = rest;

  if (Object.keys(compileTimeCheck).length > 0) {
    console.warn("Unexpected keys in LoginResponseBody", compileTimeCheck);
    // return false;
  }

  return (
    "token" in data &&
    typeof token === "string" &&
    "refreshToken" in data &&
    typeof refreshToken === "string" &&
    "tokenType" in data &&
    typeof tokenType === "string" &&
    tokenType === "Bearer" &&
    "id" in data &&
    typeof id === "number" &&
    "email" in data &&
    typeof email === "string" &&
    "username" in data &&
    typeof username === "string" &&
    "emailVerified" in data &&
    (typeof emailVerified === "number" || emailVerified === undefined) &&
    "name" in data &&
    typeof name === "string" &&
    "roles" in data &&
    Array.isArray(roles) &&
    roles.every((role) => typeof role === "string")
  );
}

export type RequestPasswordResetRequestBody = {
  email: string;
};

export type RefreshTokenRequestBody = {
  refreshToken: string;
};
