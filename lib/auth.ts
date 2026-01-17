import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";
import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";


console.log("NEXTAUTH_SECRET length =", process.env.NEXTAUTH_SECRET?.length);

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async signIn({ user, account }) {
      try {
        await connectToDatabase();

        const provider = account?.provider as "google" | "github";
        const providerId = account?.providerAccountId;

        if (!provider || !providerId) return false;

        let dbUser = await User.findOne({ provider, providerId });

        if (!dbUser) {
          dbUser = await User.create({
            provider,
            providerId,
            name: user.name ?? "Unknown",
            email: user.email ?? undefined,
            avatar: user.image ?? undefined,
            username: user.name ?? "Unknown",
          });
        }

        (user as any).dbUserId = dbUser._id.toString();

        return true;
      } catch (error) {
        console.error("SignIn error:", error);
        return false;
      }
    },

    async jwt({ token, account, user }) {

      if (user && (user as any).dbUserId) {
        token.userId = (user as any).dbUserId;
      }
        if (token.userId) {
    const dbUser = await User.findById(token.userId).select("role").lean();
    token.role = dbUser?.role ?? "user";
  }

      if (account) {
        token.provider = account.provider;
        token.providerId = account.providerAccountId;
      }

      return token;
    },

    async session({ session, token }) {

      if (session.user) {
        session.user.id = token.userId as string;
        session.user.role = token.role as "admin" | "user";
      }

      return session;
    },
  },
};

export default authOptions;
