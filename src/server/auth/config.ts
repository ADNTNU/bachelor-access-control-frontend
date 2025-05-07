import {
  isLoginResponseBody,
  type LoginRequestBody,
  type RefreshTokenRequestBody,
} from "@models/dto/auth";
import type { RequireKeys } from "@models/utils";
import {
  type DefaultSession,
  type NextAuthConfig,
  type User,
  type Session,
} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import {
  GenericLoginError,
  InvalidCredentialsError,
  UnknownResponseError,
} from "./CredentialSignInErrors";
import assert from "assert";
import { jwtDecode } from "jwt-decode";

// /**
//  * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
//  * object and keep type safety.
//  *
//  * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
//  */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      // id: string;
      // ...other properties
      // role: UserRole;
    } & DefaultSession["user"];
    accessToken?: string; // optional, if you pass it
  }

  interface User {
    accessToken?: string;
    refreshToken?: string;
    id?: string;
    emailVerified: Date | null;
    // ...other properties
    // role: UserRole;
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    // id: string;
    accessToken?: string;
    refreshToken?: string;
    user: Omit<User, "token">;
    expires?: number;
    refreshExp?: number;
  }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authConfig = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        usernameOrEmail: { label: "Username or Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      /**
       * Authorize callback that is called when the user submits the login form.
       * Calls the backend API to authenticate the user and returns the User and JWT token if successful.
       * @returns {User | null} - Returns the user object if authentication is successful, otherwise null.
       */
      async authorize(credentials) {
        let res: Response;

        assert(
          typeof credentials.usernameOrEmail === "string",
          "usernameOrEmail must be a string",
        );
        assert(
          typeof credentials.password === "string",
          "password must be a string",
        );

        try {
          const baseUrl = process.env.BACKEND_INTERNAL_URL;
          res = await fetch(`${baseUrl}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              usernameOrEmail: credentials.usernameOrEmail,
              password: credentials.password,
            } satisfies LoginRequestBody),
          });
        } catch (error) {
          console.error("Error in authorize callback:", error);
          throw new GenericLoginError("Error sending request to server");
        }

        if (res.status === 401) {
          throw new InvalidCredentialsError();
        }

        if (!res.ok) {
          throw new GenericLoginError(
            `Error in response from server. Status: ${res.status}`,
          );
        }

        try {
          const responseBody: unknown = await res.json();

          if (!isLoginResponseBody(responseBody)) {
            console.debug("Unexpected response body:", responseBody);
            throw new UnknownResponseError();
          }

          // const decodedToken = jwtDecode(responseBody.token);

          // console.debug("Token:", responseBody.token);
          // console.debug("Decoded token:", decodedToken);

          if (res.ok && responseBody.token) {
            return {
              accessToken: responseBody.token,
              refreshToken: responseBody.refreshToken,
              // TODO: Check if we should add the more properties to the login response type
              id: responseBody.id.toString(),
              name: responseBody.name,
              email: responseBody.email,
              image: null,
              emailVerified: responseBody.emailVerified
                ? new Date(responseBody.emailVerified)
                : null,
            } satisfies RequireKeys<User>;
          }
        } catch (error) {
          console.debug("Error in authorize callback:", error);
          throw new GenericLoginError("Error parsing response from server");
        }

        return null;
      },
    }),
  ],
  session: {
    strategy: "jwt", // so you can store tokens
  },
  callbacks: {
    /**
     * jwt callback that is called whenever a JWT is created or updated.
     * @returns {JWT} - Returns the JWT object with the user and access token.
     */
    async jwt({ token, user }) {
      console.debug("JWT callback:" /* , { token, user } */);
      // If user just signed in, add user data to the token object
      if (user?.id) {
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.expires = getAccessTokenExpiration(user.accessToken) ?? undefined;
        token.refreshExp =
          getAccessTokenExpiration(user.refreshToken) ?? undefined;
        token.user = {
          id: user.id,
          name: user.name,
          email: user.email,
          emailVerified: user.emailVerified,
        };
      }

      // If token is reused, check if the access token is expired
      // and refresh it if needed
      const isTokenExpired = isAccessTokenExpired(token.expires);

      if (!isTokenExpired) {
        return token;
      }

      if (!token.refreshToken || isAccessTokenExpired(token.refreshExp)) {
        console.debug("Signing out user due to expired refresh token");
        return null; // Automatically sign out the user if no refresh token is available
      }

      try {
        const baseUrl = process.env.BACKEND_INTERNAL_URL;
        const res = await fetch(`${baseUrl}/auth/refresh-token`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            refreshToken: token.refreshToken,
          } satisfies RefreshTokenRequestBody),
        });

        if (!res.ok) {
          throw new Error("Refresh token request failed");
        }

        const data: unknown = await res.json();

        if (!isLoginResponseBody(data)) {
          console.debug("Unexpected response body:", data);
          throw new UnknownResponseError();
        }

        console.log("Refreshed token:", data.token);
        token.accessToken = data.token;
        token.refreshToken = data.refreshToken ?? token.refreshToken; // if backend returns a new refreshToken
        token.expires = getAccessTokenExpiration(data.token) ?? undefined;
        token.refreshExp =
          getAccessTokenExpiration(data.refreshToken) ?? undefined;
        return token;
      } catch (error) {
        console.error("Failed to refresh access token", error);
        return null; // Automatically sign out the user if refresh token fails
      }
    },
    async session({ session, token }) {
      console.debug("Session callback:" /* , { session, token } */);
      session.accessToken = token.accessToken;
      if (token.user.id) {
        session.user = {
          id: token.user.id,
          name: token.user.name,
          email: token.user.email ?? "",
          emailVerified: token.user.emailVerified,
          image: null,
          accessToken: token.accessToken,
          refreshToken: token.refreshToken,
        } satisfies RequireKeys<Session["user"]>;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;

function getAccessTokenExpiration(accessToken?: string): number | null {
  if (!accessToken) return null;
  try {
    const decoded: { exp: number } = jwtDecode(accessToken);
    if (!decoded.exp) return null;
    return decoded.exp; // convert to milliseconds
  } catch {
    return null; // assume expired if can't decode
  }
}

function isAccessTokenExpired(exp?: number): boolean {
  if (!exp) return true; // if no expiration, assume expired
  const now = Date.now();
  const bufferMs = 5000;
  const expired = now + bufferMs > exp * 1000; // convert to milliseconds

  return expired;
}
