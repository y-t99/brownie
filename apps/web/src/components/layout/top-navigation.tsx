import Link from "next/link";

import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";

import { NavLink } from "./top-navigation/nav-link";
import { UserMenu } from "./top-navigation/user-menu";

type TopNavigationVariant = "console" | "marketing";

export function TopNavigation({ variant = "console" }: { variant?: TopNavigationVariant }) {
  if (variant === "marketing") {
    return (
      <header className="flex flex-col items-center justify-center sticky top-0 z-10 border-b border-surface-border bg-[color:color-mix(in_srgb,rgb(var(--canvas))_85%,transparent)] backdrop-blur-md">
        <Container>
          <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between">
            <Link
              href="/"
              className="text-base font-semibold tracking-tight text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
            >
              Brownie
            </Link>
            <nav className="flex items-center gap-3">
              <Button asChild variant="ghost" size="sm">
                <Link href="/design-system">Design System</Link>
              </Button>
              <Button asChild variant="secondary" size="sm">
                <Link href="/console">Console</Link>
              </Button>
            </nav>
          </div>
        </Container>
      </header>
    );
  }

  return (
    <header className="flex flex-col items-center justify-center sticky top-0 z-10 border-b border-surface-border bg-[color:color-mix(in_srgb,rgb(var(--canvas))_90%,transparent)] backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-8">
        <div className="flex items-center gap-6">
          <Link
            className="text-sm font-semibold tracking-tight text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
            href="/console/transactions"
          >
            Brownie
          </Link>
          <nav className="flex items-center gap-1">
            <NavLink href="/console/transactions">Transactions</NavLink>
            <NavLink href="/console">Dashboard</NavLink>
          </nav>
        </div>
        <UserMenu />
      </div>
    </header>
  );
}
