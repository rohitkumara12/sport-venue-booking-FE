import AdminLayout from "@/components/admin/layout";
import { AdminGuard } from "./AdminGuard";

export default function AdminSegmentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminGuard>
      <AdminLayout>{children}</AdminLayout>
    </AdminGuard>
  );
}