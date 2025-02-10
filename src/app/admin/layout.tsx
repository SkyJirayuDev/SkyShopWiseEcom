import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  // ตรวจสอบว่า session และ session.user มีค่า และ role ต้องเป็น admin
  if (!session || !session.user || session.user.role !== "admin") {
    redirect("/login");
  }

  return <>{children}</>;
}
