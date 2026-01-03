import { Suspense } from "react";

import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <main className="min-h-dvh bg-canvas">
      <div className="mx-auto flex min-h-dvh max-w-md items-center px-6">
        <div className="w-full space-y-6 rounded-2xl border border-surface-border bg-surface p-8">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight text-text-primary">
              Sign in
            </h1>
            <p className="text-sm text-text-secondary">
              Use your account email and password.
            </p>
          </div>
          <Suspense fallback={null}>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
