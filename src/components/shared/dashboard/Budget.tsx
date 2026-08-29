import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { getCategoryIcon } from "@/utils/category-icons";
import { formatCurrency } from "@/utils/formatter";
import { AlertTriangle, CheckCircle2 } from "lucide-react";

type BudgetProps = {
  budget: {
    id: string;
    category_id: string;
    amount: number;
    period: "monthly" | "weekly";
    start_date: string;
    end_date: string;
    categories: {
      name: string;
      icon: string;
    } | null;
    // Optional pre-computed values. If omitted, the component treats
    // spent as 0 and derives the rest from `amount`.
    spent?: number;
  };
};

export default function Budget({ budget }: BudgetProps) {
  const Icon = getCategoryIcon(budget.categories?.icon ?? "other");

  const budgetAmount = Number(budget.amount);
  const spent = Number(budget.spent ?? 0);

  const remaining = budgetAmount - spent;
  const percentage = budgetAmount > 0 ? (spent / budgetAmount) * 100 : 0;
  const progress = Math.min(percentage, 100);

  const isExceeded = percentage >= 100;
  const isWarning = percentage >= 80 && !isExceeded;

  // Light bg + darker text palette, mirroring SummaryCards styling.
  const palette = isExceeded
    ? "border-red-200 bg-red-50 text-red-900"
    : isWarning
      ? "border-amber-200 bg-amber-50 text-amber-900"
      : "border-emerald-200 bg-emerald-50 text-emerald-900";

  const accent = isExceeded
    ? "text-red-700"
    : isWarning
      ? "text-amber-700"
      : "text-emerald-700";

  return (
    <Card className={palette}>
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-white/70">
              <Icon className="size-5" />
            </div>

            <div className="min-w-0">
              <CardTitle className="truncate text-base font-semibold">
                {budget.categories?.name ?? "Unknown category"}
              </CardTitle>
              <CardDescription className="capitalize">
                {budget.period} budget
              </CardDescription>
            </div>
          </div>

          <Badge variant="secondary" className="bg-white/70 capitalize">
            {budget.period}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Amounts */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">
            {formatCurrency(spent)}{" "}
            <span className="text-muted-foreground">
              / {formatCurrency(budgetAmount)}
            </span>
          </span>

          <span className="text-sm font-semibold">{Math.round(percentage)}%</span>
        </div>

        {/* Progress */}
        <Progress value={progress} />

        {/* Footer */}
        <div className={`flex items-center justify-between text-xs ${accent}`}>
          {isExceeded ? (
            <span className="flex items-center gap-1">
              <AlertTriangle className="size-3.5" />
              Over budget by {formatCurrency(Math.abs(remaining))}
            </span>
          ) : isWarning ? (
            <span className="flex items-center gap-1">
              <AlertTriangle className="size-3.5" />
              Approaching limit
            </span>
          ) : (
            <span className="flex items-center gap-1">
              <CheckCircle2 className="size-3.5" />
              {formatCurrency(remaining)} remaining
            </span>
          )}

          <span className="text-muted-foreground">
            {new Date(budget.start_date).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}{" "}
            –{" "}
            {new Date(budget.end_date).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
