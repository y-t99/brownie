import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

import { Container } from "./container";

export function PageContainer({ children, className }: { children: ReactNode, className?: string }) {
  return <Container className={cn("py-16 sm:py-20 md:py-28 lg:py-32", className)}>{children}</Container>;
}
