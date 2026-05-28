import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";

// Edge-compatible config — NO Prisma adapter here
export const authConfig: NextAuthConfig = {
  providers: [Google, GitHub],
  session: { strategy: "jwt" },
  callbacks: {
    jwt({ token, user }) {
      if (user?.id) token.id = user.id;
      return token;
    },
    session({ session, token }) {
      if (token.id) session.user.id = token.id as string;
      return session;
    },
  },
  pages: { signIn: "/login" },
};
