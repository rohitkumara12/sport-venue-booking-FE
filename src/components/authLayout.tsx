type AuthLayoutProps = {
  title: string;
  description: string;
  children: React.ReactNode;
};

export default function AuthLayout({
  title,
  description,
  children,
}: AuthLayoutProps) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
      <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            {title}
          </h1>
          <p className="mt-2 text-sm text-slate-500">{description}</p>
        </div>

        {children}
      </section>
    </main>
  );
}