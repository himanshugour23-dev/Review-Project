import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    dbUserId?: string;
  }

  interface Session {
    user: {
      id: string;
      provider?: string;
      providerId?: string;
      role ?: "admin" | "user";
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    userId?: string;
    provider?: string;
    providerId?: string;
  }
}

export {};
