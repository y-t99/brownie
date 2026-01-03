import { PageContainer } from "@/components/layout/page-container";
import { TopNavigation } from "@/components/layout/top-navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-dvh bg-canvas">
      <TopNavigation />
      <PageContainer>{children}</PageContainer>
    </div>
  );
}

