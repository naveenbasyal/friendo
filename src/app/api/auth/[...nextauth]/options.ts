import { dbConnect } from "@/lib/dbConnect";
import User from "@/models/User";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import Email from "next-auth/providers/email";
import bcrypt from "bcrypt";
export const authOptions: NextAuthOptions = {
  pages: {
    signIn: "/login",
    signOut: "/signup",
    error: "/auth/error",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",

      credentials: {
        username: { label: "Username", type: "text" },
        email: { label: "Email", type: "email" },
      },

      async authorize(credentials: any): Promise<any> {
        await dbConnect();
        try {
          const user = await User.findOne({
            $or: [
              { email: credentials.email },
              { username: credentials.username },
            ],
          });
          if (!user) {
            throw new Error("User not found");
          }
          if (!user.isVerified) {
            throw new Error("Please verify your email first");
          }
          return user;
        } catch (error) {}
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = user;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = token.user as any;
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
