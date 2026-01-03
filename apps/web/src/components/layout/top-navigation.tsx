import Link from "next/link";

import { NavLink } from "./top-navigation/nav-link";
import { UserMenu } from "./top-navigation/user-menu";

export function TopNavigation() {
  return (
    <header className="sticky top-0 z-10 border-b border-surface-border bg-canvas/90 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-8">
        <div className="flex items-center gap-6">
          <Link
            className="text-sm font-semibold tracking-tight text-text-primary"
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

