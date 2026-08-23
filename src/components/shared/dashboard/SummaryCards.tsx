import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { getDashboardSummary } from "@/lib/data/dashboard";
import { formatCurrency } from "@/utils/formatter";
import { TrendingDown, TrendingUp, Wallet } from "lucide-react";

export default async function SummaryCards() {
  const { balance, income, expenses } = await getDashboardSummary();

  return (
    <div className="m-1 grid grid-cols-1 gap-4 py-4 md:grid-cols-3">
      {/* Balance */}
      <Card className="border-emerald-200 bg-emerald-50/50">
        <CardHeader>
          <CardDescription className="text-emerald-700 flex gap-2 justify-between">
            Balance
            <Wallet />
          </CardDescription>

          <CardTitle className="text-2xl font-bold text-emerald-900">
            {formatCurrency(balance)}
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Income */}
      <Card className="border-green-200 bg-green-200/50">
        <CardHeader>
          <CardDescription className="text-green-700 flex gap-2 justify-between">
            Income
            <TrendingUp />
          </CardDescription>

          <CardTitle className="text-2xl font-bold text-green-900">
            {formatCurrency(income)}
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Expenses */}
      <Card className="border-red-200 bg-red-200/50">
        <CardHeader>
          <CardDescription className="text-red-700 flex gap-2 justify-between">
            Expenses
            <TrendingDown />
          </CardDescription>

          <CardTitle className="text-2xl font-bold text-red-900">
            {formatCurrency(expenses)}
          </CardTitle>
        </CardHeader>
      </Card>
    </div>
  );
}
