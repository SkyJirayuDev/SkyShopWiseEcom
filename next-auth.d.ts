import NextAuth from "next-auth";

// Add custom fields to NextAuth session and user
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      role: "user" | "admin";
      image?: string | null;
    };
  }
  interface User {
    id: string;
    role: "user" | "admin";
  }
}
