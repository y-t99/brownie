import Link from "next/link";

import { PageContainer } from "@/components/layout/page-container";
import { TopNavigation } from "@/components/layout/top-navigation";

export default function MarketingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative flex min-h-dvh flex-col bg-canvas">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          backgroundImage: [
            "radial-gradient(900px 420px at 10% 15%, color-mix(in srgb, var(--primary) 16%, transparent), transparent 60%)",
            "radial-gradient(820px 380px at 85% 20%, color-mix(in srgb, var(--accent) 14%, transparent), transparent 55%)",
            "radial-gradient(900px 520px at 60% 90%, color-mix(in srgb, var(--secondary) 16%, transparent), transparent 60%)",
          ].join(","),
        }}
      />
      <TopNavigation variant="marketing" />

      <main className="relative flex-1">{children}</main>

      <footer className="border-t border-surface-border bg-canvas">
        <PageContainer>
          <div className="flex flex-col gap-3 py-10 text-sm text-text-secondary sm:flex-row sm:items-center sm:justify-between">
            <div>© Brownie</div>
            <div className="flex items-center gap-4">
              <Link
                className="hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
                href="/design-system"
              >
                Design System
              </Link>
              <Link
                className="hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
                href="/console"
              >
                Console
              </Link>
            </div>
          </div>
        </PageContainer>
      </footer>
    </div>
  );
}
