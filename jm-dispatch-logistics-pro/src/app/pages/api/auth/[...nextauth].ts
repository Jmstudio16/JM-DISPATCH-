import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { JWT } from "next-auth/jwt";

interface ExtendedSession {
  accessToken?: string;
  user?: {
    name?: string;
    email?: string;
    image?: string;
  };
}

const options: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: "openid email profile https://www.googleapis.com/auth/calendar.events",
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        (token as JWT).accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }) {
      (session as ExtendedSession).accessToken = (token as JWT).accessToken as string;
      return session;
    },
  },
};

export default NextAuth(options);