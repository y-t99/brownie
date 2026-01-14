import * as React from "react";

import { Container } from "@/components/layout/container";
import { cn } from "@/lib/cn";

export function Section({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <section className={cn("py-16 sm:py-20 md:py-28 lg:py-32", className)} {...props}>
      <Container className="flex w-full flex-col items-center justify-center">
        <div className="w-full max-w-7xl flex flex-col items-center justify-center">{children}</div>
      </Container>
    </section>
  );
}
