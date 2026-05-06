import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyAdminSession, ADMIN_COOKIE } from "@/lib/adminSession";
import AdminSidebar from "../AdminSidebar";

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE)?.value;

  if (!token) redirect("/admin/login");

  const session = await verifyAdminSession(token);
  if (!session) redirect("/admin/login");

  return (
    <div className="flex" style={{ minHeight: "100vh" }}>
      <AdminSidebar />
      <div className="flex-1 overflow-auto" style={{ background: "#f1f5f9" }}>
        {children}
      </div>
    </div>
  );
}
