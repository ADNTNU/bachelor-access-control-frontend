import { isLoginResponseBody } from "@models/backend/auth";
import type { RequireKeys } from "@models/utils";
import { type DefaultSession, type NextAuthConfig, type User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

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
    id?: string;
    token?: string;
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
      name: 'Credentials',
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        // Call Spring Boot backend
        const res = await fetch("http://localhost:8080/api/auth/login", { //TODO: Add real endpoint to backend login
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: credentials?.username,
            password: credentials?.password,
          }),
        })

        const responseBody: unknown = await res.json();

        if (res.ok && isLoginResponseBody(responseBody) && responseBody.token) {
          return {
            token: responseBody.token,
            id: responseBody.id,
            // TODO: Check if we should add the more properties to the login response type
            name: null,
            email: null,
            image: null,
            emailVerified: null,
          } satisfies RequireKeys<User>;
        }

        return null
      },
    }),
    /**
     * ...add more providers here.
     *
     * Most other providers require a bit more work than the Discord provider. For example, the
     * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
     * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
     *
     * @see https://next-auth.js.org/providers/github
     */
  ],
  session: {
    strategy: "jwt", // so you can store tokens
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user?.id) {
        token.accessToken = user.token
        token.user = {
          id: user.id,
          name: user.name,
          email: user.email,
          emailVerified: user.emailVerified,
        }
      }
      return token
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken
      if (token.user.id && token.user.email) {
        session.user = {
          id: token.user.id,
          name: token.user.name,
          email: token.user.email,
          emailVerified: token.user.emailVerified,
          image: null,
          token: undefined,
        } satisfies RequireKeys<User>;
      }
      return session
    }
  },
} satisfies NextAuthConfig;
