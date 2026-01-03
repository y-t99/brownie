import { TransactionsTable } from "./transactions-table";

export default function TransactionsPage() {
  return (
    <div className="py-10">
      <div className="mb-6">
        <h1 className="text-3xl font-semibold tracking-tight text-text-primary">
          Transactions
        </h1>
        <p className="mt-2 text-sm text-text-secondary">
          Review recent tasks, status, and cost.
        </p>
      </div>
      <TransactionsTable />
    </div>
  );
}
