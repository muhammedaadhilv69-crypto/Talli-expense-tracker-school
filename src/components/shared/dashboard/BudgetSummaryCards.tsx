import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { getMonthlyBudgetSummary } from "@/lib/data/dashboard";
import { formatCurrency } from "@/utils/formatter";
import { PiggyBank, TrendingDown, Wallet } from "lucide-react";

export default async function SummaryCards() {
  const { budget, spent, remaining } = await getMonthlyBudgetSummary();

  return (
    <div className="m-1 grid grid-cols-1 gap-4 py-4 md:grid-cols-3">
      {/* Balance */}
      <Card className="border-emerald-200 bg-emerald-50/50">
        <CardHeader>
          <CardDescription className="text-emerald-700 flex gap-2 justify-between">
            Total Budget
            <Wallet />
          </CardDescription>

          <CardTitle className="text-2xl font-bold text-emerald-900">
            {formatCurrency(budget)}
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Income */}
      <Card className="border-red-200 bg-red-200/50">
        <CardHeader>
          <CardDescription className="text-red-700 flex gap-2 justify-between">
            Spent
            <TrendingDown />
          </CardDescription>

          <CardTitle className="text-2xl font-bold text-red-900">
            {formatCurrency(spent)}
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Expenses */}
      <Card className="border-green-200 bg-green-200/50 ">
        <CardHeader>
          <CardDescription className="text-green-700 flex gap-2 justify-between">
            Remaining
            <PiggyBank />
          </CardDescription>

          <CardTitle className="text-2xl font-bold text-green-900">
            {formatCurrency(remaining)}
          </CardTitle>
        </CardHeader>
      </Card>
    </div>
  );
}
