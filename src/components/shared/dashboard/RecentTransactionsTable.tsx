import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getCategoryIcon } from "@/utils/category-icons";
import { getRecentTransactions } from "@/lib/data/dashboard";
import { formatCurrency } from "@/utils/formatter";

export default async function RecentTransactions() {
  const transactions = await getRecentTransactions();

  return (
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
  );
}
