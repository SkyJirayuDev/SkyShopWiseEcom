import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "@/lib/mongoClient";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import type { JWT } from "next-auth/jwt";
import type { Session } from "next-auth";

// This is the route for NextAuth authentication
export const authOptions = {
  providers: [
    // Credentials provider for email and password authentication
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      // The authorize function is called when the user submits the form
      async authorize(credentials) {
        if (!credentials) return null;
        const { email, password } = credentials;
        const user = await User.findOne({ email });
        if (user && bcrypt.compareSync(password, user.password)) {
          return user;
        }
        return null;
      },
    }),
  ],
  // Use MongoDB adapter for NextAuth
  adapter: MongoDBAdapter(clientPromise),
  session: {
    strategy: "jwt" as const, // Use JWT for session management
  },
  pages: {
    signIn: "/login", 
  },

  // Callbacks for JWT and session management
  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: any }): Promise<JWT> {
      if (user) {
        token.id = (user as any)._id ? (user as any)._id.toString() : user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({
      session,
      token,
    }: {
      session: Session;
      token: JWT;
    }): Promise<Session> {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as "user" | "admin";
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
