import { isLoginResponseBody } from "@models/backend/auth";
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
    user: Omit<User, "token">;
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
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      /**
       * Authorize callback that is called when the user submits the login form.
       * Calls the backend API to authenticate the user and returns the User and JWT token if successful.
       * @returns {User | null} - Returns the user object if authentication is successful, otherwise null.
       */
      async authorize(credentials) {
        let res: Response;
        try {
          const baseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;
          res = await fetch(`${baseUrl}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              username: credentials?.username,
              password: credentials?.password,
            }),
          });
        } catch (error) {
          console.error("Error in authorize callback:", error);
          throw new GenericLoginError();
        }

        if (res.status === 401) {
          throw new InvalidCredentialsError();
        }

        if (!res.ok) {
          throw new GenericLoginError();
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
              // TODO: Check if we should add the more properties to the login response type
              id: responseBody.id.toString(),
              name: responseBody.name,
              email: null,
              image: null,
              emailVerified: null,
            } satisfies RequireKeys<User>;
          }
        } catch (error) {
          console.debug("Error in authorize callback:", error);
          throw new GenericLoginError();
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
      // console.debug("JWT callback:", { token, user });
      if (user?.id) {
        token.accessToken = user.accessToken;
        token.user = {
          id: user.id,
          name: user.name,
          email: user.email,
          emailVerified: user.emailVerified,
        };
      }
      return token;
    },
    async session({ session, token }) {
      // console.debug("Session callback:", { session, token });
      session.accessToken = token.accessToken;
      if (token.user.id) {
        session.user = {
          id: token.user.id,
          name: token.user.name,
          email: token.user.email ?? "",
          emailVerified: token.user.emailVerified,
          image: null,
          accessToken: token.accessToken,
        } satisfies RequireKeys<Session["user"]>;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
