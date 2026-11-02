
import { Suspense } from "react";
import ResetPasswordForm from "./resetPasswordForm";

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          Memuat halaman reset password...
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
