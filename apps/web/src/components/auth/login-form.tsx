"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await new Promise((r) => window.setTimeout(r, 450));
      if (!email || !password) {
        setError("Enter an email and password.");
        return;
      }

      const next = searchParams.get("next") || "/console/transactions";
      router.replace(next);
    } catch {
      setError("Unable to sign in. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      <div className="space-y-2">
        <label className="text-sm font-medium text-text-primary" htmlFor="email">
          Email
        </label>
        <input
          className="h-11 w-full rounded-xl border border-surface-border bg-canvas px-4 text-sm text-text-primary outline-none focus-visible:ring-2 focus-visible:ring-accent-primary/30"
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <label
          className="text-sm font-medium text-text-primary"
          htmlFor="password"
        >
          Password
        </label>
        <input
          className="h-11 w-full rounded-xl border border-surface-border bg-canvas px-4 text-sm text-text-primary outline-none focus-visible:ring-2 focus-visible:ring-accent-primary/30"
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      {error ? (
        <p className="rounded-xl bg-status-error-bg px-4 py-3 text-sm text-status-error-text">
          {error}
        </p>
      ) : null}

      <button
        className="h-11 w-full rounded-xl bg-text-primary text-sm font-medium text-canvas hover:bg-text-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary/30 disabled:cursor-not-allowed disabled:opacity-60"
        disabled={isSubmitting}
        type="submit"
      >
        {isSubmitting ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
