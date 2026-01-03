"use client";

import { useRouter } from "next/navigation";

import { useAuth } from "@/components/auth/auth-provider";

export function UserMenu() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  async function logout() {
    router.replace("/console/login");
  }

  return (
    <div className="flex items-center gap-3">
      <div className="hidden text-right sm:block">
        <div className="text-sm font-medium text-text-primary">
          {isLoading ? "Loading…" : user?.name || user?.email || "Account"}
        </div>
        <div className="text-xs text-text-secondary">Balance: —</div>
      </div>
      <button
        className="flex h-9 items-center gap-2 rounded-xl px-3 text-sm text-text-secondary hover:bg-canvas-subtle hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary/30"
        type="button"
        onClick={logout}
      >
        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-canvas-subtle text-xs font-semibold text-text-primary">
          {(user?.name || user?.email || "B").slice(0, 1).toUpperCase()}
        </span>
        <span className="hidden sm:inline">Logout</span>
      </button>
    </div>
  );
}
