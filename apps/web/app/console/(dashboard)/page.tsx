import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardPage() {
  return (
    <div className="py-10">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-text-primary">Dashboard</h1>
          <p className="mt-2 text-sm text-text-secondary">
            A quick snapshot of usage and recent activity (mocked).
          </p>
        </div>
        <Button asChild variant="secondary" size="sm">
          <Link href="/console/transactions">View transactions</Link>
        </Button>
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-3">
        <Card variant="elevated">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Transactions</CardTitle>
            <CardDescription>Last 24 hours</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold tracking-tight text-text-primary">42</div>
            <div className="mt-2 text-sm text-text-secondary">+12% from yesterday</div>
          </CardContent>
        </Card>

        <Card variant="elevated">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Cost</CardTitle>
            <CardDescription>Last 24 hours</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold tracking-tight text-text-primary">¥18.40</div>
            <div className="mt-2 text-sm text-text-secondary">Across all tasks</div>
          </CardContent>
        </Card>

        <Card variant="glass">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Status</CardTitle>
            <CardDescription>Queue health</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold tracking-tight text-text-primary">OK</div>
            <div className="mt-2 text-sm text-text-secondary">
              No incidents reported
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
