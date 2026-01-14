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
          <div className="grid gap-8 py-12 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-3">
              <div className="text-base font-semibold text-text-primary">Brownie</div>
              <p className="text-sm text-text-secondary">
                Build and operate durable tasks with a premium developer experience.
              </p>
            </div>

            <div className="space-y-3">
              <div className="text-sm font-medium text-text-primary">Product</div>
              <nav className="flex flex-col gap-2 text-sm text-text-secondary">
                <Link
                  className="hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-canvas transition-colors"
                  href="/console"
                >
                  Console
                </Link>
                <Link
                  className="hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-canvas transition-colors"
                  href="/"
                >
                  Features
                </Link>
              </nav>
            </div>

            <div className="space-y-3">
              <div className="text-sm font-medium text-text-primary">Resources</div>
              <nav className="flex flex-col gap-2 text-sm text-text-secondary">
                <Link
                  className="hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-canvas transition-colors"
                  href="/design-system"
                >
                  Design System
                </Link>
              </nav>
            </div>

            <div className="space-y-3">
              <div className="text-sm font-medium text-text-primary">Company</div>
              <div className="text-sm text-text-secondary">
                © {new Date().getFullYear()} Brownie
              </div>
            </div>
          </div>
        </PageContainer>
      </footer>
    </div>
  );
}
