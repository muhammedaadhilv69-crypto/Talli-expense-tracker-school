import { Separator } from "@/components/ui/separator";
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
  return (
    <div className="p-6 h-full">
      <div>
        <div>
          <h1 className="text-3xl">Transactions</h1>
        </div>
        <div className="my-4">
          <Separator />
        </div>
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Amount</TableHead>
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
                    <div className="flex items-center gap-2">
                      {(() => {
                        const Icon = getCategoryIcon(
                          transaction.categories?.icon ?? "other",
                        );

                        return <Icon className="size-4" />;
                      })()}
                      <span>{transaction.categories?.name}</span>
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
