"use client";

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";

// const data = await response.json();
export default function Providers({ children }: { children: ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
