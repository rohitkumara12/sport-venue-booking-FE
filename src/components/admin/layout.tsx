
import Sidebar from "./sidebar";
import Header from "./header";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="min-w-0 flex-1">
        <Header />
        <main className="p-8">{children}</main>
      </div>
    </div>
  );
}
