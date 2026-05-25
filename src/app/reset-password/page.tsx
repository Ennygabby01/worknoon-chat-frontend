import { Suspense } from "react";
import { ResetPasswordForm } from "@/features/auth/ResetPasswordForm";
import { Spinner } from "@/components/ui/Spinner";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="loading-screen"><Spinner size="lg" /></div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
