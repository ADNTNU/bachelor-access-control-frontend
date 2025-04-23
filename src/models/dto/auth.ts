import type { CompileTimeCheck, UnknownKeys } from "../utils";

export type LoginResponseBody = {
  token: string;
  tokenType: "Bearer";
  id: number;
  username: string;
  name: string;
  roles: [];
  // ...other properties
  // role: UserRole;
};

export function isLoginResponseBody(data: unknown): data is LoginResponseBody {
  if (!data || typeof data !== "object") {
    return false;
  }

  const { token, tokenType, id, username, name, roles, ...rest } =
    data as UnknownKeys<LoginResponseBody>;

  const compileTimeCheck: CompileTimeCheck = rest;

  if (Object.keys(compileTimeCheck).length > 0) {
    console.warn("Unexpected keys in LoginResponseBody", compileTimeCheck);
    // return false;
  }

  return (
    "token" in data &&
    typeof token === "string" &&
    "tokenType" in data &&
    typeof tokenType === "string" &&
    tokenType === "Bearer" &&
    "id" in data &&
    typeof id === "number" &&
    "username" in data &&
    typeof username === "string" &&
    "name" in data &&
    typeof name === "string" &&
    "roles" in data &&
    Array.isArray(roles) &&
    roles.every((role) => typeof role === "string")
  );
}
