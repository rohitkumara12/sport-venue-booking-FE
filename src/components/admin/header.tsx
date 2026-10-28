
export default function Header() {
  return (
    <header className="flex h-20 items-center justify-between border-b border-gray-200 bg-white px-8">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">
          Admin Dashboard
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your sports venue platform
        </p>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 font-semibold text-blue-700">
          A
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-900">Administrator</p>
          <p className="text-xs text-gray-500">Admin</p>
        </div>
      </div>
    </header>
  );
}
