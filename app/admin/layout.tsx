import AdminSidebar from "./components/AdminSidebar";
import AdminHeader from "./components/AdminHeader";
import AdminAuthGuard from "./components/AdminAuthGuard";
import ConfirmModal from "@/components/ConfirmModal";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminAuthGuard>
      <div className="flex h-screen bg-gray-50 overflow-hidden">
        <AdminSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <AdminHeader />
          <main className="flex-1 overflow-auto p-6">{children}</main>
        </div>
        <ConfirmModal />
      </div>
    </AdminAuthGuard>
  );
}
