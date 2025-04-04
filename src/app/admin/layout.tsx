import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  // Check if the user is authenticated and has the admin role
  if (!session || !session.user || session.user.role !== "admin") {
    redirect("/login");
  }

  return <>{children}</>;
}
