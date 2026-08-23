import { Progress } from "@/components/ui/progress";
import { getCategoryIcon } from "@/utils/category-icons";
import { formatCurrency } from "@/utils/formatter";
import { AlertTriangle, CheckCircle2 } from "lucide-react";

type BudgetItemProps = {
  budget: {
    id: string;
    category: {
      name: string;
      icon: string;
    } | null;
    budget: number;
    spent: number;
    remaining: number;
    percentage: number;
    period: "monthly" | "weekly";
    startDate: string;
    endDate: string;
  };
};

export default function BudgetItem({ budget }: BudgetItemProps) {
  const Icon = getCategoryIcon(budget.category?.icon ?? "other");

  const isExceeded = budget.percentage >= 100;
  const isWarning = budget.percentage >= 80 && !isExceeded;

  const progress = Math.min(budget.percentage, 100);

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-2">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted">
            <Icon className="size-4" />
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-medium">
              {budget.category?.name ?? "Unknown category"}
            </p>

            <p className="text-xs text-muted-foreground capitalize">
              {budget.period} budget
            </p>
          </div>
        </div>

        <p className="shrink-0 text-sm font-medium">
          {formatCurrency(budget.spent)}{" "}
          <span className="text-muted-foreground">
            / {formatCurrency(budget.budget)}
          </span>
        </p>
      </div>

      {/* Progress */}
      <Progress value={progress} />

      {/* Footer */}
      <div className="flex items-center justify-between text-xs">
        <div
          className={
            isExceeded
              ? "flex items-center gap-1 text-destructive"
              : isWarning
                ? "flex items-center gap-1 text-amber-600"
                : "flex items-center gap-1 text-muted-foreground"
          }
        >
          {isExceeded ? (
            <>
              <AlertTriangle className="size-3.5" />
              <span>
                Over budget by {formatCurrency(Math.abs(budget.remaining))}
              </span>
            </>
          ) : isWarning ? (
            <>
              <AlertTriangle className="size-3.5" />
              <span>Approaching limit</span>
            </>
          ) : (
            <>
              <CheckCircle2 className="size-3.5" />
              <span>{formatCurrency(budget.remaining)} remaining</span>
            </>
          )}
        </div>

        <span className="text-muted-foreground">
          {Math.round(budget.percentage)}%
        </span>
      </div>
    </div>
  );
}
