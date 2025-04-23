import { CredentialsSignin } from "next-auth";

const GENERIC_LOGIN_ERROR_CODE = "An error occurred";
export class GenericLoginError extends CredentialsSignin {
  code = GENERIC_LOGIN_ERROR_CODE;
}

const INVALID_CREDENTIALS_ERROR_CODE = "Invalid credentials";
export class InvalidCredentialsError extends CredentialsSignin {
  code = INVALID_CREDENTIALS_ERROR_CODE;
}

const UNKNOWN_RESPONSE_ERROR_CODE = "Unknown response";
export class UnknownResponseError extends CredentialsSignin {
  code = UNKNOWN_RESPONSE_ERROR_CODE;
}

export function getLoginErrorString(error: string): string {
  console.error("getLoginErrorString", error);
  if (error == INVALID_CREDENTIALS_ERROR_CODE) {
    return "Invalid username or password";
  } else if (error == GENERIC_LOGIN_ERROR_CODE) {
    return "An error occurred during login. Please try again later.";
  } else if (error == UNKNOWN_RESPONSE_ERROR_CODE) {
    return "An unknown error occurred. Please try again later.";
  }
  return "An unknown error occurred. Please try again later.";
}
