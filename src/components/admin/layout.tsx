import { AdminGuard } from "@/app/admin/AdminGuard";

export default function AdminSegmentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminGuard>{children}</AdminGuard>;
}