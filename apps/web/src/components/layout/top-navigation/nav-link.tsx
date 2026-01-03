"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

function normalizePathname(pathname: string) {
  if (pathname === "/") return "/";
  return pathname.replace(/\/$/, "");
}

export function NavLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const isActive = normalizePathname(pathname) === normalizePathname(href);

  return (
    <Link
      className={[
        "rounded-xl px-3 py-2 text-sm transition",
        isActive
          ? "bg-surface text-text-primary"
          : "text-text-secondary hover:bg-canvas-subtle hover:text-text-primary",
      ].join(" ")}
      href={href}
    >
      {children}
    </Link>
  );
}

