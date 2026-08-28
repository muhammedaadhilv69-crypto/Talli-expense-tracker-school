import Link from "next/link";
import { getTransactions } from "@/lib/data/dashboard";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getCategoryIcon } from "@/utils/category-icons";
import { formatCurrency } from "@/utils/formatter";
import Pagination from "@/components/shared/dashboard/Pagination";
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
} from "@/components/ui/empty";
import { FilePlus2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Transactions | Talli",
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;

  const page = Math.max(Number(params.page) || 1, 1);

  const { transactions, totalPages } = await getTransactions(page);

  if (transactions.length === 0) {
    return (
      <div className="flex flex-col h-full w-full">
        <div className="mb-4">
          <h1 className="text-2xl font-semibold tracking-tight">
            Transactions
          </h1>

          <p className="text-sm text-muted-foreground">
            Track your income and expenses.
          </p>
        </div>
        <div className="flex items-center justify-center flex-col">
          <div className="rounded-lg border py-12">
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <FilePlus2 />
                </EmptyMedia>

                <EmptyTitle>No transactions yet</EmptyTitle>

                <EmptyDescription>
                  Create your first transaction to start tracking your finances.
                </EmptyDescription>
              </EmptyHeader>

              <EmptyContent>
                <Button
                  nativeButton={false}
                  render={<Link href="/dashboard/transactions/new" />}
                >
                  Create transaction
                </Button>
              </EmptyContent>
            </Empty>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 h-full">
      <div>
        <div className="mb-4">
          <h1 className="text-2xl font-semibold tracking-tight">
            Transactions
          </h1>

          <p className="text-sm text-muted-foreground">
            Track your income and expenses.
          </p>
        </div>
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Date
                </TableHead>
                <TableHead className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Category
                </TableHead>
                <TableHead
                  className="text-xs font-medium uppercase tracking-wide text-muted-foreground text-right"
                >
                  Amount
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {transactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>
                    {new Date(transaction.transaction_date).toLocaleDateString(
                      "en-US",
                      {
                        month: "short",
                        day: "numeric",
                      },
                    )}
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="flex size-8 items-center justify-center rounded-full bg-muted">
                        {(() => {
                          const Icon = getCategoryIcon(
                            transaction.categories?.icon ?? "other",
                          );

                          return <Icon className="size-4" />;
                        })()}
                      </div>

                      <span className="font-medium">
                        {transaction.categories?.name}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell
                    className={`text-right font-medium ${
                      transaction.type === "income"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {transaction.type === "income" ? "+" : "-"}{" "}
                    {formatCurrency(Number(transaction.amount))}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          createHref={(page) => `/dashboard/transactions?page=${page}`}
        />
      </div>
    </div>
  );
}
